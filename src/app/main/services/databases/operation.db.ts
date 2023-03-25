import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import parseISO from 'date-fns/parseISO';
import { resolve } from 'dns';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { printError } from '../../tools/errorTools';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { GenericDb } from './GenericDb';
import { tables } from './tables';

@Injectable()
export class OperationDataBase
  extends GenericDb
  implements GenericDataBase<Operation, number>
{
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
  }

  async create(model: Operation): Promise<any> {
    await this.checkDataBaseOpened();
    return new Promise<any>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateCreate(model)
          .then((res) => {
            resolve('loperation est bien créée');
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
  private async privateCreate(model: Operation): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.sqLiteObject
        .executeSql(
          `INSERT INTO ${tables.transaction.name} (${tables.transaction.columns
            .filter((el) => el.name !== 'ID')
            .map((el) => el.name)}) VALUES ( ?, ?, ?, ? , ?, ?, ?, ?, ?);`,
          [
            model.numTrans,
            model.time,
            model.description,
            model.statut,
            model.credit,
            model.debit,
            model.balance,
            model.idAccount,
            model.transfer,
          ]
        )
        .then((res: any) => resolve(res))
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
        .executeSql(
          `UPDATE  ${tables.transaction.name} SET ${tables.transaction.columns
            .filter((el) => el.name !== 'ID')
            .map((el) => el.name + ' = ?')} WHERE ID = ? `,
          [
            operation.numTrans,
            operation.time,
            operation.description,
            operation.statut,
            operation.credit,
            operation.debit,
            operation.balance,
            operation.idAccount,
            operation.transfer,
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
        .executeSql(
          `SELECT * FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[0].name} = ${id};`,
          []
        )
        .then((data: any) => {
          if (data.rows.length >= 1) {
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
        .executeSql(
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

  privateFindByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Operation>> {
    return new Promise<PagingData<Operation>>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  ${tables.transaction.columns[8].name} = ?`,
          [id]
        )
        .then((res: any) => {
          let totalElements: number = res.rows.item(0).VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .executeSql(
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
        .executeSql(
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

    for (let i = 0; i < data.rows.length; i++) {
      operations.push({
        id: data.rows.item(i).ID,
        numTrans: data.rows.item(i).NUM_TRANS,
        time: parseISO(data.rows.item(i).TIME),
        balance: data.rows.item(i).BALANCE,
        description: data.rows.item(i).DESCRIPTION,
        statut: data.rows.item(i).STATUT,
        credit: data.rows.item(i).CREDIT,
        debit: data.rows.item(i).DEBIT,
        idAccount: data.rows.item(i).ID_ACCOUNT,
        transfer: data.rows.item(i).TRANSFER,
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
        .executeSql(
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
          if (err.rows.length === 0 && err.rowsAffected >= 0) {
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
        .executeSql(
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
              `( ${!withId ? '' : model.id + ','} '${model.numTrans}', '${
                model.time
              }', '${model.description}', '${model.statut}' ,${model.credit}, ${
                model.debit
              }, ${model.balance}, ${model.idAccount}, '${model.transfer}')`
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
        .executeSql(
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
        .executeSql(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ?;`,
          [numTrans]
        )
        .then((data: any) => {
          let operations: Operation[] = [];
          if (data.rows.length >= 1) {
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
        .executeSql(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[0].name} = ?;`,
          [id]
        )
        .then((data: any) => {
          if (data.rows.length >= 1) {
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
        .executeSql(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ? and op.${tables.transaction.columns[8].name} <> ?`,
          [numTrans, countId]
        )
        .then((res: any) => {
          if (res.rows.length > 0) {
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
        .executeSql(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ? and op.${tables.transaction.columns[8].name} = ?`,
          [numTrans, countId]
        )
        .then((res: any) => {
          if (res.rows.length > 0) {
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
        .executeSql(
          `SELECT ${tables.transaction.columns[7].name} FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[2].name} < ? AND  ${tables.transaction.columns[8].name}  = ? ORDER BY TIME DESC LIMIT 2`,
          [date, accountId]
        )
        .then((res: any) => {
          if (res.rows.length > 0) {
            let balance: number = res.rows.item(0).BALANCE;
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
    date: Date | string,
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
    date: Date | string,
    countId: number,
    diff: number
  ): Promise<void> {
    return new Promise<void>((resolve, rejects) => {
      this.sqLiteObject
        .executeSql(
          `UPDATE  ${tables.transaction.name} SET ${tables.transaction.columns[7].name} = ${tables.transaction.columns[7].name} + ? WHERE ${tables.transaction.columns[2].name} > ? and ${tables.transaction.columns[8].name} = ?`,
          [diff, date, countId]
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

  private constructAccountArray(data: any): Operation[] {
    let operations: Operation[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      operations.push(this.performOperationsRowIndex(data, i));
    }

    return operations;
  }

  private performOperationsRowIndex(data: any, i: number): Operation {
    return {
      id: data.rows.item(i).ID,
      numTrans: data.rows.item(i).NUM_TRANS,
      time: parseISO(data.rows.item(i).TIME),
      balance: data.rows.item(i).BALANCE,
      description: data.rows.item(i).DESCRIPTION,
      statut: data.rows.item(i).STATUT,
      credit: data.rows.item(i).CREDIT,
      debit: data.rows.item(i).DEBIT,
      idAccount: data.rows.item(i).ID_ACCOUNT,
      accountType: data.rows.item(i).TYPE,
      transfer: data.rows.item(i).TRANSFER,
    };
  }
}
