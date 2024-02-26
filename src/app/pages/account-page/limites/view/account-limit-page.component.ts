import { Component, OnInit } from '@angular/core';

import { LoadingController, NavController } from '@ionic/angular';
import { Operation } from 'src/app/model/operation.model';
import { maskitoTransform } from '@maskito/core';

import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { AccountPageStore } from '../../account-page.store';
import { Account } from 'src/app/model/account.model';
import { Router } from '@angular/router';
import { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AccountLimit } from 'src/app/model/account-limit.model';
import { AbstractPage } from 'src/app/pages/abstract-page';

@Component({
  selector: 'account-limit-page',
  templateUrl: './account-limit-page.component.html',
  styleUrls: ['./account-limit-page.component.scss'],
})
export class AccountLimitPageViewComponent
  extends AbstractPage
  implements OnInit
{
  max: string | undefined;
  min: string | undefined;
  accountSubscription: Subscription;
  account: Account;
  limits: AccountLimit[] = [];

  readonly maskitoOptions = maskitoNumberOptionsGenerator({
    precision: 2,
    prefix: '$',

    decimalZeroPadding: true,
  });

  activeMax: boolean = false;
  activeMin: boolean = false;

  constructor(
    private navCtrl: NavController,
    readonly accountStore: AccountPageStore,
    readonly router: Router,
    loading: LoadingController
  ) {
    super(loading);
  }

  ngOnDestroy(): void {
    this.accountSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.accountSubscription = this.accountStore.currentAccount$.subscribe(
      async (acc) => {
        this.account = acc;
        this.limits = await this.accountStore.getLimitsByAccountId(
          this.account.id
        );
      }
    );
  }

  addOperation(row: Operation) {}

  async showPeriodOption() {}

  changeMax($event: IonInputCustomEvent<InputInputEventDetail>) {
    this.account.limitMax = $event.detail.value
      ? parseFloat(
          $event.detail.value
            ?.substring(1, $event.detail.value.length)
            .trim()
            .replace(/\s/g, '')
        )
      : 0;
  }

  changeMin($event: IonInputCustomEvent<InputInputEventDetail>) {
    this.account.limitMin = $event.detail.value
      ? parseFloat(
          $event.detail.value
            ?.substring(1, $event.detail.value.length)
            .trim()
            .replace(/\s/g, '')
        )
      : 0;
  }

  async deleteItem(id: number) {
    this.showLoading();
    await this.accountStore.deleteLimitById(id);
    this.limits = await this.accountStore.getLimitsByAccountId(this.account.id);
    this.dismissLoading();
  }

  backNavigation() {
    this.navCtrl.back();
  }

  activateMax($event: any) {
    if (!this.activeMax) {
      this.max = '$ 0.00';
    } else {
      this.max = undefined;
      this.account.limitMax = undefined;
    }
  }

  activateMin($event: any) {
    if (!this.activeMin) {
      this.min = '$ 0.00';
    } else {
      this.min = undefined;
      this.account.limitMin = undefined;
    }
  }

  newLimit() {
    this.router.navigate(['/account/' + this.account.id + '/limit/new'], {});
  }

  goToHome() {
    this.router.navigate(['/dashboard'], {});
  }

  async submit() {
    await this.accountStore.updateLimits(
      this.account.id,
      this.account.limitMax,
      this.account.limitMin
    );
  }

  back() {
    throw new Error('Method not implemented.');
  }

  transformValue(val: number): string {
    return maskitoTransform('' + val, this.maskitoOptions);
  }
}
