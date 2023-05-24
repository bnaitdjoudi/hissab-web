import { NgModule } from '@angular/core';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { AccountingService } from './accounting.service';
import { AccountsService } from './accounts.service';
import { AssetsService } from './assets.service';
import { DataBasesModule } from './databases/databases.module';
import { OperationService } from './operation.service';
import { BordService } from './bord.service';
import { InitService } from './init.service';

@NgModule({
  imports: [DataBasesModule, NgxTranslateModule],
  providers: [
    AssetsService,
    AccountsService,
    OperationService,
    AccountingService,
    BordService,
    InitService,
  ],
})
export class ServicesModule {}
