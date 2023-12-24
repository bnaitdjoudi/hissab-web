import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Account } from '../../model/account.model';
import { MainStore } from './../../store/main.store';
import { Router } from '@angular/router';
import { Period } from '../../model/balance.model';
import { getLabelPeriode } from './../../tools/period.label';

@Component({
  selector: 'dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  balanceSuscription: Subscription;
  mainAccountsSuscription: Subscription;
  isModalOpenActif = false;

  mainAccounts: Account[] = [];
  balanceAccount: Account;
  globalBalance: number;
  period$: Observable<Period> = this.mainStore.period$;
  menuRoute$: Observable<any> = this.mainStore.menuRoute$;
  alertOptions: {
    header: 'Pizza Toppings';
    subHeader: 'Select your favorite topping';
    class: 'custom-alert';
  };
  constructor(
    private readonly mainStore: MainStore,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    console.log('DashboardPage::ngOnDestroy');
    this.balanceSuscription?.unsubscribe();
    this.mainAccountsSuscription?.unsubscribe();
  }

  ngOnInit(): void {
    console.log('DashboardPage::ngOnInit');
    this.balanceSuscription = this.mainStore.globalBalance$.subscribe(
      (result) => {
        this.globalBalance = result;
      }
    );

    this.mainAccountsSuscription = this.mainStore.mainAccounts$.subscribe(
      (result) => {
        this.mainAccounts = result;
      }
    );

    this.mainStore.setPeriod('month');
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
