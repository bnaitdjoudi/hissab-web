import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../pipes/pipes.moule';
import { CardMainAccountComponent } from './card-main-account/card-main-accounts.component';
import { ErrorMessageComponent } from './forms/error-message/error-message.component';
import { MainAccountEditComponent } from './forms/main-account-edit/main-account-edit.component';
import { OperationFormComponent } from './forms/operation-form/operation-form.component';
import { ActifViewComponent } from './views/actif-view/actif.view.component';
import { PassifViewComponent } from './views/passif-view/passif.view.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { OperationListComponent } from './data-list/operation-list/operation-list.component';
import { NumberInputComponent } from './inputs/number-input/number-input.component';
import { NgxTranslateModule } from '../translate/translate.module';
import { AccountListComponent } from './data-list/account-list/account-list.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MainMenuComponent } from './shared/main-menu/main-menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { HeaderSimpleComponent } from './shared/header-simple/header-simple.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransferAccountsComponent } from './forms/transfer-accounts/transfer-accounts.component';
import { SearchAccountComponent } from './search/search-account/search-account.component';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    NgxTranslateModule,
    RouterModule,
    MaterialModule,
    FontAwesomeModule,
  ],
  exports: [
    CardMainAccountComponent,
    MainAccountEditComponent,
    PassifViewComponent,
    ActifViewComponent,
    OperationFormComponent,
    ErrorMessageComponent,
    OperationListComponent,
    AccountListComponent,
    MainMenuComponent,
    HeaderComponent,
    HeaderSimpleComponent,
    SearchAccountComponent,
  ],
  declarations: [
    CardMainAccountComponent,
    MainAccountEditComponent,
    PassifViewComponent,
    ActifViewComponent,
    OperationFormComponent,
    ErrorMessageComponent,
    OperationListComponent,
    NumberInputComponent,
    AccountListComponent,
    MainMenuComponent,
    HeaderComponent,
    HeaderSimpleComponent,
    TransferAccountsComponent,
    SearchAccountComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
