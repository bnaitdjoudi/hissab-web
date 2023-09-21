import { Component, OnInit } from '@angular/core';
import { AlertInput } from '@ionic/core';
import { ProfileModel } from 'src/app/model/profil.model';
import { ProfileStore } from './profile.store';
import { Router } from '@angular/router';

type Edittype = 'mail' | 'firstName' | 'lastName' | 'phone' | 'pwd';
type ArrayMap = { [key: string]: any };

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(readonly router: Router) {}

  ngOnInit(): void {}

  goToHome() {
    this.router.navigate(['/']);
  }
  addPersonne() {
    this.router.navigate(['profile/new']);
  }
}
