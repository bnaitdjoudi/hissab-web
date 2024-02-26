import { Injectable } from '@angular/core';

import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
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
import { Patchquery } from 'src/app/model/patch.model';

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
  sqliteCapacitor: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  constructor(
    private readonly platform: Platform,
    private readonly sqliteporter: SQLitePorter,
    private readonly initService: InitService
  ) {
    this.createDataBase();
  }

  private createDataBase() {
    console.log('createDataBase', new Date());
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
    await this.sqLiteObject.query(CREATE_NOTIFICATION_TABLE, []);
    console.info('NOTIFICATION CREATED');
  }
  async initInitRappel() {
    console.info('CREATE RAPPEL TABLE');
    await this.sqLiteObject.query(CREATE_RAPPEL_TABLE, []);
    console.info('RAPPEL CREATED');
  }

  async initPatchData() {
    console.info('CREATE PATCH TABLE');
    this.sqLiteObject
      .query(CREATE_PATCH_TABLE, [])
      .then((res: any) => {
        console.info('PATCH TABLE CREATED');
      })
      .catch((error: any) => alert(JSON.stringify(error)));
  }
  initAuthTable() {
    console.info('CREATE PROFILES TABLE');
    this.sqLiteObject.query(CREATE_AUTH_TABLE, []).then((res: any) => {
      console.info('AUTH TABLE CREATED');
    });
  }
  initProfilesTable() {
    console.info('CREATE PROFILES TABLE');
    this.sqLiteObject.query(CREATE_PROFILES_TABLE, []).then((res: any) => {
      console.info('PROFILES TABLE CREATED');
    });
  }

  private async initInitFlag() {
    return new Promise<void>((resolve, reject) => {
      console.info('INSERT FLAGS');

      this.sqLiteObject
        .query(
          'INSERT INTO FLAGS (FLAG_NAME, IS_FLAG_SETTED) values (?, ?), (?,?)',
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
    console.log('CONSTRUCt FLAG');
    return new Promise<boolean>((resolve, reject) => {
      this.sqLiteObject
        .execute(CREATE_FLAGS)
        .then((res: any) => {
          this.sqLiteObject
            .query(
              'SELECT * FROM FLAGS WHERE FLAG_NAME = ? AND IS_FLAG_SETTED = ?',
              ['DATA_ACCOUNT_SETTED', 1]
            )
            .then(async (res: any) => {
              resolve(res.values.length === 0);
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
    this.openDatabase(this.DATABASE, false, 'no-encryption', 1.1, false)
      .then(async (db: SQLiteDBConnection) => {
        this.sqLiteObject = db;
        DataBaseService.sqlStaticValue = db;
        await this.sqLiteObject.open();

        this.initAll();
      })
      .catch((e: any) => console.error(e));
  }

  private async createAccountTables(): Promise<void> {
    console.log('creation table ACCOUNT');

    return new Promise<void>((resolve, reject) => {
      this.sqLiteObject
        .query(CREATE_ACCOUNT_TABLE, [])
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
        .query(CREATE_TRANSACTION_TABLE, [])
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
        .query(CREATE_TRANSACTION_VIEW, [])
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
          .query(INSERT_INITIAL_ACCOUNT_DATA, [])
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
        .query('SELECT * FROM ACCOUNT WHERE ACCOUNT_NAME = ?', [
          INITIAL_ACCOUNT_DATA[0].acountName,
        ])
        .then((data: any) => {
          if (data.values.length === 0 && !this.isInserting) {
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
    return new Promise<any>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        resolve(this.sqLiteObject);
      } else {
        if (DataBaseService.sqlStaticValue) {
          this.sqLiteObject = DataBaseService.sqlStaticValue;
        } else {
          console.log('ddddd');

          this.sqLiteObject = await this.openDatabase(
            this.DATABASE,
            false,
            'no-encryption',
            1.1,
            false
          );
        }

        resolve(this.sqLiteObject);
      }
    });
  }

  /*console.info('OPEN SQLITE DATABASEfdgsdffg');
    if (this.platform.is('capacitor')) {
      console.info('OPEN SQLITE DATABASE');

      return this.sqlite.create({ name: this.DATABASE, location: 'default' });
    } else {
      return new Promise<any>((resolve, reject) => {
        this.createDataBaseWebSql();
        resolve(this.sqLiteObject);
      });
    }
  }*/

  async runPatchquery(query: Patchquery): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const res = await this.runSqlquery(
          `SELECT * FROM PATCH_SQL WHERE ${tables.patchquery.columns[0].name} = '${query.codePatch}';`
        );
        if (res.values.length > 0) {
          console.log('NOT RUN :' + query.codePatch);
          resolve(false);
        } else {
          console.log('RUN :' + query.codePatch);
          await this.runSqlquery(query.query);
          resolve(true);
        }
      } catch (error) {
        resolve(false);
        console.log('ERROR :' + JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    });
  }

  async runSqlquery(query: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.runSqlquerySecure(query)
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
          this.runSqlquerySecure(query)
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
  runSqlquerySecure(query: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const queries = query.split(';');
      try {
        for (let q in queries) {
          console.log('run sql:', q);
          await this.sqLiteObject.query(q, []);
        }

        resolve('done!');
      } catch (error) {
        reject(error);
      }
    });
  }

  async openDatabase(
    dbName: string,
    encrypted: boolean,
    mode: string,
    version: number,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteCapacitor.checkConnectionsConsistency())
      .result;
    let isConn = (await this.sqliteCapacitor.isConnection(dbName, readonly))
      .result;
    if (retCC && isConn) {
      db = await this.sqliteCapacitor.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteCapacitor.createConnection(
        dbName,
        encrypted,
        mode,
        version,
        readonly
      );
    }
    await db.open();
    return db;
  }
}
