import { Injectable } from '@angular/core';
import {
  CancelOptions,
  LocalNotifications,
  ScheduleOn,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import { Rappel } from '../model/rappel.model';
import { AccountsService } from './accounts.service';
import { Notify } from '../model/notification.model';
import { getNextPeriodDate } from '../tools/date.tools';
import { NotificationDataBase } from './databases/notification.db';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    readonly accountService: AccountsService,
    readonly notificationDb: NotificationDataBase
  ) {}

  async findByPaging(paging: PagingRequest): Promise<PagingData<Notify>> {
    return new Promise<PagingData<Notify>>(async (resolve, reject) => {
      let notifications: Notify[] = [];

      try {
        let nots = this.notificationDb.findByPaging(paging);
        resolve(nots);
      } catch (error) {
        reject('erreur dans la consultation des not');
        console.error(error);
      }

      resolve({ data: notifications, totalPage: 1, currentPage: 1 });
    });
  }

  async createRappelNotification(rappel: Rappel) {
    const notifications: Notify[] = [
      {
        accountId: rappel.accountId,
        rappelId: rappel.id,
        isOpen: true,
        notifyDateBegin: new Date(rappel.notifyDate.getTime()),
        eventDate: rappel.eventDate,
      },
    ];

    if (rappel.isPeriode) {
      let diff = rappel.eventDate.getTime() - rappel.notifyDate.getTime();
      const notifyDates = getNextPeriodDate(
        rappel.periode,
        rappel.notifyDate,
        2023
      );

      const currentDate = new Date();
      notifyDates
        .filter((notDate) => currentDate.getTime() < notDate.getTime())
        .forEach((date) => {
          notifications.push({
            accountId: rappel.accountId,
            rappelId: rappel.id,
            isOpen: true,
            notifyDateBegin: date,
            eventDate: new Date(date.getTime() + diff),
          });
        });
    }

    let results = await Promise.all(
      notifications.map((not) => this.notificationDb.create(not))
    );

    await Promise.all(
      results.map((not) => this.createLocalNotification(rappel, not))
    );
  }

  async createLocalNotification(rappel: Rappel, notification: Notify) {
    try {
      await LocalNotifications.checkPermissions();
      const account = await this.accountService.getAccountById(
        notification.accountId
      );

      let t1 = notification.notifyDateBegin.getTime();

      let time = new Date(t1 + 1000 * 60 * 1);

      let options: ScheduleOptions = {
        notifications: [
          {
            title: 'Account reminder',
            body: account.acountName,
            largeBody: account.acountName + ':' + rappel.description,
            id: notification.id ? notification.id : 0,

            schedule: {
              allowWhileIdle: true,
              at: time,
              repeats: true,
              on: this.calculateScheduleOn(notification.notifyDateBegin),
            },

            extra: {
              rappel: rappel.id,
            },
          },
        ],
      };
      LocalNotifications.schedule(options);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteByRappelId(id: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await LocalNotifications.checkPermissions();
        let notis = await this.notificationDb.selectByRappelId(id);
        await this.notificationDb.deleteByRappelId(id);

        let options: CancelOptions = {
          notifications: notis.map((el) => {
            return { id: el.id ? el.id : 0 };
          }),
        };
        LocalNotifications.cancel(options);
        resolve();
      } catch (error) {
        reject('erreur dans la comminication avec la bd: notification');
        console.error(error);
      }
    });
  }

  async deleteNotificationById(id: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await LocalNotifications.checkPermissions();
        await this.notificationDb.deleteById([id]);

        let options: CancelOptions = {
          notifications: [{ id: id }],
        };
        LocalNotifications.cancel(options);
        resolve();
      } catch (error) {
        reject('erreur dans la comminication avec la bd: notification');
        console.error(error);
      }
    });
  }

  private calculateScheduleOn(notifyDate: Date): ScheduleOn {
    return {
      minute: 0,
     
      month: notifyDate.getMonth(),
      year: notifyDate.getFullYear(),
    };
  }

  async updateStateOpen(id: number, isOpen: boolean): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.notificationDb.updateStateOpen(id, isOpen);

        if (!isOpen) {
          let options: CancelOptions = {
            notifications: [{ id: id }],
          };
          LocalNotifications.cancel(options);
        }

        resolve();
      } catch (error) {
        reject('erreur avec la bd');
        console.error(error);
      }
    });
  }
}
