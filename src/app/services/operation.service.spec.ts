import { TestBed } from '@angular/core/testing';
import { Account } from '../model/account.model';
import { Operation } from '../model/operation.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import { AccountingService } from './accounting.service';
import { AccountsService } from './accounts.service';
import { OperationDataBase } from './databases/operation.db';
import { OperationService } from './operation.service';

describe('OperationService', () => {
  let operationService: OperationService;
  let operationDb: OperationDataBase;
  let accountService: AccountsService;

  let account: Account = {
    id: 0,
    acountName: '',
    totalAccount: 0,
    isMain: false,
    type: '',
    parentId: 0,
    path: 'path/to/account',
    isLeaf: false,
    resume: { debit: 0, credit: 0, sons: 0 },
  };

  let operation: Operation = {
    id: 0,
    numTrans: 'numTrans',
    time: new Date(),
    description: '',
    statut: '',
    credit: 0,
    debit: 0,
    balance: 0,
    idAccount: 0,
    transfer: '',
    accountType: 'actif',
  };
  let operationv: Operation = {
    id: 45,
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

  let operations: Operation[] = [operation, operationv];

  let pagingData: PagingData<Operation> = {
    data: operations,
    totalPage: 1,
    currentPage: 1,
  };

  beforeEach(() => {
    let operationDbSpy = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      createList: jasmine
        .createSpy('createList')
        .and.returnValue(Promise.resolve()),
      findByIdAccount: jasmine
        .createSpy('findByIdAccount')
        .and.returnValue(Promise.resolve(operations)),
      update: jasmine
        .createSpy('update')
        .and.returnValue(Promise.resolve(operation)),
      findById: jasmine
        .createSpy('findById')
        .and.returnValue(Promise.resolve(operation)),
      selectOperationJoinAccountById: jasmine
        .createSpy('selectOperationJoinAccountById')
        .and.returnValue(Promise.resolve(operation)),
      findByIdAccountAndPaging: jasmine
        .createSpy('findByIdAccountAndPaging')
        .and.returnValue(Promise.resolve(pagingData)),

      adjusteAfterOperation: jasmine
        .createSpy('adjusteAfterOperation')
        .and.returnValue(Promise.resolve()),
      adjusteAfterOperationByDate: jasmine
        .createSpy('adjusteAfterOperationByDate')
        .and.returnValue(Promise.resolve()),
      getBalanceBeforeDate: jasmine
        .createSpy('getBalanceBeforeDate')
        .and.returnValue(Promise.resolve(8)),
      selectOperationJoinAccountByNumTrans: jasmine
        .createSpy('selectOperationJoinAccountByNumTrans')
        .and.returnValue(Promise.resolve(operations)),
      deleteById: jasmine
        .createSpy('deleteById')
        .and.returnValue(Promise.resolve()),
      findOperationByTransAndCountId: jasmine
        .createSpy('findOperationByTransAndCountId')
        .and.returnValue(Promise.resolve(operation)),
    };
    let accountServiceSpy = {
      updateTotalByAccountPath: jasmine
        .createSpy('updateTotalByAccountPath')
        .and.returnValue(Promise.resolve()),
      getAccountById: jasmine
        .createSpy('getAccountById')
        .and.returnValue(Promise.resolve(account)),
      findAccountByPath: jasmine.createSpy('findAccountByPath'),
    };
    let accountingServiceSpy = {
      processTransferingOperation: jasmine
        .createSpy('processTransferingOperation')
        .and.callFake((to: string, operation: Operation) => {
          let accountingService = new AccountingService();
          return accountingService.processTransferingOperation(to, operation);
        }),
    };

    TestBed.configureTestingModule({
      providers: [
        OperationService,
        { provide: OperationDataBase, useValue: operationDbSpy },
        { provide: AccountsService, useValue: accountServiceSpy },
        { provide: AccountingService, useValue: accountingServiceSpy },
      ],
    });

    operationService = TestBed.inject(OperationService);
    operationDb = TestBed.inject(OperationDataBase);
    accountService = TestBed.inject(AccountsService);
  });

  it('should create', () => {
    expect(operationService).toBeTruthy();
  });

  it('OperationService create', async () => {
    await operationService.createOperation(operation);

    expect(operationDb.create).toHaveBeenCalledOnceWith(operation);
  });

  it('OperationService create bulk', async () => {
    await operationService.createOperations(operations);

    expect(operationDb.createList).toHaveBeenCalledOnceWith(operations, true);
  });

  it('OperationService getOperationsByAccountId', async () => {
    let result = await operationService.getOperationsByAccountId(5);
    expect(operationDb.findByIdAccount).toHaveBeenCalledOnceWith(5);
    expect(result).toEqual(operations);
  });

  it('OperationService updateOperation', async () => {
    let result = await operationService.updateOperation(operation, 5);
    expect(operationDb.update).toHaveBeenCalledOnceWith(operation, 5);
    expect(result).toEqual(operation);
  });

  it('OperationService getOperationById', async () => {
    let result = await operationService.getOperationById(5);
    expect(operationDb.findById).toHaveBeenCalledOnceWith(5);
    expect(result).toEqual(operation);
  });

  it('OperationService getOperationJoinAccountById', async () => {
    let result = await operationService.getOperationJoinAccountById(5);
    expect(operationDb.selectOperationJoinAccountById).toHaveBeenCalledOnceWith(
      5
    );
    expect(result).toEqual(operation);
  });

  it('OperationService getOperationJoinAccountById reject', async () => {
    operationDb.selectOperationJoinAccountById = jasmine
      .createSpy('selectOperationJoinAccountById')
      .and.returnValue(Promise.reject());

    try {
      await operationService.getOperationJoinAccountById(5);
    } catch (error) {
      expect(error).toEqual('erreur dans lappel a la bd');
    }

    expect(operationDb.selectOperationJoinAccountById).toHaveBeenCalledOnceWith(
      5
    );
  });

  it('OperationService getOperationsByPagingAndAccountId', async () => {
    let paging: PagingRequest = {
      page: 1,
      limit: 10,
    };

    let result = await operationService.getOperationsByPagingAndAccountId(
      paging,
      5
    );
    expect(operationDb.findByIdAccountAndPaging).toHaveBeenCalledOnceWith(
      paging,
      5
    );
    expect(result).toEqual(pagingData);
  });

  it('OperationService adjusteAfterOperation all good', async () => {
    let id = 5;
    let accountId: number = 6;
    let diff: number = 600;
    await operationService.adjusteAfterOperation(id, accountId, diff);
    expect(operationDb.adjusteAfterOperation).toHaveBeenCalledOnceWith(
      id,
      accountId,
      diff
    );
    expect(accountService.getAccountById).toHaveBeenCalledOnceWith(accountId);
    expect(accountService.updateTotalByAccountPath).toHaveBeenCalledOnceWith(
      ['path/to/account', 'path/to', 'path'],
      diff
    );
  });

  it('OperationService adjusteAfterOperation updateTotalByAccountPath reject', async () => {
    let id = 5;
    let accountId: number = 6;
    let diff: number = 600;

    accountService.updateTotalByAccountPath = jasmine
      .createSpy('updateTotalByAccountPath')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationService.adjusteAfterOperation(id, accountId, diff);
    } catch (error) {
      expect(operationDb.adjusteAfterOperation).toHaveBeenCalledOnceWith(
        id,
        accountId,
        diff
      );
      expect(accountService.getAccountById).toHaveBeenCalledOnceWith(accountId);
      expect(accountService.updateTotalByAccountPath).toHaveBeenCalledOnceWith(
        ['path/to/account', 'path/to', 'path'],
        diff
      );

      expect(error).toEqual('error');
    }
  });

  it('OperationService adjusteAfterOperation adjusteAfterOperation reject', async () => {
    let id = 5;
    let accountId: number = 6;
    let diff: number = 600;

    operationDb.adjusteAfterOperation = jasmine
      .createSpy('adjusteAfterOperation')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationService.adjusteAfterOperation(id, accountId, diff);
    } catch (error) {
      expect(operationDb.adjusteAfterOperation).toHaveBeenCalledOnceWith(
        id,
        accountId,
        diff
      );
      expect(accountService.getAccountById).toHaveBeenCalledTimes(0);
      expect(accountService.updateTotalByAccountPath).toHaveBeenCalledTimes(0);

      expect(error).toEqual('error');
    }
  });

  it('OperationService adjusteAfterOperationByDate all good', async () => {
    let date = new Date();
    let accountId: number = 6;
    let diff: number = 600;
    await operationService.adjusteAfterOperationByDate(date, accountId, diff);
    expect(operationDb.adjusteAfterOperationByDate).toHaveBeenCalledOnceWith(
      date,
      accountId,
      diff
    );
    expect(accountService.getAccountById).toHaveBeenCalledOnceWith(accountId);
    expect(accountService.updateTotalByAccountPath).toHaveBeenCalledOnceWith(
      ['path/to/account', 'path/to', 'path'],
      diff
    );
  });

  it('OperationService adjusteAfterOperationByDate updateTotalByAccountPath reject', async () => {
    let date = new Date();
    let accountId: number = 6;
    let diff: number = 600;

    accountService.updateTotalByAccountPath = jasmine
      .createSpy('updateTotalByAccountPath')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationService.adjusteAfterOperationByDate(date, accountId, diff);
    } catch (error) {
      expect(operationDb.adjusteAfterOperationByDate).toHaveBeenCalledOnceWith(
        date,
        accountId,
        diff
      );
      expect(accountService.getAccountById).toHaveBeenCalledOnceWith(accountId);
      expect(accountService.updateTotalByAccountPath).toHaveBeenCalledOnceWith(
        ['path/to/account', 'path/to', 'path'],
        diff
      );

      expect(error).toEqual('error');
    }
  });

  it('OperationService adjusteAfterOperationByDate adjusteAfterOperation reject', async () => {
    let date = new Date();
    let accountId: number = 6;
    let diff: number = 600;

    operationDb.adjusteAfterOperationByDate = jasmine
      .createSpy('adjusteAfterOperation')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationService.adjusteAfterOperationByDate(date, accountId, diff);
    } catch (error) {
      expect(operationDb.adjusteAfterOperationByDate).toHaveBeenCalledOnceWith(
        date,
        accountId,
        diff
      );
      expect(accountService.getAccountById).toHaveBeenCalledTimes(0);
      expect(accountService.updateTotalByAccountPath).toHaveBeenCalledTimes(0);

      expect(error).toEqual('error');
    }
  });

  it('OperationService getBalanceBeforeDate getBalanceBeforeDate resolve', async () => {
    let date = new Date();
    let accountId: number = 6;

    let result = await operationService.getBalanceBeforeDate(date, accountId);

    expect(operationDb.getBalanceBeforeDate).toHaveBeenCalledOnceWith(
      date,
      accountId
    );

    expect(result).toEqual(8);
  });

  it('OperationService getBalanceBeforeDate getBalanceBeforeDate reject', async () => {
    let date = new Date();
    let accountId: number = 6;

    operationDb.getBalanceBeforeDate = jasmine
      .createSpy('getBalanceBeforeDate')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationService.getBalanceBeforeDate(date, accountId);
    } catch (error) {
      expect(error).toEqual('erreur en recuperant la balance a la date 6');
    }

    expect(operationDb.getBalanceBeforeDate).toHaveBeenCalledOnceWith(
      date,
      accountId
    );
  });

  it('OperationService businessCreationOperationDate all good', async () => {
    let operationS: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: new Date(),
      description: 'walou',
      statut: 'r',
      credit: 0,
      debit: 500,
      balance: 2400,
      idAccount: 4,
      transfer: 'rout/to/pathD',
    };

    let operationSR: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: operationS.time,
      description: 'walou',
      statut: 'r',
      credit: 0,
      debit: 500,
      balance: 508,
      idAccount: 4,
      transfer: 'rout/to/pathD',
    };

    let operationD: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: operationS.time,
      description: 'walou',
      statut: 'r',
      credit: 500,
      debit: 0,
      balance: -492,
      idAccount: 5,
      transfer: 'rout/to/pathS',
    };

    let accountS: Account = {
      id: 4,
      acountName: '',
      totalAccount: 2500,
      isMain: false,
      type: 'actif',
      parentId: 2,
      path: 'rout/to/pathS',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accountD: Account = {
      id: 5,
      acountName: '',
      totalAccount: 2500,
      isMain: false,
      type: 'passif',
      parentId: 2,
      path: 'rout/to/pathD',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    accountService.getAccountById = jasmine
      .createSpy('getAccountById')
      .and.returnValue(Promise.resolve(accountS));
    accountService.findAccountByPath = jasmine
      .createSpy('findAccountByPath')
      .and.returnValue(Promise.resolve(accountD));

    await operationService.businessCreationOperationDate(operationS);

    expect(operationDb.createList).toHaveBeenCalledWith(
      [operationD, operationSR],
      false
    );
  });

  it('OperationService businessCreationOperationDate adjusteAfterOperationByDate reject', async () => {
    let operationS: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: new Date(),
      description: 'walou',
      statut: 'r',
      credit: 0,
      debit: 500,
      balance: 2400,
      idAccount: 4,
      transfer: 'rout/to/pathD',
    };

    let operationSR: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: operationS.time,
      description: 'walou',
      statut: 'r',
      credit: 0,
      debit: 500,
      balance: 508,
      idAccount: 4,
      transfer: 'rout/to/pathD',
    };

    let operationD: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: operationS.time,
      description: 'walou',
      statut: 'r',
      credit: 500,
      debit: 0,
      balance: -492,
      idAccount: 5,
      transfer: 'rout/to/pathS',
    };

    let accountS: Account = {
      id: 4,
      acountName: '',
      totalAccount: 2500,
      isMain: false,
      type: 'actif',
      parentId: 2,
      path: 'rout/to/pathS',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accountD: Account = {
      id: 5,
      acountName: '',
      totalAccount: 2500,
      isMain: false,
      type: 'passif',
      parentId: 2,
      path: 'rout/to/pathD',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    accountService.getAccountById = jasmine
      .createSpy('getAccountById')
      .and.returnValue(Promise.resolve(accountS));
    accountService.findAccountByPath = jasmine
      .createSpy('findAccountByPath')
      .and.returnValue(Promise.resolve(accountD));

    operationService.adjusteAfterOperationByDate = jasmine
      .createSpy('adjusteAfterOperationByDate')
      .and.returnValue(Promise.reject());

    try {
      await operationService.businessCreationOperationDate(operationS);
    } catch (error) {
      expect(error).toEqual('erreur durant la ajustement');
    }

    expect(operationDb.createList).toHaveBeenCalledWith(
      [operationD, operationSR],
      false
    );
  });

  it('OperationService businessCreationOperationDate createList reject', async () => {
    let operationS: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: new Date(),
      description: 'walou',
      statut: 'r',
      credit: 0,
      debit: 500,
      balance: 2400,
      idAccount: 4,
      transfer: 'rout/to/pathD',
    };

    let operationSR: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: operationS.time,
      description: 'walou',
      statut: 'r',
      credit: 0,
      debit: 500,
      balance: 508,
      idAccount: 4,
      transfer: 'rout/to/pathD',
    };

    let operationD: Operation = {
      id: 9,
      numTrans: 'dsfsdfsdfsd',
      time: operationS.time,
      description: 'walou',
      statut: 'r',
      credit: 500,
      debit: 0,
      balance: -492,
      idAccount: 5,
      transfer: 'rout/to/pathS',
    };

    let accountS: Account = {
      id: 4,
      acountName: '',
      totalAccount: 2500,
      isMain: false,
      type: 'actif',
      parentId: 2,
      path: 'rout/to/pathS',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accountD: Account = {
      id: 5,
      acountName: '',
      totalAccount: 2500,
      isMain: false,
      type: 'passif',
      parentId: 2,
      path: 'rout/to/pathD',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    accountService.getAccountById = jasmine
      .createSpy('getAccountById')
      .and.returnValue(Promise.resolve(accountS));
    accountService.findAccountByPath = jasmine
      .createSpy('findAccountByPath')
      .and.returnValue(Promise.resolve(accountD));

    operationService.adjusteAfterOperationByDate = jasmine
      .createSpy('adjusteAfterOperationByDate')
      .and.returnValue(Promise.resolve());

    operationDb.createList = jasmine
      .createSpy('createList')
      .and.returnValue(Promise.reject());

    try {
      await operationService.businessCreationOperationDate(operationS);
    } catch (error) {
      expect(error).toEqual('erreur durant lajout de loperation');
    }

    expect(operationDb.createList).toHaveBeenCalledWith(
      [operationD, operationSR],
      false
    );

    expect(operationService.adjusteAfterOperationByDate).toHaveBeenCalledTimes(
      0
    );
  });

  it('OperationService deleteOperationDate all godd', async () => {
    let id: number = 58;

    await operationService.deleteOperationDate(id);

    expect(
      operationDb.selectOperationJoinAccountByNumTrans
    ).toHaveBeenCalledOnceWith('numTrans');

    expect(operationDb.deleteById).toHaveBeenCalledOnceWith([0, 45]);
  });

  it('OperationService deleteOperationDate deleteById reject', () => {
    let id: number = 58;

    operationDb.deleteById = jasmine
      .createSpy('deleteById')
      .and.returnValue(Promise.reject('izane'));

    operationService.deleteOperationDate(id).catch((err) => {
      expect(err).toEqual('erreur dans la suppression');
    });

    expect(
      operationDb.selectOperationJoinAccountByNumTrans
    ).toHaveBeenCalledTimes(0);

    expect(operationDb.deleteById).toHaveBeenCalledTimes(0);
  });

  it('OperationService deleteOperationDate selectOperationJoinAccountByNumTrans reject', () => {
    let id: number = 58;

    operationDb.selectOperationJoinAccountByNumTrans = jasmine
      .createSpy('selectOperationJoinAccountByNumTrans')
      .and.returnValue(Promise.reject('izane'));

    operationService.deleteOperationDate(id).catch((err) => {
      expect(err).toEqual('erreur pour retrouver par numero de transaction');
    });

    expect(
      operationDb.selectOperationJoinAccountByNumTrans
    ).toHaveBeenCalledTimes(0);

    expect(operationDb.deleteById).toHaveBeenCalledTimes(0);
  });

  it('OperationService deleteOperationDate findById reject', () => {
    let id: number = 58;

    operationDb.findById = jasmine
      .createSpy('findById')
      .and.returnValue(Promise.reject('izane'));

    operationService.deleteOperationDate(id).catch((err) => {
      expect(err).toEqual('izane');
    });

    expect(
      operationDb.selectOperationJoinAccountByNumTrans
    ).toHaveBeenCalledTimes(0);

    expect(operationDb.deleteById).toHaveBeenCalledTimes(0);
  });

  it('OperationService businessUpdateOperationDate all good', async () => {
    let deleteOperationDateSpy = spyOn(
      operationService,
      'deleteOperationDate'
    ).and.returnValue(Promise.resolve());
    let businessCreationOperationDateSpy = spyOn(
      operationService,
      'businessCreationOperationDate'
    ).and.returnValue(Promise.resolve(operation));

    await operationService.businessUpdateOperationDate(operation);

    expect(deleteOperationDateSpy).toHaveBeenCalledOnceWith(operation.id);
    expect(businessCreationOperationDateSpy).toHaveBeenCalledOnceWith(
      operation
    );
  });

  it('OperationService businessUpdateOperationDate businessCreationOperationDate reject', async () => {
    let deleteOperationDateSpy = spyOn(
      operationService,
      'deleteOperationDate'
    ).and.returnValue(Promise.resolve());
    let businessCreationOperationDateSpy = spyOn(
      operationService,
      'businessCreationOperationDate'
    ).and.returnValue(Promise.reject());

    try {
      await operationService.businessUpdateOperationDate(operation);
    } catch (error) {
      expect(error).toEqual('erreur lors de la creation de l operation');
    }

    expect(deleteOperationDateSpy).toHaveBeenCalledOnceWith(operation.id);
    expect(businessCreationOperationDateSpy).toHaveBeenCalledOnceWith(
      operation
    );
  });

  it('OperationService businessUpdateOperationDate deleteOperationDate reject', async () => {
    let deleteOperationDateSpy = spyOn(
      operationService,
      'deleteOperationDate'
    ).and.returnValue(Promise.reject('walou'));
    let businessCreationOperationDateSpy = spyOn(
      operationService,
      'businessCreationOperationDate'
    ).and.returnValue(Promise.resolve(operation));

    try {
      await operationService.businessUpdateOperationDate(operation);
    } catch (error) {
      expect(error).toEqual('erreur lors de la suppression de l operation');
    }

    expect(deleteOperationDateSpy).toHaveBeenCalledOnceWith(operation.id);
    expect(businessCreationOperationDateSpy).toHaveBeenCalledTimes(0);
  });
});
