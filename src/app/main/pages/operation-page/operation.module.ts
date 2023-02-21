import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../../components/components.module';
import { StoreModule } from './../../store/store.module';
import { NgxTranslateModule } from '../../../translate/translate.module';
import { OperationPageViewComponent } from './view/operation-page-view.component';
import { PipeModule } from '../../../pipes/pipes.moule';
import { OperationPageRoutingModule } from './operation-routing.module';
import { OperationPageEditComponent } from './edit/operation-page-edit.component';

@NgModule({
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
    FormsModule,
    StoreModule,
    RouterModule,
    NgxTranslateModule,
    PipeModule,
    OperationPageRoutingModule,
  ],
  declarations: [OperationPageViewComponent, OperationPageEditComponent],
})
export class OperationPageModule {}
