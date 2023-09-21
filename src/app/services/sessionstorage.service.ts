import { Injectable } from '@angular/core';
import { CONSTANTS } from '../shared/constants';
import { Storage } from '@ionic/storage-angular';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private key: string = 'izane';

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }
  public saveData(key: string, value: string) {
    this._storage?.set(key, value);
  }
  public async getData(key: string) {
    return await this._storage?.get(key);
  }
  public removeData(key: string) {
    this._storage?.remove(key);
  }
  public async clearData() {
    await this._storage?.clear();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async checkIsSignedIn(): Promise<boolean> {
    console.warn('getData:::' + this._storage);

    const storage = await this.storage.create();
    this._storage = storage;
    let ms = await this.getData(CONSTANTS.LOCAL_TOKEN_END);
    console.warn('Ms:::' + JSON.stringify(ms));
    const msn = ms ? +ms : 0;

    const mst = new Date().getTime();

    if (msn > mst) {
      let ms = mst + 30 * 60 * 1000;
      this.saveData(CONSTANTS.LOCAL_TOKEN_END, '' + ms);

      return true;
    }

    return false;
  }

  async getSessionInfos(): Promise<String> {
    return new Promise<String>(async (resolve, reject) => {
      try {
        await this.init();
        let token = await this.getData(CONSTANTS.LOCAL_TOKEN_ID);
        if (token) {
          resolve(JSON.parse(this.decrypt(token)).login);
        } else {
          reject('no session started');
        }
      } catch (error) {
        reject('error in getting session store');
        console.error(error);
      }
    });
  }

  decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }
}
