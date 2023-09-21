import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Observable, skip } from 'rxjs';
import { BalanceResult, Period } from 'src/app/model/balance.model';
import {
  AccountBalancePeriod,
  IncomesExpenceRapport,
  OverTimeAssetRapportResult,
  RapportStoreModel,
  RapportType,
} from 'src/app/model/rapport-store.model';
import { BordService } from 'src/app/services/bord.service';
import { Store } from 'src/app/store/store';
import { getPeriodDatesByName } from 'src/app/tools/date.tools';

@Injectable({ providedIn: 'root' })
export class RapportStore extends Store<RapportStoreModel> {
  rapports$: Observable<RapportType[]> = this.select<RapportType[]>(
    (state) => state.rapports
  );

  globalAssetsRapport$: Observable<BalanceResult[]> = this.select<
    BalanceResult[]
  >((state) => state.globalAssetsRapport);

  overTimeAssetsRapport$: Observable<OverTimeAssetRapportResult> =
    this.select<OverTimeAssetRapportResult>(
      (state) => state.overTimeAssetsRapport
    );

  incomesExpenceRapport$: Observable<IncomesExpenceRapport> =
    this.select<IncomesExpenceRapport>((state) => state.incomesExpenceRapport);

  periodAsset$: Observable<Period> = this.select<Period>(
    (state) => state.periodAsset
  );

  periodsSelected$: Observable<String[]> = this.select<String[]>(
    (state) => state.periodsSelected
  );

  incomesAccountsDetailsRapport$: Observable<AccountBalancePeriod[]> =
    this.select<AccountBalancePeriod[]>(
      (state) => state.incomesAccountsDetailsRapport
    );

  expenseAccountsDetailsRapport$: Observable<AccountBalancePeriod[]> =
    this.select<AccountBalancePeriod[]>(
      (state) => state.expenseAccountsDetailsRapport
    );

  constructor(readonly bordService: BordService) {
    super({
      rapports: [
        {
          name: 'Assets and Liabilities',
          short: 'al',
          subType: [],
        },
        { name: 'Incomes and Expenses', short: 'ie', subType: [] },
        { name: 'Accounts summary', short: 'as', subType: [] },
      ],
      globalAssetsRapport: [],
      overTimeAssetsRapport: { result: [] },
      incomesExpenceRapport: { result: [] },
      periodAsset: 'week',
      periodsSelected: [
        'jan',
        'feb',
        'mar',
        'apr',
        'mai',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ],
      expenseAccountsDetailsRapport: [],
      incomesAccountsDetailsRapport: [],
    });

    this.periodsSelected$.subscribe((val) => {
      this.reloadIncomesExpenceRapport(val);
      this.loadIncomesRapport();
    });
  }

  reloadIncomesExpenceRapport(periods: String[]) {
    this.bordService
      .loadIncomesExpencesRapport(periods)
      .then((val) => this.updateIncomesExpenceRapport(val))
      .catch((error) => console.error(error));
  }

  updateIncomesExpenceRapport(
    incomesExpenceRapport: IncomesExpenceRapport
  ): any {
    this.setState({
      ...this.state,
      incomesExpenceRapport: incomesExpenceRapport,
    });
  }

  async loadAllBalance() {
    let btypes = ['actif', 'passif'];
    let resultB: BalanceResult[] = await Promise.all(
      btypes.map((type) =>
        this.bordService.getBalanceByPeriodAndType(
          { type: 'global', param: [] },
          type
        )
      )
    );

    this.setState({ ...this.state, globalAssetsRapport: resultB });
  }

  async loadOverTimeAssetRapport(period: Period) {
    try {
      const result: OverTimeAssetRapportResult =
        await this.bordService.loadOverTimeAssetRapport(period);
      this.setState({ ...this.state, overTimeAssetsRapport: result });
    } catch (error) {}
  }

  displayDateList() {
    // Returns an array of whatever is in dates.push().
    var dates = this.state.periodsSelected.map((el) =>
      getPeriodDatesByName(el)
    );

    console.log(dates);
  }

  uodateDateAssetsPeriod(period: Period) {
    this.setState({ ...this.state, periodAsset: period });
  }

  upDateSelectedPeriods(value: any) {
    this.setState({ ...this.state, periodsSelected: value });
  }

  loadIncomesRapport() {
    this.bordService
      .loadIncomesRapport(this.state.periodsSelected)
      .then((val) => this.updateIncomesRapport(val))
      .catch((error) => console.error(error));
  }

  loadExpencesRapport() {
    this.bordService
      .loadExpencesRapport(this.state.periodsSelected)
      .then((val) => this.updateExpencesRapport(val))
      .catch((error) => console.error(error));
  }
  updateExpencesRapport(val: AccountBalancePeriod[]): any {
    this.setState({ ...this.state, expenseAccountsDetailsRapport: val });
  }

  updateIncomesRapport(val: AccountBalancePeriod[]) {
    this.setState({ ...this.state, incomesAccountsDetailsRapport: val });
  }
}
