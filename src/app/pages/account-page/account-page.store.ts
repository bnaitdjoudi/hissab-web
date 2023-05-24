import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { AccountsService } from '../../services/accounts.service';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { Store } from '../../store/store';
import { excludedAccountTypeTransferTo } from '../../tools/configs';
import { AccountPageStoreModel } from './account-page.store.model';
import random from 'random-string-alphanumeric-generator';
import { printError } from '../../tools/errorTools';
import { MainStore } from '../../store/main.store';
import { getDatesByPeriodValue } from '../../tools/date.tools';
import { OperationPageStore } from '../operation-page/operation-page.store';

@Injectable({
  providedIn: 'root',
})
export class AccountPageStore extends Store<AccountPageStoreModel> {
  //observables
  currentAccount$ = this.select<Account>((state) => state.currentAccount);
  newOperation$ = this.select<Operation | null | undefined>(
    (state) => state.newOperation
  );
  operationsData$ = this.select<PagingData<Operation>>(
    (state) => state.operationsData
  );

  pagingOperation$ = this.select<PagingRequest>(
    (state) => state.operationsPagingRequest
  );

  accountsData$ = this.select<PagingData<Account>>(
    (state) => state.subAccountData
  );

  pagingAccount$ = this.select<PagingRequest>(
    (state) => state.accountsPagingRequest
  );

  leafAccounts$ = this.select<LeafAccount[]>((state) => state.leafAccounts);

  listDataCombined$ = combineLatest([this.accountsData$, this.operationsData$]);

  reee: string;
  //Subjects
  _currentPageOperation: BehaviorSubject<PagingRequest> =
    this.subject<PagingRequest>(
      (val: PagingRequest) =>
        this.setState({
          ...this.state,
          operationsPagingRequest: val,
        }),
      { page: 1, limit: 15 }
    );

  _currentPageSubAccount: BehaviorSubject<PagingRequest> =
    this.subject<PagingRequest>(
      (val: PagingRequest) =>
        this.setState({
          ...this.state,
          accountsPagingRequest: val,
        }),
      { page: 1, limit: 15 }
    );

  _deleteOperationSubject: BehaviorSubject<number>;

  _newAccountSubject: BehaviorSubject<Account | null>;

  constructor(
    private readonly accountService: AccountsService,
    private readonly operationService: OperationService,
    private readonly routeParamsStore: RouteParamsStore,
    private readonly mainStore: MainStore
  ) {
    super({
      currentAccount: {
        id: 0,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: '',
        parentId: 0,
        path: '',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      },
      operationsData: { data: [], currentPage: 1, totalPage: 1 },
      subAccountData: { data: [], currentPage: 1, totalPage: 1 },
      accountsPagingRequest: { page: 1, limit: 15 },
      operationsPagingRequest: { page: 1, limit: 15 },
      leafAccounts: [],
    });
    this._deleteOperationSubject = new BehaviorSubject<number>(0);
    this._newAccountSubject = new BehaviorSubject<Account | null>(null);
    this.initSuscription();
    this.reee = new Date().toUTCString();
  }

  private initSuscription() {
    this.currentAccount$.subscribe((acc) => {
      if (acc.id !== undefined && acc.id > 0) {
        this.performUpdateOperationList({ page: 1, limit: 15 }, acc.id);
        this.performUpdateSubAccountList({ page: 1, limit: 15 }, acc.id);
      }
    });

    //routeParamettre
    this.routeParamsStore.idAccount$.subscribe((id) => {
      if (id > 0) {
        this.loadAccount(id);
      }
    });
    // new operation
    this.newOperation$.subscribe((operation) => {
      if (!!operation && !!this.state.currentAccount.id) {
        if (
          operation.id === undefined ||
          operation.id == null ||
          operation.id === 0
        ) {
          this.createNewOperation(operation);
        }
      }
    });

    // currentPageOperation
    this.pagingOperation$.subscribe((val: PagingRequest) => {
      if (this.state.currentAccount.id) {
        this.performUpdateOperationList(val, this.state.currentAccount.id);
      }
    });

    this.pagingAccount$.subscribe((val: PagingRequest) => {
      if (this.state.currentAccount.id) {
        this.performUpdateSubAccountList(val, this.state.currentAccount.id);
      }
    });

    //deleteSuscription
    this._deleteOperationSubject.subscribe({
      next: (id: number) => {
        if (id !== null && id > 0) {
          this.operationService.deleteOperationDate(id).then(() => {
            if (
              this.state.currentAccount.id !== undefined &&
              this.state.currentAccount.id >= 1
            ) {
              this.accountService
                .getAccountById(this.state.currentAccount.id)
                .then((acc) => {
                  this.setCurrentAccount(acc);
                  this._currentPageOperation.next({ page: 1, limit: 15 });
                });
            }
          });
        }
      },
    });

    //create Account suscription
    this._newAccountSubject.subscribe({
      next: (account: Account | null) => {
        if (account != null) this.createNewAccount(account);
      },
    });

    this.mainStore.period$.subscribe(() => {
      this.loadAccount(this.state.currentAccount.id);
    });
  }

