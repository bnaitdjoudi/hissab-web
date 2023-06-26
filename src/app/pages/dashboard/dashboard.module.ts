import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { ComponentsModule } from '../../components/components.module';
import { StoreModule } from 'src/app/store/store.module';
import { PipeModule } from 'src/app/pipes/pipes.moule';
import { MaterialModule } from 'src/app/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
  },
];

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxTranslateModule,
    ComponentsModule,
    ComponentsModule,
    NgxTranslateModule,
    PipeModule,
    MaterialModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardPageModule {}
