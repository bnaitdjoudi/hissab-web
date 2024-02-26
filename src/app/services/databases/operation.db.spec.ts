import { TestBed, waitForAsync } from '@angular/core/testing';
import { Operation } from '../../model/operation.model';
import { PagingRequest } from '../../model/paging-request.model';
import { DataBaseService } from './database.service';
import { OperationDataBase } from './operation.db';
import { tables } from './tables';

describe('OperationDataBase', () => {
  let operationBd: OperationDataBase;
  let dataBaseService: DataBaseService;

  const performOperations = () => {
    let operation1: Operation = {
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

    let operation2: Operation = {
      id: 4,
      numTrans: 'erwerwre',
      time: new Date(),
      description: '',
      statut: 'r',
      credit: 555,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };
    return [operation1, operation2];
  };

  const performOperationsAccountType = () => {
    let operation1: Operation = {
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
      accountType: 'passif',
    };

    let operation2: Operation = {
      id: 4,
      numTrans: 'erwerwre',
      time: new Date(),
      description: '',
      statut: 'r',
      credit: 555,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
      accountType: 'actif',
    };
    return [operation1, operation2];
  };

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
    accountType: 'actif',
  };

  let operation1: Operation = {
    id: 4,
    numTrans: 'erwerwre',
    time: new Date(),
    description: '',
    statut: 'r',
    credit: 555,
    debit: 0,
    balance: 0,
    idAccount: 0,
    transfer: '',
    accountType: 'actif',
  };

  beforeEach(waitForAsync(() => {
    let sqLiteObject: any = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.resolve('created')),
    };

    let dataBaseServiceSpy: any = {
      sqLiteObject: sqLiteObject,
      openSQLObject: jasmine
        .createSpy('openSQLObject')
        .and.returnValue(Promise.resolve(sqLiteObject)),
    };

    TestBed.configureTestingModule({
      providers: [
        OperationDataBase,
        { provide: DataBaseService, useValue: dataBaseServiceSpy },
      ],
    });

    operationBd = TestBed.inject(OperationDataBase);
    dataBaseService = TestBed.inject(DataBaseService);
  }));

  it('OperationDataBase should create', async () => {
    expect(operationBd).toBeTruthy();
  });

  it('OperationDataBase  create', async () => {
    await operationBd.create(operation);
    expect(dataBaseService.openSQLObject).toHaveBeenCalledTimes(1);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      `INSERT INTO ${tables.transaction.name} (${tables.transaction.columns
        .filter((el) => el.name !== 'ID')
        .map((el) => el.name)}) VALUES ( ?, ?, ?, ? , ?, ?, ?, ?, ?);`,
      ['', operation.time, '', '', 0, 0, 0, 0, '']
    );
  });

  it('OperationDataBase  create sqLiteObject is null', async () => {
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.create(operation);
    } catch (error) {
      expect(error).toEqual('aucun instance de connexion a bd');
    }
  });

  it('OperationDataBase  create sqLiteObject.query reject', async () => {
    operationBd.sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.reject('error')),
    };

    try {
      await operationBd.create(operation);
    } catch (error) {
      expect(error).toEqual('erreur a excecution de la requete insertion');
    }
  });

  it('OperationDataBase  create sqLiteObject.query reject code 6', async () => {
    operationBd.sqLiteObject = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.reject({ code: 6 })),
    };

    try {
      await operationBd.create(operation);
    } catch (error) {
      expect(error).toEqual('erreur a excecution de la requete insertion');
    }
  });

  it('OperationDataBase  update all good', async () => {
    operationBd.findById = jasmine
      .createSpy('query')
      .and.returnValue(Promise.resolve(operation));

    await operationBd.update(operation, operation.id);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE  OPERATION SET NUM_TRANS = ?,TIME = ?,DESCRIPTION = ?,STATUT = ?,CREDIT = ?,DEBIT = ?,BALANCE = ?,ID_ACCOUNT = ?,TRANSFER = ? WHERE ID = ? ',
      ['', operation.time, '', '', 0, 0, 0, 0, '', 0]
    );
  });

  it('OperationDataBase  update query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationBd.update(operation, operation.id);
    } catch (error) {
      expect(error).toEqual('error dans le update doperation');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE  OPERATION SET NUM_TRANS = ?,TIME = ?,DESCRIPTION = ?,STATUT = ?,CREDIT = ?,DEBIT = ?,BALANCE = ?,ID_ACCOUNT = ?,TRANSFER = ? WHERE ID = ? ',
      ['', operation.time, '', '', 0, 0, 0, 0, '', 0]
    );
  });

  it('OperationDataBase  update findById reject', async () => {
    operationBd.findById = jasmine
      .createSpy('findById')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationBd.update(operation, operation.id);
    } catch (error) {
      expect(error).toEqual('error dans le update doperation');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE  OPERATION SET NUM_TRANS = ?,TIME = ?,DESCRIPTION = ?,STATUT = ?,CREDIT = ?,DEBIT = ?,BALANCE = ?,ID_ACCOUNT = ?,TRANSFER = ? WHERE ID = ? ',
      ['', operation.time, '', '', 0, 0, 0, 0, '', 0]
    );
  });

  it('OperationDataBase  update sqLiteObject undefined ', async () => {
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.update(operation, operation.id);
    } catch (error) {
      expect(error).toEqual('error dans le update doperation');
    }
  });

  it('OperationDataBase  findById all good', async () => {
    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 1,
          item: (i: number) => {
            return {
              ID: operation.id,
              NUM_TRANS: operation.numTrans,
              TIME: operation.time.toISOString(),
              BALANCE: operation.balance,
              DESCRIPTION: operation.description,
              STATUT: operation.statut,
              CREDIT: operation.credit,
              DEBIT: operation.debit,
              ID_ACCOUNT: operation.idAccount,
              TYPE: operation.accountType,
              TRANSFER: operation.transfer,
            };
          },
        },
      })
    );

    let operationresult = await operationBd.findById(operation.id);
    expect(operation).toEqual(operationresult);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM OPERATION WHERE ID = 0;',
      []
    );
  });

  it('OperationDataBase  findById query no operation found', async () => {
    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 0,
          item: (i: number) => {
            return {
              ID: operation.id,
              NUM_TRANS: operation.numTrans,
              TIME: operation.time.toISOString(),
              BALANCE: operation.balance,
              DESCRIPTION: operation.description,
              STATUT: operation.statut,
              CREDIT: operation.credit,
              DEBIT: operation.debit,
              ID_ACCOUNT: operation.idAccount,
              TYPE: undefined,
              TRANSFER: operation.transfer,
            };
          },
        },
      })
    );

    try {
      await operationBd.findById(operation.id);
    } catch (error) {
      expect(error).toEqual('erreur pour retrouver une operation');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM OPERATION WHERE ID = 0;',
      []
    );
  });

  it('OperationDataBase  findById query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationBd.findById(operation.id);
    } catch (error) {
      expect(error).toEqual('erreur pour retrouver une operation');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM OPERATION WHERE ID = 0;',
      []
    );
  });

  it('OperationDataBase  findById sqLiteObject null', async () => {
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.findById(operation.id);
    } catch (error) {
      expect(error).toEqual('erreur pour retrouver une operation');
    }
  });

  it('OperationDataBase  findByIdAccount all good', async () => {
    let operation1: Operation = {
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

    let operation2: Operation = {
      id: 4,
      numTrans: 'erwerwre',
      time: new Date(),
      description: '',
      statut: 'r',
      credit: 555,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };

    let operations: Operation[] = [operation1, operation2];

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 2,
          item: (i: number) => {
            return {
              ID: operations[i].id,
              NUM_TRANS: operations[i].numTrans,
              TIME: operations[i].time.toISOString(),
              BALANCE: operations[i].balance,
              DESCRIPTION: operations[i].description,
              STATUT: operations[i].statut,
              CREDIT: operations[i].credit,
              DEBIT: operations[i].debit,
              ID_ACCOUNT: operations[i].idAccount,
              TRANSFER: operations[i].transfer,
            };
          },
        },
      })
    );

    let operationresult = await operationBd.findByIdAccount(0);
    expect(operations).toEqual(operationresult);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT * FROM OPERATION WHERE ID_ACCOUNT = ? ORDER BY TIME DESC;',
      [0]
    );
  });

  it('OperationDataBase  findByIdAccount sqLiteObject undefined ', async () => {
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.findByIdAccount(0);
    } catch (error) {
      expect(error).toEqual('erreur lors trouver des operastions avec idcount');
    }
  });

  it('OperationDataBase  findByIdAccount sqLiteObject.query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject('erreur'));

    try {
      await operationBd.findByIdAccount(0);
    } catch (error) {
      expect(error).toEqual('erreur lors trouver des operastions avec idcount');
    }
  });

  it('OperationDataBase  privateFindByIdAccountAndPaging all good', async () => {
    let operation1: Operation = {
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

    let operation2: Operation = {
      id: 4,
      numTrans: 'erwerwre',
      time: new Date(),
      description: '',
      statut: 'r',
      credit: 555,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };

    let operations: Operation[] = [operation1, operation2];

    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.callFake((query: string, values: any[]) => {
        if (
          query ===
          `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  ${tables.transaction.columns[8].name} = ?`
        ) {
          return Promise.resolve({
            rows: {
              length: 1,
              item: (i: number) => {
                return {
                  VAL: 2,
                };
              },
            },
          });
        }
        return Promise.resolve({
          rows: {
            length: 2,
            item: (i: number) => {
              return {
                ID: operations[i].id,
                NUM_TRANS: operations[i].numTrans,
                TIME: operations[i].time.toISOString(),
                BALANCE: operations[i].balance,
                DESCRIPTION: operations[i].description,
                STATUT: operations[i].statut,
                CREDIT: operations[i].credit,
                DEBIT: operations[i].debit,
                ID_ACCOUNT: operations[i].idAccount,
                TRANSFER: operations[i].transfer,
              };
            },
          },
        });
      });

    let pagingRequest: PagingRequest = {
      page: 0,
      limit: 0,
    };

    let operationresult = await operationBd.findByIdAccountAndPaging(
      pagingRequest,
      0
    );
    expect(operations).toEqual(operationresult.data);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT COUNT (*) AS VAL FROM OPERATION  WHERE  ID_ACCOUNT = ?',
      [0]
    );
  });

  it('OperationDataBase  privateFindByIdAccountAndPaging select count reject ', async () => {
    let operation1: Operation = {
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

    let operation2: Operation = {
      id: 4,
      numTrans: 'erwerwre',
      time: new Date(),
      description: '',
      statut: 'r',
      credit: 555,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };

    let operations: Operation[] = [operation1, operation2];

    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.callFake((query: string, values: any[]) => {
        if (
          query ===
          `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  ${tables.transaction.columns[8].name} = ?`
        ) {
          return Promise.reject('error');
        }
        return Promise.resolve({
          rows: {
            length: 2,
            item: (i: number) => {
              return {
                ID: operations[i].id,
                NUM_TRANS: operations[i].numTrans,
                TIME: operations[i].time.toISOString(),
                BALANCE: operations[i].balance,
                DESCRIPTION: operations[i].description,
                STATUT: operations[i].statut,
                CREDIT: operations[i].credit,
                DEBIT: operations[i].debit,
                ID_ACCOUNT: operations[i].idAccount,
                TRANSFER: operations[i].transfer,
              };
            },
          },
        });
      });

    let pagingRequest: PagingRequest = {
      page: 0,
      limit: 0,
    };

    try {
      await operationBd.findByIdAccountAndPaging(pagingRequest, 0);
    } catch (error) {
      expect(error).toEqual('erreur lors de la recuperation des données');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT COUNT (*) AS VAL FROM OPERATION  WHERE  ID_ACCOUNT = ?',
      [0]
    );
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledTimes(1);
  });

  it('OperationDataBase  findByIdAccountAndPaging select list reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.callFake((query: string, values: any[]) => {
        if (
          query ===
          `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  ${tables.transaction.columns[8].name} = ?`
        ) {
          return Promise.resolve({
            rows: {
              length: 1,
              item: (i: number) => {
                return {
                  VAL: 2,
                };
              },
            },
          });
        }
        return Promise.reject('error');
      });

    let pagingRequest: PagingRequest = {
      page: 0,
      limit: 0,
    };

    try {
      await operationBd.findByIdAccountAndPaging(pagingRequest, 0);
    } catch (error) {
      expect(error).toEqual('erreur lors de la recuperation des données');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT COUNT (*) AS VAL FROM OPERATION  WHERE  ID_ACCOUNT = ?',
      [0]
    );

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  *  FROM OPERATION  WHERE ID_ACCOUNT = ? ORDER BY TIME DESC LIMIT ?  OFFSET ?;',
      [0, 0, -0]
    );
  });

  it('OperationDataBase  findByIdAccountAndPaging sqLiteObject.query', async () => {
    operationBd.sqLiteObject = undefined;

    let pagingRequest: PagingRequest = {
      page: 0,
      limit: 0,
    };

    try {
      await operationBd.findByIdAccountAndPaging(pagingRequest, 0);
    } catch (error) {
      expect(error).toEqual('erreur lors de la recuperation des données');
    }
  });

  it('OperationDataBase  findAll not implemented', async () => {
    let expectedError: Error = new Error('Method not implemented.');
    try {
      await operationBd.findAll();
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });

  it('OperationDataBase  adjusteAfterOperation all good', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.resolve());

    await operationBd.adjusteAfterOperation(0, 4, 522);

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledOnceWith(
      'UPDATE  OPERATION SET BALANCE = BALANCE + ? WHERE id > ? and ID_ACCOUNT = ?',
      [522, 0, 4]
    );
  });

  it('OperationDataBase  adjusteAfterOperation sqLiteObject.query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject());
    try {
      await operationBd.adjusteAfterOperation(0, 4, 522);
    } catch (error) {
      expect(error).toEqual('erreur lors de lajustement');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledOnceWith(
      'UPDATE  OPERATION SET BALANCE = BALANCE + ? WHERE id > ? and ID_ACCOUNT = ?',
      [522, 0, 4]
    );
  });

  it('OperationDataBase  adjusteAfterOperation sqLiteObject undefined', async () => {
    operationBd.sqLiteObject = undefined;
    try {
      await operationBd.adjusteAfterOperation(0, 4, 522);
    } catch (error) {
      expect(error).toEqual('aucun instance de connexion a bd');
    }
  });

  it('OperationDataBase deleteById', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.resolve());

    await operationBd.deleteById([0]);

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'DELETE FROM OPERATION WHERE  ID IN (0)'
    );
  });

  it('OperationDataBase deleteById query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(
        Promise.reject({ rows: { length: 0 }, rowsAffected: 0 })
      );

    try {
      await operationBd.deleteById([0]);
    } catch (error) {
      expect(error).toEqual('erreur lors de la suppression');
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'DELETE FROM OPERATION WHERE  ID IN (0)'
    );
  });

  it('OperationDataBase deleteById sqLiteObject undefined', async () => {
    operationBd.sqLiteObject = undefined;
    try {
      await operationBd.deleteById([0]);
    } catch (error) {
      expect(error).toEqual('aucun instance de connexion a bd');
    }
  });

  it('OperationDataBase createList all good', async () => {
    let operations: Operation[] = performOperations();

    await operationBd.createList(operations, true);
    /* expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      `INSERT INTO OPERATION (ID,NUM_TRANS,TIME,DESCRIPTION,STATUT,CREDIT,DEBIT,BALANCE,ID_ACCOUNT,TRANSFER) 
        VALUES ( 0, '', 'Tue Mar 21 2023 23:10:38 GMT-0400 (Eastern Daylight Time)', '', '' ,0, 0, 0, 0, ''),( 4, 'erwerwre', 'Tue Mar 21 2023 23:10:38 GMT-0400 (Eastern Daylight Time)', '', 'r' ,555, 0, 0, 0, '');`,
      []
    );*/
  });

  it('OperationDataBase createList sqLiteObject undefined', async () => {
    operationBd.sqLiteObject = undefined;

    let operations: Operation[] = performOperations();

    try {
      await operationBd.createList(operations, true);
    } catch (error) {
      expect(error).toEqual('aucun instance de connexion a bd');
    }
  });

  it('OperationDataBase createList sqLiteObject.query reject code 6', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject({ code: 6 }));

    let operations: Operation[] = performOperations();

    try {
      await operationBd.createList(operations, true);
    } catch (error) {
      expect(error).toEqual("error dans l'excecusion de la requete");
    }
  });

  it('OperationDataBase createList sqLiteObject.query reject other 6', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject({}));

    let operations: Operation[] = performOperations();

    try {
      await operationBd.createList(operations, true);
    } catch (error) {
      expect(error).toEqual("error dans l'excecusion de la requete");
    }
  });

  it('OperationDataBase selectOperationByNumTrans all good', async () => {
    let operations: Operation[] = performOperations();

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 2,
          item: (i: number) => {
            return {
              ID: operations[i].id,
              NUM_TRANS: operations[i].numTrans,
              TIME: operations[i].time.toISOString(),
              BALANCE: operations[i].balance,
              DESCRIPTION: operations[i].description,
              STATUT: operations[i].statut,
              CREDIT: operations[i].credit,
              DEBIT: operations[i].debit,
              ID_ACCOUNT: operations[i].idAccount,
              TRANSFER: operations[i].transfer,
            };
          },
        },
      })
    );

    let result = await operationBd.selectOperationByNumTrans('num');
    expect(result).toEqual(operations);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  *  FROM OPERATION  WHERE NUM_TRANS = ?',
      ['num']
    );
  });

  it('OperationDataBase selectOperationByNumTrans query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.resolve(Promise.reject()));
    try {
      await operationBd.selectOperationByNumTrans('num');
    } catch (error) {
      expect(error).toEqual("error dans l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  *  FROM OPERATION  WHERE NUM_TRANS = ?',
      ['num']
    );
  });

  it('OperationDataBase selectOperationByNumTrans sqLiteObject null', async () => {
    operationBd.sqLiteObject = undefined;
    try {
      await operationBd.selectOperationByNumTrans('num');
    } catch (error) {
      expect(error).toEqual("error dans l'excecusion de la requette");
    }
  });

  it('OperationDataBase selectOperationJoinAccountByNumTrans all godd', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 2,
          item: (i: number) => {
            return {
              ID: operations[i].id,
              NUM_TRANS: operations[i].numTrans,
              TIME: operations[i].time.toISOString(),
              BALANCE: operations[i].balance,
              DESCRIPTION: operations[i].description,
              STATUT: operations[i].statut,
              CREDIT: operations[i].credit,
              DEBIT: operations[i].debit,
              ID_ACCOUNT: operations[i].idAccount,
              TYPE: operations[i].accountType,
              TRANSFER: operations[i].transfer,
            };
          },
        },
      })
    );

    let result = await operationBd.selectOperationJoinAccountByNumTrans('num');
    expect(result).toEqual(operations);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.NUM_TRANS = ?;',
      ['num']
    );
  });

  it('OperationDataBase selectOperationJoinAccountByNumTrans query reject', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationBd.selectOperationJoinAccountByNumTrans('num');
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.NUM_TRANS = ?;',
      ['num']
    );
  });

  it('OperationDataBase selectOperationJoinAccountByNumTrans sqLiteObject undefined', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.selectOperationJoinAccountByNumTrans('num');
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }
  });

  it('OperationDataBase selectOperationJoinAccountById all godd', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 2,
          item: (i: number) => {
            return {
              ID: operations[i].id,
              NUM_TRANS: operations[i].numTrans,
              TIME: operations[i].time.toISOString(),
              BALANCE: operations[i].balance,
              DESCRIPTION: operations[i].description,
              STATUT: operations[i].statut,
              CREDIT: operations[i].credit,
              DEBIT: operations[i].debit,
              ID_ACCOUNT: operations[i].idAccount,
              TYPE: operations[i].accountType,
              TRANSFER: operations[i].transfer,
            };
          },
        },
      })
    );

    let result = await operationBd.selectOperationJoinAccountById(0);
    expect(result).toEqual(operations[0]);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.ID = ?;',
      [0]
    );
  });

  it('OperationDataBase selectOperationJoinAccountById no row found', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 0,
        },
      })
    );

    let result = await operationBd.selectOperationJoinAccountById(0);
    expect(result.id).toBeFalsy();
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.ID = ?;',
      [0]
    );
  });

  it('OperationDataBase selectOperationJoinAccountById query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject('error'));

    try {
      await operationBd.selectOperationJoinAccountById(0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.ID = ?;',
      [0]
    );
  });

  it('OperationDataBase selectOperationJoinAccountById sqLiteObject undefined', async () => {
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.selectOperationJoinAccountById(0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }
  });

  it('OperationDataBase findOperationTransferTo all godd', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 2,
          item: (i: number) => {
            return {
              ID: operations[i].id,
              NUM_TRANS: operations[i].numTrans,
              TIME: operations[i].time.toISOString(),
              BALANCE: operations[i].balance,
              DESCRIPTION: operations[i].description,
              STATUT: operations[i].statut,
              CREDIT: operations[i].credit,
              DEBIT: operations[i].debit,
              ID_ACCOUNT: operations[i].idAccount,
              TYPE: operations[i].accountType,
              TRANSFER: operations[i].transfer,
            };
          },
        },
      })
    );

    let result = await operationBd.findOperationTransferTo('num', 0);
    expect(result).toEqual(operations[0]);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.NUM_TRANS = ? and op.ID_ACCOUNT <> ?',
      ['num', 0]
    );
  });

  it('OperationDataBase findOperationTransferTo not found', async () => {
    let operations: Operation[] = performOperationsAccountType();

    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 0,
        },
      })
    );

    try {
      await operationBd.findOperationTransferTo('num', 0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.NUM_TRANS = ? and op.ID_ACCOUNT <> ?',
      ['num', 0]
    );
  });

  it('OperationDataBase findOperationTransferTo query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject());

    try {
      await operationBd.findOperationTransferTo('num', 0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT  op.*, acc.type  FROM OPERATION op left join ACCOUNT acc on op.id_account = acc.id WHERE op.NUM_TRANS = ? and op.ID_ACCOUNT <> ?',
      ['num', 0]
    );
  });

  it('OperationDataBase findOperationTransferTo sqLiteObject null reject', async () => {
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.findOperationTransferTo('num', 0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }
  });

  it('OperationDataBase findOperationTransferTo all good', async () => {
    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 1,
          item: (i: number) => {
            return { BALANCE: 8000 };
          },
        },
      })
    );

    let givenDate = new Date();
    let result = await operationBd.getBalanceBeforeDate(givenDate, 0);

    expect(8000).toEqual(result);

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT BALANCE FROM OPERATION WHERE TIME < ? AND  ID_ACCOUNT  = ? ORDER BY TIME DESC LIMIT 2',
      [givenDate, 0]
    );
  });

  it('OperationDataBase getBalanceBeforeDate all good ', async () => {
    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 1,
          item: (i: number) => {
            return { BALANCE: 8000 };
          },
        },
      })
    );

    let givenDate = new Date();
    let result = await operationBd.getBalanceBeforeDate(givenDate, 0);

    expect(8000).toEqual(result);

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT BALANCE FROM OPERATION WHERE TIME < ? AND  ID_ACCOUNT  = ? ORDER BY TIME DESC LIMIT 2',
      [givenDate, 0]
    );
  });

  it('OperationDataBase getBalanceBeforeDate no result ', async () => {
    operationBd.sqLiteObject.query = jasmine.createSpy('query').and.returnValue(
      Promise.resolve({
        rows: {
          length: 0,
          item: (i: number) => {
            return { BALANCE: 8000 };
          },
        },
      })
    );

    let givenDate = new Date();
    let result = await operationBd.getBalanceBeforeDate(givenDate, 0);

    expect(0).toEqual(result);

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT BALANCE FROM OPERATION WHERE TIME < ? AND  ID_ACCOUNT  = ? ORDER BY TIME DESC LIMIT 2',
      [givenDate, 0]
    );
  });

  it('OperationDataBase getBalanceBeforeDate  query reject', async () => {
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject('error'));

    let givenDate = new Date();
    try {
      await operationBd.getBalanceBeforeDate(givenDate, 0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'SELECT BALANCE FROM OPERATION WHERE TIME < ? AND  ID_ACCOUNT  = ? ORDER BY TIME DESC LIMIT 2',
      [givenDate, 0]
    );
  });

  it('OperationDataBase getBalanceBeforeDate sqLiteObject undefined  ', async () => {
    operationBd.sqLiteObject = undefined;

    let givenDate = new Date();
    try {
      await operationBd.getBalanceBeforeDate(givenDate, 0);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }
  });

  it('OperationDataBase adjusteAfterOperationByDate all good', async () => {
    let givenDate = new Date();

    await operationBd.adjusteAfterOperationByDate(givenDate, 0, 8000);
    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE  OPERATION SET BALANCE = BALANCE + ? WHERE TIME > ? and ID_ACCOUNT = ?',
      [8000, givenDate, 0]
    );
  });

  it('OperationDataBase adjusteAfterOperationByDate query reject ', async () => {
    let givenDate = new Date();
    operationBd.sqLiteObject.query = jasmine
      .createSpy('query')
      .and.returnValue(Promise.reject());

    try {
      await operationBd.adjusteAfterOperationByDate(givenDate, 0, 8000);
    } catch (error) {
      expect(error).toEqual("erreur lors de l'excecusion de la requette");
    }

    expect(operationBd.sqLiteObject.query).toHaveBeenCalledWith(
      'UPDATE  OPERATION SET BALANCE = BALANCE + ? WHERE TIME > ? and ID_ACCOUNT = ?',
      [8000, givenDate, 0]
    );
  });

  it('OperationDataBase adjusteAfterOperationByDate sqLiteObject undefined ', async () => {
    let givenDate = new Date();
    operationBd.sqLiteObject = undefined;

    try {
      await operationBd.adjusteAfterOperationByDate(givenDate, 0, 8000);
    } catch (error) {
      expect(error).toEqual('aucun instance de connexion a bd');
    }
  });
});
