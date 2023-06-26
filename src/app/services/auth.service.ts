import { Injectable } from '@angular/core';
import { AuthModel } from '../model/auth.model';
import { AuthDataBase } from './databases/auth.db';

@Injectable()
export class AuthService {
  constructor(readonly authDb: AuthDataBase) {}

  async createAuth(auth: AuthModel): Promise<any> {
    auth.password = await this.generateSHA256Hash(auth.password);
    return this.authDb.create(auth);
  }

  async isLogginSuccess(auth: AuthModel): Promise<boolean> {
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
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    console.log('SHA-256 Hash:', hashHex);
    return hashHex;
  }
}
