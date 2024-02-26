import { Injectable } from '@angular/core';
import { GenericDb } from './GenericDb';
import { GenericDataBase } from './generic.db';

import { DataBaseService } from './database.service';
import { tables } from './tables';
import { format, parseISO } from 'date-fns';
import { Notify } from 'src/app/model/notification.model';
import { PagingRequest } from 'src/app/model/paging-request.model';
import { PagingData } from 'src/app/model/paging-data';
import { reject, resolve } from 'cypress/types/bluebird';

@Injectable({
  providedIn: 'root',
})
export class NotificationDataBase
  extends GenericDb
  implements GenericDataBase<Notify, number>
{
  constructor(override readonly dataBase: DataBaseService) {
    super(dataBase);
  }
  async create(model: Notify): Promise<Notify> {
    return new Promise<Notify>(async (resolve, reject) => {
      this.checkDataBaseOpened();

      try {
        await this.sqLiteObject.query(
          `INSERT INTO ${
            tables.notification.name
          } (${tables.notification.columns
            .filter((el) => {
              return el.name !== 'ID';
            })
            .map((el) => el.name)}) VALUES (?,?,?,?,?);`,
          [
            model.accountId,
            model.rappelId,
            format(model.notifyDateBegin, 'yyyy-MM-dd HH:mm:ss'),
            model.isOpen ? 1 : 0,
            format(model.eventDate, 'yyyy-MM-dd HH:mm:ss'),
          ]
        );

        let data = await this.sqLiteObject.query(
          `SELECT * FROM  ${tables.notification.name}  WHERE ${tables.notification.columns[3].name} = ? 
          and ${tables.notification.columns[2].name} = ? and ${tables.notification.columns[1].name} = ?;`,
          [
            format(model.notifyDateBegin, 'yyyy-MM-dd HH:mm:ss'),
            model.rappelId,
            model.accountId,
          ]
        );

        if (data.values.length >= 1) {
          resolve(this.constructNotArray(data)[0]);
        } else {
          resolve({} as Notify);
        }
      } catch (error) {
        reject('erreur dans lexcecusion de la requette');
        console.error(error);
      }
    });
  }
  update(model: Notify, id: number): Promise<Notify> {
    throw new Error('Method not implemented.');
  }
  findById(id: number): Promise<Notify> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Notify[]> {
    await this.checkDataBaseOpened();
    return new Promise<Notify[]>(async (resolve, reject) => {
      try {
        let data = await this.sqLiteObject.query(
          'SELECT * FROM NOTIFICATION',
          []
        );
        if (data.values.legth > 0) {
          resolve(this.constructNotArray(data));
        }

        resolve([]);
      } catch (error) {
        reject();
        console.error(error);
      }
    });
  }
  async deleteById(ids: number[]): Promise<void> {
    this.checkDataBaseOpened();
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.query(
          `DELETE FROM ${tables.notification.name} WHERE ${tables.notification.columns[0].name} IN (?);`,
          [ids]
        );
        resolve();
      } catch (error) {
        reject('erreur dans la requette!!');
        console.error(error);
      }
    });
  }

  async deleteByRappelId(rappelId: number): Promise<void> {
    this.checkDataBaseOpened();
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sqLiteObject.query(
          `DELETE FROM ${tables.notification.name} WHERE ${tables.notification.columns[2].name} = ? `,
          [rappelId]
        );
        resolve();
      } catch (error) {
        reject('erreur dans la requel sql');
        console.error(error);
      }
    });
  }

  async selectByRappelId(rappelId: number): Promise<Notify[]> {
    this.checkDataBaseOpened();
    return new Promise<Notify[]>(async (resolve, reject) => {
      try {
        const data = await this.sqLiteObject.query(
          `SELECT * FROM ${tables.notification.name} WHERE ${tables.notification.columns[2].name} = ? `,
          [rappelId]
        );
        resolve(this.constructNotArray(data));
      } catch (error) {
        reject('erreur dans la requel sql');
        console.error(error);
      }
    });
  }

  async findByPaging(request: PagingRequest): Promise<PagingData<Notify>> {
    await this.checkDataBaseOpened();
    return new Promise<PagingData<Notify>>(async (resolve, reject) => {
      try {
        let totalElements: number = await this.getActiveAcount();
        let offset: number = (request.page - 1) * request.limit;
        let totalPage: number = Math.ceil(totalElements / request.limit);

        let data = await this.sqLiteObject.query(
          `SELECT  noti.*, acc.${tables.account.columns[1].name}, rap.${tables.rappel.columns[6].name}  FROM ${tables.notification.name} noti left join ${tables.account.name} acc on acc.${tables.account.columns[0].name} = noti.${tables.notification.columns[1].name} left join ${tables.rappel.name} rap on rap.${tables.rappel.columns[0].name} = ${tables.notification.columns[2].name} 
          WHERE noti.${tables.notification.columns[3].name} <= ? ORDER BY noti.${tables.notification.columns[3].name}  DESC LIMIT ?  OFFSET ?;`,
          [format(new Date(), 'yyyy-MM-dd HH:mm:ss'), request.limit, offset]
        );

        resolve({
          data: this.constructNotArray(data),
          currentPage: request.page,
          totalPage: totalPage,
        });
      } catch (error) {
        reject('erreur dans la requete');
        console.error(error);
      }
    });
  }

  async getActiveAcount(): Promise<number> {
    await this.checkDataBaseOpened();
    return new Promise<number>(async (resolve, reject) => {
      try {
        let dateCount = await this.sqLiteObject.query(
          `SELECT COUNT (*) AS VAL FROM  ${tables.notification.name}  WHERE ${tables.notification.columns[3].name} <= ?`,
          [format(new Date(), 'yyyy-MM-dd HH:mm:ss')]
        );
        let totalElements: number = dateCount.values[0].VAL;

        resolve(totalElements);
      } catch (error) {
        reject('erreur durant lappel de la bd');
        console.error(error);
      }
    });
  }

  async updateStateOpen(id: number, isOpen: boolean): Promise<void> {
    await this.checkDataBaseOpened();
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.sqLiteObject.query(
          `UPDATE  ${tables.notification.name} SET ${tables.notification.columns[4].name} = ?
           WHERE ${tables.notification.columns[0].name} = ?`,
          [isOpen ? 1 : 0, id]
        );
        resolve();
      } catch (error) {
        reject('error dans la requette????');
        console.error(error);
      }
    });
  }

  private constructNotArray(data: any): Notify[] {
    let rappels: Notify[] = [];

    for (let i = 0; i < data.values.legth; i++) {
      rappels.push(this.performNotificationsRowIndex(data, i));
    }

    return rappels;
  }

  private performNotificationsRowIndex(data: any, i: number): Notify {
    return {
      id: data.values[i].ID,
      accountId: data.values[i].ACCOUNT_ID,
      rappelId: data.values[i].RAPPEL_ID,
      notifyDateBegin: parseISO(data.values[i].NOTIFY_DATE_BEGIN),
      eventDate: parseISO(data.values[i].EVENT_DATE),
      isOpen: data.values[i].IS_OPEN === 1,
      description: data.values[i].DESCRIPTION,
      accountName: data.values[i].ACCOUNT_NAME,
    };
  }
}
