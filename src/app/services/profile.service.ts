import { Injectable } from '@angular/core';
import { ProfileDataBase } from './databases/profile.db';
import { ProfileModel } from '../model/profil.model';

@Injectable()
export class ProfileService {
  constructor(readonly profileDb: ProfileDataBase) {}

  async creationProfile(profil: ProfileModel): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        await this.profileDb.create(profil);
        console.log('createddddd');
        resolve({});
      } catch (error) {
        reject('un proble durant la creation d un profile');
        console.error(error);
      }
    });
  }

  async findProfile(): Promise<ProfileModel> {
    return new Promise(async (resolve, reject) => {
      try {
        let profils = await this.profileDb.findAll();
        if (profils.length > 0) {
          resolve(profils[0]);
        } else {
          reject('no profile fouand');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async findProfileByMail(mail: string): Promise<ProfileModel> {
    return new Promise(async (resolve, reject) => {
      try {
        let profil = await this.profileDb.findById(mail);
        resolve(profil);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateProfile(profil: ProfileModel): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.profileDb.update(profil, profil.mail);
        resolve();
      } catch (error) {
        reject('erreur dans en appelant la bd');
        console.error(error);
      }
    });
  }

  async findAllProfiles(): Promise<ProfileModel[]> {
    return new Promise<ProfileModel[]>(async (resolve, reject) => {
      try {
        let profiles = await this.profileDb.findAll();
        resolve(profiles);
      } catch (error) {
        reject('erreur dans appel a repository');
        console.log(error);
      }
    });
  }
}
