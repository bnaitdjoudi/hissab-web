import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Account } from '../../model/account.model';
import { MainStore } from './../../store/main.store';
import { Router } from '@angular/router';
import { Period } from '../../model/balance.model';
import { getLabelPeriode } from './../../tools/period.label';

@Component({
  selector: 'main-page',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  balanceSuscription: Subscription;
  isModalOpenActif = false;

  mainAccounts$ = this.mainStore.mainAccounts$;
  balanceAccount: Account;
  globalBalance: number;
  period$: Observable<Period> = this.mainStore.period$;

  constructor(
    private readonly mainStore: MainStore,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {}

  async ngOnInit(): Promise<void> {
    this.balanceSuscription = this.mainStore.globalBalance$.subscribe(
      (result) => {
        this.globalBalance = result;
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
