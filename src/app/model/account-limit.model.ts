export interface AccountLimit {
  id: number;
  accountId: number;
  max?: number;
  min?: number;
  period: string;
}
