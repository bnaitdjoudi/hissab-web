import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { printError } from '../../tools/errorTools';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { GenericDb } from './GenericDb';
import { tables } from './tables';
import { AccountResume } from '../../model/account.resume.model';
import { queriesAccount } from './queries';
import { format } from 'date-fns';

import { AccountLimit } from 'src/app/model/account-limit.model';

@Injectable({
  providedIn: 'root',
})
export class AccountDataBase
  extends GenericDb
  implements GenericDataBase<Account, number>
{
  async findAccountStateByIdAndDates(
    id: number,
    startDate: Date,
    endDate: Date
  ): Promise<Account> {
    return new Promise<Account>(async (resolve, reject) => {
      if (!this.sqLiteObject) {
        try {
          this.sqLiteObject = await this.dataBase.openSQLObject();
        } catch (error) {
          console.error(error);
          reject(error);
        }
      }
      this.sqLiteObject
        .query(queriesAccount.view, [
          format(startDate, 'yyyy-MM-dd HH:mm:ss'),
          format(endDate, 'yyyy-MM-dd HH:mm:ss'),
          id,
        ])
        .then((data: any) => {
          if (data.values.length > 0) {
            let i = 0;
            resolve({
              id: data.values[i].ID,
              acountName: data.values[i].ACCOUNT_NAME,
              totalAccount: data.values[i][tables.account.columns[2].name],
              isMain: data.values[i].IS_MAIN > 0,
              type: data.values[i].TYPE,
              parentId: data.values[i].PARENT_ID,
              path: data.values[i].PATH,
              isLeaf: data.values[i].IS_LEAF > 0,
              resume: { debit: 0, credit: 0, sons: 0 },
              debit: data.values[i].debit,
              credit: data.values[i].credit,
              rbalance: data.values[i].rbalance,
            });
          }
        });
    });
  }
  override sqLiteObject: any;
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
  }

  async initMainAccount(subject: BehaviorSubject<void>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dataBase
        .createInitialAccounts(subject)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  async update(model: Account, id: number): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise<Account>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateUpdate(model, id)
          .then((account) => resolve(account))
          .catch((err) =>
            printError(
              "erreur l'ors de l'execussion d ela requette",
              reject,
              err
            )
          );
      }
    });
  }
  private async privateUpdate(model: Account, id: number): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise<Account>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `UPDATE ${tables.account.name} SET ${tables.account.columns
            .filter((el) => el.name !== 'ID')
            .map((el) => el.name + ' = ?')} WHERE id = ?;`,
          [
            model.acountName,
            model.totalAccount,
            model.isMain ? 1 : 0,
            model.type,
            model.parentId,
            model.path,
            model.isLeaf ? 1 : 0,
            model.limitMax,
            model.limitMin,
            id,
          ]
        )
        .then(() =>
          this.findById(id)
            .then((account) => resolve(account))
            .catch((err) =>
              printError(
                'erreur lors de la recuperation de la ligne',
                reject,
                err
              )
            )
        )
        .catch((err: any) =>
          printError('erreur lors de la requette de mis a jour', reject, err)
        );
    });
  }

  async findAll(): Promise<Account[]> {
    await this.checkDataBaseOpened();
    return new Promise<Account[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(`SELECT * FROM ${tables.account.name};`, [])
          .then((res: any) => resolve(this.constructAccountArray(res)))
          .catch((err: any) => {
            printError(
              "error l'ors de la recuperation des accounts",
              reject,
              err
            );
          });
      }
    });
  }
  async findById(id: number): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(
            `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[0].name} = ${id};`,
            []
          )
          .then((data: any) => {
            if (data.values.length >= 1) {
              resolve(this.performeAccountRowIndex(data, 0));
            } else {
              reject('NOT FOUND');
            }
          })
          .catch((err: any) => {
            printError('erreur lors de la requette', reject, err);
          });
      }
    });
  }

  async findByName(name: string): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise<Account>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[1].name} = ?;`,
          [name]
        )
        .then((res: any) => {
          if (res.values.length > 0) {
            resolve(this.performeAccountRowIndex(res, 0));
          } else {
            reject('NOT FOUND');
          }
        })
        .catch((err: any) =>
          printError('erreur lors de la requette', reject, err)
        );
    });
  }

  async create(model: Account): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      this.sqLiteObject
        .query(
          `INSERT INTO ${tables.account.name} (
            ${tables.account.columns[1].name},
            ${tables.account.columns[2].name}, 
            ${tables.account.columns[3].name},
            ${tables.account.columns[4].name}, 
            ${tables.account.columns[5].name},
            ${tables.account.columns[6].name},
            ${tables.account.columns[7].name}) VALUES ( ?, ?, ?,?, ?, ?, ? );`,
          [
            model.acountName,
            model.totalAccount,
            model.isMain ? 1 : 0,
            model.type,
            model.parentId,
            model.path,
            model.isLeaf ? 1 : 0,
          ]
        )
        .then(() => {
          this.finByPath(model.path).then((acc) => resolve(acc));
        })
        .catch((e: { code: number }) => {
          if (e.code === 6) {
            reject('account already exist');
          } else {
            printError('error on creating account:', reject, e);
          }
        });
    });
  }

  async createAccountLimit(model: AccountLimit): Promise<void> {
    await this.checkDataBaseOpened();
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.query(
          `INSERT INTO ${tables.limites.name} (
            ${tables.limites.columns[1].name},
            ${tables.limites.columns[2].name}, 
            ${tables.limites.columns[3].name},
            ${tables.limites.columns[4].name})
              VALUES( ?, ?, ?,? );`,
          [
            model.accountId,
            model.max !== undefined && model.max !== null ? model.max : null,
            model.min !== undefined && model.min !== null ? model.min : null,
            model.period,
          ]
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAccountsByType(arg0: string): Promise<Account[]> {
    await this.checkDataBaseOpened();
    return new Promise<Account[]>((resolve, reject) => {
      if (this.sqLiteObject !== undefined || this.sqLiteObject !== null) {
        this.sqLiteObject
          .query(
            `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[4].name} = ?;`,
            [arg0]
          )
          .then((data: any) => {
            if (data.values.length >= 1) {
              resolve(this.constructAccountArray(data));
            } else {
              resolve([]);
            }
          })
          .catch((e: any) =>
            printError('error on runnin query account', reject, e)
          );
      } else {
        reject('aucun ouverture a la bd');
      }
    });
  }

  async getMainAccounts(): Promise<Account[]> {
    await this.checkDataBaseOpened();
    return new Promise<Account[]>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[3].name} = ?;`,
          [1]
        )
        .then((data: any) => {
          if (data.values.length >= 1) {
            resolve(this.constructAccountArray(data));
          } else {
            resolve([]);
          }
        })
        .catch((err: any) =>
          printError('error on running query account', reject, err)
        );
    });
  }

  async findByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Account>> {
    await this.checkDataBaseOpened();
    return new Promise<PagingData<Account>>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindByIdAccountAndPaging(paging, id)
          .then((paging) => resolve(paging))
          .catch((err) =>
            printError('erreur durant la construction des données', reject, err)
          );
      }
    });
  }
  privateFindByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Account>> {
    return new Promise<PagingData<Account>>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT COUNT (*) AS VAL FROM ${tables.account.name}  WHERE  ${tables.account.columns[5].name} = ?`,
          [id]
        )
        .then((res: any) => {
          let totalElements: number = res.values[0].VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .query(
              `SELECT  *  FROM ${tables.account.name}  WHERE ${tables.account.columns[5].name} = ? ORDER BY ${tables.account.columns[2].name} DESC LIMIT ?  OFFSET ?;`,
              [id, paging.limit, offset]
            )
            .then((res: any) => {
              resolve({
                data: this.constructAccountArray(res),
                currentPage: paging.page,
                totalPage: totalPage,
              });
            })
            .catch((err: any) => reject(err));
        })
        .catch((err: any) => reject(err));
    });
  }

  async deleteById(ids: number[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(
            `DELETE FROM ${tables.account.name} WHERE  ${
              tables.account.columns[0].name
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
      } else {
        reject('no bd connexion');
      }
    });
  }

  async ajusteDiffByPath(paths: string[], diff: number): Promise<any> {
    await this.checkDataBaseOpened();
    return new Promise<any>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateAjusteDiffByPath(paths, diff)
          .then(() => resolve('succes!'))
          .catch((err) => printError('error on running query', reject, err));
      }
    });
  }

  private async privateAjusteDiffByPath(
    paths: string[],
    diff: number
  ): Promise<any> {
    await this.checkDataBaseOpened();
    return new Promise<any>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `UPDATE ${tables.account.name} SET ${
            tables.account.columns[2].name
          } = ${tables.account.columns[2].name} + ? WHERE ${
            tables.account.columns[6].name
          } IN (${paths.map((el) => "'" + el + "'").join(',')})`,
          [diff]
        )
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }

  async findAllLeafExeptType(types: string[]): Promise<LeafAccount[]> {
    await this.checkDataBaseOpened();
    return new Promise<LeafAccount[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindAllLeafExeptType(types)
          .then((leafs) => resolve(leafs))
          .catch((err) => printError('error on running query', reject, err));
      }
    });
  }

  private async privateFindAllLeafExeptType(
    types: string[]
  ): Promise<LeafAccount[]> {
    return new Promise<LeafAccount[]>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF , TYPE, BALANCE FROM ACCOUNT  WHERE IS_LEAF = 1 AND TYPE NOT IN (${types
            .map((el) => `'${el}'`)
            .join(',')});`,
          []
        )
        .then((data: any) => {
          let leafAccounts: LeafAccount[] = [];
          if (data.values.length > 0) {
            for (let i = 0; i < data.values.length; i++) {
              leafAccounts.push({
                id: data.values[i].ID,
                acountName: data.values[i].ACCOUNT_NAME,
                path: data.values[i].PATH,
                isLeaf: data.values[i].IS_LEAF > 0,
                type: data.values[i].TYPE,
                balance: data.values[i].BALANCE,
              });
            }
          }
          resolve(leafAccounts);
        })
        .catch((err: any) => {
          printError("erreur dans l'appel a la base de données", reject, err);
        });
    });
  }

  async findAllLeafExeptOneByIds(ids: number[]): Promise<LeafAccount[]> {
    await this.checkDataBaseOpened();
    return new Promise<LeafAccount[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindAllLeafExeptOneByIds(ids)
          .then((leafs) => resolve(leafs))
          .catch((err) => printError('error on running query', reject, err));
      }
    });
  }

  async privateFindAllLeafExeptOneByIds(ids: number[]): Promise<LeafAccount[]> {
    return new Promise<LeafAccount[]>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF, TYPE, BALANCE FROM ACCOUNT  WHERE IS_LEAF = 1 AND ID NOT IN (${ids
            .map((el) => `'${el}'`)
            .join(',')});`,
          []
        )
        .then((data: any) => {
          let leafAccounts: LeafAccount[] = [];
          if (data.values.length > 0) {
            for (let i = 0; i < data.values.length; i++) {
              leafAccounts.push({
                id: data.values[i].ID,
                acountName: data.values[i].ACCOUNT_NAME,
                path: data.values[i].PATH,
                isLeaf: data.values[i].IS_LEAF > 0,
                type: data.values[i].TYPE,
                balance: data.values[i].BALANCE,
              });
            }
          }
          resolve(leafAccounts);
        })
        .catch((err: any) => {
          reject("erreur dans l'appel a la base de données");
          console.error(err);
        });
    });
  }

  async finByPath(transfer: string): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise<Account>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFinByPath(transfer)
          .then((acc) => resolve(acc))
          .catch((err) => printError('error on running query', reject, err));
      }
    });
  }
  private async privateFinByPath(transfer: string): Promise<Account> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        const data = await this.sqLiteObject.query(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[6].name} LIKE ?`,
          [transfer]
        );
        console.log('privateFinByPath::', JSON.stringify(data));
        if (data.values.length > 0) {
          resolve(this.performeAccountRowIndex(data, 0));
        } else {
          reject('no record found!!!');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getSubAccountsStateByPagingAndAccountId(
    paging: PagingRequest,
    id: number,
    startDate: Date,
    endDate: Date
  ): Promise<PagingData<Account>> {
    return new Promise<PagingData<Account>>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT COUNT (*) AS VAL FROM ${tables.account.name}  WHERE  ${tables.account.columns[5].name} = ?`,
          [id]
        )
        .then((res: any) => {
          let totalElements: number = res.values[0].VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .query(
              `select acc.*, sum(opv.debit) as debit, sum(opv.credit) as credit, sum(opv.debit) - sum(opv.credit)   as rbalance from 
              account acc left outer join operation_view opv on opv.${tables.account.columns[6].name} like acc.${tables.account.columns[6].name} || '%' and opv.${tables.transaction.columns[2].name} >= ? and opv.${tables.transaction.columns[2].name} <= ?
              where acc.${tables.account.columns[5].name} = ?  group by (acc.${tables.account.columns[0].name}) 
              ORDER BY acc.${tables.account.columns[2].name} DESC LIMIT ?  OFFSET ?;`,
              [
                format(startDate, 'yyyy-MM-dd HH:mm:ss'),
                format(endDate, 'yyyy-MM-dd HH:mm:ss'),
                id,
                paging.limit,
                offset,
              ]
            )
            .then((res: any) => {
              resolve({
                data: this.constructAccountArray(res),
                currentPage: paging.page,
                totalPage: totalPage,
              });
            })
            .catch((err: any) => reject(err));
        })
        .catch((err: any) => reject(err));
    });
  }

  async getResumeOfAccountById(id: number): Promise<AccountResume> {
    return new Promise<AccountResume>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `select count(op.id) as sons from operation op where op.id_account = ?`,
          [id]
        )
        .then((res: any) => {
          if (res.values.length >= 1) {
            resolve({
              sons: res.values[0].sons ? res.values[0].sons : 0,
            });
          } else {
            resolve({ sons: 0 });
          }
        })
        .catch((err: any) =>
          printError('erreur durant excecusion de la requete', reject, err)
        );
    });
  }

  async findAccountByTextSerach(
    text: string,
    withoutOp: boolean
  ): Promise<Account[]> {
    await this.checkDataBaseOpened();
    return new Promise<Account[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .query(
            `select acc.*, count(op.id)  from ${
              tables.account.name
            } acc left join operation op on op.id_account = acc.id  where  UPPER(${
              tables.account.columns[1].name
            }) like ? or  UPPER(${
              tables.account.columns[6].name
            }) like ? group by acc.id ${
              withoutOp ? ' having count(op.id) = 0' : ''
            }`,
            [text, text]
          )
          .then((res: any) => {
            if (res.values.length > 0) {
              resolve(this.constructAccountArray(res));
            } else {
              resolve([]);
            }
          })
          .catch((err: any) => {
            reject('coucou');
            console.error(err);
          });
      } else {
        reject('pas de connection a l abd');
      }
    });
  }

  async finAccountOnSearchingText(
    val: string,
    paging: PagingRequest
  ): Promise<PagingData<Account>> {
    return new Promise<PagingData<Account>>((resolve, reject) => {
      this.sqLiteObject
        .query(
          `SELECT COUNT (*) AS VAL FROM ${tables.account.name}  WHERE  ${tables.account.columns[1].name} like ? or ${tables.account.columns[6].name} like ?`,
          [`%${val}%`, `%${val}%`]
        )
        .then((res: any) => {
          let totalElements: number = res.values[0].VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .query(
              `SELECT *  FROM ${tables.account.name}  WHERE  ${tables.account.columns[1].name} like ? or ${tables.account.columns[6].name} like ? 
              ORDER BY ${tables.account.columns[2].name} DESC LIMIT ?  OFFSET ?;`,
              [`%${val}%`, `%${val}%`, paging.limit, offset]
            )
            .then((res: any) => {
              resolve({
                data: this.constructAccountArray(res),
                currentPage: paging.page,
                totalPage: totalPage,
              });
            })
            .catch((err: any) => reject(err));
        })
        .catch((err: any) => reject(err));
    });
  }

  async updateBalanceById(balance: number, accountId: number): Promise<void> {
    await this.checkDataBaseOpened();
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.query(
          `UPDATE  ${tables.account.name} SET 
          ${tables.account.columns[2].name} = ? WHERE ${tables.account.columns[0].name} = ?`,
          [balance, accountId]
        );
        resolve();
      } catch (error) {
        reject('erreur dans la bd');
        console.error(error);
      }
    });
  }

  async resetAllBalanceTo(balance: number): Promise<void> {
    await this.checkDataBaseOpened();

    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.query(
          `UPDATE ${tables.account.name}  SET ${tables.account.columns[2].name} = ?`,
          [balance]
        );
        resolve();
      } catch (error) {
        reject('erreur dans la bd');
        console.error(error);
      }
    });
  }

  async getAccountLimits(idAccount: number): Promise<AccountLimit[]> {
    await this.checkDataBaseOpened();
    return new Promise<AccountLimit[]>(async (resolve, reject) => {
      try {
        const data = await this.sqLiteObject.query(
          `SELECT * FROM ${tables.limites.name} WHERE ${tables.limites.columns[1].name} =  ? ORDER BY ${tables.limites.columns[0].name} DESC ;`,
          [idAccount]
        );
        const limits: AccountLimit[] = [];
        if (data.values.length >= 1) {
          for (let i = 0; i < data.values.length; i++) {
            let accountLimit: AccountLimit = {
              id: data.values[i].ID,
              accountId: data.values[i].ACCOUNT_ID,
              max: data.values[i].MAX,
              min: data.values[i].MIN,
              period: data.values[i].PERIOD,
            };
            limits.push(accountLimit);
          }
        }
        resolve(limits);
      } catch (error) {
        reject(error);
      }
    });
  }

  async findAllLeafChildAccounst(path: string): Promise<Account[]> {
    await this.checkDataBaseOpened();
    return new Promise<Account[]>(async (resolve, reject) => {
      try {
        const data = await this.sqLiteObject.query(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[6].name} LIKE ? AND ${tables.account.columns[6].name}  = 1`,
          ['%' + path + '%']
        );

        resolve(this.constructAccountArray(data));
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteAccountLimitById(id: number): Promise<void> {
    new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.query(
          `DELETE FROM ${tables.limites.name} WHERE  ${tables.account.columns[0].name} =  ?`,
          [id]
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private constructAccountArray(data: any): Account[] {
    let accounts: Account[] = [];

    for (let i = 0; i < data.values.length; i++) {
      accounts.push(this.performeAccountRowIndex(data, i));
    }

    return accounts;
  }

  private performeAccountRowIndex(data: any, i: number): Account {
    return {
      id: data.values[i].ID,
      acountName: data.values[i].ACCOUNT_NAME,
      totalAccount: data.values[i].BALANCE,
      isMain: data.values[i].IS_MAIN > 0,
      type: data.values[i].TYPE,
      parentId: data.values[i].PARENT_ID,
      path: data.values[i].PATH,
      isLeaf: data.values[i].IS_LEAF > 0,
      resume: { debit: 0, credit: 0, sons: 0 },
      debit: data.values[i].debit,
      credit: data.values[i].credit,
      rbalance: data.values[i].rbalance,
    };
  }
}
