import { Period } from '../model/balance.model';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getLabelPeriode = (period: Period): string => {
  switch (period) {
    case 'month': {
      const d = new Date();
      return 'month.' + monthNames[d.getMonth()];
    }

    case 'global': {
      return 'period.global';
    }

    case 'cyear': {
      const d = new Date();
      return '' + d.getFullYear();
    }

    default: {
      return '';
    }
  }
};
