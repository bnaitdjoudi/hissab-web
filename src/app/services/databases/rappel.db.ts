import { Injectable } from '@angular/core';
import { GenericDb } from './GenericDb';
import { GenericDataBase } from './generic.db';
import { Rappel } from 'src/app/model/rappel.model';
import { DataBaseService } from './database.service';
import { tables } from './tables';
import { format, parseISO } from 'date-fns';
import { PagingData } from 'src/app/model/paging-data';
import { PagingRequest } from 'src/app/model/paging-request.model';

@Injectable({
  providedIn: 'root',
})
export class RappelDataBase
  extends GenericDb
  implements GenericDataBase<Rappel, number>
{
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
  }
  async create(model: Rappel): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.checkDataBaseOpened();

      try {
        await this.sqLiteObject.executeSql(
          `INSERT INTO ${tables.rappel.name} (${tables.rappel.columns
            .filter((el) => {
              return el.name !== 'ID';
            })
            .map((el) => el.name)}) VALUES (?,?, ?,?,?,?, ?)`,
          [
            model.accountId,
            format(model.eventDate, 'yyyy-MM-dd HH:mm:ss'),
            format(model.notifyDate, 'yyyy-MM-dd HH:mm:ss'),

            model.isPeriode ? 1 : 0,
            model.periode,
            model.description,
            1,
          ]
        );

        let data = await this.sqLiteObject.executeSql(
          `SELECT * FROM ${tables.rappel.name} WHERE ID=(SELECT MAX(ID) from ${tables.rappel.name});`,
          []
        );

        if (data.rows.length >= 1) {
          resolve(this.constructRappelArray(data)[0]);
        } else {
          resolve({});
        }
      } catch (error) {
        reject('erreur dans lexcecusion de la requette');
        console.error(error);
      }
    });
  }
  update(model: Rappel, id: number): Promise<Rappel> {
    throw new Error('Method not implemented.');
  }
  findById(id: number): Promise<Rappel> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Rappel[]> {
    await this.checkDataBaseOpened();
    return new Promise<Rappel[]>(async (resolve, reject) => {
      try {
        let data = await this.sqLiteObject.executeSql(
          'SELECT * FROM RAPPEL',
          []
        );
        if (data.rows.length > 0) {
          resolve(this.constructRappelArray(data));
        }

        resolve([]);
      } catch (error) {
        reject();
        console.error(error);
      }
    });
  }

  async findByPaging(request: PagingRequest): Promise<PagingData<Rappel>> {
    await this.checkDataBaseOpened();
    return new Promise<PagingData<Rappel>>(async (resolve, reject) => {
      try {
        let dateCount = await this.sqLiteObject.executeSql(
          `SELECT COUNT (*) AS VAL FROM  ${tables.rappel.name}`,
          []
        );

        let totalElements: number = dateCount.rows.item(0).VAL;
        let offset: number = (request.page - 1) * request.limit;
        let totalPage: number = Math.ceil(totalElements / request.limit);

        let data = await this.sqLiteObject.executeSql(
          `SELECT  rap.*, acc.${tables.account.columns[1].name}  FROM ${tables.rappel.name} rap left join ${tables.account.name} acc on acc.${tables.account.columns[0].name} = 
           rap.${tables.rappel.columns[1].name}   ORDER BY rap.${tables.rappel.columns[0].name}  DESC LIMIT ?  OFFSET ?;`,
          [request.limit, offset]
        );

        resolve({
          data: this.constructRappelArray(data),
          currentPage: request.page,
          totalPage: totalPage,
        });
      } catch (error) {
        reject('erreur dans la requete');
        console.error(error);
      }
    });
  }

  async deleteById(ids: number[]): Promise<void> {
    await this.checkDataBaseOpened();
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.executeSql(
          `DELETE FROM  ${tables.rappel.name} WHERE ${
            tables.rappel.columns[0].name
          } IN (${ids.join(',')})`,
          []
        );
        resolve();
      } catch (error) {
        reject('erreur avec dans la requette');
        console.error(error);
      }
    });
  }

  private constructRappelArray(data: any): Rappel[] {
    let rappels: Rappel[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      rappels.push(this.performRappelsRowIndex(data, i));
    }

    return rappels;
  }

  private performRappelsRowIndex(data: any, i: number): Rappel {
    return {
      id: data.rows.item(i).ID,
      accountId: data.rows.item(i).ACCOUNT_ID,
      description: data.rows.item(i).DESCRIPTION,
      eventDate: parseISO(data.rows.item(i).EVENT_DATE),
      notifyDate: parseISO(data.rows.item(i).NOTIFY_DATE),
      periode: data.rows.item(i).PERIODE,
      isActive: data.rows.item(i).IS_ACTIVE === 1,
      isPeriode: data.rows.item(i).IS_PERIODE === 1,
      accountName: data.rows.item(i).ACCOUNT_NAME,
    };
  }
}
