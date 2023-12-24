import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SignupPagePageRoutingModule } from './support-page-routing.module';
import { StoreModule } from 'src/app/store/store.module';
import { MaterialModule } from 'src/app/material.module';
import { ServicesModule } from 'src/app/services/services.module';
import { PatchPage } from './patch/patch.page';
import { TicketPage } from './tickets/ticket.page';
import { SupportPage } from './home/support.page';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { MaintenancePage } from './maintenance/maintenance.page';
import { BackupPage } from './backup/backup.page';

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
  providers: [Chooser],
  declarations: [
    PatchPage,
    TicketPage,
    SupportPage,
    MaintenancePage,
    BackupPage,
  ],
})
export class SupportPageModule {}
