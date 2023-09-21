import { DataBaseService } from './database.service';

export class GenericDb {
  sqLiteObject: any;

  constructor(protected dataBase: DataBaseService) {
    this.checkDataBaseOpened();
  }

  protected async checkDataBaseOpened(): Promise<void> {
    if (this.sqLiteObject === undefined || this.sqLiteObject === null) {
      this.sqLiteObject = await this.dataBase.openSQLObject();
    }
  }
}
