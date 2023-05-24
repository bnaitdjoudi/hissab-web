import { BehaviorSubject } from 'rxjs';

export type Period = 'month' | 'global' | '' | 'cyear';

export interface BalanceRequest {
  type: Period;
  param: any[];
  subject?: BehaviorSubject<BalanceResult>;
}

export interface BalanceResult {
  type?: string;
  result: number;
  period: Period;
}
