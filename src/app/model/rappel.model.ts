export interface RappelModel {
  rappels: Rappel[];
}

export interface Rappel {
  [key: string]: any;
  id: number;
  accountId: number;
  description: string;
  eventDate: Date;
  notifyDate: Date;
  accountName: string;
  isPeriode: boolean;
  periode: '1w' | '2w' | '1m' | '2m';
  isActive: boolean;
}
