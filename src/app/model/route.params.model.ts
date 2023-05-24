export interface AccountParams {
  id: number;
}

export interface OperationParams {
  id: number;
}

export interface RouteParams {
  accountParams: AccountParams;
  operationParams: OperationParams;
}
