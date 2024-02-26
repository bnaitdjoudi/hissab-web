import { NgModule } from '@angular/core';
import { LanguagePage } from './language/language.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { PipeModule } from 'src/app/pipes/pipes.moule';
import { MaterialModule } from 'src/app/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ServicesModule } from 'src/app/services/services.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [LanguagePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxTranslateModule,
    ComponentsModule,
    NgxTranslateModule,
    PipeModule,
    MaterialModule,
    FontAwesomeModule,
    ServicesModule,
    AdminRoutingModule,
  ],
})
export class AdminPageModule {}
