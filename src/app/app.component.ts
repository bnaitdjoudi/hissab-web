import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription, filter } from 'rxjs';
import { SessionStorageService } from './services/sessionstorage.service';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { MainStore } from './store/main.store';
import { AlertLimit } from './model/alert.limit.model';
import { Account } from './model/account.model';
import { AccountLimit } from './model/account-limit.model';
import { maskitoTransform } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  routeSuscription: Subscription | undefined;
  alertSuscription: Subscription | undefined;

  fatButton = false;
  notifCount: number = 0;
  alertLimits: AlertLimit[] = [];

  readonly maskitoOptions = maskitoNumberOptionsGenerator({
    precision: 2,
    prefix: '$',

    decimalZeroPadding: true,
  });

  constructor(
    readonly platform: Platform,
    readonly sessionStoreService: SessionStorageService,
    readonly router: Router,
    readonly notificationService: NotificationService,
    readonly mainStore: MainStore
  ) {}
  ngOnDestroy(): void {
    this.alertSuscription?.unsubscribe();
  }
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

    this.alertSuscription = this.mainStore.alertLimits$.subscribe((limits) => {
      this.alertLimits = limits;
    });
  }

  get isAlertOpen(): boolean {
    return this.alertLimits.length > 0;
  }

  closeAlertLimits() {
    this.mainStore.emptyAlertLimits();
  }

  goToNotification() {
    this.router.navigate(['notification']);
  }

  transformValue(arg0: any) {
    return maskitoTransform('' + arg0, this.maskitoOptions);
  }

  totalAccount(arg: number, type: string) {
    return this.transformValue(
      arg * (type === 'depense' || type === 'passif' ? -1 : 1)
    );
  }
}
