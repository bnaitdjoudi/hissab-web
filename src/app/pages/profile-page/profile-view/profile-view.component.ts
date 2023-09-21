import { Component } from '@angular/core';
import { AlertInput } from '@ionic/core';
import { ProfileModel } from 'src/app/model/profil.model';
import { ProfileStore } from '../profile.store';
import { Router } from '@angular/router';

type Edittype = 'mail' | 'firstName' | 'lastName' | 'phone' | 'pwd';
type ArrayMap = { [key: string]: any };

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent {
  value: any;
  editType: Edittype;

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
          this.submit();
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

  constructor(readonly profileStore: ProfileStore, private router: Router) {
    this.profileStore.profile$.subscribe((profile) => {
      this.profil = profile;
    });

    this.arrayMap['mail'] = 'Email';
    this.arrayMap['firstName'] = 'Last name';
    this.arrayMap['lastName'] = 'First name';
    this.arrayMap['phone'] = 'Phone';
    this.arrayMap['pwd'] = 'Password';
  }

  ngOnInit() {}

  edit(type: Edittype) {
    this.editType = type;
    this.alertInputs = [
      {
        name: type,
        value: type !== 'pwd' ? this.profil[type] : '',
        type: type === 'pwd' ? 'password' : 'text',
        placeholder: this.arrayMap[type],
        handler: (input) => {
          console.log(input.value);
        },
      },
    ];
    this.alertInputs =
      type === 'pwd'
        ? [
            ...this.alertInputs,
            {
              type: 'password',
              placeholder: 'confirmation',
            },
          ]
        : [...this.alertInputs];
    this.isEdeting = true;
  }

  async submit() {
    try {
      await this.profileStore.updateProfile(this.profil);
    } catch (error) {
      console.error(error);
    }
  }
}
