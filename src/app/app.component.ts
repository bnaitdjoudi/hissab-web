import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription, filter } from 'rxjs';
import { SessionStorageService } from './services/sessionstorage.service';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  routeSuscription: Subscription | undefined;

  fatButton = false;
  notifCount: number = 0;

  constructor(
    readonly platform: Platform,
    readonly sessionStoreService: SessionStorageService,
    readonly router: Router,
    readonly notificationService: NotificationService
  ) {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.platform.pause.subscribe(async () => {
      await this.sessionStoreService.clearData();
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))

      .subscribe((event: any) => {
        console.log(event.url);
        this.fatButton =
          event.url !== '/notification' &&
          !event.url.includes('signup-page') &&
          this.notifCount > 1;
      });

    this.notificationService.getActiveCount().then((val) => {
      this.notifCount = val;
    });
  }

  goToNotification() {
    this.router.navigate(['notification']);
  }
}
