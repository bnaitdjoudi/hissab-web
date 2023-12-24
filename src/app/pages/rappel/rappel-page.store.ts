import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rappel, RappelModel } from 'src/app/model/rappel.model';
import { RappelService } from 'src/app/services/rappel.service';
import { Store } from 'src/app/store/store';
import { AccountPageStore } from '../account-page/account-page.store';
import { NotificationService } from 'src/app/services/notification.service';
import { PagingRequest } from 'src/app/model/paging-request.model';

@Injectable({
  providedIn: 'root',
})
export class RappelPageStore extends Store<RappelModel> {
  rappels$: Observable<Rappel[]> = this.select<Rappel[]>(
    (state) => state.rappels
  );

  _requestPagingSubject: BehaviorSubject<PagingRequest> =
    new BehaviorSubject<PagingRequest>({ limit: 10, page: 1 });

  constructor(
    readonly rappelService: RappelService,
    readonly accountStore: AccountPageStore,
    readonly notificationService: NotificationService
  ) {
    super({ rappels: [] });

    this._requestPagingSubject.subscribe(async (paging) => {
      let data = await this.rappelService.findByPaging(paging);
      this.updateRappels(data.data);
    });
  }

  relaodRappels(paging: PagingRequest) {
    this._requestPagingSubject.next(paging);
  }

  updateRappels(rappels: Rappel[]) {
    this.setState({ ...this.state, rappels: rappels });
  }

  updateAcountSearch(text: string) {
    this.accountStore.setTextSearch(text);
  }

  async saveRappel(rappel: Rappel) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        let rap = await this.rappelService.create(rappel);
        await this.notificationService.createRappelNotification(rap);
        resolve();
      } catch (error) {
        reject("erreur de creation d'un rappel");
        console.log(error);
      }
    });
  }

  async updateRappel(rappel: Rappel) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.rappelService.update(rappel);
        if (rappel.isActive) {
          await this.notificationService.createRappelNotification(rappel);
        } else {
          await this.notificationService.deleteByRappelId(rappel.id);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteRappel(rap: Rappel): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log('fsdfl;s;fldjsdf:::' + JSON.stringify(rap));
        await this.rappelService.deleteById(rap.id);
        await this.notificationService.deleteByRappelId(rap.id);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
