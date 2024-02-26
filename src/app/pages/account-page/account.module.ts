import { ComponentsModule } from '../../components/components.module';
import { NgxTranslateModule } from '../../translate/translate.module';

import { PipeModule } from '../../pipes/pipes.moule';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from 'src/app/material.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountPageViewComponent } from './view/account-page.component';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountNewPage } from './new/account-new.page';
import { AccountSearchPage } from './search/account-search.page';
import { AccountLimitPageViewComponent } from './limites/view/account-limit-page.component';
import { AccountLimitNewPage } from './limites/new/account-limit-new.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxTranslateModule,
    PipeModule,
    FontAwesomeModule,
    MaterialModule,
    AccountPageRoutingModule,
    MaskitoModule,
  ],
  declarations: [
    AccountPageViewComponent,
    AccountNewPage,
    AccountSearchPage,
    AccountLimitPageViewComponent,
    AccountLimitNewPage,
  ],
})
export class AccountPageModule {}
