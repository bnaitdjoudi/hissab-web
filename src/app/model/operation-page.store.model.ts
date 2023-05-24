import { Account } from './account.model';
import { Operation } from './operation.model';

export interface OperationPageStoreModel {
  currentOperation?: Operation;
  currentAccount?: Account;
  
}
