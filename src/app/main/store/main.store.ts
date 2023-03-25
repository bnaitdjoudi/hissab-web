import { Injectable } from '@angular/core';
import { Account } from '../model/account.model';
import { MainStoreData } from '../model/main.store.data.model';
import { AccountsService } from '../services/accounts.service';
import { AccountPageStore } from '../pages/account-page/account-page.store';
import { Store } from './store';

const store: MainStoreData = {
  mainAccounts: [],
};

@Injectable()
export class MainStore extends Store<MainStoreData> {
  mainAccounts$ = this.select<Account[]>((state) => state.mainAccounts);
  currentAccountId$ = this.select<number | undefined>(
    (state) => state.currentAccountId
  );

  balanceAccount$ = this.select<Account | undefined>(
    (state) => state.balanceAccount
  );

  constructor(private readonly accountsService: AccountsService) {
    super(store);
    this.initMainAccounts();
  }

 

   initMainAccounts() {
    this.accountsService.getMainAccounts().then((data) => {
      this.setState({ ...this.state, mainAccounts: data });
    });

    this.accountsService
      .getAccountByType('balance')
      .then(
        (accounts) =>
          accounts.length > 0 &&
          this.setState({ ...this.state, balanceAccount: accounts[0] })
      );
  }

  setCurrentAccountId(id: number) {
    this.setState({ ...this.state, currentAccountId: id });
  }
}
