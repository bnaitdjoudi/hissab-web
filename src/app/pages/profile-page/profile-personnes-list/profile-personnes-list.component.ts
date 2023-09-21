import { Component, OnInit } from '@angular/core';
import { ProfileStore } from '../profile.store';
import { ProfileModel } from 'src/app/model/profil.model';

@Component({
  selector: 'profile-personnes-list',
  templateUrl: './profile-personnes-list.component.html',
  styleUrls: ['./profile-personnes-list.component.css'],
})
export class ProfilePersonnesListComponent implements OnInit {
  profiles: ProfileModel[] = [];

  constructor(readonly profileStore: ProfileStore) {}

  ngOnInit(): void {
    this.profileStore.profileList$.subscribe(
      (profiles) => (this.profiles = profiles)
    );
  }
}
