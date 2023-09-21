import { Injectable } from '@angular/core';
import { Operation } from '../../model/operation.model';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { Store } from '../../store/store';
import { AccountPageStore } from '../account-page/account-page.store';
import { Location } from '@angular/common';
import random from 'random-string-alphanumeric-generator';
import {
  OperationPageStoreModel,
  OperationSearchData,
} from '../../model/operation-page.store.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../../model/account.model';
import { PagingData } from 'src/app/model/paging-data';
import { MainStore } from 'src/app/store/main.store';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileModel } from 'src/app/model/profil.model';

let initialStore: OperationPageStoreModel = {};

@Injectable()
export class OperationPageStore extends Store<OperationPageStoreModel> {
  operation$: Observable<Operation | undefined> = this.select<
    Operation | undefined
  >((state) => state.currentOperation);

  account$: Observable<Account | undefined> = this.select<Account | undefined>(
    (state) => state.currentAccount
  );

  operationSerachData$: Observable<OperationSearchData | undefined> =
    this.select<OperationSearchData | undefined>(
      (state) => state.operationSerachData
    );

  operationSearchResult$: Observable<PagingData<Operation> | undefined> =
    this.select<PagingData<Operation> | undefined>(
      (state) => state.operationSearchResult
    );

  profileListSubject_: BehaviorSubject<ProfileModel[]> = new BehaviorSubject<
    ProfileModel[]
  >([]);
  constructor(
    private readonly operationService: OperationService,
    private readonly routeParamsStore: RouteParamsStore,
    readonly accountStore: AccountPageStore,
    readonly mainStore: MainStore,
    readonly profileService: ProfileService
  ) {
    super(initialStore);

    this.routeParamsStore.idOperation$.subscribe(async (id) => {
      if (id > 0) {
        console.log('suscribtion idOp:' + id);
        this.operationService
          .getOperationJoinAccountById(id)
          .then((operation) => {
            this.setOperation(operation);
          })
          .catch((e) => console.error(e));
      } else {
        this.setOperation({
          id: 0,
          numTrans: '',
          time: new Date(),
          description: '',
          statut: 'r',
          credit: 0,
          debit: 0,
          balance: 0,
          idAccount: 0,
          transfer: '',
        });
      }
    });

    this.operation$.subscribe((op) => {
      if (op?.idAccount) {
        this.accountStore.reloadAccount(op.idAccount);
      }
    });
    this.accountStore.currentAccount$.subscribe((acc) => {
      this.setAccount(acc);
    });

    this.operationSerachData$.subscribe((operationSerachData) => {
      this.operationService
        .operationSearch(operationSerachData)
        .then((operationSearchResult: PagingData<Operation> | undefined) => {
          this.setOperationSearchResult(operationSearchResult);
        });
    });
  }
  setOperationSearchResult(
    operationSearchResult: PagingData<Operation> | undefined
  ) {
    this.setState({
      ...this.state,
      operationSearchResult: operationSearchResult,
    });
  }

  setOperationSerachData(operationSerachData: OperationSearchData | undefined) {
    this.setState({
      ...this.state,
      operationSerachData: operationSerachData,
    });
  }

  setAccount(currentAccount: Account) {
    this.setState({ ...this.state, currentAccount: currentAccount });
  }
  setOperation(operation: Operation) {
    this.setState({ ...this.state, currentOperation: operation });
  }
  async deleteCurrentOperatoion(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.state != null && this.state.currentOperation != null) {
        this.deleteOperationById(this.state.currentOperation?.id)
          .then(() => {
            resolve();
          })
          .catch((err) => reject(err));
      } else {
        reject('no operation selected!!!!');
      }
    });
  }

  async deleteOperationById(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.operationService
        .deleteOperationDate(id)
        .then(() => resolve())
        .catch((err) => {
          reject('erreur lors de la suppression');
          console.error(err);
        });
    });
  }

  async updateOperation(operation: Operation): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.operationService
        .businessUpdateOperationDate(operation)
        .then((op) => {
          if (op && op.id) this.setOperation(op);
          resolve(op);
        })
        .catch((err) => {
          reject('erreur durant excecusion du service');
          console.error(err);
        });
    });
  }

  async createNewOperation(operation: Operation): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      operation.numTrans = random.randomAlphanumeric(16, 'uppercase');
      operation.profile = this.mainStore.state.currentProfile?.mail;
      this.operationService
        .businessCreationOperationDate(operation)
        .then((operation) => {
          this.setOperation(operation);

          resolve(operation.id);
        })
        .catch((err) => {
          console.error(err);
          reject('erreur dans les service');
        });
    });
  }

  backToAccount(id: number) {
    //console.log();
    //this.accountStore.reloadAccount(id);
    //  this.location.back();
  }

  onLoadLeafAccount(exeptId: number | undefined) {
    this.accountStore.loadLeadAccounts(exeptId);
  }

  async getAccountIdByPath(transfer: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.accountStore
        .getAccountByPath(transfer)
        .then((acc) => {
          resolve(acc.id);
        })
        .catch((err) => {
          console.error(err);
          reject('error dans le service');
        });
    });
  }

  async getCurrentProfile(): Promise<ProfileModel> {
    return new Promise<ProfileModel>((resolve, reject) => {
      try {
        if (this.mainStore.state.currentProfile?.mail) {
          this.profileService
            .findProfileByMail(this.mainStore.state.currentProfile.mail)
            .then((profile) => resolve(profile));
        }
      } catch (error) {
        reject(
          'error on getting profile:' +
            this.mainStore.state.currentProfile?.mail
        );
        console.error(error);
      }
    });
  }

  loadAllProfiles() {
    this.profileService.findAllProfiles().then((profiles) => {
      this.profileListSubject_.next(profiles);
    });
  }
}
