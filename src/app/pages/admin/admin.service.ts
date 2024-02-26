import { Injectable } from '@angular/core';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { Device } from '@capacitor/device';
@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(readonly sessionStorage: SessionStorageService) {}

  async getCurrentLang(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const lang = await this.sessionStorage.getData('lang');
        console.log('langgggg:::', lang);
        if (lang) {
          resolve(lang);
        } else {
          const deviceLang = (await Device.getLanguageCode()).value;
          await this.sessionStorage.saveData('lang', deviceLang.split('-')[0]);
          const lang = await this.sessionStorage.getData('lang');
          resolve(lang);
        }
      } catch (error) {}
    });
  }

  async setCurrentLang(lang: string): Promise<void> {
    await this.sessionStorage.saveData('lang', lang);
  }
}
