import { Account } from './account.model';

export interface MainStoreData {
  balanceAccount?: Account;
  mainAccounts: Account[];
  currentAccountId?: number;
}
