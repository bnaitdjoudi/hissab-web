import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { printError } from '../../tools/errorTools';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { GenericDb } from './GenericDb';
import { tables } from './tables';

@Injectable()
export class AccountDataBase
  extends GenericDb
  implements GenericDataBase<Account, number>
{
  override sqLiteObject: any;
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
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
        .executeSql(
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
          .executeSql(`SELECT * FROM ${tables.account.name};`)
          .then((res: any) => resolve(this.constructAccountArray(res)))
          .catch((err: any) =>
            printError(
              "error l'ors de la recuperation des accounts",
              reject,
              err
            )
          );
      }
    });
  }
  async findById(id: number): Promise<Account> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      if (this.sqLiteObject) {
        this.sqLiteObject
          .executeSql(
            `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[0].name} = ${id};`,
            []
          )
          .then((data: any) => {
            if (data.rows.length >= 1) {
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
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[1].name} = ?;`,
          [name]
        )
        .then((res: any) => {
          if (res.rows.length > 0) {
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

  async create(model: Account): Promise<any> {
    await this.checkDataBaseOpened();
    return new Promise((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
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
        .then(() => resolve('succes!'))
        .catch((e: { code: number }) => {
          if (e.code === 6) {
            reject('account already exist');
          } else {
            printError('error on creating account:', reject, e);
          }
        });
    });
  }

  async getAccountsByType(arg0: string): Promise<Account[]> {
    await this.checkDataBaseOpened();
    return new Promise<Account[]>((resolve, reject) => {
      if (this.sqLiteObject !== undefined || this.sqLiteObject !== null) {
        this.sqLiteObject
          .executeSql(
            `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[4].name} = ?;`,
            [arg0]
          )
          .then((data: { rows: string | any[] }) => {
            if (data.rows.length >= 1) {
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
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[3].name} = ?;`,
          [1]
        )
        .then((data: { rows: string | any[] }) => {
          if (data.rows.length >= 1) {
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
        .executeSql(
          `SELECT COUNT (*) AS VAL FROM ${tables.account.name}  WHERE  ${tables.account.columns[5].name} = ?`,
          [id]
        )
        .then((res: any) => {
          let totalElements: number = res.rows.item(0).VAL;
          let offset: number = (paging.page - 1) * paging.limit;
          let totalPage: number = Math.ceil(totalElements / paging.limit);

          this.sqLiteObject
            .executeSql(
              `SELECT  *  FROM ${tables.account.name}  WHERE ${tables.account.columns[5].name} = ? ORDER BY ${tables.transaction.columns[0].name} DESC LIMIT ?  OFFSET ?;`,
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

  async deleteById(ids: number[]): Promise<void> {}

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
        .executeSql(
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
        .executeSql(
          `SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND TYPE NOT IN (${types
            .map((el) => `'${el}'`)
            .join(',')});`,
          []
        )
        .then(
          (data: {
            rows: {
              length: number;
              item: (arg0: number) => {
                (): any;
                new (): any;
                ID: any;
                ACCOUNT_NAME: any;
                PATH: any;
                IS_LEAF: number;
              };
            };
          }) => {
            let leafAccounts: LeafAccount[] = [];
            if (data.rows.length > 0) {
              for (let i = 0; i < data.rows.length; i++) {
                leafAccounts.push({
                  id: data.rows.item(i).ID,
                  acountName: data.rows.item(i).ACCOUNT_NAME,
                  path: data.rows.item(i).PATH,
                  isLeaf: data.rows.item(i).IS_LEAF > 0,
                });
              }
            }
            resolve(leafAccounts);
          }
        )
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
        .executeSql(
          `SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND ID NOT IN (${ids
            .map((el) => `'${el}'`)
            .join(',')});`,
          []
        )
        .then(
          (data: {
            rows: {
              length: number;
              item: (arg0: number) => {
                (): any;
                new (): any;
                ID: any;
                ACCOUNT_NAME: any;
                PATH: any;
                IS_LEAF: number;
              };
            };
          }) => {
            let leafAccounts: LeafAccount[] = [];
            if (data.rows.length > 0) {
              for (let i = 0; i < data.rows.length; i++) {
                leafAccounts.push({
                  id: data.rows.item(i).ID,
                  acountName: data.rows.item(i).ACCOUNT_NAME,
                  path: data.rows.item(i).PATH,
                  isLeaf: data.rows.item(i).IS_LEAF > 0,
                });
              }
            }
            resolve(leafAccounts);
          }
        )
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
    return new Promise<Account>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[6].name} LIKE ?`,
          [transfer]
        )
        .then((data: { rows: string | any[] }) => {
          if (data.rows.length > 0) {
            resolve(this.performeAccountRowIndex(data, 0));
          } else {
            reject('no record found!!!');
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  private constructAccountArray(data: any): Account[] {
    let accounts: Account[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      accounts.push(this.performeAccountRowIndex(data, i));
    }

    return accounts;
  }

  private performeAccountRowIndex(data: any, i: number): Account {
    return {
      id: data.rows.item(i).ID,
      acountName: data.rows.item(i).ACCOUNT_NAME,
      totalAccount: data.rows.item(i)[tables.account.columns[2].name],
      isMain: data.rows.item(i).IS_MAIN > 0,
      type: data.rows.item(i).TYPE,
      parentId: data.rows.item(i).PARENT_ID,
      path: data.rows.item(i).PATH,
      isLeaf: data.rows.item(i).IS_LEAF > 0,
    };
  }
}
