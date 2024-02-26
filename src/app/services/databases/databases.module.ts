import { NgModule } from '@angular/core';
import { AccountDataBase } from './account.db';
import { DataBaseService } from './database.service';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { OperationDataBase } from './operation.db';
import { FlagsDataBase } from './flags.db';
import { ProfileDataBase } from './profile.db';
import { AuthDataBase } from './auth.db';

@NgModule({
  providers: [
    DataBaseService,
    AccountDataBase,
    SQLitePorter,
    OperationDataBase,
    FlagsDataBase,
    ProfileDataBase,
    AuthDataBase,
  ],
})
export class DataBasesModule {}
