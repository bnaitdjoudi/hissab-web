import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Observable, Subscription } from 'rxjs';
import { Account } from './model/account.model';
import { MainStore } from './store/main.store';

@Component({
  selector: 'main-page',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  routeSuscription: Subscription | undefined;
  balanceSuscription: Subscription | undefined;

  isModalOpenActif = false;

  mainAccounts$ = this.mainStore.mainAccounts$;
  balanceAccount: Account;

  constructor(
    private readonly mainStore: MainStore,
    private readonly router: Router
  ) {}

  onActifConfirmValue(mantant: number) {
    console.log('ccccc:' + mantant);
  }

  onOpenActifAjuste() {
    this.isModalOpenActif = true;
  }

  onWillDismissEvent(montant: number) {}

  ngOnDestroy(): void {
    this.routeSuscription?.unsubscribe();
    console.log('MainPage::ngOnDestroy');
  }
  async ngOnInit(): Promise<void> {
    console.log('MainPage::ngOnInit::');

    this.routeSuscription = this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof ActivationEnd &&
            Object.keys(e.snapshot.params).length > 0
        ),
        map((e) => (e instanceof ActivationEnd ? e.snapshot.params : {}))
      )
      .subscribe((params) => {
        // Do whatever you want here!!!!
      });

    this.mainStore.balanceAccount$.subscribe((account: Account | undefined) => {
      if (account) {
        this.balanceAccount = account;
      }
    });
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
}
