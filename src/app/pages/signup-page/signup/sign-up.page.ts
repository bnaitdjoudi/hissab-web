import { Component, OnInit, ViewChild } from '@angular/core';
import { SignUpPageStore } from '../signup-page.store';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

interface ProfileForm {
  [key: string]: any;
}

@Component({
  selector: 'app-load',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignupPage implements OnInit {
  profilForm: FormGroup;

  @ViewChild('stepper')
  stepper: MatStepper | undefined;

  backDisabled: boolean = true;
  profileForm: ProfileForm = {};
  constructor(
    readonly signUpPageStore: SignUpPageStore,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit() {
    this.profilForm = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          firstNameFormCtrl: ['', Validators.required],
          lastNameFormCtrl: ['', Validators.required],
          telFormCtrl: ['', Validators.required],
          emailFormCtrl: ['', [Validators.email, Validators.required]],
          passwordFormCtrl: [
            '',
            [Validators.required, Validators.minLength(6)],
          ],
        }),
        this.fb.group({
          dataFormSample: ['non', Validators.required],
        }),
      ]),
    });

    this.profilForm.valueChanges.subscribe((val) => {
      this.profileForm['firstNameFormCtrl'] =
        val.formArray[0]['firstNameFormCtrl'];
      this.profileForm['lastNameFormCtrl'] =
        val.formArray[0]['lastNameFormCtrl'];
      this.profileForm['telFormCtrl'] = val.formArray[0]['telFormCtrl'];

      this.profileForm['emailFormCtrl'] = val.formArray[0]['emailFormCtrl'];
      this.profileForm['passwordFormCtrl'] =
        val.formArray[0]['passwordFormCtrl'];
      this.profileForm['dataFormSample'] = val.formArray[1]['dataFormSample'];
    });
  }

  get formArray(): AbstractControl | null {
    return this.profilForm.get('formArray');
  }

  back() {
    this.stepper?.previous();
    this.backDisabled = this.stepper?.selectedIndex === 0;
  }

  next() {
    if (this.stepper && this.stepper.selectedIndex < 1) {
      this.stepper.next();
      this.backDisabled = this.stepper.selectedIndex === 0;
    } else {
      this.submit();
    }
  }
  private submit() {
    this.signUpPageStore.signUp(this.profileForm);
  }
}
