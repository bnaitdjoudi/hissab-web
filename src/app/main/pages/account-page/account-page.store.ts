import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { AccountingService } from '../../services/accounting.service';
import { AccountsService } from '../../services/accounts.service';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { Store } from '../../store/store';
import { excludedAccountTypeTransferTo } from '../../tools/configs';
import { localBalanceFunMap } from '../../tools/counting.fun.tools';
import { AccountPageStoreModel } from './account-page.store.model';
import random from 'random-string-alphanumeric-generator';

@Injectable()
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

  //Subjects
  _currentPageOperation: BehaviorSubject<PagingRequest> =
    this.subject<PagingRequest>(
      (val: PagingRequest) =>
        this.setState({
          ...this.state,
          operationsPagingRequest: val,
        }),
      { page: 1, limit: 10 }
    );

  _currentPageSubAccount: BehaviorSubject<PagingRequest> =
    this.subject<PagingRequest>(
      (val: PagingRequest) =>
        this.setState({
          ...this.state,
          accountsPagingRequest: val,
        }),
      { page: 1, limit: 10 }
    );

  _deleteOperationSubject: BehaviorSubject<number>;

  _newAccountSubject: BehaviorSubject<Account | null>;

  constructor(
    private readonly accountService: AccountsService,
    private readonly operationService: OperationService,
    private readonly routeParamsStore: RouteParamsStore
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
      },
      operationsData: { data: [], currentPage: 1, totalPage: 1 },
      subAccountData: { data: [], currentPage: 1, totalPage: 1 },
      accountsPagingRequest: { page: 1, limit: 10 },
      operationsPagingRequest: { page: 1, limit: 10 },
      leafAccounts: [],
    });
    this._deleteOperationSubject = new BehaviorSubject<number>(0);
    this._newAccountSubject = new BehaviorSubject<Account | null>(null);
    this.initSuscription();
  }

  private initSuscription() {
    this.currentAccount$.subscribe((acc) => {
      if (acc.type === 'actif') {
        this.accountService
          .getLeatAccountExceptOneByIds([acc.id])
          .then((leafs) => {
            this.setState({ ...this.state, leafAccounts: leafs });
          });
      } else {
        if (excludedAccountTypeTransferTo[acc.type]) {
          this.accountService
            .getLeatAccountExcepttype(excludedAccountTypeTransferTo[acc.type])
            .then((leafs) => {
              this.setState({ ...this.state, leafAccounts: leafs });
            });
        }
      }

      if (acc.id !== undefined && acc.id > 0) {
        this.performUpdateOperationList({ page: 1, limit: 10 }, acc.id);
        this.performUpdateSubAccountList({ page: 1, limit: 10 }, acc.id);
      }
    });

    //routeParamettre
    this.routeParamsStore.idAccount$.subscribe((id) => {
      if (id > 0) {
        this.accountService
          .getAccountById(id)
          .then((acc) => {
            this.setCurrentAccount(acc);
            this._currentPageSubAccount.next({ page: 1, limit: 10 });
            this._currentPageOperation.next({ page: 1, limit: 10 });
          })
          .catch((e) => console.error(e));
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
            if (this.state.currentAccount.id !== undefined) {
              this.accountService
                .getAccountById(this.state.currentAccount.id)
                .then((acc) => {
                  this.setCurrentAccount(acc);
                  this._currentPageOperation.next({ page: 1, limit: 10 });
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
  }

  private performUpdateSubAccountList(val: PagingRequest, id: number) {
    this.accountService
      .getSubAccountsByPagingAndAccountId(val, id)
      .then((data) => {
        this.updateSubAccountData(data);
      })
      .catch((err) => console.error(err));
  }
  updateSubAccountData(data: PagingData<Account>) {
    this.setState({ ...this.state, subAccountData: data });
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
        .getOperationsByPagingAndAccountId(paging, id)
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
        this.reloadAccount();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async reloadAccount() {
    this.accountService
      .getAccountById(this.state.currentAccount.id)
      .then((acc) => {
        this.setCurrentAccount(acc);
        this._currentPageOperation.next({ page: 1, limit: 10 });
      })
      .catch((err) => {
        console.error(err);
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

        this.performUpdateOperationList(
          { page: 1, limit: 10 },
          this.state.currentAccount.id
        );
        this.performUpdateSubAccountList(
          { page: 1, limit: 10 },
          this.state.currentAccount.id
        );

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
}
