import { Injectable } from '@angular/core';
import { Account } from '../model/account.model';
import { MainStoreData } from '../model/main.store.data.model';
import { AccountsService } from '../services/accounts.service';
import { Store } from './store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BordService } from '../services/bord.service';
import { BalanceResult, Period } from '../model/balance.model';
import { InitService } from '../services/init.service';

const store: MainStoreData = {
  globalBalance: 0,
  mainAccounts: [],
  period: '',
  init: false,
  menuRoute: 'dash',
};

@Injectable({
  providedIn: 'root',
})
export class MainStore extends Store<MainStoreData> {
  mainAccounts$ = this.select<Account[]>((state) => state.mainAccounts);

  currentAccountId$ = this.select<number | undefined>(
    (state) => state.currentAccountId
  );

  balanceAccount$ = this.select<Account | undefined>(
    (state) => state.balanceAccount
  );

  period$: Observable<Period> = this.select<Period>((state) => state.period);

  globalBalance$ = this.select<number>((state) => state.globalBalance);

  _mainAccountsSubject: BehaviorSubject<void> = new BehaviorSubject<void>(
    undefined
  );

  _periodSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');

  menuRoute$ = this.select<any>((state) => state.menuRoute);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly bordService: BordService,
    private readonly initService: InitService
  ) {
    super(store);
    console.log('construct main store');
    this.initService.initialisationSubject.subscribe((init) => {
      if (init) {
        this._mainAccountsSubject.subscribe(() => {
          if (!this.state.init) {
            this.processToInitAccounts();
            this.setInit(true);
          }
        });

        this.period$.subscribe(async (val) => {
          console.log(val);
          await this.synchronusData();
        });
      }
    });
  }

  async initMainAccounts() {
    if (!this.state.init) {
      await this.accountsService.initMainAccount(this._mainAccountsSubject);
    }
  }
  setInit(arg0: boolean) {
    this.setState({ ...this.state, init: arg0 });
  }
  async synchronusData() {
    this.setGlobalBalance(
      (
        await this.bordService.getBalanceByPeriod({
          type: this.state.period,
          param: [],
        })
      ).result
    );

    this.processToInitAccounts();
  }

  private processToInitAccounts() {
    this.accountsService.getMainAccounts().then(async (data) => {
      let balanceTypes: BalanceResult[] = await Promise.all(
        data.map((el) =>
          this.bordService.getBalanceByPeriodAndType(
            {
              type: this.state.period,
              param: [],
            },
            el.type
          )
        )
      );
      data.forEach((el) => {
        let b = balanceTypes.find((e) => e.type === el.type)?.result;
        el.totalAccount = b ? b : 0;
      });

      this.setState({ ...this.state, mainAccounts: data });
    });
  }
  setCurrentAccountId(id: number) {
    this.setState({ ...this.state, currentAccountId: id });
  }

  setGlobalBalance(balance: number) {
    this.setState({ ...this.state, globalBalance: balance });
  }

  setPeriod(period: Period) {
    this.setState({ ...this.state, period: period });
  }

  updateMenuRoute(menuRoute: 'dash' | 'account' | 'operation') {
    this.setState({ ...this.state, menuRoute: menuRoute });
  }
}
