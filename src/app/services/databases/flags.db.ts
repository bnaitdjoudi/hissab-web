import { Flag } from 'src/app/model/flags.model';
import { GenericDb } from './GenericDb';
import { GenericDataBase } from './generic.db';
import { DataBaseService } from './database.service';
import { tables } from './tables';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class FlagsDataBase
  extends GenericDb
  implements GenericDataBase<Flag, string>
{
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
  }
  create(model: Flag): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          await this.sqLiteObject.executeSql(
            `INSERT INTO ${tables.flags.name} (${tables.flags.columns.map(
              (el) => el.name
            )}) VALUES (?,?)`,
            [model.flagName, model.flagSetted ? 1 : 0]
          );
          resolve([]);
        } catch (error) {
          reject('error dans la requette d insertion');
          console.log(error);
        }
      } else {
        reject('no bd connexion');
      }
    });
  }
  update(model: Flag, id: string): Promise<Flag> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Flag> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Flag[]> {
    console.log('FLAGGGGGGGGGGGGGGG');
    return new Promise<Flag[]>((resolve, reject) => {
      if (this.sqLiteObject) {
        this.privateFindAll(resolve, reject);
      } else {
        this.dataBase.openSQLObject().then((sqLiteObject: any) => {
          this.sqLiteObject = sqLiteObject;
          this.privateFindAll(resolve, reject);
        });
      }
    });
  }

  private privateFindAll(resolve: any, reject: any) {
    this.sqLiteObject
      .executeSql(`SELECT * FROM ${tables.flags.name} `, [])
      .then((res: any) => {
        resolve(this.constructGlagArray(res));
      })
      .catch((e: any) => {
        reject('erreur dans lapel a la bd');
        console.error(e);
      });
  }
  deleteById(ids: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private constructGlagArray(data: any): Flag[] {
    let flags: Flag[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      flags.push(this.performOperationsRowIndex(data, i));
    }

    return flags;
  }

  private performOperationsRowIndex(data: any, i: number): Flag {
    return {
      flagName: data.rows.item(i).FLAG_NAME,
      flagSetted: data.rows.item(i).IS_FLAG_SETTED === 1,
    };
  }
}
