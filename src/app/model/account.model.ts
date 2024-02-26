import { AccountResume } from './account.resume.model';

export interface Account {
  id: number;
  acountName: string;
  totalAccount: number;
  isMain: boolean;
  type: string;
  parentId: number;
  path: string;
  isLeaf: boolean;
  resume: AccountResume;
  debit?: number;
  credit?: number;
  rbalance?: number;
  limitMax?: number;
  limitMin?: number;
}
