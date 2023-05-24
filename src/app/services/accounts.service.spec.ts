import { TestBed } from '@angular/core/testing';
import { Account } from '../model/account.model';
import { LeafAccount } from '../model/leaf-account.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import { AccountsService } from './accounts.service';
import { AccountDataBase } from './databases/account.db';

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let spyAccountDb: AccountDataBase;

  let account: Account = {
    id: 5,
    acountName: '',
    totalAccount: 50,
    isMain: false,
    type: 'actif',
    parentId: 0,
    path: '',
    isLeaf: false,
    resume: { debit: 0, credit: 0, sons: 0 },
  };

  let leafAccounts: LeafAccount[] = [];

  let accounts: Account[] = [account];
  let pagingData: PagingData<Account> = {
    data: accounts,
    totalPage: 1,
    currentPage: 1,
  };

  beforeEach(() => {
    let accountDbSpy = {
      findAll: jasmine
        .createSpy('findAll')
        .and.returnValue(Promise.resolve(accounts)),
      getMainAccounts: jasmine
        .createSpy('getMainAccounts')
        .and.returnValue(accounts),
      findById: jasmine
        .createSpy('findById')
        .and.returnValue(Promise.resolve(account)),
      update: jasmine
        .createSpy('update')
        .and.returnValue(Promise.resolve(account)),
      findByIdAccountAndPaging: jasmine
        .createSpy('findByIdAccountAndPaging')
        .and.returnValue(Promise.resolve(pagingData)),
      create: jasmine.createSpy('create'),
      ajusteDiffByPath: jasmine
        .createSpy('ajusteDiffByPath')
        .and.returnValue(Promise.resolve(account)),
      getAccountsByType: jasmine
        .createSpy('getAccountsByType')
        .and.returnValue(Promise.resolve(accounts)),
      findAllLeafExeptType: jasmine
        .createSpy('findAllLeafExeptType')
        .and.returnValue(Promise.resolve(leafAccounts)),
      findAllLeafExeptOneByIds: jasmine
        .createSpy('findAllLeafExeptOneByIds')
        .and.returnValue(Promise.resolve(leafAccounts)),
      finByPath: jasmine
        .createSpy('finByPath')
        .and.returnValue(Promise.resolve(account)),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountsService,
        { provide: AccountDataBase, useValue: accountDbSpy },
      ],
    });

    accountsService = TestBed.inject(AccountsService);
    spyAccountDb = TestBed.inject(AccountDataBase);
  });

  it('should be created', () => {
    expect(accountsService).toBeTruthy();
  });

  it('getAllAccounts', async () => {
    let result = await accountsService.getAllAccounts();
    expect(spyAccountDb.findAll).toHaveBeenCalled();
    expect(result).toEqual(accounts);
  });

  it('getMainAccounts', async () => {
    let result = await accountsService.getMainAccounts();
    expect(spyAccountDb.getMainAccounts).toHaveBeenCalled();
    expect(result).toEqual(accounts);
  });

  it('getAccountById', async () => {
    let result = await accountsService.getAccountById(5);
    expect(spyAccountDb.findById).toHaveBeenCalledOnceWith(5);
    expect(result).toEqual(account);
  });

  it('updateAccount', async () => {
    let result = await accountsService.updateAccount(account, 5);
    expect(spyAccountDb.update).toHaveBeenCalledOnceWith(account, 5);
    expect(result).toEqual(account);
  });

  it('getSubAccountsByPagingAndAccountId', async () => {
    let paging: PagingRequest = {
      page: 1,
      limit: 10,
    };

    let result = await accountsService.getSubAccountsByPagingAndAccountId(
      paging,
      5
    );
    expect(spyAccountDb.findByIdAccountAndPaging).toHaveBeenCalledOnceWith(
      paging,
      5
    );
    expect(result).toEqual(pagingData);
  });

  it('getSubAccountsByPagingAndAccountId reject', async () => {
    let paging: PagingRequest = {
      page: 1,
      limit: 10,
    };

    spyAccountDb.findByIdAccountAndPaging = jasmine
      .createSpy('findByIdAccountAndPaging')
      .and.returnValue(Promise.reject());

    try {
      let result = await accountsService.getSubAccountsByPagingAndAccountId(
        paging,
        5
      );
    } catch (e) {
      expect(e).toEqual(
        'une erreur sai produit lors de chargement la list des account'
      );
    }

    expect(spyAccountDb.findByIdAccountAndPaging).toHaveBeenCalledOnceWith(
      paging,
      5
    );
  });

  it('createAccount resolve', async () => {
    let res: any = {
      val: 1,
    };

    spyAccountDb.create = jasmine
      .createSpy('create')
      .and.returnValue(Promise.resolve(res));

    let result = await accountsService.createAccount(account);
    expect(res).toEqual(result);
    expect(spyAccountDb.create).toHaveBeenCalledOnceWith(account);
  });

  it('createAccount reject', async () => {
    spyAccountDb.create = jasmine
      .createSpy('create')
      .and.returnValue(Promise.reject());

    try {
      let result = await accountsService.createAccount(account);
    } catch (r) {
      expect(r).toEqual('erreur au moment de persister le Account');
    }

    expect(spyAccountDb.create).toHaveBeenCalledOnceWith(account);
  });

  it('updateTotalByAccountPath resolve', async () => {
    let path: string[] = ['1', '1/2'];

    let result = await accountsService.updateTotalByAccountPath(path, 70);
    expect(account).toEqual(result);
    expect(spyAccountDb.ajusteDiffByPath).toHaveBeenCalledOnceWith(path, 70);
  });

  it('getAccountByType resolve', async () => {
    let result = await accountsService.getAccountByType('type');
    expect(accounts).toEqual(result);
    expect(spyAccountDb.getAccountsByType).toHaveBeenCalledOnceWith('type');
  });

  it('getAccountByType reject', async () => {
    spyAccountDb.getAccountsByType = jasmine
      .createSpy('getAccountsByType')
      .and.returnValue(Promise.reject());

    try {
      await accountsService.getAccountByType('type');
    } catch (e) {
      expect(e).toEqual('erreur lors du de lappelle a la base de données');
    }

    expect(spyAccountDb.getAccountsByType).toHaveBeenCalledOnceWith('type');
  });

  it('getLeatAccountExcepttype resolve', async () => {
    let result = await accountsService.getLeatAccountExcepttype(['type']);
    expect(leafAccounts).toEqual(result);
    expect(spyAccountDb.findAllLeafExeptType).toHaveBeenCalledOnceWith([
      'type',
    ]);
  });

  it('getLeatAccountExcepttype reject', async () => {
    spyAccountDb.findAllLeafExeptType = jasmine
      .createSpy('findAllLeafExeptType')
      .and.returnValue(Promise.reject());

    try {
      await accountsService.getLeatAccountExcepttype(['type']);
    } catch (e) {
      expect(e).toEqual("probleme lors de l'appelle du service !!!!");
    }

    expect(spyAccountDb.findAllLeafExeptType).toHaveBeenCalledOnceWith([
      'type',
    ]);
  });

  it('getLeatAccountExceptOneByIds resolve', async () => {
    let result = await accountsService.getLeatAccountExceptOneByIds([6]);
    expect(leafAccounts).toEqual(result);
    expect(spyAccountDb.findAllLeafExeptOneByIds).toHaveBeenCalledOnceWith([6]);
  });

  it('getLeatAccountExceptOneByIds reject', async () => {
    spyAccountDb.findAllLeafExeptOneByIds = jasmine
      .createSpy('findAllLeafExeptOneByIds')
      .and.returnValue(Promise.reject());

    try {
      await accountsService.getLeatAccountExceptOneByIds([6]);
    } catch (e) {
      expect(e).toEqual("probleme lors de l'appelle du service !!!!");
    }

    expect(spyAccountDb.findAllLeafExeptOneByIds).toHaveBeenCalledOnceWith([6]);
  });

  it('findAccountByPath resolve', async () => {
    let result = await accountsService.findAccountByPath('path');
    expect(account).toEqual(result);
    expect(spyAccountDb.finByPath).toHaveBeenCalledOnceWith('path');
  });

  it('findAccountByPath reject', async () => {
    spyAccountDb.finByPath = jasmine
      .createSpy('finByPath')
      .and.returnValue(Promise.reject('erreur'));

    try {
      await accountsService.findAccountByPath('walou');
    } catch (e) {
      expect(e).toEqual('erreur');
    }

    expect(spyAccountDb.finByPath).toHaveBeenCalledOnceWith('walou');
  });
});
