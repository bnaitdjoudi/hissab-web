export class OperationDto {
  operationId?: number;

  operationProfile: string;

  numTrans: string;

  time: Date;

  description: string;

  statut: string;

  credit: number;

  debit: number;

  balance: number;

  idAccount: number;

  transfer: string;

  attachement?: string;
}
