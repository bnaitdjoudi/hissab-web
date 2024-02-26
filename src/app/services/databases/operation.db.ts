import { Injectable } from '@angular/core';
import { parseISO, format } from 'date-fns';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { printError } from '../../tools/errorTools';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { GenericDb } from './GenericDb';
import { tables } from './tables';
import { OperationSearchData } from 'src/app/model/operation-page.store.model';
import { AccountBalance } from 'src/app/model/rapport-store.model';

@Injectable({
  providedIn: 'root',
})
export class OperationDataBase
  extends GenericDb
  implements GenericDataBase<Operation, number>
{
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
  }

  async create(model: Operation): Promise<number> {
    await this.checkDataBaseOpened();
    return new Promise<any>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateCreate(model)
          .then((res) => {
            resolve(res);
          })
          .catch((err) =>
            printError(
              'erreur a excecution de la requete insertion',
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }
  private async privateCreate(model: Operation): Promise<number> {
    return new Promise<any>((resolve, reject) =>
      this.sqLiteObject
        .query(
          `INSERT INTO ${tables.transaction.name} (${tables.transaction.columns
            .filter((el) => el.name !== 'ID')
            .map(
              (el) => el.name
            )}) VALUES ( ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?); `,
          [
            model.numTrans,
            format(model.time, 'yyyy-MM-dd HH:mm:ss'),
            model.description,
            model.statut,
            model.credit,
            model.debit,
            model.balance,
            model.idAccount,
            model.transfer,
            model.profile,
            model.attachment,
          ]
        )
        .then(async () => {
          try {
            let res = await this.sqLiteObject.query(
              `SELECT max(id) as seq from operation where transfer = ?;`,
              [model.transfer]
            );

            if (res.values.length > 0) {
              resolve(res.values[0].seq);
            } else {
              resolve(0);
            }
          } catch (error) {
            console.log(JSON.stringify(error));
            resolve(0);
          }
        })
        .catch((e: any) => {
          if (e.code === 6) {
            reject('operation already exist');
          }

          reject(e);
        })
    );
  }
  async update(operation: Operation, id: number): Promise<Operation> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateUpdate(operation, id)
          .then((res) => resolve(operation))
          .catch((err) =>
            printError('error dans le update doperation', reject, err)
          );
      } else {
        printError(
          'aucun instance de connexion a bd',
          reject,
          'aucun instance de connexion a bd'
        );
      }
    });
  }
  private async privateUpdate(
    operation: Operation,
    id: number
  ): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `UPDATE  ${tables.transaction.name} SET ${tables.transaction.columns
            .filter((el) => el.name !== 'ID')
            .map((el) => el.name + ' = ?')} WHERE ID = ? `,
          [
            operation.numTrans,
            format(operation.time, 'yyyy-MM-dd HH:mm:ss'),
            operation.description,
            operation.statut,
            operation.credit,
            operation.debit,
            operation.balance,
            operation.idAccount,
            operation.transfer,
            operation.profile,
            operation.attachment,
            id,
          ]
        )
        .then(() =>
          this.findById(id)
            .then((op) => resolve(op))
            .catch((err) =>
              printError('fail to get updated operation', reject, err)
            )
        )
        .catch((err: any) =>
          printError('fail to update operation', reject, err)
        );
    });
  }

  async findById(id: number): Promise<Operation> {
    await this.checkDataBaseOpened();
    return new Promise<Operation>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindById(id)
          .then((operation) => resolve(operation))
          .catch((err) =>
            printError('erreur pour retrouver une operation', reject, err)
          );
      } else {
        printError(
          'aucun instance de connexion a bd',
          reject,
          'aucun instance de connexion a bd'
        );
      }
    });
  }

  private async privateFindById(id: number): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT * FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[0].name} = ${id};`,
          []
        )
        .then((data: any) => {
          if (data.values.length >= 1) {
            resolve(this.performOperationsRowIndex(data, 0));
          } else {
            reject('no operation found');
          }
        })
        .catch((err: any) =>
          printError('error en excecutant la requete', reject, err)
        );
    });
  }

  async findByIdAccount(id: number): Promise<Operation[]> {
    await this.checkDataBaseOpened();
    return new Promise<Operation[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindByIdAccount(id)
          .then((ops) => resolve(ops))
          .catch((err) =>
            printError(
              'erreur lors trouver des operastions avec idcount',
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private async privateFindByIdAccount(id: number): Promise<Operation[]> {
    return new Promise<Operation[]>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT * FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[8].name} = ? ORDER BY ${tables.transaction.columns[2].name} DESC;`,
          [id]
        )
        .then((data: any) => {
          resolve(this.constructOperationArray(data));
        })
        .catch((err: any) =>
          printError('erreur a lexcecution de la requette ', reject, err)
        );
    });
  }

  async findByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Operation>> {
    await this.checkDataBaseOpened();
    return new Promise<PagingData<Operation>>((resolve, rejects) => {
      if (this.sqLiteObject) {
        this.privateFindByIdAccountAndPaging(paging, id)
          .then((data) => resolve(data))
          .catch((err) =>
            printError(
              'erreur lors de la recuperation des données',
              rejects,
              err
            )
          );
      } else {
        rejects('aucun instance de connexion a bd');
      }
    });
  }

  async findByIdAccountAndPagingBetweenDate(
    paging: PagingRequest,
    id: number,
    startDate: string,
    endDate: string
  ): Promise<PagingData<Operation>> {
    await this.checkDataBaseOpened();
    return new Promise<PagingData<Operation>>((resolve, rejects) => {
      if (this.sqLiteObject) {
        this.privateFindByIdAccountAndPagingBetweenDate(
          paging,
          id,
          startDate,
          endDate
        )
          .then((data) => resolve(data))
          .catch((err) =>
            printError(
              'erreur lors de la recuperation des données',
              rejects,
              err
            )
          );
      } else {
        rejects('aucun instance de connexion a bd');
      }
    });
  }

  privateFindByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Operation>> {
    return new Promise<PagingData<Operation>>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  ${tables.transaction.columns[8].name} = ?`,
          [id]
        )
        .then((res: any) => {
          let totalElements: number = res.values[0].VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .query(
              `SELECT  *  FROM ${tables.transaction.name}  WHERE ${tables.transaction.columns[8].name} = ? ORDER BY ${tables.transaction.columns[2].name} DESC LIMIT ?  OFFSET ?;`,
              [id, paging.limit, offset]
            )
            .then((res: any) => {
              resolve({
                data: this.constructOperationArray(res),
                currentPage: paging.page,
                totalPage: totalPage,
              });
            })
            .catch((err: any) =>
              printError('error lors davoir la liste', reject, err)
            );
        })
        .catch((err: any) =>
          printError('erreur lors davoir count', reject, err)
        );
    });
  }

  privateFindByIdAccountAndPagingBetweenDate(
    paging: PagingRequest,
    id: number,
    startDate: string,
    endDate: string
  ): Promise<PagingData<Operation>> {
    return new Promise<PagingData<Operation>>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  
          ${tables.transaction.columns[8].name} = ?  AND 
          ${tables.transaction.columns[2].name} >= ? AND 
          ${tables.transaction.columns[2].name} <= ?`,
          [id, startDate, endDate]
        )
        .then((res: any) => {
          let totalElements: number = res.values[0].VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .query(
              `SELECT  *  FROM ${tables.transaction.name}  WHERE ${tables.transaction.columns[8].name} = ? 
              AND ${tables.transaction.columns[2].name} >= ? 
              AND ${tables.transaction.columns[2].name} <= ? ORDER BY ${tables.transaction.columns[2].name} DESC LIMIT ?  OFFSET ?;`,
              [id, startDate, endDate, paging.limit, offset]
            )
            .then((res: any) => {
              resolve({
                data: this.constructOperationArray(res),
                currentPage: paging.page,
                totalPage: totalPage,
              });
            })
            .catch((err: any) =>
              printError('error lors davoir la liste', reject, err)
            );
        })
        .catch((err: any) =>
          printError('erreur lors davoir count', reject, err)
        );
    });
  }

  async findAll(): Promise<Operation[]> {
    throw new Error('Method not implemented.');
  }

  async adjusteAfterOperation(
    id: number,
    countId: number,
    diff: number
  ): Promise<any> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateAdjusteAfterOperation(id, countId, diff)
          .then(() => resolve({}))
          .catch((err) =>
            printError('erreur lors de lajustement', reject, err)
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }
  private async privateAdjusteAfterOperation(
    id: number,
    countId: number,
    diff: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqLiteObject
        .query(
          `UPDATE  ${tables.transaction.name} SET ${tables.transaction.columns[7].name} = ${tables.transaction.columns[7].name} + ? WHERE id > ? and ${tables.transaction.columns[8].name} = ?`,
          [diff, id, countId]
        )
        .then((res: any) => {
          resolve('succes!!');
          console.info(res);
        })
        .catch((err: any) =>
          printError('erreur lors de lexcecusion de la requete', reject, err)
        );
    });
  }

  private constructOperationArray(data: any): Operation[] {
    let operations: Operation[] = [];

    for (let i = 0; i < data.values.length; i++) {
      operations.push({
        id: data.values[i].ID,
        numTrans: data.values[i].NUM_TRANS,
        time: parseISO(data.values[i].TIME),
        balance: data.values[i].BALANCE,
        description: data.values[i].DESCRIPTION,
        statut: data.values[i].STATUT,
        credit: data.values[i].CREDIT,
        debit: data.values[i].DEBIT,
        idAccount: data.values[i].ID_ACCOUNT,
        transfer: data.values[i].TRANSFER,
      } as Operation);
    }

    return operations;
  }

  async deleteById(ids: number[]): Promise<void> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateDeleteById(ids)
          .then(() => resolve())
          .catch((err) =>
            printError('erreur lors de la suppression', reject, err)
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private async privateDeleteById(ids: number[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `DELETE FROM ${tables.transaction.name} WHERE  ${
            tables.transaction.columns[0].name
          } IN (${ids.join(',')})`
        )
        .then((res: any) => {
          console.log(
            'operation ids :' +
              ids.join(',') +
              ' deleted!:::' +
              JSON.stringify(res)
          );
          resolve();
        })
        .catch((err: any) => {
          if (err.values.length === 0 && err.rowsAffected >= 0) {
            resolve();
          } else {
            printError("erreur dans l'excecusion de le requete", reject, err);
          }
        });
    });
  }

  async createList(operations: Operation[], withoutId: boolean): Promise<any> {
    await this.checkDataBaseOpened();
    return new Promise<any>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privatecreateList(operations, withoutId)
          .then(() => resolve({}))
          .catch((err) =>
            printError("error dans l'excecusion de la requete", reject, err)
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private async privatecreateList(
    operations: Operation[],
    withId: boolean
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `INSERT INTO ${tables.transaction.name} (${tables.transaction.columns
            .filter((el) => {
              if (withId) {
                return true;
              }
              return el.name !== 'ID';
            })
            .map((el) => el.name)}) 
        VALUES ${operations
          .map(
            (model) =>
              `( ${!withId ? '' : model.id + ','} '${
                model.numTrans
              }', '${format(model.time, 'yyyy-MM-dd HH:mm:ss')}', '${
                model.description
              }', '${model.statut}' ,${model.credit}, ${model.debit}, ${
                model.balance
              }, ${model.idAccount}, '${model.transfer}')`
          )
          .join(',')};`,
          []
        )
        .then((res: any) => resolve(res))
        .catch((e: any) => {
          if (e.code === 6) {
            printError('operation already exist', reject, e);
          }

          printError("erreur dans l'excecusion de la requete", reject, e);
        });
    });
  }

  async createListIdReturning(
    operations: Operation[],
    withoutId: boolean
  ): Promise<number[]> {
    await this.checkDataBaseOpened();
    return new Promise<any>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        const resolvePromisesSeq = async (tasks: Promise<any>[]) => {
          const results = [];
          for (const task of tasks) {
            results.push(await task);
          }
          console.log('ID S :' + JSON.stringify(results));
          return results;
        };
        resolve(
          await resolvePromisesSeq(operations.map((el) => this.create(el)))
        );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  async selectOperationByNumTrans(numTrans: string): Promise<Operation[]> {
    await this.checkDataBaseOpened();
    return new Promise<Operation[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateSelectOperationByNumTrans(numTrans)
          .then((operations) => resolve(operations))
          .catch((err) =>
            printError("error dans l'excecusion de la requette", reject, err)
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private privateSelectOperationByNumTrans(
    numTrans: string
  ): Promise<Operation[]> {
    return new Promise<Operation[]>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT  *  FROM ${tables.transaction.name}  WHERE ${tables.transaction.columns[1].name} = ?`,
          [numTrans]
        )
        .then((result: any) => {
          resolve(this.constructOperationArray(result));
        })
        .catch((err: any) => {
          printError("erreur lors de l'excecusion de la requette", reject, err);
        });
    });
  }

  async selectOperationJoinAccountByNumTrans(
    numTrans: string
  ): Promise<Operation[]> {
    await this.checkDataBaseOpened();
    return new Promise<Operation[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateSelectOperationJoinAccountByNumTrans(numTrans)
          .then((opers) => resolve(opers))
          .catch((err) =>
            printError(
              "erreur lors de l'excecusion de la requette",
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private async privateSelectOperationJoinAccountByNumTrans(
    numTrans: string
  ): Promise<Operation[]> {
    return new Promise<Operation[]>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ?;`,
          [numTrans]
        )
        .then((data: any) => {
          let operations: Operation[] = [];
          if (data.values.length >= 1) {
            operations = this.constructAccountArray(data);
          }
          resolve(operations);
        })
        .catch((err: any) =>
          printError("erreur lors de l'excecusion de la requette", reject, err)
        );
    });
  }

  async selectOperationJoinAccountById(id: number): Promise<Operation> {
    await this.checkDataBaseOpened();
    return new Promise<Operation>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateSelectOperationJoinAccountById(id)
          .then((op) => resolve(op))
          .catch((err) =>
            printError(
              "erreur lors de l'excecusion de la requette",
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private async privateSelectOperationJoinAccountById(
    id: number
  ): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[0].name} = ?;`,
          [id]
        )
        .then((data: any) => {
          if (data.values.length >= 1) {
            resolve(this.performOperationsRowIndex(data, 0));
          } else {
            resolve({} as Operation);
          }
        })
        .catch((err: any) =>
          printError("erreur lors de l'excecusion de la requette", reject, err)
        );
    });
  }

  async findOperationTransferTo(
    numTrans: string,
    countId: number
  ): Promise<Operation> {
    await this.checkDataBaseOpened();
    return new Promise<Operation>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFincOperatonTransferTo(numTrans, countId)
          .then((op) => resolve(op))
          .catch((err) =>
            printError(
              "erreur lors de l'excecusion de la requette",
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }
  privateFincOperatonTransferTo(
    numTrans: string,
    countId: number
  ): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ? and op.${tables.transaction.columns[8].name} <> ?`,
          [numTrans, countId]
        )
        .then((res: any) => {
          if (res.values.length > 0) {
            resolve(this.performOperationsRowIndex(res, 0));
          } else {
            reject(404);
          }
        })
        .catch((err: any) => {
          printError("erreur lors de l'excecusion de la requette", reject, err);
        });
    });
  }

  async findOperationByTransAndCountId(
    numTrans: string,
    countId: number
  ): Promise<Operation> {
    await this.checkDataBaseOpened();
    return new Promise<Operation>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindOperationByTransAndCountId(numTrans, countId)
          .then((op) => resolve(op))
          .catch((err) =>
            printError(
              "erreur lors de l'excecusion de la requette",
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }

  private async privateFindOperationByTransAndCountId(
    numTrans: string,
    countId: number
  ): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ? and op.${tables.transaction.columns[8].name} = ?`,
          [numTrans, countId]
        )
        .then((res: any) => {
          if (res.values.length > 0) {
            resolve(this.performOperationsRowIndex(res, 0));
          } else {
            reject(404);
          }
        })
        .catch((err: any) => {
          printError("erreur lors de l'excecusion de la requette", reject, err);
        });
    });
  }

  async getBalanceBeforeDate(date: Date, accountId: number): Promise<number> {
    await this.checkDataBaseOpened();
    return new Promise<number>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateGetBalanceBeforeDate(date, accountId)
          .then((balance) => resolve(balance))
          .catch((err) =>
            printError(
              "erreur lors de l'excecusion de la requette",
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }
  private async privateGetBalanceBeforeDate(
    date: Date,
    accountId: number
  ): Promise<number> {
    return new Promise<number>((resolve, rejects) => {
      this.sqLiteObject
        .query(
          `SELECT ${tables.transaction.columns[7].name} FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[2].name} < ? AND  ${tables.transaction.columns[8].name}  = ? ORDER BY TIME DESC LIMIT 2`,
          [format(date, 'yyyy-MM-dd HH:mm:ss'), accountId]
        )
        .then((res: any) => {
          if (res.values.length > 0) {
            let balance: number = res.values[0].BALANCE;
            resolve(balance);
          } else {
            resolve(0);
          }
        })
        .catch((err: any) =>
          printError('erreur durant lexcecustion de la requette', rejects, err)
        );
    });
  }

  async adjusteAfterOperationByDate(
    date: Date,
    countId: number,
    diff: number
  ): Promise<void> {
    await this.checkDataBaseOpened();
    return new Promise<void>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateAdjusteAfterOperationByDate(date, countId, diff)
          .then(() => resolve())
          .catch((err) =>
            printError(
              "erreur lors de l'excecusion de la requette",
              reject,
              err
            )
          );
      } else {
        reject('aucun instance de connexion a bd');
      }
    });
  }
  private async privateAdjusteAfterOperationByDate(
    date: Date,
    countId: number,
    diff: number
  ): Promise<void> {
    return new Promise<void>((resolve, rejects) => {
      this.sqLiteObject
        .query(
          `UPDATE  ${tables.transaction.name} SET ${tables.transaction.columns[7].name} = ${tables.transaction.columns[7].name} + ? WHERE ${tables.transaction.columns[2].name} > ? and ${tables.transaction.columns[8].name} = ?`,
          [diff, format(date, 'yyyy-MM-dd HH:mm:ss'), countId]
        )
        .then((res: any) => resolve())
        .catch((err: any) =>
          printError(
            'error quand excecute la requette de mis ajour',
            rejects,
            err
          )
        );
    });
  }

  getGlobalBalance(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateGetGlobalBalance()
          .then((r) => resolve(r))
          .catch((err) => console.error(err));
      } else {
        this.dataBase
          .openSQLObject()
          .then((sqLiteObject) => {
            this.sqLiteObject = sqLiteObject;
            this.privateGetGlobalBalance()
              .then((r) => resolve(r))
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      }
    });
  }

  private async privateGetGlobalBalance(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(
            `select actif - passif as balance from (select sum(op.debit) as actif, sum(op.credit) as passif from operation op left join account acc on op.id_account = acc.id where acc.type like 'actif' or acc.type like 'passif');`,
            []
          )
          .then((res: any) => {
            if (res.values.length > 0) {
              resolve(res.values[0].balance);
            } else {
              reject(' no result');
            }
          })
          .catch((e: any) => {
            printError('erreur dans la requette de balance global', reject, e);
          });
      } else {
        reject(' getGlobalBalance :no db connexion');
      }
    });
  }

  async getGlobalBalanceBetweenDate(
    endDate: Date,
    startDate: Date
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateGetGlobalBalanceBetweenDate(endDate, startDate)
          .then((r) => resolve(r))
          .catch((err) => console.error(err));
      } else {
        this.dataBase
          .openSQLObject()
          .then((sqLiteObject) => {
            this.sqLiteObject = sqLiteObject;
            this.privateGetGlobalBalanceBetweenDate(endDate, startDate)
              .then((r) => resolve(r))
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      }
    });
  }

  private async privateGetGlobalBalanceBetweenDate(
    endDate: Date,
    startDate: Date
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `select actif - passif as balance from ( select sum(op.debit) as actif, sum(op.credit) as passif from operation op left join account acc on op.id_account = acc.id where (op.time  <= ? and op.time >= ? ) and ( acc.type like 'actif' or acc.type like 'passif'));`,
          [
            format(endDate, 'yyyy-MM-dd HH:mm:ss'),
            format(startDate, 'yyyy-MM-dd HH:mm:ss'),
          ]
        )
        .then((res: any) => {
          if (res.values.length > 0) {
            resolve(res.values[0].balance);
          } else {
            reject('no result');
          }
        })
        .catch((e: any) => {
          printError('erreur dans la requette de balance global', reject, e);
        });
    });
  }

  async getGlobalBalanceAccountBetweenDate(
    endDate: Date,
    startDate: Date,
    type: string
  ): Promise<number> {
    await this.checkDataBaseOpened();
    return new Promise<number>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(
            `select debit - credit as balance from (select sum(op.credit) as credit, sum(op.debit) as debit, acc.type from account acc left join operation op on acc.id = op.id_account where op.time  <= ? and op.time >= ?   group by acc.type) where type = ? ;`,
            [
              format(endDate, 'yyyy-MM-dd HH:mm:ss'),
              format(startDate, 'yyyy-MM-dd HH:mm:ss'),
              type,
            ]
          )
          .then((res: any) => {
            if (res.values.length > 0) {
              resolve(res.values[0].balance);
            } else {
              reject('no result');
            }
          })
          .catch((e: any) => {
            printError('erreur dans la requette de balance global', reject, e);
          });
      } else {
        reject(' no db connexion');
      }
    });
  }

  async getBalanceOnLeafByTypeAccountAndDates(
    endDate: Date,
    startDate: Date,
    type: string
  ): Promise<AccountBalance[]> {
    await this.checkDataBaseOpened();
    return new Promise<AccountBalance[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(
            `select id, name, debit - credit as balance from (select acc.id as id, acc.account_name as name, sum(op.credit) as credit, sum(op.debit) as debit from account acc left outer join operation op on acc.id = op.id_account and op.time <= ? and op.time >= ? where  acc.type = ? and acc.is_leaf = 1 group by acc.id, acc.account_name);`,
            [
              format(endDate, 'yyyy-MM-dd HH:mm:ss'),
              format(startDate, 'yyyy-MM-dd HH:mm:ss'),
              type,
            ]
          )
          .then((res: any) => {
            if (res.values.length > 0) {
              const accountBalances: AccountBalance[] = [];
              for (let i = 0; i < res.values.length; i++) {
                accountBalances.push({
                  accountId: res.values[i].id,
                  accountName: res.values[i].name,
                  balance: res.values[i].balance,
                });
              }
              resolve(accountBalances);
            } else {
              resolve([]);
            }
          })
          .catch((e: any) => {
            printError('erreur dans la requette de balance global', reject, e);
          });
      } else {
        reject(' no db connexion');
      }
    });
  }

  operationSearch(
    operationSearchData: OperationSearchData
  ): Promise<PagingData<Operation> | undefined> {
    return new Promise<PagingData<Operation> | undefined>((resolve, reject) => {
      if (this.sqLiteObject) {
        const clauseDescription = `${tables.transaction.columns[3].name} like '%${operationSearchData.description}%'`;
        const clauseStartDate = operationSearchData.startDate
          ? `${tables.transaction.columns[2].name} >   '${format(
              operationSearchData.startDate,
              'yyyy-MM-dd HH:mm:ss'
            )}' `
          : ' 1 = 1';
        const clauseEndDate = operationSearchData.endDate
          ? `${tables.transaction.columns[2].name} <  '${format(
              operationSearchData.endDate,
              'yyyy-MM-dd HH:mm:ss'
            )}' `
          : ' 1 = 1';
        const clauseAccountId = operationSearchData.accountId
          ? `${tables.transaction.columns[8].name} =  ${operationSearchData.accountId} `
          : ' 1 = 1';
        const clause = `${clauseDescription} and ${clauseStartDate} and  ${clauseEndDate} and ${clauseAccountId}`;
        this.sqLiteObject
          .query(
            `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name} WHERE ${clause};`,
            []
          )
          .then((res: any) => {
            let totalElements: number = res.values[0].VAL;
            let offset: number =
              (operationSearchData.page - 1) * operationSearchData.limit;
            let totalPage: number = Math.ceil(
              totalElements / operationSearchData.limit
            );

            this.sqLiteObject
              .query(
                `SELECT op.*, acc.${tables.account.columns[1].name} FROM ${tables.transaction.name} op left join ${tables.account.name} acc on acc.${tables.account.columns[0].name} = ${tables.transaction.columns[8].name}   WHERE ${clause} ORDER BY ${tables.transaction.columns[2].name} DESC LIMIT ?  OFFSET ?;`,
                [operationSearchData.limit, offset]
              )
              .then((res: any) => {
                resolve({
                  data: this.constructAccountArray(res),
                  currentPage: operationSearchData.page,
                  totalPage: totalPage,
                });
              })
              .catch((error: any) => {
                reject('erreur dans la requette des operations');
                console.error(error);
              });
          })
          .catch((error: any) => {
            reject('erreur dans la requette count operation');
            console.error(error);
          });
      } else {
        reject(' no db connexion');
      }
    });
  }

  getActifAndPassifStateOnDateByPath(
    date: Date,
    path: string
  ): Promise<Operation> {
    return new Promise<Operation>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          const res = await this.sqLiteObject.query(
            `select sum(op.debit) as actif, sum(op.credit) as passif from operation op left join account acc on op.id_account = acc.id where (op.time  <= ? and op.time >= ? ) and ( acc.type like ?);`,
            [
              format(date, 'yyyy-MM-dd HH:mm:ss'),
              format(
                parseISO('2023-01-01 00:00:00'),

                'yyyy-MM-dd HH:mm:ss'
              ),
              `${path}%`,
            ]
          );

          if (res.values.length > 0) {
            const result: Operation = {
              debit: res.values[0].actif,
              credit: res.values[0].passif,
            } as unknown as Operation;

            resolve({
              ...result,
              assets: result.debit ? result.debit : 0,
              liabilities: result.credit ? result.credit : 0,
            });
          }
        } catch (error) {}
      } else {
        reject('no db connexion!!');
      }
    });
  }

  async getAccountBalanceBetweenDates(
    startDate: Date,
    endDate: Date,
    accountdIds: number[]
  ): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        const data = await this.sqLiteObject.query(
          `SELECT debit - credit as balance FROM (SELECT SUM(DEBIT) as debit,SUM(CREDIT) as credit  FROM ${tables.transaction.name}
           WHERE ${tables.transaction.columns[8].name} IN (?) 
            and ${tables.transaction.columns[2].name} >= ? and ${tables.transaction.columns[2].name} <= ? )`,
          [
            accountdIds,
            format(endDate, 'yyyy-MM-dd HH:mm:ss'),
            format(startDate, 'yyyy-MM-dd HH:mm:ss'),
          ]
        );
        if (data.values.length > 0) {
          resolve(data.values[0].balance);
        } else {
          resolve(0);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllOperationAfterDate(
    idAccount: number,
    date: Date
  ): Promise<Operation[]> {
    this.checkDataBaseOpened();

    return new Promise<Operation[]>(async (resolve, reject) => {
      try {
        let data = await this.sqLiteObject.query(
          `SELECT * FROM  ${tables.transaction.name} WHERE ${tables.transaction.columns[2].name} >= ?  
          and ${tables.transaction.columns[8].name}  = ? order by ${tables.transaction.columns[2].name} ;`,
          [format(date, 'yyyy-MM-dd HH:mm:ss'), idAccount]
        );

        resolve(this.constructAccountArray(data));
      } catch (error) {
        reject('erreur durant la requette');
        console.log(error);
      }
    });
  }

  private constructAccountArray(data: any): Operation[] {
    let operations: Operation[] = [];

    for (let i = 0; i < data.values.length; i++) {
      operations.push(this.performOperationsRowIndex(data, i));
    }

    return operations;
  }

  private performOperationsRowIndex(data: any, i: number): Operation {
    return {
      id: data.values[i].ID,
      numTrans: data.values[i].NUM_TRANS,
      time: parseISO(data.values[i].TIME),
      balance: data.values[i].BALANCE,
      description: data.values[i].DESCRIPTION,
      statut: data.values[i].STATUT,
      credit: data.values[i].CREDIT,
      debit: data.values[i].DEBIT,
      idAccount: data.values[i].ID_ACCOUNT,
      accountType: data.values[i].TYPE,
      transfer: data.values[i].TRANSFER,
      accountName: data.values[i].ACCOUNT_NAME,
      profile: data.values[i].PROFILE,
      attachment: data.values[i].ATTACHMENT,
    };
  }
}
