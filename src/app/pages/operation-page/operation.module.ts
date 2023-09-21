import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../components/components.module';
import { NgxTranslateModule } from '../../translate/translate.module';
import { OperationPageViewComponent } from './view/operation-page-view.component';
import { PipeModule } from '../../pipes/pipes.moule';
import { OperationPageRoutingModule } from './operation-routing.module';
import { OperationPageEditComponent } from './edit/operation-page-edit.component';
import { OperationPageNewPage } from './new/operation-page-new.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from 'src/app/material.module';
import { OperationSearchPage } from './search/operation-search.page';

import { ProfilePageModule } from '../profile-page/profile.module';
import { ServicesModule } from 'src/app/services/services.module';

@NgModule({
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgxTranslateModule,
    PipeModule,
    OperationPageRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    ServicesModule,
  ],
  declarations: [
    OperationPageViewComponent,
    OperationPageEditComponent,
    OperationPageNewPage,
    OperationSearchPage,
  ],
})
export class OperationPageModule {}
