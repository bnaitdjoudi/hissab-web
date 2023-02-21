import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { tables } from './tables';

@Injectable()
export class AccountDataBase implements GenericDataBase<Account, number> {
  sqLiteObject: SQLiteObject;

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

  async update(model: Account, id: number): Promise<Account> {
    if (this.sqLiteObject) {
      return this.privateUpdate(model, id);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateUpdate(model, id);
      })
      .catch((err) => err);
  }
  private async privateUpdate(model: Account, id: number): Promise<Account> {
    return this.sqLiteObject
      .executeSql(
        `UPDATE ${tables.account.name} SET ${tables.account.columns
          .filter((el) => el.name !== 'ID')
          .map((el) => el.name + ' = ?')} WHERE id = ?;`,
        [model.acountName, model.totalAccount, model.isMain, model.type, id]
      )
      .then(() => this.findById(id))
      .catch((err) => err);
  }

  //update ACCOUNT set type = 'actif' ,total_account = 0 where id =  1;

  async findAll(): Promise<Account[]> {
    return this.sqLiteObject
      .executeSql(`SELECT * FROM ${tables.account.name};`)
      .then((res) => res);
  }
  async findById(id: number): Promise<Account> {
    return new Promise((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[0].name} = ${id};`,
          []
        )
        .then((data) => {
          if (data.rows.length >= 1) {
            resolve(this.performeAccountRowIndex(data, 0));
          } else {
            reject('NOT FOUND');
          }
        })
        .catch((err) => {
          console.error(err);
          reject('erreur lors de linterogation de la bd');
        });
    });
  }

  async findByName(name: string): Promise<Account> {
    return this.sqLiteObject
      .executeSql(
        `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[1].name} = ${name};`
      )
      .then((res) => res);
  }

  async create(model: Account): Promise<any> {
    return this.sqLiteObject
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
      .then((res) => res)
      .catch((e) => {
        if (e.code === 6) {
          return 'account already exist';
        }

        return 'error on creating account:' + JSON.stringify(e);
      });
  }

  async getAccountsByType(arg0: string): Promise<Account[]> {
    return this.dataBase.openSQLObject().then((sqLiteObject) => {
      this.sqLiteObject = sqLiteObject;

      return this.sqLiteObject
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[4].name} = ?;`,
          [arg0]
        )
        .then((data) => {
          console.log('data:::::' + JSON.stringify(data.rows.item));
          if (data.rows.length >= 1) {
            this.constructAccountArray(data);
          }

          return [];
        });
    });
  }

  async getMainAccounts(): Promise<Account[]> {
    return this.dataBase.openSQLObject().then((sqLiteObject) => {
      this.sqLiteObject = sqLiteObject;

      return this.sqLiteObject
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[3].name} = ?;`,
          [1]
        )
        .then((data) => {
          console.log('data:::::' + JSON.stringify(data.rows.item));
          if (data.rows.length >= 1) {
            return this.constructAccountArray(data);
          }

          return [];
        });
    });
  }

  async findByIdAccountAndPaging(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Account>> {
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
  ): Promise<PagingData<Account>> {
    return this.sqLiteObject
      .executeSql(
        `SELECT COUNT (*) AS VAL FROM ${tables.account.name}  WHERE  ${tables.account.columns[5].name} = ?`,
        [id]
      )
      .then((res: any) => {
        let totalElements: number = res.rows.item(0).VAL;
        let offset: number = (paging.page - 1) * paging.limit;
        let totalPage: number = Math.ceil(totalElements / paging.limit);
        console.log('ddd:' + JSON.stringify(paging));
        return new Promise<PagingData<Account>>((resolve, reject) => {
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
        });
      })
      .catch((err: any) => err);
  }

  async deleteById(ids: number[]): Promise<void> {}

  async ajusteDiffByPath(paths: string[], diff: number): Promise<any> {
    if (this.sqLiteObject) {
      return this.privateAjusteDiffByPath(paths, diff);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateAjusteDiffByPath(paths, diff);
      })
      .catch((err) => err);
  }

  async privateAjusteDiffByPath(paths: string[], diff: number): Promise<any> {
    return this.sqLiteObject
      .executeSql(
        `UPDATE ${tables.account.name} SET ${
          tables.account.columns[2].name
        } = ${tables.account.columns[2].name} + ? WHERE ${
          tables.account.columns[6].name
        } IN (${paths.map((el) => "'" + el + "'").join(',')})`,
        [diff]
      )
      .then((res) => res)
      .catch((err) => err);
  }

  async findAllLeafExeptType(types: string[]): Promise<LeafAccount[]> {
    if (this.sqLiteObject) {
      return this.privateFindAllLeafExeptType(types);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateFindAllLeafExeptType(types);
      })
      .catch((err) => err);
  }

  private privateFindAllLeafExeptType(types: string[]): Promise<LeafAccount[]> {
    return new Promise<LeafAccount[]>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `SELECT ID, ACCOUNT_NAME, PATH, IS_LEAF FROM ACCOUNT  WHERE IS_LEAF = 1 AND TYPE NOT IN (${types
            .map((el) => `'${el}'`)
            .join(',')});`,
          []
        )
        .then((data) => {
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
        })
        .catch((err) => {
          reject("erreur dans l'appel a la base de données");
          console.error(err);
        });
    });
  }

  async findAllLeafExeptOneByIds(ids: number[]): Promise<LeafAccount[]> {
    if (this.sqLiteObject) {
      return this.privateFindAllLeafExeptOneByIds(ids);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateFindAllLeafExeptOneByIds(ids);
      })
      .catch((err) => err);
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
        .then((data) => {
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
        })
        .catch((err) => {
          reject("erreur dans l'appel a la base de données");
          console.error(err);
        });
    });
  }

  async finByPath(transfer: string): Promise<Account> {
    if (this.sqLiteObject) {
      return this.privateFinByPath(transfer);
    }

    return this.dataBase
      .openSQLObject()
      .then((sqLiteObject) => {
        this.sqLiteObject = sqLiteObject;
        return this.privateFinByPath(transfer);
      })
      .catch((err) => err);
  }
  private privateFinByPath(transfer: string): Promise<Account> {
    return new Promise<Account>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(
          `SELECT * FROM ${tables.account.name} WHERE ${tables.account.columns[6].name} LIKE ?`,
          [transfer]
        )
        .then((data) => {
          if (data.rows.length > 0) {
            resolve(this.performeAccountRowIndex(data, 0));
          } else {
            reject('no record found!!!');
          }
        })
        .catch((err) => {
          reject('erreur en appelant la bd');
          console.error(err);
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
