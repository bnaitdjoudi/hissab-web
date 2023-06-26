import { Component, OnInit } from '@angular/core';
import { SignUpPageStore } from '../signup-page.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ProfileForm {
  [key: string]: any;
}

@Component({
  selector: 'signin',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  authForm: FormGroup;

  backDisabled: boolean = true;
  profileForm: ProfileForm = {};
  constructor(
    readonly signUpPageStore: SignUpPageStore,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authForm = this.fb.group({
      emailFormCtrl: ['', [Validators.email, Validators.required]],
      passwordFormCtrl: ['', [Validators.required]],
    });

    this.authForm.valueChanges.subscribe((val) => {
      this.profileForm['emailFormCtrl'] = val['emailFormCtrl'];
      this.profileForm['passwordFormCtrl'] = val['passwordFormCtrl'];
    });
  }

  submit() {
    this.signUpPageStore.signIn(this.profileForm);
  }
}
