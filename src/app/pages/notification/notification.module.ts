import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationPageRoutingModule } from './notification-routing.module';

import { NotificationPage } from './notification.page';
import { NotificationStore } from './notification.store';
import { MaterialModule } from 'src/app/material.module';
import { PipeModule } from '../../pipes/pipes.moule';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [NotificationPage],
  providers: [NotificationStore],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPageRoutingModule,
    MaterialModule,
    PipeModule,
    FontAwesomeModule,
  ],
})
export class NotificationPageModule {}
