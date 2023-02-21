import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { browserDBInstance } from './browser';
import {
  CREATE_ACCOUNT_TABLE,
  CREATE_TRANSACTION_TABLE,
  INITIAL_ACCOUNT_DATA,
  INSERT_INITIAL_ACCOUNT_DATA,
} from './tables';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

declare var window: any;

@Injectable()
export class DataBaseService {
  sqLiteObject: any;

  constructor(
    private readonly sqlite: SQLite,
    private readonly platform: Platform,
    private readonly sqliteporter: SQLitePorter
  ) {
    this.createDataBase();
  }

  private createDataBase() {
    if (this.platform.is('capacitor')) {
      this.createDataBaseSqlite();
    } else {
      this.createDataBaseWebSql(true);
    }
  }

  private createDataBaseWebSql(init: boolean) {
    let db = window.openDatabase('data4.db', '1.0', 'DEV', -1);
    this.sqLiteObject = browserDBInstance(db);
    if (init) {
      this.createAccountTables();
      this.createInitialAccounts();
      this.createTransactionTables();
    }
  }
  /**
   * create Data base
   */
  private createDataBaseSqlite() {
    this.sqlite
      .create({
        name: 'data4.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.sqLiteObject = db;

        this.createAccountTables();
        this.createInitialAccounts();
        this.createTransactionTables();
      })
      .catch((e) => console.log('erreur llllllllllll' + e));
  }

  private createAccountTables() {
    console.log('creation table ACCOUNT');
    this.sqLiteObject
      .executeSql(CREATE_ACCOUNT_TABLE)
      .then(() => {
        console.log('la table ACCOUNT a etais créee');
      })
      .catch((e: any) =>
        console.log(
          'la table ACCOUNT n a pas pus etre crée' + JSON.stringify(e)
        )
      );
  }

  private createTransactionTables() {
    console.log('creation table ACCOUNT');
    this.sqLiteObject
      .executeSql(CREATE_TRANSACTION_TABLE)
      .then(() => {
        console.log('la table TRANSACTION a etais créee');
      })
      .catch((e: any) =>
        console.log(
          'la table TRANSACTION n a pas pus etre crée' + JSON.stringify(e)
        )
      );
  }

  private insertFromSQL(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.platform.is('android')) {
        this.sqliteporter
          .importSqlToDb(this.sqLiteObject, INSERT_INITIAL_ACCOUNT_DATA)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => reject(err));
      } else {
        this.sqLiteObject
          .executeSql(INSERT_INITIAL_ACCOUNT_DATA, [])
          .then((res: any) => {
            resolve(res);
          })
          .catch((e: any) => reject(e));
      }
    });
  }

  private createInitialAccounts() {
    console.log('check inital data');
    this.sqLiteObject
      .executeSql('SELECT * FROM ACCOUNT WHERE ACCOUNT_NAME = ?', [
        INITIAL_ACCOUNT_DATA[0].acountName,
      ])
      .then((data: any) => {
        console.log('Account created:ffff::' + JSON.stringify(data));
        if (data.rows.length === 0) {
          this.insertFromSQL()
            .then((res) => {
              console.log('data account inserted');
            })
            .catch((err) => console.error(err));
        } else {
          console.log('Initial Account data is already sets');
        }
      })
      .catch((e: any) => console.log('fddfdf' + JSON.stringify(e)));
  }

  async openSQLObject(): Promise<any> {
    if (this.sqLiteObject) {
      return new Promise<any>((resolve, reject) => {
        console.log('ddddd');
        resolve(this.sqLiteObject);
      });
    }

    if (this.platform.is('android')) {
      return this.sqlite.create({ name: 'data4.db', location: 'default' });
    } else {
      return new Promise<any>((resolve, reject) => {
        this.createDataBaseWebSql(false);
        resolve(this.sqLiteObject);
      });
    }
  }
}
