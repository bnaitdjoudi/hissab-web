import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePagePageRoutingModule } from './profile-page-routing.module';

import { ProfilePage } from './profile.page';
import { MaterialModule } from 'src/app/material.module';
import { ProfileStore } from './profile.store';
import { ProfileService } from 'src/app/services/profile.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfilePersonnesListComponent } from './profile-personnes-list/profile-personnes-list.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ServicesModule } from 'src/app/services/services.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePagePageRoutingModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ServicesModule,
  ],
  declarations: [
    ProfilePage,
    ProfileViewComponent,
    ProfilePersonnesListComponent,
    ProfileEditComponent,
  ],
  providers: [ProfileStore, ProfileService],
})
export class ProfilePageModule {}
