import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Router } from '@angular/router';
import { SignUpPageStore } from 'src/app/pages/signup-page/signup-page.store';
@Injectable()
export class AuthGuardService implements CanLoad {
  constructor(private signUpService: SignUpPageStore, private router: Router) {}
  canLoad(): boolean {
    if (this.signUpService.checkIsSignedIn()) {
      return true;
    }
    this.router.navigate(['signup-page']);
    return false;
  }
}
