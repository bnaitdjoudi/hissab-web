import { Account } from './account.model';
import { Period } from './balance.model';

export interface MainStoreData {
  balanceAccount?: Account;
  mainAccounts: Account[];
  currentAccountId?: number;
  globalBalance: number;
  period: Period;
  init: boolean;
  menuRoute: 'dash' | 'operation' | 'account';
}
