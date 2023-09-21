import { BalanceResult, Period } from './balance.model';

export interface RapportType {
  short: string;
  name: string;
  subType: RapportType[];
}

export interface RapportStoreModel {
  rapports: RapportType[];

  globalAssetsRapport: BalanceResult[];
  overTimeAssetsRapport: OverTimeAssetRapportResult;
  incomesExpenceRapport: IncomesExpenceRapport;
  periodAsset: Period;
  periodsSelected: string[];
  incomesAccountsDetailsRapport: AccountBalancePeriod[];
  expenseAccountsDetailsRapport: AccountBalancePeriod[];
}

export interface AssetAtDateRapport {
  date: Date;
  assets: number;
  liabilities: number;
}

export interface OverTimeAssetRapportResult {
  result: AssetAtDateRapport[];
}

export interface PeriodDates {
  start: Date;
  end: Date;
}

export interface IncomesExpenceRapport {
  result: AssetAtDateRapport[];
}

export interface AccountBalancePeriod {
  periodDates: PeriodDates;
  accountBalance: AccountBalance[];
}

export interface AccountBalance {
  balance: number;
  accountId: number;
  accountName: string;
}
