import { Injectable } from '@angular/core';
import { Account } from '../model/account.model';
import { MainStoreData } from '../model/main.store.data.model';
import { AccountsService } from '../services/accounts.service';
import { Store } from './store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BordService } from '../services/bord.service';
import { BalanceResult, Period } from '../model/balance.model';
import { InitService } from '../services/init.service';
import { Flag } from '../model/flags.model';
import { FlagsService } from '../services/flags.service';

const store: MainStoreData = {
  globalBalance: 0,
  mainAccounts: [],
  period: '',
  init: false,
  menuRoute: 'dash',
  flags: new Map<string, Flag>(),
  iSignedin: false,
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

  _currentAccountId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  menuRoute$ = this.select<any>((state) => state.menuRoute);

  flags$ = this.select<Map<string, Flag>>((state) => state.flags);
  iSignedin$ = this.select<boolean>((state) => state.iSignedin);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly bordService: BordService,
    private readonly initService: InitService,
    private readonly flagService: FlagsService
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

        this.flagService.findAllFlags().then((flags) => {
          this.setState({
            ...this.state,
            flags: new Map<string, Flag>(flags.map((el) => [el.flagName, el])),
          });
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

  async setSignedUpFlag() {
    console.log('walou');
    try {
      await this.flagService.createFlag({
        flagName: 'PROFIL_SIGNED_UP',
        flagSetted: true,
      });

      this.setState({
        ...this.state,
        flags: new Map<string, Flag>(
          (await this.flagService.findAllFlags()).map((el) => [el.flagName, el])
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }

  setSignedIn(val: boolean) {
    this.setState({ ...this.state, iSignedin: val });
  }
}
