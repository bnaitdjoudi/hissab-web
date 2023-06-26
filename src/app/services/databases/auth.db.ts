import { AuthModel } from 'src/app/model/auth.model';
import { GenericDb } from './GenericDb';
import { DataBaseService } from './database.service';
import { GenericDataBase } from './generic.db';
import { resolve } from 'cypress/types/bluebird';
import { tables } from './tables';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthDataBase
  extends GenericDb
  implements GenericDataBase<AuthModel, string>
{
  constructor(dataBase: DataBaseService) {
    super(dataBase);
  }

  create(model: AuthModel): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          await this.sqLiteObject.executeSql(
            `INSERT INTO ${
              tables.authentication.name
            } (${tables.authentication.columns.map(
              (el) => el.name
            )}) VALUES (?,?, ?)`,
            [model.email, model.password, new Date()]
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

  update(model: AuthModel, id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<AuthModel[]> {
    throw new Error('Method not implemented.');
  }
  deleteById(ids: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findByEmailAndPassword(model: AuthModel): Promise<AuthModel[]> {
    return new Promise<any>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          const res = await this.sqLiteObject.executeSql(
            `SELECT * FROM ${tables.authentication.name} WHERE ${tables.authentication.columns[0].name} = ?
             AND ${tables.authentication.columns[1].name} = ? `,
            [model.email, model.password]
          );
          if (res.rows.length > 0) {
            let l = res.rows.length;
            const auths: AuthModel[] = [];

            for (let i = 0; i < l; i++) {
              auths.push({
                email: res.rows.item(i).mail,
                password: res.rows.item(i).password,
                hashed: true,
              });
            }

            resolve(auths);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject('error dans la requette authentification');
          console.log(error);
        }
      } else {
        reject('no bd connexion');
      }
    });
  }
}
