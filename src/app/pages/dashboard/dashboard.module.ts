import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { ComponentsModule } from '../../components/components.module';

import { MaterialModule } from 'src/app/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule, Routes } from '@angular/router';
import { ServicesModule } from 'src/app/services/services.module';
import { PipeModule } from "../../pipes/pipes.moule";

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
        MaterialModule,
        FontAwesomeModule,
        RouterModule.forChild(routes),
        ServicesModule,
        PipeModule
    ]
})
export class DashboardPageModule {}
