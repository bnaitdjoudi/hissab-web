import { Component, OnInit } from '@angular/core';

import { LoadingController, NavController } from '@ionic/angular';
import { Operation } from 'src/app/model/operation.model';
import {
  MaskitoElementPredicateAsync,
  maskitoTransform,
  maskitoPipe,
} from '@maskito/core';
import { ElementState } from '@maskito/core/lib/types';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { AccountPageStore } from '../../account-page.store';
import { Account } from 'src/app/model/account.model';
import { Router } from '@angular/router';
import {
  IonInputCustomEvent,
  InputInputEventDetail,
  IonSelectCustomEvent,
  SelectChangeEventDetail,
} from '@ionic/core';
import { AbstractPage } from 'src/app/pages/abstract-page';
import { AccountLimit } from 'src/app/model/account-limit.model';
import { Subscription } from 'rxjs';
const postrocessor1 = (
  elementState: ElementState,
  initialElementState: ElementState
) => {
  const { value, selection } = elementState;
  let ch = value.substring(0, 1);
  let rest = value.substring(1, value.length);
  console.log('rest', rest);
  return {
    selection,
    value: '$' + rest + ch,
  };
};

@Component({
  selector: 'account-limit-new-page',
  templateUrl: './account-limit-new.page.html',
  styleUrls: ['./account-limit-new.page.scss'],
})
export class AccountLimitNewPage extends AbstractPage implements OnInit {
  max: string | undefined;
  min: string | undefined;
  account: Account;
  accountSubscription: Subscription;

  maskitoMaxOptions = maskitoNumberOptionsGenerator({
    precision: 2,
    prefix: '$ ',
    decimalZeroPadding: true,
  });

  maskitoMinOptions = maskitoNumberOptionsGenerator({
    precision: 2,
    prefix: '$ ',
    decimalZeroPadding: true,
  });

  public toastButtons = [
    {
      text: 'Dismiss',
      role: 'cancel',
      handler: () => {
        this.mumToast = false;
        this.periodToast = false;
      },
    },
  ];

  readonly predicate: MaskitoElementPredicateAsync = async (element) =>
    (element as HTMLIonInputElement).getInputElement();
  activeMax: boolean = false;
  activeMin: boolean = false;
  period: any;
  periodToast = false;
  mumToast = false;
  limits: AccountLimit[] = [];
  constructor(
    private navCtrl: NavController,
    readonly accountStore: AccountPageStore,
    readonly router: Router,
    loadingCtrl: LoadingController
  ) {
    super(loadingCtrl);
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
            .replace('−', '-')
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
            .replace('−', '-')
        )
      : 0;
  }

  periodChange(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    this.max = undefined;
    this.min = undefined;
    this.account.limitMin = undefined;
    this.account.limitMax = undefined;
  }

  backNavigation() {
    this.navCtrl.back();
  }

  activateMax($event: any) {
    if (!this.activeMax) {
      this.max = '$ 0.00';
      this.account.limitMax = 0;

      this.maskitoMaxOptions = maskitoNumberOptionsGenerator({
        precision: 2,
        prefix: '$ ',
        min: this.account.limitMin ? this.account.limitMin : undefined,
        decimalZeroPadding: true,
      });
    } else {
      this.max = undefined;
      this.account.limitMax = undefined;
    }
  }

  activateMin($event: any) {
    if (!this.activeMin) {
      this.min = '$ 0.00';
      this.account.limitMin = 0;

      this.maskitoMinOptions = maskitoNumberOptionsGenerator({
        precision: 2,
        prefix: '$ ',
        max: this.account.limitMax ? this.account.limitMax : undefined,
        decimalZeroPadding: true,
      });
    } else {
      this.min = undefined;
      this.account.limitMin = undefined;
    }
  }

  goToHome() {
    this.router.navigate(['/dashboard'], {});
  }

  async submit() {
    await this.showLoading();
    try {
      if (this.formValidation()) {
        await this.accountStore.createLimits({
          id: 0,
          accountId: this.account.id,
          max: this.account.limitMax,
          min: this.account.limitMin,
          period: this.period,
        });

        await this.dismissLoading();
        this.backNavigation();
      } else {
        this.periodToast = !this.period;

        this.mumToast =
          this.account.limitMax === undefined &&
          this.account.limitMin === undefined;
        await this.dismissLoading();
      }
    } catch (error) {
      console.error(error);
      await this.dismissLoading();
    }
  }

  private formValidation(): boolean {
    return (
      this.period &&
      (this.account.limitMax !== undefined ||
        this.account.limitMin !== undefined)
    );
  }

  isNotCreated(period: string): boolean {
    console.log(this.limits.map((al) => al.period).includes(period));
    return !this.limits.map((al) => al.period).includes(period);
  }

  back() {}

  get displayMax() {
    return (
      (this.period === 'gl' && this.account.type === 'passif') ||
      (this.period !== 'gl' &&
        this.account.type !== 'income' &&
        this.period !== undefined)
    );
  }

  get displayMin() {
    return (
      (this.period === 'gl' &&
        (this.account.type === 'actif' || this.account.type === 'income')) ||
      (this.period !== 'gl' && this.account.type === 'income')
    );
  }
}
