import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Platform } from '@ionic/angular';
import { browserDBInstance } from './browser';
import {
  CREATE_ACCOUNT_TABLE,
  CREATE_AUTH_TABLE,
  CREATE_FLAGS,
  CREATE_NOTIFICATION_TABLE,
  CREATE_PATCH_TABLE,
  CREATE_PROFILES_TABLE,
  CREATE_RAPPEL_TABLE,
  CREATE_TRANSACTION_TABLE,
  CREATE_TRANSACTION_VIEW,
  INITIAL_ACCOUNT_DATA,
  INSERT_INITIAL_ACCOUNT_DATA,
  tables,
} from './tables';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { InjectDbTestService } from './injectDbTest.service';
import { BehaviorSubject } from 'rxjs';
import { printError } from '../../tools/errorTools';
import { InitService } from '../init.service';
import { PatchQuery } from 'src/app/model/patch.model';

declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  sqLiteObject: any;
  static sqlStaticValue: any;

  DATABASE: string = 'data6.db';
  DATABASE_V: string = '1.1';
  DDD: string = 'yes';
  isInserting: boolean = false;

  constructor(
    private readonly sqlite: SQLite,
    private readonly platform: Platform,
    private readonly sqliteporter: SQLitePorter,
    private readonly initService: InitService
  ) {
    this.createDataBase();
  }

  private createDataBase() {
    if (this.platform.is('capacitor')) {
      this.createDataBaseSqlite();
    } else {
      this.createDataBaseWebSql();
    }
  }

  private async createDataBaseWebSql() {
    console.info('CREATE WEBSQL DATABASE');
    let db = window.openDatabase(this.DATABASE, this.DATABASE_V, 'DEV', -1);
    this.sqLiteObject = browserDBInstance(db);
    DataBaseService.sqlStaticValue = this.sqLiteObject;
    this.initAll();
  }

  private initAll() {
    this.createFlagsTables().then(async (notsetted) => {
      console.log(' FLAG VALUE:' + notsetted);
      if (notsetted) {
        await this.createAccountTables();
        await this.createTransactionTables();
        await this.createTransactionView();
        await this.initProfilesTable();
        await this.initAuthTable();
        await this.initPatchData();
        await this.initInitFlag();
        await this.initInitRappel();
        await this.initInitNotification();
      }
      this.initService.initialisationSubject.next(true);
    });
  }
  async initInitNotification() {
    console.info('CREATE NOTIFICATION TABLE');
    await this.sqLiteObject.executeSql(CREATE_NOTIFICATION_TABLE, []);
    console.info('NOTIFICATION CREATED');
  }
  async initInitRappel() {
    console.info('CREATE RAPPEL TABLE');
    await this.sqLiteObject.executeSql(CREATE_RAPPEL_TABLE, []);
    console.info('RAPPEL CREATED');
  }

  async initPatchData() {
    console.info('CREATE PATCH TABLE');
    this.sqLiteObject
      .executeSql(CREATE_PATCH_TABLE, [])
      .then((res: any) => {
        console.info('PATCH TABLE CREATED');
      })
      .catch((error: any) => alert(JSON.stringify(error)));
  }
  initAuthTable() {
    console.info('CREATE PROFILES TABLE');
    this.sqLiteObject.executeSql(CREATE_AUTH_TABLE, []).then((res: any) => {
      console.info('AUTH TABLE CREATED');
    });
  }
  initProfilesTable() {
    console.info('CREATE PROFILES TABLE');
    this.sqLiteObject.executeSql(CREATE_PROFILES_TABLE, []).then((res: any) => {
      console.info('PROFILES TABLE CREATED');
    });
  }

  private async initInitFlag() {
    return new Promise<void>((resolve, reject) => {
      console.info('INSERT FLAGS');
      this.sqLiteObject
        .executeSql(
          'INSERT INTO FLAGS (FLAG_NAME, IS_FLAG_SETTED) values (?, ?)',
          ['DATA_ACCOUNT_SETTED', 1]
        )
        .then(() => {
          resolve();
        })
        .catch((er: any) => {
          console.error(er);
        });
    });
  }
  private async createFlagsTables(): Promise<boolean> {
    console.log('CONSTRUC FLAG');
    return new Promise<boolean>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(CREATE_FLAGS, [])
        .then((res: any) => {
          this.sqLiteObject
            .executeSql(
              'SELECT * FROM FLAGS WHERE FLAG_NAME = ? AND IS_FLAG_SETTED = ?',
              ['DATA_ACCOUNT_SETTED', 1]
            )
            .then(async (res: any) => {
              resolve(res.rows.length === 0);
            })
            .catch((err: any) => {
              printError('error dans SELECT FLAGS:', reject, err);
            });
        })
        .catch((err: any) =>
          printError('erreur de creation de la table flag', reject, err)
        );
    });
  }
  /**
   * create Data base
   */
  private createDataBaseSqlite() {
    console.info('CREATE SQLITE DATABASE');
    this.sqlite
      .create({
        name: this.DATABASE,
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.sqLiteObject = db;
        DataBaseService.sqlStaticValue = db;
        this.initAll();
      })
      .catch((e: any) => console.error(e));
  }

  private async createAccountTables(): Promise<void> {
    console.log('creation table ACCOUNT');

    return new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(CREATE_ACCOUNT_TABLE, [])
        .then(async () => {
          try {
            await this.createInitialAccounts(undefined);
            let inject = new InjectDbTestService(this);
            await inject.processTestDb();
            resolve();
          } catch (error) {
            console.error(error);
            reject('erreur dans initialisation de account');
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    });
  }

  private async createTransactionTables() {
    console.log('creation table OPERATION');
    return new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(CREATE_TRANSACTION_TABLE, [])
        .then(() => {
          resolve();
        })
        .catch((e: any) => console.error(e));
    });
  }

  private async createTransactionView() {
    console.log('creation view OPERATION_VIEW');

    return new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(CREATE_TRANSACTION_VIEW, [])
        .then(() => {
          console.log('OPERATION_VIEW created');
          resolve();
        })
        .catch((e: any) => {
          console.error(e);
          resolve();
        });
    });
  }

  private insertFromSQL(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.platform.is('capacitor')) {
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

  async createInitialAccounts(
    subject: BehaviorSubject<void> | undefined
  ): Promise<void> {
    console.log('check inital data');
    new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .executeSql('SELECT * FROM ACCOUNT WHERE ACCOUNT_NAME = ?', [
          INITIAL_ACCOUNT_DATA[0].acountName,
        ])
        .then((data: any) => {
          if (data.rows.length === 0 && !this.isInserting) {
            this.isInserting = true;
            this.insertFromSQL()
              .then((res) => {
                console.log('data account inserted');
                resolve();
                this.isInserting = false;
              })
              .catch((err) => {
                reject(err);
                console.error(err);
                this.isInserting = false;
              });
          } else {
            console.log('Initial Account data is already sets');

            resolve();
          }
          subject?.next();
        })
        .catch((e: any) => console.log('fddfdf' + JSON.stringify(e)));
    });
  }

  async openSQLObject(): Promise<any> {
    if (this.sqLiteObject) {
      return new Promise<any>((resolve, reject) => {
        console.log('ddddd');
        resolve(this.sqLiteObject);
      });
    }
    console.info('OPEN SQLITE DATABASEfdgsdffg');
    if (this.platform.is('capacitor')) {
      console.info('OPEN SQLITE DATABASE');

      return this.sqlite.create({ name: this.DATABASE, location: 'default' });
    } else {
      return new Promise<any>((resolve, reject) => {
        this.createDataBaseWebSql();
        resolve(this.sqLiteObject);
      });
    }
  }

  async runPatchQuery(query: PatchQuery): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const res = await this.runSqlQuery(
          `SELECT * FROM PATCH_SQL WHERE ${tables.patchquery.columns[0].name} = '${query.codePatch}';`
        );
        if (res.rows.length > 0) {
          console.log('NOT RUN :' + query.codePatch);
          resolve(false);
        } else {
          console.log('RUN :' + query.codePatch);
          await this.runSqlQuery(query.query);
          resolve(true);
        }
      } catch (error) {
        resolve(false);
        console.log('ERROR :' + JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    });
  }

  async runSqlQuery(query: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.runSqlQuerySecure(query)
          .then((res) => {
            resolve(res);
          })
          .catch((error: Error) => {
            reject(error);
            console.log(JSON.stringify(error));
          });
      } else {
        this.openSQLObject().then((val: any) => {
          this.sqLiteObject = val;
          this.runSqlQuerySecure(query)
            .then((res) => {
              resolve(res);
            })
            .catch((error: Error) => {
              reject(error);
              console.log(JSON.stringify(error));
            });
        });
      }
    });
  }
  runSqlQuerySecure(query: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sqLiteObject
        .executeSql(query, [])
        .then((res: any) => resolve(res))
        .catch((error: any) => reject(error));
    });
  }
}
