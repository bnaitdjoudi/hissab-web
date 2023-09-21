import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPagePageRoutingModule } from './signup-page-routing.module';
import { SignupLoadPage } from './load/sign-up.load.page';
import { StoreModule } from 'src/app/store/store.module';
import { SignupPage } from './signup/sign-up.page';
import { MaterialModule } from 'src/app/material.module';
import { SignInPage } from './signin/sign-in.page';
import { ServicesModule } from 'src/app/services/services.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPagePageRoutingModule,
    StoreModule,
    MaterialModule,
    ReactiveFormsModule,
    ServicesModule,
  ],
  declarations: [SignupLoadPage, SignupPage, SignInPage],
})
export class SignupPagePageModule {}
