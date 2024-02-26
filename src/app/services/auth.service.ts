import { Injectable } from '@angular/core';
import { AuthModel } from '../model/auth.model';
import { AuthDataBase } from './databases/auth.db';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(readonly authDb: AuthDataBase) {}

  async createAuth(auth: AuthModel): Promise<any> {
    auth.password = await this.generateSHA256Hash(auth.password);
    return this.authDb.create(auth);
  }

  async isLogginSuccess(auth: AuthModel): Promise<boolean> {
    console.log('PASSWORD:', auth.password);
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let auths = await this.authDb.findByEmailAndPassword({
          ...auth,
          password: auth.hashed
            ? auth.password
            : await this.generateSHA256Hash(auth.password),
        });

        resolve(auths.length > 0);
      } catch (error) {
        reject('erreur dans lappelle a la bd');
        console.error(error);
      }
    });
  }

  async generateSHA256Hash(data: any): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    CryptoJS.SHA256(CryptoJS.enc.Hex.parse(data)).toString(CryptoJS.enc.Hex);
    const hashBuffer = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer.sigBytes));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    console.log('SHA-256 Hash:', hashHex);
    return hashHex;
  }
}
