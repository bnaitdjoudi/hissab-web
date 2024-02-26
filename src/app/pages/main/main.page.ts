import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Account } from '../../model/account.model';
import { MainStore } from './../../store/main.store';
import { Router } from '@angular/router';
import { Period } from '../../model/balance.model';
import { getLabelPeriode } from './../../tools/period.label';
import { RouteParamsStore } from 'src/app/store/route.params.store';
import { AlertLimit } from 'src/app/model/alert.limit.model';

@Component({
  selector: 'main-page',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  balanceSuscription: Subscription;
  flagSuscription: Subscription;
  isModalOpenActif = false;
  alertSuscription: Subscription | undefined;

  mainAccounts$ = this.mainStore.mainAccounts$;
  balanceAccount: Account;
  globalBalance: number;
  period$: Observable<Period> = this.mainStore.period$;

  alertLimits: AlertLimit[] = [];
  constructor(
    private readonly mainStore: MainStore,
    private readonly router: Router,
    private readonly routeParamStore: RouteParamsStore
  ) {}

  ngOnDestroy(): void {}

  async ngOnInit(): Promise<void> {
    this.balanceSuscription = this.mainStore.globalBalance$.subscribe(
      (result) => {
        this.globalBalance = result;
      }
    );

    this.mainStore.setPeriod('month');
    this.routeParamStore.goto;

    this.alertSuscription = this.mainStore.alertLimits$.subscribe((limits) => {
      console.log('app:::', JSON.stringify(limits));
      this.alertLimits = limits;
    });
  }

  accountClass(currentAccount: Account): string {
    return 'balance';
  }

  multiplyFor(type: string): number {
    return type === 'actif' || type === 'income' ? 1 : -1;
  }
  routeToAccount(id: number): void {
    this.router.navigate(['account/' + id]);
  }

  onPeriodChange($event: any) {
    this.mainStore.setPeriod($event.target.value);
  }

  getMonth() {
    return getLabelPeriode(this.mainStore.state.period);
  }
}
