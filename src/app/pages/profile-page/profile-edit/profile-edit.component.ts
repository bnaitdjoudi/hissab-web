import { Component } from '@angular/core';
import { AlertInput } from '@ionic/core';
import { ProfileModel } from 'src/app/model/profil.model';
import { ProfileStore } from '../profile.store';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type Edittype = 'mail' | 'firstName' | 'lastName' | 'phone' | 'pwd';
type ArrayMap = { [key: string]: any };

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent {
  value: any;
  editType: Edittype;
  isUser: 'no' | 'yes' = 'no';
  password: string = '';

  profil: ProfileModel = {
    mail: '',
    firstName: '',
    lastName: '',
    phone: '',
    isAdmin: false,
  };

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: (value: any) => {
        console.log('canceled!');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: (value: any) => {
        if (this.editType && this.editType !== 'pwd') {
          this.profil[this.editType] = value[this.editType];
        }
      },
    },
  ];

  public alertInputs: AlertInput[] = [
    {
      placeholder: 'Name',
    },
  ];
  isEdeting: boolean;

  arrayMap: ArrayMap = {};

  profileForm: FormGroup;

  constructor(
    readonly profileStore: ProfileStore,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.arrayMap['mail'] = 'Email';
    this.arrayMap['firstName'] = 'Last name';
    this.arrayMap['lastName'] = 'First name';
    this.arrayMap['phone'] = 'Phone';
    this.arrayMap['pwd'] = 'Password';
  }

  ngOnInit() {
    this.profileForm = this._formBuilder.group({
      mail: [
        this.profil.mail,
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur',
        },
      ],
      firstName: [
        this.profil.firstName,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      lastName: [
        this.profil.lastName,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      phone: [this.profil.phone],
      isUser: [this.isUser],
    });

    this.profileForm.valueChanges.subscribe((val) => {
      Object.keys(val)
        .filter((k) => k !== 'isUser')
        .forEach((key) => {
          this.profil[key] = val[key];
          console.log(JSON.stringify(this.profil));
        });
    });
  }

  async onSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      try {
        await this.profileStore.createProfile(this.profil);
        this.router.navigate(['profile/']);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
