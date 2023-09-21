import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/model/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { MainStore } from 'src/app/store/main.store';
import { Store } from 'src/app/store/store';
import * as CryptoJS from 'crypto-js';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { CONSTANTS } from 'src/app/shared/constants';

export interface SignUpModel {
  isSignedUp: 'signedup' | 'notsignedup' | undefined;
  isSignedIn?: 'signedin' | 'notsignedin' | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class SignUpPageStore extends Store<SignUpModel> {
  private key: string = 'izane';

  constructor(
    readonly mainStore: MainStore,
    readonly router: Router,
    readonly profileService: ProfileService,
    readonly authService: AuthService,
    readonly sessionStoreService: SessionStorageService
  ) {
    super({ isSignedIn: undefined, isSignedUp: undefined });

    this.mainStore.flags$.subscribe((flagsMap) => {
      if (flagsMap.size > 0) {
        this.setState({
          ...this.state,
          isSignedUp: flagsMap.has('PROFIL_SIGNED_UP')
            ? 'signedup'
            : 'notsignedup',
          isSignedIn: this.mainStore.state.iSignedin
            ? 'signedin'
            : 'notsignedin',
        });
      } else {
        this.setState({
          ...this.state,
          isSignedUp: undefined,
        });
      }
    });
  }

  signupPage() {
    this.router.navigate(['signup-page/signup'], { replaceUrl: true });
  }

  signinPage() {
    this.router.navigate(['signup-page/signin'], { replaceUrl: true });
  }

  async signUp(params: any) {
    try {
      console.log('izane');
      await this.profileService.creationProfile({
        mail: params.emailFormCtrl,
        phone: params.telFormCtrl,
        firstName: params.firstNameFormCtrl,
        lastName: params.lastNameFormCtrl,
        isAdmin: true,
      });
      await this.authService.createAuth({
        email: params.emailFormCtrl,
        password: params.passwordFormCtrl,
      } as AuthModel);
      await this.mainStore.setSignedUpFlag();
      this.router.navigate(['signup-page', { replaceUrl: true }]);
    } catch (error) {
      console.error(error);
    }
  }

  async signIn(params: any) {
    try {
      const isLogged = await this.authService.isLogginSuccess({
        email: params.emailFormCtrl,
        hashed: false,
        password: params.passwordFormCtrl,
      });

      const profiles = await this.profileService.findAllProfiles();
      const profile = profiles.find((el) => el.mail === params.emailFormCtrl);

      if (profile) {
        console.log(JSON.stringify(profile));
        this.mainStore.currentProfile(profile);
      } else {
        console.log('profile not found');
      }

      console.log('is logged' + isLogged);

      this.setSignedin();
      const encrypted = this.encrypt(
        JSON.stringify({
          login: params.emailFormCtrl,
          pwd: params.passwordFormCtrl,
        })
      );

      const d = new Date();
      let ms = d.getTime();
      ms = ms + 30 * 60 * 1000;

      this.sessionStoreService.saveData(CONSTANTS.LOCAL_TOKEN_ID, encrypted);
      this.sessionStoreService.saveData(CONSTANTS.LOCAL_TOKEN_END, '' + ms);
      this.router.navigate([''], { replaceUrl: true });
    } catch (error) {
      console.error(error);
    }
  }
  private setSignedin() {
    this.setState({ ...this.state, isSignedIn: 'signedin' });
    this.mainStore.setSignedIn(true);
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }
  decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }

  async checkIsSignedIn(): Promise<boolean> {
    let ms = await this.sessionStoreService.getData(CONSTANTS.LOCAL_TOKEN_END);

    const msn = ms ? +ms : 0;

    const mst = new Date().getTime();

    console.log(msn + '|' + mst);

    if (msn > mst) {
      let ms = mst + 30 * 60 * 1000;
      this.sessionStoreService.saveData(CONSTANTS.LOCAL_TOKEN_END, '' + ms);
      this.mainStore.setSignedIn(true);

      const token = await this.sessionStoreService.getData(
        CONSTANTS.LOCAL_TOKEN_ID
      );
      const decodedToken = this.decrypt(token);
      let credential = JSON.parse(decodedToken);
      console.log(credential.login);
      return true;
    }

    this.mainStore.setSignedIn(false);
    return false;
  }
}
