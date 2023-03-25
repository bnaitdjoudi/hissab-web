import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account } from './model/account.model';
import { MainStore } from './store/main.store';
import { Router } from '@angular/router';

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

  constructor(
    private readonly mainStore: MainStore,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    this.balanceSuscription.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.balanceSuscription = this.mainStore.balanceAccount$.subscribe(
      (account: Account | undefined) => {
        if (account) {
          this.balanceAccount = account;
        }
      }
    );
  }

  accountClass(currentAccount: Account): string {
    return (
      currentAccount.type +
      ' ' +
      (currentAccount.totalAccount > 0 ? 'positif' : 'negatif')
    );
  }

  multiplyFor(type: string): number {
    return type === 'actif' || type === 'income' ? 1 : -1;
  }
  routeToAccount(id: number): void {
    this.router.navigate(['account/' + id]);
  }
}
