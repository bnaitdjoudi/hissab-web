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
import { ProfileModel } from '../model/profil.model';
import { SessionStorageService } from '../services/sessionstorage.service';
import { TranslateService } from '@ngx-translate/core';

import { pathToAllParentUniquePath } from '../tools/tools';
import { AccountLimit } from '../model/account-limit.model';
import { AlertLimit } from '../model/alert.limit.model';
import {
  getFirstSecondOfMonth,
  getFirstSecondOfYear,
  timeFromPeriod,
} from '../tools/date.tools';
import { OperationService } from '../services/operation.service';

const store: MainStoreData = {
  globalBalance: 0,
  mainAccounts: [],
  period: '',
  init: false,
  menuRoute: 'dash',
  flags: new Map<string, Flag>(),
  iSignedin: false,
  alertLimits: [],
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
  alertLimits$: Observable<AlertLimit[]> = this.select<AlertLimit[]>(
    (state) => state.alertLimits
  );

  globalBalance$ = this.select<number>((state) => state.globalBalance);

  _mainAccountsSubject: BehaviorSubject<void> = new BehaviorSubject<void>(
    undefined
  );

  _periodSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');

  _currentAccountId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  menuRoute$ = this.select<any>((state) => state.menuRoute);

  flags$ = this.select<Map<string, Flag>>((state) => state.flags);
  iSignedin$ = this.select<boolean>((state) => state.iSignedin);
  currentProfile$ = this.select<ProfileModel | undefined>(
    (state) => state.currentProfile
  );

  constructor(
    private readonly accountsService: AccountsService,
    private readonly bordService: BordService,
    private readonly initService: InitService,
    private readonly flagService: FlagsService,
    private readonly sessionService: SessionStorageService,
    private readonly translateService: TranslateService,
    private readonly operationService: OperationService
  ) {
    super(store);
    this.sessionService.getSessionInfos().then((info) => {
      this.currentProfile({ mail: info } as unknown as ProfileModel);
    });

    let r = (Math.random() + 1).toString(36).substring(7);
    console.log('MainStore:::', r);

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

  currentProfile(profile: ProfileModel) {
    this.setState({ ...this.state, currentProfile: profile });
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

  getTranslation(value: string): string {
    this.translateService.setDefaultLang('en');

    return this.translateService.instant(value);
  }

  async checkLimitsAccount(idAccount: number, transfer: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const account: Account = await this.accountsService.getAccountById(
          idAccount
        );
        const accounts: Account[] = await Promise.all([
          ...pathToAllParentUniquePath(account.path).map((path) =>
            this.accountsService.findAccountByPath(path)
          ),
          ...pathToAllParentUniquePath(transfer).map((path) =>
            this.accountsService.findAccountByPath(path)
          ),
        ]);

        const alertLimits = await this.checkLimits(accounts);
        this.setAlertLimits(alertLimits);
        console.log(JSON.stringify(alertLimits));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  setAlertLimits(alertLimits: AlertLimit[]) {
    this.setState({ ...this.state, alertLimits: alertLimits });
  }

  emptyAlertLimits() {
    this.setState({ ...this.state, alertLimits: [] });
  }

  private async checkLimits(accounts: Account[]): Promise<AlertLimit[]> {
    return new Promise<AlertLimit[]>(async (resolve, reject) => {
      try {
        const alertLimits: AlertLimit[] = [];
        for (let i = 0; i < accounts.length; i++) {
          let limits = await this.accountsService.getAccountLimits(
            accounts[i].id
          );
          for (let j = 0; j < limits.length; j++) {
            if (await this.areOverLimit(accounts[i], limits[j])) {
              alertLimits.push({
                account: accounts[i],
                accountLimit: limits[j],
              });
            }
          }
        }
        console.log('brave:', JSON.stringify(alertLimits));
        resolve(alertLimits);
      } catch (error) {
        console.error(error);
        reject('error:checkLimits');
      }
    });
  }
  private async areOverLimit(
    account: Account,
    accountLimit: AccountLimit
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        switch (accountLimit.period) {
          case 'gl': {
            resolve(await this.checkGlobal(account, accountLimit));
            break;
          }
          case 'an': {
            resolve(await this.checkAnnual(account, accountLimit));
            break;
          }
          case 'ml': {
            resolve(await this.checkMonthely(account, accountLimit));
            break;
          }
          case 'wl': {
            resolve(await this.checkWeekly(account, accountLimit));
            break;
          }
          case 'dl': {
            resolve(await this.checkWeekly(account, accountLimit));
            break;
          }
        }
      } catch (error) {
        reject('error:areOverLimit');
        console.error(error);
      }
    });
  }

  checkDaily(account: Account, accountLimit: AccountLimit): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let now = new Date();
        let startDate = new Date(now.getDate() - timeFromPeriod('1d'));
        const balance =
          await this.operationService.getAccountBalanceBetweenDates(
            new Date(),
            startDate,
            account.id
          );

        const coef =
          account.type === 'passif' || account.type === 'depense' ? -1 : 1;
        const total = balance * coef;
        let bool = false;
        bool = accountLimit.max ? accountLimit.max <= total : false;
        bool = bool || (accountLimit.min ? accountLimit.min <= total : false);
        resolve(bool);
      } catch (error) {
        reject(error);
      }
    });
  }

  checkWeekly(account: Account, accountLimit: AccountLimit): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let now = new Date();
        let startDate = new Date(now.getDate() - timeFromPeriod('1w'));
        const balance =
          await this.operationService.getAccountBalanceBetweenDates(
            new Date(),
            startDate,
            account.id
          );

        const coef =
          account.type === 'passif' || account.type === 'depense' ? -1 : 1;
        const total = balance * coef;
        let bool = false;
        bool = accountLimit.max ? accountLimit.max <= total : false;
        bool = bool || (accountLimit.min ? accountLimit.min <= total : false);
        resolve(bool);
      } catch (error) {
        reject(error);
      }
    });
  }

  checkMonthely(
    account: Account,
    accountLimit: AccountLimit
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const balance =
          await this.operationService.getAccountBalanceBetweenDates(
            new Date(),
            getFirstSecondOfMonth(),
            account.id
          );

        const coef =
          account.type === 'passif' || account.type === 'depense' ? -1 : 1;
        const total = balance * coef;
        let bool = false;
        bool = accountLimit.max ? accountLimit.max <= total : false;
        bool = bool || (accountLimit.min ? accountLimit.min <= total : false);
        resolve(bool);
      } catch (error) {
        reject(error);
      }
    });
  }

  checkAnnual(account: Account, accountLimit: AccountLimit): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let balance = await this.operationService.getGlobalBalanceBetweenDate(
          new Date(),
          getFirstSecondOfYear()
        );

        let bool = false;
        bool = accountLimit.max ? accountLimit.max <= balance : false;
        bool = bool || (accountLimit.min ? accountLimit.min <= balance : false);
        resolve(bool);
      } catch (error) {
        reject(error);
      }
    });
  }
  checkGlobal(account: Account, accountLimit: AccountLimit): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let bool = false;
        bool = accountLimit.max
          ? accountLimit.max <= account.totalAccount
          : false;
        bool =
          bool ||
          (accountLimit.min ? accountLimit.min <= account.totalAccount : false);
        resolve(bool);
      } catch (error) {
        reject('error:checkGlobal');
        console.error(error);
      }
    });
  }
}
