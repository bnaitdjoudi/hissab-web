import { Component, OnInit } from '@angular/core';
import { NotificationStore } from './notification.store';
import { Notify } from 'src/app/model/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.isAlertOpen = false;
      },
    },
    {
      text: 'Confirm',
      role: 'confirm',
      handler: () => {
        this.isAlertOpen = false;
        this.deleteSelectedNotification();
      },
    },
  ];

  selectNoti: Notify;

  notifications: Notify[] = [];
  isAlertOpen: boolean = false;

  constructor(
    readonly notificationStore: NotificationStore,
    readonly router: Router
  ) {}

  ngOnInit() {
    this.notificationStore.data$.subscribe((val) => {
      this.notifications = val.data;
    });
  }

  async delete(id: number | undefined) {
    if (id) {
      await this.notificationStore.deleteNot(id);
    }
  }

  async deleteSelectedNotification() {
    try {
      await this.delete(this.selectNoti.id);
      this.notificationStore.requestPagingObject_.next({ limit: 10, page: 1 });
    } catch (error) {
      console.error(error);
    }
  }

  confirmDelete(noty: Notify) {
    this.selectNoti = noty;
    this.isAlertOpen = true;
  }

  setResult(event: any) {
    console.log(`Dismissed with role: ${event.detail.role}`);
    this.isAlertOpen = false;
  }

  async notOpen(not: Notify) {
    not.isOpen = !not.isOpen;
    console.log(JSON.stringify(not));

    if (not.id) {
      try {
        await this.notificationStore.updateStateOpen(not.id, not.isOpen);
        this.notificationStore.requestPagingObject_.next({
          limit: 10,
          page: 1,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  goToHome() {
    this.router.navigate(['/dashboard'], {});
  }
}
