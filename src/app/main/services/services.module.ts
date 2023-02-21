import { NgModule } from '@angular/core';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { AccountingService } from './accounting.service';
import { AccountsService } from './accounts.service';
import { AssetsService } from './assets.service';
import { DataBasesModule } from './databases/databases.module';
import { OperationService } from './operation.service';

@NgModule({
  imports: [DataBasesModule, NgxTranslateModule],
  providers: [
    AssetsService,
    AccountsService,
    OperationService,
    AccountingService,
  ],
})
export class ServicesModule {}
