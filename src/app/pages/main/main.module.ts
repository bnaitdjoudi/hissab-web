import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { ComponentsModule } from '../../components/components.module';
import { StoreModule } from './../../store/store.module';

import { NgxTranslateModule } from '../../translate/translate.module';

import { PipeModule } from '../../pipes/pipes.moule';
import { MaterialModule } from '../../material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServicesModule } from 'src/app/services/services.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MainPageRoutingModule,
    ComponentsModule,

    RouterModule,
    NgxTranslateModule,
    PipeModule,
    MaterialModule,
    FontAwesomeModule,
    ServicesModule,
  ],
  declarations: [MainPage],
})
export class MainPageModule {}
