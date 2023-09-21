import { NgModule } from '@angular/core';
import { ServicesModule } from '../services/services.module';
import { AccountPageStore } from '../pages/account-page/account-page.store';
import { AssetsStore } from './assets.store';
import { MainStore } from './main.store';
import { RouteParamsStore } from './route.params.store';
import { OperationPageStore } from '../pages/operation-page/operation-page.store';
import { SignUpPageStore } from '../pages/signup-page/signup-page.store';
import { RapportStore } from '../pages/rapport/rapport.store';

@NgModule({
  imports: [ServicesModule],
  providers: [
    AssetsStore,
    MainStore,
    RouteParamsStore,
    AccountPageStore,
    OperationPageStore,
    SignUpPageStore,
    RapportStore,
  ],
})
export class StoreModule {}