  private loadAccount(id: number) {
    console.log('loooooddddd:::' + this.mainStore.state.period);
    const [startDate, endDate] = getDatesByPeriodValue(
      this.mainStore.state.period
    );

    this.accountService
      .findAccountStateByIdAndDates(id, startDate, endDate)
      .then((acc) => {
        this.accountService
          .getResumeOfAccountById(acc.id)
          .then((res) => {
            acc.resume = res;
            console.log(
              'gggggggggggggggggggggggggggggg:::::::::::::::::' +
                JSON.stringify(acc)
            );
            this.setCurrentAccount(acc);
            this._currentPageSubAccount.next({ page: 1, limit: 15 });
            this._currentPageOperation.next({ page: 1, limit: 15 });
          })
          .catch((err) => console.error(err));
      })
      .catch((e) => console.error(e));
  }

  private performUpdateSubAccountList(val: PagingRequest, id: number) {
    let [startDate, endDate] = getDatesByPeriodValue(
      this.mainStore.state.period
    );

    this.accountService
      .getSubAccountsStateByPagingAndAccountId(val, id, startDate, endDate)
      .then((data) => {
        this.updateSubAccountData(data);
      })
      .catch((err) => console.error(err));
  }
  updateSubAccountData(data: PagingData<Account>) {
    this.setState({
      ...this.state,
      subAccountData: {
        ...data,
        data:
          data.currentPage > 1
            ? [...this.state.subAccountData.data, ...data.data]
            : data.data,
      },
    });
  }

  async setCurrentAccount(account: Account) {
    this.setState({
      ...this.state,
      currentAccount: account,
    });
  }

  setNewOrUpdateOperation(operation: Operation | undefined | null) {
    this.setState({
      ...this.state,
      newOperation: operation,
    });
  }

  updateOperationsList(operations: PagingData<Operation>) {
    this.setState({
      ...this.state,
      operationsData: {
        ...operations,
        data:
          operations.currentPage > 1
            ? [...this.state.operationsData.data, ...operations.data]
            : operations.data,
      },
    });
  }

  private performUpdateOperationList(paging: PagingRequest, id: number) {
    if (id) {
      this.operationService
        .getOperationsByPagingAndPeriodAndAccountId(
          paging,
          id,
          this.mainStore.state.period
        )
        .then((val) => this.updateOperationsList(val))
        .catch((err) => console.log(err));
    }
  }

  private createNewOperation(operation: Operation) {
    operation.idAccount = this.state.currentAccount.id;
    operation.numTrans = random.randomAlphanumeric(16, 'uppercase');
    this.operationService
      .businessCreationOperationDate(operation)
      .then(() => {
        this.reloadAccount(undefined);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async reloadAccount(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (id || id > 0) {
        this.accountService
          .getAccountById(id ? id : this.state.currentAccount.id)
          .then((acc) => {
            this.setCurrentAccount(acc);
            this._currentPageOperation.next({ page: 1, limit: 15 });
            resolve();
          })
          .catch((err) => {
            printError('erreur durant lappel au service db', reject, err);
          });
      } else {
        this.setCurrentAccount({
          id: 0,
          acountName: '',
          totalAccount: 0,
          isMain: false,
          type: '',
          parentId: 0,
          path: '',
          isLeaf: false,
          resume: { sons: 0 },
        });
      }
    });
  }

  private createNewAccount(account: Account) {
    account = {
      ...account,
      parentId: this.state.currentAccount.id ? this.state.currentAccount.id : 0,
      type: this.state.currentAccount.type,
      path: this.state.currentAccount.path + '/' + account.acountName,
      isLeaf: true,
    };
    this.accountService
      .createAccount(account)
      .then((res) => {
        console.log(
          'message de creation de Account:' + account.acountName + '-> ' + res
        );

        this._currentPageOperation.next({ page: 1, limit: 15 });
        this._currentPageSubAccount.next({ page: 1, limit: 15 });

        if (
          this.state.currentAccount.isLeaf &&
          this.state.currentAccount.id !== undefined
        ) {
          this.accountService
            .updateAccount(
              {
                ...this.state.currentAccount,
                isLeaf: false,
              } as Account,
              this.state.currentAccount.id
            )
            .then(() => {
              this.setCurrentAccount({
                ...this.state.currentAccount,
                isLeaf: false,
              });
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }

  getCurrentPeriod() {
    return this.mainStore.state.period;
  }

  setPeriod(val: any) {
    this.mainStore.setPeriod(val);
  }

  initNewOperation() {
    this.mainStore.setCurrentAccountId(this.state.currentAccount.id);
  }

  loadLeadAccounts(exeptId: number | undefined) {
    if (exeptId) {
      this.accountService
        .getLeatAccountExceptOneByIds([exeptId])
        .then((leafs) => {
          this.setLeafAccounts(leafs);
        })
        .catch((e) => {
          console.error(e);
          this.setLeafAccounts([]);
        });
    } else {
      this.accountService
        .getLeatAccountExcepttype([])
        .then((leafs) => {
          this.setLeafAccounts(leafs);
        })
        .catch((e) => {
          console.error(e);
          this.setLeafAccounts([]);
        });
    }
  }
  setLeafAccounts(leafs: LeafAccount[]) {
    this.setState({ ...this.state, leafAccounts: leafs });
  }
}
