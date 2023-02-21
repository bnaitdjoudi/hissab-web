import { Account } from '../../model/account.model';
import { LeafAccount } from '../../model/leaf-account.model';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';

export interface AccountPageStoreModel {
  currentAccount: Account;
  subAccountData: PagingData<Account>;
  operationsData: PagingData<Operation>;
  newOperation?: Operation | null;
  operationsPagingRequest: PagingRequest;
  accountsPagingRequest: PagingRequest;
  leafAccounts: LeafAccount[];
}
