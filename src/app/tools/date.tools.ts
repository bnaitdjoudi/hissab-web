import { parseISO } from 'date-fns';
import { Period } from '../model/balance.model';

export const getFirstSecondOfMonth = (): Date => {
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 1, 0);
};

export const getFirstSecondOfYear = (): Date => {
  let now = new Date();
  return new Date(now.getFullYear(), 1, 1, 0, 0, 1, 0);
};

export const getDatesByPeriodValue = (period: Period): any => {
  switch (period) {
    case 'global': {
      let [d1, d2] = [parseISO('1900-04-30 00:56:11'), new Date()];
      return [d1, d2];
    }

    case 'month': {
      let [d1, d2] = [getFirstSecondOfMonth(), new Date()];
      return [d1, d2];
    }

    case 'cyear': {
      let [d1, d2] = [getFirstSecondOfYear(), new Date()];
      return [d1, d2];
    }
    default: {
      let [d1, d2] = [getFirstSecondOfMonth(), new Date()];
      return [d1, d2];
    }
  }
};
