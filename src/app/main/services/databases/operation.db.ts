import { Injectable } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { rejects } from 'assert';
import { KeyObject } from 'crypto';
import parseISO from 'date-fns/parseISO';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { printError } from '../../tools/errorTools';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { tables } from './tables';

@Injectable()
export class OperationDataBase implements GenericDataBase<Operation, number> {
  sqLiteObject: any;

  constructor(private readonly dataBase: DataBaseService) {
    this.sqLiteObject = this.dataBase.sqLiteObject;
    if (this.sqLiteObject) {
      this.dataBase
        .openSQLObject()
        .then((sqLiteObject) => {
          this.sqLiteObject = sqLiteObject;
          console.log('sqlObject pulled on AccountDataBase');
        })
        .catch((e) => console.error(JSON.stringify(e)));
    }
  }

  async create(model: Operation): Promise<any> {
    if (this.sqLiteObject) {
      return this.privateCreate(model);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateCreate(model);
      })
      .catch((err) => {
        return err;
      });
  }
  private async privateCreate(model: Operation): Promise<any> {
    return this.sqLiteObject
      .executeSql(
        `INSERT INTO ${tables.transaction.name} (${tables.transaction.columns
          .filter((el) => el.name !== 'ID')
          .map((el) => el.name)}) 
        VALUES ( ?, ?, ?, ? , ?, ?, ?, ?, ?);`,
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
      .then((res: any) => res)
      .catch((e: any) => {
        if (e.code === 6) {
          return 'operation already exist';
        }

        return e;
      });
  }
  async update(operation: Operation, id: number): Promise<Operation> {
    if (this.sqLiteObject) {
      return this.privateUpdate(operation, id);
    }
    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateUpdate(operation, id);
      })
      .catch((err) => err);
  }
  private async privateUpdate(
    operation: Operation,
    id: number
  ): Promise<Operation> {
    return this.sqLiteObject
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
      .then(() => this.findById(id))
      .catch((err: any) => err);
  }

  async findById(id: number): Promise<Operation> {
    if (this.sqLiteObject) {
      return this.privateFindById(id);
    }
    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateFindById(id);
      })
      .catch((err) => err);
  }

  private async privateFindById(id: number): Promise<Operation> {
    return this.sqLiteObject
      .executeSql(
        `SELECT * FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[0].name} = ${id};`,
        []
      )
      .then((data: any) => {
        if (data.rows.length >= 1) {
          return {
            id: data.rows.item(0).ID,
            numTrans: data.rows.item(0).NUM_TRANS,
            time: parseISO(data.rows.item(0).TIME),
            balance: data.rows.item(0).BALANCE,
            description: data.rows.item(0).DESCRIPTION,
            statut: data.rows.item(0).STATUT,
            credit: data.rows.item(0).CREDIT,
            debit: data.rows.item(0).DEBIT,
            idAccount: data.rows.item(0).ID_ACCOUNT,
            transfer: data.rows.item(0).TRANSFER,
          } as Operation;
        }

        return {
          description: '',
          debit: 0,
        } as Operation;
      })
      .catch((err: any) => err);
  }

  async findByIdAccount(id: number): Promise<Operation[]> {
    if (this.sqLiteObject) {
      return this.privateFindByIdAccount(id);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateFindByIdAccount(id);
      })
      .catch((err) => err);
  }

  async findByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Operation>> {
    if (this.sqLiteObject) {
      return this.privateFindByIdAccountAndPaging(paging, id);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateFindByIdAccountAndPaging(paging, id);
      })
      .catch((err) => err);
  }
  privateFindByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Operation>> {
    return this.sqLiteObject
      .executeSql(
        `SELECT COUNT (*) AS VAL FROM ${tables.transaction.name}  WHERE  ${tables.transaction.columns[8].name} = ?`,
        [id]
      )
      .then((res: any) => {
        let totalElements: number = res.rows.item(0).VAL;
        let offset: number = (paging.page - 1) * paging.limit;
        let totalPage: number = Math.ceil(totalElements / paging.limit);
        console.log('ddd:' + JSON.stringify(paging));
        return new Promise<PagingData<Operation>>((resolve, reject) => {
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
            .catch((err: any) => reject(err));
        });
      })
      .catch((err: any) => err);
  }

  private async privateFindByIdAccount(id: number): Promise<Operation[]> {
    return this.sqLiteObject
      .executeSql(
        `SELECT * FROM ${tables.transaction.name} WHERE ${tables.transaction.columns[8].name} = ? ORDER BY ${tables.transaction.columns[2].name} DESC;`,
        [id]
      )
      .then((data: any) => {
        return this.constructOperationArray(data);
      })
      .catch((err: any) => console.error(err));
  }

  findAll(): Promise<Operation[]> {
    throw new Error('Method not implemented.');
  }

  async adjusteAfterOperation(
    id: number,
    countId: number,
    diff: number
  ): Promise<any> {
    if (this.sqLiteObject) {
      return this.privateAdjusteAfterOperation(id, countId, diff);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateAdjusteAfterOperation(id, countId, diff);
      })
      .catch((err) => err);
  }
  private async privateAdjusteAfterOperation(
    id: number,
    countId: number,
    diff: number
  ): Promise<any> {
    return this.sqLiteObject
      .executeSql(
        `UPDATE  ${tables.transaction.name} SET ${tables.transaction.columns[7].name} = ${tables.transaction.columns[7].name} + ? WHERE id > ? and ${tables.transaction.columns[8].name} = ?`,
        [diff, id, countId]
      )
      .then((res: any) => res)
      .catch((err: any) => err);
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
    if (this.sqLiteObject) {
      return this.privateDeleteById(ids);
    }

    return this.dataBase
      .openSQLObject()
      .catch((err) => err)
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateDeleteById(ids);
      });
  }

  private async privateDeleteById(ids: number[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `DELETE FROM  ${tables.transaction.name} WHERE  ${
            tables.transaction.columns[0].name
          } IN (${ids.join(',')})`
        )
        .then(() => {
          console.log('operation ids :' + ids.join(',') + ' deleted!');
          resolve();
        })
        .catch((err: any) => reject(err));
    });
  }

  async createList(operations: Operation[]): Promise<any> {
    if (this.sqLiteObject) {
      return this.privatecreateList(operations);
    }
    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privatecreateList(operations);
      })
      .catch((err) => err);
  }

  private async privatecreateList(operations: Operation[]): Promise<any> {
    return this.sqLiteObject
      .executeSql(
        `INSERT INTO ${tables.transaction.name} (${tables.transaction.columns
          .filter((el) => el.name !== 'ID')
          .map((el) => el.name)}) 
        VALUES ${operations
          .map(
            (model) =>
              `( '${model.numTrans}', '${model.time}', '${model.description}', '${model.statut}' ,${model.credit}, ${model.debit}, ${model.balance}, ${model.idAccount}, '${model.transfer}')`
          )
          .join(',')};`,
        []
      )
      .then((res: any) => res)
      .catch((e: any) => {
        if (e.code === 6) {
          return 'operation already exist';
        }

        return e;
      });
  }

  async selectOperationByNumTrans(numTrans: string): Promise<Operation[]> {
    if (this.sqLiteObject) {
      return this.privateSelectOperationByNumTrans(numTrans);
    }
    return new Promise<Operation[]>((_resolve, reject) => {
      this.dataBase
        .openSQLObject()
        .then((sqLiteObject) => {
          this.sqLiteObject = sqLiteObject;
          return this.privateSelectOperationByNumTrans(numTrans);
        })
        .catch((err) => {
          reject('erreur lors de la creation de la connexion a DB');
          console.error(err);
        });
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
          reject('erreur lors d excecusion de la requette');
          console.error(err);
        });
    });
  }

  async selectOperationJoinAccountByNumTrans(
    numTrans: string
  ): Promise<Operation[]> {
    if (this.sqLiteObject) {
      return this.privateSelectOperationJoinAccountByNumTrans(numTrans);
    }
    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateSelectOperationJoinAccountByNumTrans(numTrans);
      })
      .catch((err) => err);
  }

  private async privateSelectOperationJoinAccountByNumTrans(
    numTrans: string
  ): Promise<Operation[]> {
    return this.sqLiteObject
      .executeSql(
        `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[1].name} = ?;`,
        [numTrans]
      )
      .then((data: any) => {
        let operations: Operation[] = [];
        if (data.rows.length >= 1) {
          operations = this.constructAccountArray(data);
        }
        return operations;
      })
      .catch((err: any) => err);
  }

  async selectOperationJoinAccountById(id: number): Promise<Operation> {
    if (this.sqLiteObject) {
      return this.privateSelectOperationJoinAccountById(id);
    }
    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateSelectOperationJoinAccountById(id);
      })
      .catch((err) => err);
  }

  private async privateSelectOperationJoinAccountById(
    id: number
  ): Promise<Operation> {
    return this.sqLiteObject
      .executeSql(
        `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id WHERE op.${tables.transaction.columns[0].name} = ?;`,
        [id]
      )
      .then((data: any) => {
        if (data.rows.length >= 1) {
          return this.performOperationsRowIndex(data, 0);
        } else {
          return null;
        }
      })
      .catch((err: any) => err);
  }

  async findOperationTransferTo(
    numTrans: string,
    countId: number
  ): Promise<Operation> {
    if (this.sqLiteObject) {
      return this.privateFincOperatonTransferTo(numTrans, countId);
    }
    return new Promise<Operation>((resolve, reject) => {
      this.dataBase
        .openSQLObject()
        .then((sqLiteObject) => {
          this.sqLiteObject = sqLiteObject;
          this.privateFincOperatonTransferTo(numTrans, countId)
            .then((operation) => {
              resolve(operation);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => {
          reject('problem de connexion a la base de données');
          console.error(err);
        });
    });
  }
  privateFincOperatonTransferTo(
    numTrans: string,
    countId: number
  ): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `SELECT  op.*, acc.type  FROM ${tables.transaction.name} op left join ${tables.account.name} acc on op.id_account = acc.id 
        WHERE op.${tables.transaction.columns[1].name} = ? and  op.${tables.transaction.columns[8].name} <> ?`,
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
          reject('erreur dans lexcecision de la requete');
          console.error(err);
        });
    });
  }

  async getBalanceBeforeDate(date: Date, accountId: number): Promise<number> {
    if (this.sqLiteObject) {
      return this.privateGetBalanceBeforeDate(date, accountId);
    }

    return new Promise<number>(async (resolve, rejects) => {
      try {
        this.sqLiteObject = await this.dataBase.openSQLObject();
        try {
          let balance = await this.privateGetBalanceBeforeDate(date, accountId);
          resolve(balance);
        } catch (error) {
          printError('erreur en recuperant la balance', rejects, error);
        }
      } catch (error) {
        printError('erreur en recuperant la sqlObject', rejects, error);
      }
    });
  }
  privateGetBalanceBeforeDate(date: Date, accountId: number): Promise<number> {
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

  adjusteAfterOperationByDate(
    date: Date | string,
    countId: number,
    diff: number
  ): Promise<void> {
    if (this.sqLiteObject) {
      return this.privateAdjusteAfterOperationByDate(date, countId, diff);
    }

    return new Promise<void>((resolve, rejects) => {
      this.dataBase
        .openSQLObject()
        .then(async (sqLiteObject) => {
          this.sqLiteObject = sqLiteObject;
          try {
            await this.privateAdjusteAfterOperationByDate(date, countId, diff);
            resolve();
          } catch (err) {
            printError('erreur lors de lappel du private', rejects, err);
          }
        })
        .catch((err) => {
          printError('error on open database', rejects, err);
        });
    });
  }
  privateAdjusteAfterOperationByDate(
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
