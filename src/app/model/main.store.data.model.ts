import { Account } from './account.model';
import { Period } from './balance.model';
import { Flag } from './flags.model';
import { ProfileModel } from './profil.model';

export interface MainStoreData {
  balanceAccount?: Account;
  mainAccounts: Account[];
  currentAccountId?: number;
  globalBalance: number;
  period: Period;
  init: boolean;
  menuRoute: 'dash' | 'operation' | 'account';
  flags: Map<string, Flag>;
  iSignedin: boolean;
  currentProfile?: ProfileModel;
}
