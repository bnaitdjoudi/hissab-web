import { Component, OnInit } from '@angular/core';
import { SignUpPageStore } from '../signup-page.store';

@Component({
  selector: 'app-load',
  templateUrl: './sign-up.load.page.html',
  styleUrls: ['./sign-up.load.page.scss'],
})
export class SignupLoadPage implements OnInit {
  constructor(readonly signUpPageStore: SignUpPageStore) {}

  ngOnInit() {
    this.signUpPageStore.observable.subscribe((value) => {
      if (value.isSignedUp === 'signedup') {
        if (value.isSignedIn === 'signedin') {
          console.log('redirect to dashboard');
        } else {
          if (value.isSignedIn === 'notsignedin') {
            this.signUpPageStore.signinPage();
          }
        }
      } else {
        if (value.isSignedUp === 'notsignedup') {
          this.signUpPageStore.signupPage();
        }
      }
    });
  }
}
