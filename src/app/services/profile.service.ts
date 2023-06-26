import { Injectable } from '@angular/core';
import { ProfileDataBase } from './databases/profile.db';
import { ProfileModel } from '../model/profil.model';
import { resolve } from 'cypress/types/bluebird';

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
}
