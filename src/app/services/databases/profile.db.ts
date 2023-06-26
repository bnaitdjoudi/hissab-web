import { ProfileModel } from 'src/app/model/profil.model';
import { GenericDb } from './GenericDb';
import { GenericDataBase } from './generic.db';
import { DataBaseService } from './database.service';
import { Injectable } from '@angular/core';
import { tables } from './tables';

@Injectable()
export class ProfileDataBase
  extends GenericDb
  implements GenericDataBase<ProfileModel, string>
{
  constructor(dataBase: DataBaseService) {
    super(dataBase);
  }

  async create(model: ProfileModel): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          await this.sqLiteObject.executeSql(
            `INSERT INTO ${tables.profiles.name} (${tables.profiles.columns.map(
              (el) => el.name
            )}) VALUES (?,?,?,?, ?)`,
            [
              model.mail,
              model.firstName,
              model.lastName,
              model.phone,
              model.isAdmin ? 1 : 0,
            ]
          );
          resolve('created');
        } catch (error) {
          reject('error dans la requette d insertion');
          console.log(error);
        }
      } else {
        reject('no bd connexion');
      }
    });
  }
  update(model: ProfileModel, id: string): Promise<ProfileModel> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<ProfileModel> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<ProfileModel[]> {
    throw new Error('Method not implemented.');
  }
  deleteById(ids: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
