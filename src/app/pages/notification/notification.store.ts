import { Injectable } from '@angular/core';
import { resolve } from 'cypress/types/bluebird';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  NotificationStoreModel,
  Notify,
} from 'src/app/model/notification.model';
import { PagingData } from 'src/app/model/paging-data';
import { PagingRequest } from 'src/app/model/paging-request.model';
import { NotificationService } from 'src/app/services/notification.service';
import { Store } from 'src/app/store/store';

@Injectable()
export class NotificationStore extends Store<NotificationStoreModel> {
  data$: Observable<PagingData<Notify>> = this.select<PagingData<Notify>>(
    (state) => state.data
  );

  requestPagingObject_: BehaviorSubject<PagingRequest> =
    new BehaviorSubject<PagingRequest>({ limit: 10, page: 1 });

  constructor(readonly notificationService: NotificationService) {
    super({ data: { data: [], totalPage: 0, currentPage: 0 } });
    this.requestPagingObject_.subscribe(async (val) => {
      const ff = await this.notificationService.findByPaging(val);
      this.setState({ ...this.state, data: ff });
    });
  }

  async deleteNot(id: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.notificationService.deleteNotificationById(id);
        resolve();
      } catch (error) {
        reject('error on deleting');
        console.error(error);
      }
    });
  }

  async updateStateOpen(id: number, isOpen: boolean): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.notificationService.updateStateOpen(id, isOpen);
        resolve();
      } catch (error) {
        console.log(error);
        reject('erreur de operation');
      }
    });
  }
}
