import { PagingData } from './paging-data';

export interface Notify {
  id?: number;
  accountId: number;
  rappelId: number;
  notifyDateBegin: Date;
  isOpen: boolean;
  accountName?: string;
  description?: string;
  eventDate: Date;
  periode?: '1w' | '2w' | '1m' | '2m';
}

export interface NotificationStoreModel {
  data: PagingData<Notify>;
}
