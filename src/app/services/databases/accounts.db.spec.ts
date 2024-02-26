import { TestBed } from '@angular/core/testing';
import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { PagingRequest } from '../../model/paging-request.model';
import { AccountDataBase } from './account.db';
import { DataBaseService } from './database.service';

describe('AccountDataBase', () => {
  let accountDb: AccountDataBase;
  let dataBase: DataBaseService;

  beforeEach(() => {
    let sqLiteObjectSpy: any = {
      query: jasmine.createSpy('query').and.returnValue(Promise.resolve()),
    };

    let dataBaseSpy: any = {
      sqLiteObject: sqLiteObjectSpy,
      openSQLObject: jasmine
        .createSpy('openSQLObject')
        .and.returnValue(Promise.resolve(sqLiteObjectSpy)),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountDataBase,
        { provide: DataBaseService, useValue: dataBaseSpy },
      ],
    });

    accountDb = TestBed.inject(AccountDataBase);
    dataBase = TestBed.inject(DataBaseService);
  });

  it('should create', async () => {
    expect(accountDb).toBeTruthy();
  });

  it('AccountDataBase update all good', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    spyOn(accountDb, 'findById').and.returnValue(Promise.resolve(account));

    let result = await accountDb.update(account, 0);

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE ACCOUNT SET ACCOUNT_NAME = ?,BALANCE = ?,IS_MAIN = ?,TYPE = ?,PARENT_ID = ?,PATH = ?,IS_LEAF = ? WHERE id = ?;',
      ['', 0, 0, '', 0, '', 0, 0]
    );
    expect(account).toEqual(result);
  });

  it('AccountDataBase update findById reject ', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    spyOn(accountDb, 'findById').and.returnValue(Promise.reject('error'));

    try {
      await accountDb.update(account, 0);
    } catch (error) {
      expect(error).toEqual("erreur l'ors de l'execussion d ela requette");
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE ACCOUNT SET ACCOUNT_NAME = ?,BALANCE = ?,IS_MAIN = ?,TYPE = ?,PARENT_ID = ?,PATH = ?,IS_LEAF = ? WHERE id = ?;',
      ['', 0, 0, '', 0, '', 0, 0]
    );
  });

  it('AccountDataBase update findById query reject', async () => {
    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.reject('error')),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    spyOn(accountDb, 'findById').and.returnValue(Promise.resolve(account));

    try {
      await accountDb.update(account, 0);
    } catch (error) {
      expect(error).toEqual("erreur l'ors de l'execussion d ela requette");
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE ACCOUNT SET ACCOUNT_NAME = ?,BALANCE = ?,IS_MAIN = ?,TYPE = ?,PARENT_ID = ?,PATH = ?,IS_LEAF = ? WHERE id = ?;',
      ['', 0, 0, '', 0, '', 0, 0]
    );

    expect(accountDb.findById).toHaveBeenCalledTimes(0);
  });

  it('AccountDataBase  findByAll all good', async () => {
    let account1: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let account2: Account = {
      id: 7,
      acountName: 'acc',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account1, account2];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 2,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.findAll();

    expect(accounts).toEqual(result);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT;'
    );
  });

  it('AccountDataBase  findByAll query reject', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject()),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.findAll();
    } catch (error) {}

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT;'
    );
  });

  it('AccountDataBase  findById all good', async () => {
    let account1: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account1];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 1,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.findById(0);

    expect(accounts[0]).toEqual(result);
    expect(sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE ID = 0;',
      []
    );
  });

  it('AccountDataBase  findById not found', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 0,
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.findById(0);
    } catch (error) {
      expect(error).toEqual('NOT FOUND');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE ID = 0;',
      []
    );
  });

  it('AccountDataBase  findById query reject', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject()),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.findById(0);
    } catch (error) {
      expect(error).toEqual('erreur lors de la requette');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE ID = 0;',
      []
    );
  });

  it('AccountDataBase  findByName all good', async () => {
    let account1: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account1];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 1,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.findByName('name');

    expect(accounts[0]).toEqual(result);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE ACCOUNT_NAME = ?;',
      ['name']
    );
  });

  it('AccountDataBase  findByName not found', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 0,
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.findByName('name');
    } catch (error) {
      expect(error).toEqual('NOT FOUND');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE ACCOUNT_NAME = ?;',
      ['name']
    );
  });

  it('AccountDataBase  findByName query reject', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject()),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.findByName('name');
    } catch (error) {
      expect(error).toEqual('erreur lors de la requette');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE ACCOUNT_NAME = ?;',
      ['name']
    );
  });

  it('AccountDataBase  create all good', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 1,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.create(account);

    expect('succes!').toEqual(result);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'INSERT INTO ACCOUNT (\n            ACCOUNT_NAME,\n            BALANCE, \n            IS_MAIN,\n            TYPE, \n            PARENT_ID,\n            PATH,\n            IS_LEAF) VALUES ( ?, ?, ?,?, ?, ?, ? );',
      ['', 0, 0, '', 0, '', 0]
    );
  });

  it('AccountDataBase  create already exist', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.reject({ code: 6 })),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.create(account);
    } catch (error) {
      expect(error).toEqual('account already exist');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'INSERT INTO ACCOUNT (\n            ACCOUNT_NAME,\n            BALANCE, \n            IS_MAIN,\n            TYPE, \n            PARENT_ID,\n            PATH,\n            IS_LEAF) VALUES ( ?, ?, ?,?, ?, ?, ? );',
      ['', 0, 0, '', 0, '', 0]
    );
  });

  it('AccountDataBase  create query reject ', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject('')),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.create(account);
    } catch (error) {
      expect(error).toEqual('error on creating account:');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'INSERT INTO ACCOUNT (\n            ACCOUNT_NAME,\n            BALANCE, \n            IS_MAIN,\n            TYPE, \n            PARENT_ID,\n            PATH,\n            IS_LEAF) VALUES ( ?, ?, ?,?, ?, ?, ? );',
      ['', 0, 0, '', 0, '', 0]
    );
  });

  it('AccountDataBase  getAccountsByType all good', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 1,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.getAccountsByType('actif');

    expect(result).toEqual(accounts);

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE TYPE = ?;',
      ['actif']
    );
  });

  it('AccountDataBase  getAccountsByType return nothing', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 0,
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.getAccountsByType('actif');

    expect(result).toEqual([]);

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE TYPE = ?;',
      ['actif']
    );
  });

  it('AccountDataBase  getAccountsByType query reject', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject('')),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.getAccountsByType('actif');
    } catch (error) {
      expect(error).toEqual('error on runnin query account');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE TYPE = ?;',
      ['actif']
    );
  });

  it('AccountDataBase  getMainAccounts all good', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 1,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.getMainAccounts();

    expect(result).toEqual(accounts);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE IS_MAIN = ?;',
      [1]
    );
  });

  it('AccountDataBase  getMainAccounts return empty', async () => {
    let account: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: {
            length: 0,
            item: (i: number) => {
              return {
                ID: accounts[i].id,
                ACCOUNT_NAME: accounts[i].acountName,
                BALANCE: accounts[i].totalAccount,
                IS_MAIN: accounts[i].isMain ? 1 : 0,
                TYPE: accounts[i].type,
                PARENT_ID: accounts[i].parentId,
                PATH: accounts[i].path,
                IS_LEAF: accounts[i].isLeaf ? 1 : 0,
              };
            },
          },
        })
      ),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.getMainAccounts();

    expect(result).toEqual([]);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE IS_MAIN = ?;',
      [1]
    );
  });

  it('AccountDataBase  getMainAccounts query reject', async () => {
    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.reject('error')),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));
    try {
      await accountDb.getMainAccounts();
    } catch (error) {
      expect(error).toEqual('error on running query account');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE IS_MAIN = ?;',
      [1]
    );
  });

  it('AccountDataBase findByIdAccountAndPaging all good', async () => {
    let account1: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let account2: Account = {
      id: 7,
      acountName: '',
      totalAccount: 0,
      isMain: true,
      type: 'actif',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account1, account2];

    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          if (query.includes('SELECT COUNT')) {
            return Promise.resolve({
              rows: {
                length: 1,
                item: (i: number) => {
                  return { VAL: 2 };
                },
              },
            });
          }

          return Promise.resolve({
            rows: {
              length: 2,
              item: (i: number) => {
                return {
                  ID: accounts[i].id,
                  ACCOUNT_NAME: accounts[i].acountName,
                  BALANCE: accounts[i].totalAccount,
                  IS_MAIN: accounts[i].isMain ? 1 : 0,
                  TYPE: accounts[i].type,
                  PARENT_ID: accounts[i].parentId,
                  PATH: accounts[i].path,
                  IS_LEAF: accounts[i].isLeaf ? 1 : 0,
                };
              },
            },
          });
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let pagingRequest: PagingRequest = {
      page: 2,
      limit: 10,
    };

    let result = await accountDb.findByIdAccountAndPaging(pagingRequest, 0);

    expect(result.data).toEqual(accounts);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT COUNT (*) AS VAL FROM ACCOUNT  WHERE  PARENT_ID = ?',
      [0]
    );

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  *  FROM ACCOUNT  WHERE PARENT_ID = ? ORDER BY ID DESC LIMIT ?  OFFSET ?;',
      [0, 10, 10]
    );
  });

  it('AccountDataBase findByIdAccountAndPaging get count reject', async () => {
    let account1: Account = {
      id: 0,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let account2: Account = {
      id: 7,
      acountName: '',
      totalAccount: 0,
      isMain: true,
      type: 'actif',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    let accounts = [account1, account2];

    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          if (query.includes('SELECT COUNT')) {
            return Promise.reject('erreur val count!');
          }

          return Promise.resolve({
            rows: {
              length: 2,
              item: (i: number) => {
                return {
                  ID: accounts[i].id,
                  ACCOUNT_NAME: accounts[i].acountName,
                  BALANCE: accounts[i].totalAccount,
                  IS_MAIN: accounts[i].isMain ? 1 : 0,
                  TYPE: accounts[i].type,
                  PARENT_ID: accounts[i].parentId,
                  PATH: accounts[i].path,
                  IS_LEAF: accounts[i].isLeaf ? 1 : 0,
                };
              },
            },
          });
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let pagingRequest: PagingRequest = {
      page: 2,
      limit: 10,
    };

    try {
      await accountDb.findByIdAccountAndPaging(pagingRequest, 0);
    } catch (error) {
      expect(error).toEqual('erreur durant la construction des données');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT COUNT (*) AS VAL FROM ACCOUNT  WHERE  PARENT_ID = ?',
      [0]
    );
  });

  it('AccountDataBase findByIdAccountAndPaging get data reject', async () => {
    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          if (query.includes('SELECT COUNT')) {
            return Promise.resolve({
              rows: {
                length: 1,
                item: (i: number) => {
                  return { VAL: 2 };
                },
              },
            });
          }

          return Promise.reject('error dans lappel des données');
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let pagingRequest: PagingRequest = {
      page: 2,
      limit: 10,
    };

    try {
      await accountDb.findByIdAccountAndPaging(pagingRequest, 0);
    } catch (error) {
      expect(error).toEqual('erreur durant la construction des données');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT COUNT (*) AS VAL FROM ACCOUNT  WHERE  PARENT_ID = ?',
      [0]
    );

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  *  FROM ACCOUNT  WHERE PARENT_ID = ? ORDER BY ID DESC LIMIT ?  OFFSET ?;',
      [0, 10, 10]
    );
  });

  it('AccountDataBase ajusteDiffByPath all good', async () => {
    let paths: string[] = ['1/2/3', '1/2', '1'];

    await accountDb.ajusteDiffByPath(paths, 880);

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      "UPDATE ACCOUNT SET BALANCE = BALANCE + ? WHERE PATH IN ('1/2/3','1/2','1')",
      [880]
    );
  });

  it('AccountDataBase ajusteDiffByPath query reject', async () => {
    let paths: string[] = ['1/2/3', '1/2', '1'];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject()),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.ajusteDiffByPath(paths, 880);
    } catch (error) {
      expect(error).toEqual('error on running query');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      "UPDATE ACCOUNT SET BALANCE = BALANCE + ? WHERE PATH IN ('1/2/3','1/2','1')",
      [880]
    );
  });

  it('AccountDataBase findAllLeafExeptType all good', async () => {
    let leafAccount1: LeafAccount = {
      id: 4,
      acountName: 'count1',
      path: 'path1',
      isLeaf: true,
    };

    let leafAccount2: LeafAccount = {
      id: 6,
      acountName: 'count2',
      path: 'path2',
      isLeaf: true,
    };

    let leafs = [leafAccount1, leafAccount2];

    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          if (query.includes('SELECT COUNT')) {
            return Promise.reject('erreur val count!');
          }

          return Promise.resolve({
            rows: {
              length: 2,
              item: (i: number) => {
                return {
                  ID: leafs[i].id,
                  ACCOUNT_NAME: leafs[i].acountName,
                  PATH: leafs[i].path,
                  IS_LEAF: 1,
                };
              },
            },
          });
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.findAllLeafExeptType(['actif']);
    expect(result).toEqual(leafs);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      "SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND TYPE NOT IN ('actif');",
      []
    );
  });

  it('AccountDataBase findAllLeafExeptType query reject', async () => {
    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject()),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.findAllLeafExeptType(['actif']);
    } catch (error) {
      expect(error).toEqual('error on running query');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      "SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND TYPE NOT IN ('actif');",
      []
    );
  });

  it('AccountDataBase findAllLeafExeptOneByIds all good', async () => {
    let leafAccount1: LeafAccount = {
      id: 4,
      acountName: 'count1',
      path: 'path1',
      isLeaf: true,
    };

    let leafAccount2: LeafAccount = {
      id: 6,
      acountName: 'count2',
      path: 'path2',
      isLeaf: true,
    };

    let leafs = [leafAccount1, leafAccount2];

    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          if (query.includes('SELECT COUNT')) {
            return Promise.reject('erreur val count!');
          }

          return Promise.resolve({
            rows: {
              length: 2,
              item: (i: number) => {
                return {
                  ID: leafs[i].id,
                  ACCOUNT_NAME: leafs[i].acountName,
                  PATH: leafs[i].path,
                  IS_LEAF: 1,
                };
              },
            },
          });
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.findAllLeafExeptOneByIds([4]);
    expect(result).toEqual(leafs);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      "SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND ID NOT IN ('4');",
      []
    );
  });

  it('AccountDataBase findAllLeafExeptOneByIds query reject', async () => {
    let leafAccount1: LeafAccount = {
      id: 4,
      acountName: 'count1',
      path: 'path1',
      isLeaf: true,
    };

    let leafAccount2: LeafAccount = {
      id: 6,
      acountName: 'count2',
      path: 'path2',
      isLeaf: true,
    };

    let leafs = [leafAccount1, leafAccount2];

    let sqLiteObject = {
      query: jasmine.createSpy('query').and.returnValue(Promise.reject()),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));
    try {
      await accountDb.findAllLeafExeptOneByIds([3]);
    } catch (error) {
      expect(error).toEqual('error on running query');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      "SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND ID NOT IN ('3');",
      []
    );
  });

  it('AccountDataBase finByPath all good', async () => {
    let account: Account = {
      id: 8,
      acountName: '',
      totalAccount: 0,
      isMain: false,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: false,
      resume: { debit: 0, credit: 0, sons: 0 },
    };
    let accounts = [account];

    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          return Promise.resolve({
            rows: {
              length: 1,
              item: (i: number) => {
                return {
                  ID: accounts[i].id,
                  ACCOUNT_NAME: accounts[i].acountName,
                  BALANCE: accounts[i].totalAccount,
                  IS_MAIN: accounts[i].isMain ? 1 : 0,
                  TYPE: accounts[i].type,
                  PARENT_ID: accounts[i].parentId,
                  PATH: accounts[i].path,
                  IS_LEAF: accounts[i].isLeaf ? 1 : 0,
                };
              },
            },
          });
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    let result = await accountDb.finByPath('path');
    expect(result).toEqual(account);
    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE PATH LIKE ?',
      ['path']
    );
  });

  it('AccountDataBase finByPath return empty', async () => {
    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          return Promise.resolve({
            rows: {
              length: 0,
            },
          });
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.finByPath('path');
    } catch (error) {
      expect(error).toEqual('error on running query');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE PATH LIKE ?',
      ['path']
    );
  });

  it('AccountDataBase finByPath query reject', async () => {
    let sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.callFake((query: string, args: any[]) => {
          return Promise.reject('reject!');
        }),
    };

    dataBase.openSQLObject = jasmine
      .createSpy('openSQLObject')
      .and.returnValue(Promise.resolve(sqLiteObject));

    try {
      await accountDb.finByPath('path');
    } catch (error) {
      expect(error).toEqual('error on running query');
    }

    expect(accountDb.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM ACCOUNT WHERE PATH LIKE ?',
      ['path']
    );
  });
});
