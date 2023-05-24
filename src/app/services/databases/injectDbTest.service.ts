import { DataBaseService } from './database.service';
import { accounts } from '../../tools/data.simulation';
import { tables } from './tables';
export class InjectDbTestService {
  constructor(private readonly dateBase: DataBaseService) {}

  async processTestDb() {
    let sqLiteObject = await this.dateBase.openSQLObject();

    try {
      await this.resetBalanceAccount(sqLiteObject);
      console.info('balance ressted!');
    } catch (error) {
      console.error(error);
    }

    /*try {
      await this.deleteAllOperation(sqLiteObject);
      console.info('operation deleted!');
    } catch (error) {
      console.error(error);
    }*/

    try {
      await this.initAccounts(sqLiteObject);
      console.info('account created');
    } catch (error) {
      console.error(error);
    }
  }
  initAccounts(sqLiteObject: any) {
    sqLiteObject.executeSql(`INSERT INTO ${tables.account.name} (
            ${tables.account.columns[0].name},
            ${tables.account.columns[1].name},
            ${tables.account.columns[2].name}, 
            ${tables.account.columns[3].name},
            ${tables.account.columns[4].name}, 
            ${tables.account.columns[5].name},
            ${tables.account.columns[6].name},
            ${tables.account.columns[7].name}) VALUES ${accounts.map(
      (el) =>
        `( ${el.id},'${el.acountName}', ${el.totalAccount}, ${
          el.isMain ? 1 : 0
        },'${el.type}', ${el.parentId}, '${el.path}', ${el.isLeaf ? 1 : 0} )`
    )};`);
  }

  deleteAllOperation(sqLiteObject: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      sqLiteObject
        .executeSql('DELETE FROM OPERATION WHERE 1 = 1', [])
        .then(() => resolve())
        .catch((err: any) => reject(err));
    });
  }
  resetBalanceAccount(sqLiteObject: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      sqLiteObject
        .executeSql('UPDATE ACCOUNT SET BALANCE = 0, IS_LEAF = 0 ', [])
        .then(() => resolve())
        .catch((err: any) => reject(err));
    });
  }

  async deleteNonMainAccount(sqLiteObject: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      sqLiteObject
        .executeSql('DELETE FROM ACCOUNT WHERE IS_MAIN = ?', [0])
        .then(() => resolve())
        .catch((err: any) => reject(err));
    });
  }
}
