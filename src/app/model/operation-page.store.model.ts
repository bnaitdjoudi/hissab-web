import { Account } from './account.model';
import { Operation } from './operation.model';
import { PagingData } from './paging-data';
import { PagingRequest } from './paging-request.model';

export interface OperationPageStoreModel {
  currentOperation?: Operation;
  currentAccount?: Account;
  operationSerachData?: OperationSearchData;
  operationSearchResult?: PagingData<Operation>;
  
}

export interface OperationSearchData extends PagingRequest {
  description: string;
  endDate: Date | null;
  startDate: Date | null;
  accountId?: number;
  
}
