import { Injectable } from '@angular/core';
import { Operation } from '../../model/operation.model';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { Store } from '../../store/store';
import { AccountPageStore } from '../account-page/account-page.store';
import { Location } from '@angular/common';
import random from 'random-string-alphanumeric-generator';
import { OperationPageStoreModel } from '../../model/operation-page.store.model';
import { Observable } from 'rxjs';
import { Account } from '../../model/account.model';

let initialStore: OperationPageStoreModel = {};

@Injectable()
export class OperationPageStore extends Store<OperationPageStoreModel> {
  operation$: Observable<Operation | undefined> = this.select<
    Operation | undefined
  >((state) => state.currentOperation);

  account$: Observable<Account | undefined> = this.select<Account | undefined>(
    (state) => state.currentAccount
  );

  constructor(
    private readonly operationService: OperationService,
    private readonly routeParamsStore: RouteParamsStore,
    readonly accountStore: AccountPageStore,
    private location: Location
  ) {
    super(initialStore);

    this.routeParamsStore.idOperation$.subscribe(async (id) => {
      if (id > 0) {
        this.operationService
          .getOperationJoinAccountById(id)
          .then(async (operation) => {
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
        this.accountStore.reloadAccount(0);
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
}
