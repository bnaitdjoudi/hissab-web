import { ProfileModel } from 'src/app/model/profil.model';
import { GenericDb } from './GenericDb';
import { GenericDataBase } from './generic.db';
import { DataBaseService } from './database.service';
import { Injectable } from '@angular/core';
import { tables } from './tables';

@Injectable({ providedIn: 'root' })
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
          await this.sqLiteObject.query(
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
  async update(model: ProfileModel, id: string): Promise<ProfileModel> {
    return new Promise<ProfileModel>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          await this.sqLiteObject.query(
            'UPDATE PROFIL SET FIRST_NAME = ? , LAST_NAME = ?, PHONE = ? WHERE mail = ?',
            [model.firstName, model.lastName, model.phone, id]
          );
        } catch (error) {
          reject('erreur dans execussion de la requette');
          console.error(error);
        }
      } else {
        reject('no bd connection on update profile');
      }
    });
  }
  async findById(id: string): Promise<ProfileModel> {
    await this.checkDataBaseOpened();
    return new Promise<ProfileModel>((resolve, reject) => {
      this.sqLiteObject
        .query('SELECT * FROM PROFIL WHERE MAIL = ?', [id])
        .then((data: any) => {
          if (data.values.length > 0) {
            resolve({
              mail: data.values[0].mail,
              firstName: data.values[0].FIRST_NAME,
              lastName: data.values[0].LAST_NAME,
              phone: data.values[0].PHONE,
              isAdmin: data.values[0].IS_ADMIN,
            });
          } else {
            reject('profile not found');
          }
        })
        .catch((error: any) => {
          reject('erreur dans la requete');
          console.error(error);
        });
    });
  }
  async findAll(): Promise<ProfileModel[]> {
    await this.checkDataBaseOpened();
    return new Promise<ProfileModel[]>(async (resolve, reject) => {
      if (this.sqLiteObject) {
        try {
          const data = await this.sqLiteObject.query(
            'SELECT * FROM PROFIL',
            []
          );
          const profiles: ProfileModel[] = [];
          if (data.values.length > 0) {
            for (let i = 0; i < data.values.length; i++) {
              profiles.push({
                mail: data.values[i].mail,
                firstName: data.values[i].FIRST_NAME,
                lastName: data.values[i].LAST_NAME,
                phone: data.values[i].PHONE,
                isAdmin: data.values[i].IS_ADMIN,
              });
            }
          }
          resolve(profiles);
        } catch (error) {
          reject("erreur durant l'execusion de la requette");
          console.error(error);
        }
      } else {
        reject('pas de connexion a cccc la bd');
      }
    });
  }
  deleteById(ids: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
