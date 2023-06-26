export interface Operation {
  [key: string]: any;
  id: number;
  numTrans: string;
  time: Date;
  description: string;
  statut: string;
  credit: number;
  debit: number;
  balance: number;
  idAccount: number;
  transfer: string;
  accountType?: string;
  random?: string;
  accountName?: string;
}
