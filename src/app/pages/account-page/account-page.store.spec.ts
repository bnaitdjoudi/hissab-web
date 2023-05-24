import { TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, from } from 'rxjs';
import { Operation } from '../../model/operation.model';
import { AccountsService } from '../../services/accounts.service';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { AccountPageStore } from './account-page.store';

import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { Account } from '../../model/account.model';

describe('AccountPageStore', () => {
  describe('AccountPageStore creation', () => {
    let accountPageStore: AccountPageStore;

    beforeEach(() => {
      const spyAccountService = {
        getLeatAccountExceptOneByIds: '',
        getLeatAccountExcepttype: '',
        performUpdateOperationLis: '',
        getSubAccountsByPagingAndAccountId: (
          paging: PagingRequest,
          id: number
        ): Promise<PagingData<Account>> => {
          return Promise.resolve({
            data: [],
            totalPage: 0,
            currentPage: 0,
          });
        },
      };
      const spyOperationService = {
        getOperationsByPagingAndAccountId: (
          paging: PagingRequest,
          id: number
        ): Promise<PagingData<Operation>> => {
          return Promise.resolve({
            data: [],
            totalPage: 0,
            currentPage: 0,
          });
        },
        deleteOperationDate: (id: number) => Promise.resolve(),
      } as OperationService;

      let idAccount$ = from([0]);
      const spyRouteParamsStore = {
        idAccount$: idAccount$,
      } as RouteParamsStore;

      TestBed.configureTestingModule({
        // Provide both the service-to-test and its (spy) dependency
        providers: [
          AccountPageStore,
          { provide: AccountsService, useValue: spyAccountService },
          { provide: OperationService, useValue: spyOperationService },
          { provide: RouteParamsStore, useValue: spyRouteParamsStore },
        ],
      });

      accountPageStore = TestBed.inject(AccountPageStore);
    });

    it('AccountPageStore should create', async () => {
      expect(accountPageStore).toBeTruthy();
    });
  });

  describe('AccountPageStore Methods', () => {
    let accountPageStore: AccountPageStore;
    let accountServiceSpy: AccountsService;
    let operationServiceSpy: OperationService;
    let routeParamsStoreSpy: RouteParamsStore;

    let subject: BehaviorSubject<number> = new BehaviorSubject(0);

    beforeEach(waitForAsync(() => {
      const spyAccountService = {
        getAccountById: (id: number) => Promise.resolve({}),
        getLeatAccountExceptOneByIds: (id: number[]) => Promise.resolve([]),
        getLeatAccountExcepttype: '',
        performUpdateOperationLis: '',
        getSubAccountsByPagingAndAccountId: (
          paging: PagingRequest,
          id: number
        ): Promise<PagingData<Account>> => {
          return Promise.resolve({
            data: [],
            totalPage: 0,
            currentPage: 0,
          });
        },
        createAccount: (account: Account) =>
          Promise.resolve(JSON.stringify(account)),
        updateAccount: (account: Account) =>
          Promise.resolve(JSON.stringify(account)),
      };
      const spyOperationService = {
        getOperationsByPagingAndAccountId: (
          paging: PagingRequest,
          id: number
        ): Promise<PagingData<Operation>> => {
          return Promise.resolve({
            data: [],
            totalPage: 0,
            currentPage: 0,
          });
        },
        deleteOperationDate: (id: number) => Promise.resolve(),
        businessCreationOperationDate: (operation: Operation) => {
          return Promise.resolve(operation);
        },
      } as OperationService;

      const spyRouteParamsStore = {
        idAccount$: subject.asObservable(),
      } as RouteParamsStore;

      TestBed.configureTestingModule({
        // Provide both the service-to-test and its (spy) dependency
        providers: [
          AccountPageStore,
          { provide: AccountsService, useValue: spyAccountService },
          { provide: OperationService, useValue: spyOperationService },
          { provide: RouteParamsStore, useValue: spyRouteParamsStore },
        ],
      });

      accountPageStore = TestBed.inject(AccountPageStore);
      accountServiceSpy = TestBed.inject(AccountsService);
      routeParamsStoreSpy = TestBed.inject(RouteParamsStore);
      operationServiceSpy = TestBed.inject(OperationService);
    }));

    it('AccountPageStore currentAccount$ subscribtion', async () => {
      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };
      spyOn(accountServiceSpy, 'getLeatAccountExceptOneByIds').and.returnValue(
        Promise.resolve([])
      );

      accountPageStore.setCurrentAccount(account);

      expect(
        accountServiceSpy.getLeatAccountExceptOneByIds
      ).toHaveBeenCalledTimes(1);

      expect(
        accountServiceSpy.getLeatAccountExceptOneByIds
      ).toHaveBeenCalledWith([1]);
    });

    it('AccountPageStore currentAccount$ exlude branch', async () => {
      let account: Account = {
        id: 2,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'income',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };
      spyOn(accountServiceSpy, 'getLeatAccountExcepttype').and.returnValue(
        Promise.resolve([])
      );

      accountPageStore.setCurrentAccount(account);

      expect(accountServiceSpy.getLeatAccountExcepttype).toHaveBeenCalledTimes(
        1
      );

      expect(accountServiceSpy.getLeatAccountExcepttype).toHaveBeenCalledWith([
        'income',
      ]);
    });

    it('AccountPageStore routeParamsStore.idAccount$ ', async () => {
      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      spyOn(accountServiceSpy, 'getAccountById').and.returnValue(
        Promise.resolve(account)
      );
      spyOn(accountPageStore, 'setCurrentAccount');
      subject.next(3);

      expect(accountServiceSpy.getAccountById).toHaveBeenCalledTimes(1);

      expect(accountServiceSpy.getAccountById).toHaveBeenCalledWith(3);
    });

    it('AccountPageStore routeParamsStore.idAccount$ getAccountById catch', async () => {
      spyOn(accountServiceSpy, 'getAccountById').and.returnValue(
        Promise.reject('message')
      );

      subject.next(3);

      expect(accountServiceSpy.getAccountById).toHaveBeenCalledTimes(1);

      expect(accountServiceSpy.getAccountById).toHaveBeenCalledWith(3);
    });

    it('AccountPageStore setNewOrUpdateOperation should perform new operation', async () => {
      let operation: Operation = {
        id: 0,
        numTrans: '',
        time: new Date(),
        description: '',
        statut: '',
        credit: 0,
        debit: 0,
        balance: 0,
        idAccount: 0,
        transfer: '',
      };

      let spy = spyOn<AccountPageStore, any>(
        accountPageStore,
        'createNewOperation'
      );

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };
      accountPageStore.setCurrentAccount(account);

      accountPageStore.setNewOrUpdateOperation(operation);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith(operation);
    });

    it('AccountPageStore pagingOperation$ should run performUpdateOperationList', async () => {
      let spy = spyOn<AccountPageStore, any>(
        accountPageStore,
        'performUpdateOperationList'
      );

      let pagingOperation: PagingRequest = {
        page: 58,
        limit: 9,
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account);
      accountPageStore._currentPageOperation.next(pagingOperation);

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(pagingOperation, 1);
    });

    it('AccountPageStore pagingAccount$ should run performUpdateSubAccountList', async () => {
      let spy = spyOn<AccountPageStore, any>(
        accountPageStore,
        'performUpdateSubAccountList'
      );

      let pagingAccount: PagingRequest = {
        page: 58,
        limit: 9,
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account);
      accountPageStore._currentPageSubAccount.next(pagingAccount);

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(pagingAccount, 1);
    });

    it('AccountPageStore  performUpdateSubAccountList run updateSubAccountData ', async () => {
      let pagingDataAccount: PagingData<Account> = {
        data: [],
        totalPage: 0,
        currentPage: 0,
      };

      let spy1 = spyOn<AccountsService, any>(
        accountServiceSpy,
        'getSubAccountsByPagingAndAccountId'
      ).and.returnValue(Promise.resolve(pagingDataAccount));

      let spy2 = spyOn<AccountPageStore, any>(
        accountPageStore,
        'updateSubAccountData'
      );

      let pagingAccount: PagingRequest = {
        page: 58,
        limit: 9,
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account);
      accountPageStore._currentPageSubAccount.next(pagingAccount);

      expect(spy1).toHaveBeenCalledTimes(2);

      expect(spy1).toHaveBeenCalledWith(pagingAccount, 1);
    });

    it('AccountPageStore  performUpdateSubAccountList reject ', async () => {
      let spy1 = spyOn<AccountsService, any>(
        accountServiceSpy,
        'getSubAccountsByPagingAndAccountId'
      ).and.returnValue(Promise.reject());

      let pagingAccount: PagingRequest = {
        page: 58,
        limit: 9,
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account);
      accountPageStore._currentPageSubAccount.next(pagingAccount);

      expect(spy1).toHaveBeenCalledTimes(2);

      //expect(spy1).toHaveBeenCalledWith(pagingAccount, 0);
      expect(spy1).toHaveBeenCalledWith(pagingAccount, 1);

      //TODO
      //expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('AccountPageStore  getOperationsByPagingAndAccountId perform ', async () => {
      //

      let pagingDataOperation: PagingData<Operation> = {
        data: [],
        totalPage: 0,
        currentPage: 0,
      };

      let spy1 = spyOn<OperationService, any>(
        operationServiceSpy,
        'getOperationsByPagingAndAccountId'
      ).and.returnValue(Promise.resolve(pagingDataOperation));

      let pagingAccount: PagingRequest = {
        page: 58,
        limit: 9,
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account);
      accountPageStore._currentPageOperation.next(pagingAccount);

      expect(spy1).toHaveBeenCalledTimes(2);

      expect(spy1).toHaveBeenCalledWith({ page: 1, limit: 10 }, 1);
      expect(spy1).toHaveBeenCalledWith(pagingAccount, 1);
      //TODO
      //expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('AccountPageStore  getOperationsByPagingAndAccountId reject ', async () => {
      //

      let spy1 = spyOn<OperationService, any>(
        operationServiceSpy,
        'getOperationsByPagingAndAccountId'
      ).and.returnValue(Promise.reject('message'));

      let pagingAccount: PagingRequest = {
        page: 58,
        limit: 9,
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account);
      accountPageStore._currentPageOperation.next(pagingAccount);

      expect(spy1).toHaveBeenCalledTimes(2);

      expect(spy1).toHaveBeenCalledWith({ page: 1, limit: 10 }, 1);
      expect(spy1).toHaveBeenCalledWith(pagingAccount, 1);
      //TODO
      //expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('operationService deleteOperationDate should perform', async () => {
      let spydeleteOperationDate = spyOn<OperationService, any>(
        operationServiceSpy,
        'deleteOperationDate'
      ).and.returnValue(Promise.resolve());

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      spyOn(accountServiceSpy, 'getAccountById').and.returnValue(
        Promise.resolve(account)
      );

      let account2: Account = {
        id: 1,
        acountName: '',
        totalAccount: 500,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account2);
      accountPageStore._deleteOperationSubject.next(2);

      expect(spydeleteOperationDate).toHaveBeenCalledTimes(1);
      expect(spydeleteOperationDate).toHaveBeenCalledWith(2);
    });

    it('accountStore accountServiceSpy should perform ', async () => {
      let account: Account = {
        id: 0,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spy = spyOn<AccountPageStore, any>(
        accountPageStore,
        'createNewAccount'
      );

      let account2: Account = {
        id: 1,
        acountName: '',
        totalAccount: 500,
        isMain: false,
        type: 'actif',
        parentId: 0,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      accountPageStore.setCurrentAccount(account2);
      accountPageStore._newAccountSubject.next(account);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(account);
    });

    it('accountStore createNewOperation should perform businessCreationOperationDate ', async () => {
      let operation: Operation = {
        id: 0,
        numTrans: '',
        time: new Date(),
        description: '',
        statut: 'r',
        credit: 500,
        debit: 0,
        balance: 0,
        idAccount: 0,
        transfer: '',
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyOp = spyOn<OperationService, any>(
        operationServiceSpy,
        'businessCreationOperationDate'
      ).and.returnValue(Promise.resolve());

      accountPageStore.setCurrentAccount(account);
      accountPageStore.setNewOrUpdateOperation(operation);
      expect(spyOp).toHaveBeenCalledTimes(1);
      expect(spyOp).toHaveBeenCalledWith(operation);
    });

    it('accountStore createNewOperation should perform businessCreationOperationDate and reject', async () => {
      let operation: Operation = {
        id: 0,
        numTrans: '',
        time: new Date(),
        description: '',
        statut: 'r',
        credit: 5500,
        debit: 0,
        balance: 0,
        idAccount: 0,
        transfer: '',
      };

      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyOp = spyOn<OperationService, any>(
        operationServiceSpy,
        'businessCreationOperationDate'
      ).and.returnValue(Promise.reject('message erreur'));

      accountPageStore.setCurrentAccount(account);
      accountPageStore.setNewOrUpdateOperation(operation);
      expect(spyOp).toHaveBeenCalledTimes(1);
      expect(spyOp).toHaveBeenCalledWith(operation);

      //expect(spyAcc).toHaveBeenCalledTimes(1);
    });

    it('accountStore reloadAccount should perform getAccountById', async () => {
      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyAcc = spyOn<AccountsService, any>(
        accountServiceSpy,
        'getAccountById'
      ).and.returnValue(Promise.resolve(account));

      let spy = spyOn<AccountPageStore, any>(
        accountPageStore,
        'setCurrentAccount'
      );

      accountPageStore.state.currentAccount = account;
      await accountPageStore.reloadAccount(undefined);
      expect(spyAcc).toHaveBeenCalledTimes(1);
      expect(spyAcc).toHaveBeenCalledWith(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('accountStore reloadAccount should perform getAccountById with reject', async () => {
      let account: Account = {
        id: 1,
        acountName: '',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyAcc = spyOn<AccountsService, any>(
        accountServiceSpy,
        'getAccountById'
      ).and.returnValue(Promise.reject('erreur'));

      let spy = spyOn<AccountPageStore, any>(
        accountPageStore,
        'setCurrentAccount'
      );

      accountPageStore.state.currentAccount = account;
      await accountPageStore.reloadAccount(undefined);
      expect(spyAcc).toHaveBeenCalledTimes(1);
      expect(spyAcc).toHaveBeenCalledWith(1);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('accountStore createNewAccount should perform accountService ', async () => {
      let account: Account = {
        id: 8,
        acountName: 'prince',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let accountNotLeaf: Account = {
        id: 8,
        acountName: 'prince',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let account1: Account = {
        id: 0,
        acountName: 'walou',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let account2: Account = {
        id: 0,
        acountName: 'walou',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 8,
        path: '/walou',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyAcc = spyOn<AccountsService, any>(
        accountServiceSpy,
        'createAccount'
      ).and.returnValue(Promise.resolve('sdsd'));

      let spyAccUpdate = spyOn<AccountsService, any>(
        accountServiceSpy,
        'updateAccount'
      ).and.returnValue(Promise.resolve());

      accountPageStore.state.currentAccount = account;
      await accountPageStore._newAccountSubject.next(account1);
      expect(spyAcc).toHaveBeenCalledTimes(1);
      expect(spyAcc).toHaveBeenCalledWith(account2);

      expect(spyAccUpdate).toHaveBeenCalledTimes(1);
      expect(spyAccUpdate).toHaveBeenCalledWith(accountNotLeaf, 8);
    });

    it('accountStore createNewAccount should perform accountService  create account reject', async () => {
      let account: Account = {
        id: 8,
        acountName: 'prince',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let account1: Account = {
        id: 0,
        acountName: 'walou',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let account2: Account = {
        id: 0,
        acountName: 'walou',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 8,
        path: '/walou',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyAcc = spyOn<AccountsService, any>(
        accountServiceSpy,
        'createAccount'
      ).and.returnValue(Promise.reject());

      let spyAccUpdate = spyOn<AccountsService, any>(
        accountServiceSpy,
        'updateAccount'
      ).and.returnValue(Promise.resolve());

      accountPageStore.state.currentAccount = account;
      await accountPageStore._newAccountSubject.next(account1);
      expect(spyAcc).toHaveBeenCalledTimes(1);
      expect(spyAcc).toHaveBeenCalledWith(account2);

      expect(spyAccUpdate).toHaveBeenCalledTimes(0);
      //expect(spyAccUpdate).toHaveBeenCalledWith(accountNotLeaf, 8);
    });

    it('accountStore createNewAccount should perform accountService  update reject', async () => {
      let account: Account = {
        id: 8,
        acountName: 'prince',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let accountNotLeaf: Account = {
        id: 8,
        acountName: 'prince',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let account1: Account = {
        id: 0,
        acountName: 'walou',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 200,
        path: '',
        isLeaf: false,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let account2: Account = {
        id: 0,
        acountName: 'walou',
        totalAccount: 0,
        isMain: false,
        type: 'actif',
        parentId: 8,
        path: '/walou',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      let spyAcc = spyOn<AccountsService, any>(
        accountServiceSpy,
        'createAccount'
      ).and.returnValue(Promise.resolve('lklkh'));

      let spyAccUpdate = spyOn<AccountsService, any>(
        accountServiceSpy,
        'updateAccount'
      ).and.returnValue(Promise.reject());

      accountPageStore.state.currentAccount = account;
      await accountPageStore._newAccountSubject.next(account1);
      expect(spyAcc).toHaveBeenCalledTimes(1);
      expect(spyAcc).toHaveBeenCalledWith(account2);

      expect(spyAccUpdate).toHaveBeenCalledTimes(1);
      expect(spyAccUpdate).toHaveBeenCalledWith(accountNotLeaf, 8);
    });
  });
});
