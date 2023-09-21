import { parseISO } from 'date-fns';
import { Period } from '../model/balance.model';
import { PeriodDates } from '../model/rapport-store.model';

export const MONDAY: string = 'Monday';
export const TUESDAY: string = 'Tuesday';
export const WEDNESDAY: string = 'Wednesday';
export const THURSDAY: string = 'Thursday';
export const FRIDAY: string = 'Friday';
export const SATURDAY: string = 'Saturday';
export const SUNDAY: string = 'Sunday';

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

export const getNumberFromNameDay = (name: string): number => {
  switch (name) {
    case SUNDAY: {
      return 0;
    }
    case MONDAY: {
      return 1;
    }
    case TUESDAY: {
      return 2;
    }
    case WEDNESDAY: {
      return 3;
    }
    case THURSDAY: {
      return 4;
    }
    case FRIDAY: {
      return 5;
    }
    case SATURDAY: {
      return 6;
    }
    default: {
      return 0;
    }
  }
};

export const getFistDateOfDayInYear = (day: string, year: number): Date => {
  let dayOfWeek = getNumberFromNameDay(day);
  let firstDateOfYear = new Date('' + year);
  let date = firstDateOfYear;

  while (date.getDay() !== dayOfWeek) {
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  }

  return date;
};

export const getDatesOfDayInYear = (day: string, year: number): Date[] => {
  var startDate = getFistDateOfDayInYear(day, year);
  var date = startDate;

  var dates: any[] = [];

  while (date.getFullYear() == year) {
    dates = [...dates, new Date(date.getTime())]; // change this to change the output
    date.setTime(date.getTime() + 1000 * 7 * 24 * 60 * 60);
  }
  return dates;
};

export const getAllendMontDatesInYear = (year: number): Date[] => {
  let dates: Date[] = [];

  for (let i = 1; i <= 12; i++) {
    let date = new Date(year, i, 1);
    date.setTime(date.getTime() - 1000);
    dates.push(date);
  }

  return dates;
};

export const getPeriodDatesByName = (name: String): PeriodDates => {
  switch (name) {
    case 'jan': {
      return {
        start: new Date(2023, 0, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[0],
      };
    }

    case 'feb': {
      return {
        start: new Date(2023, 1, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[1],
      };
    }
    case 'mar': {
      return {
        start: new Date(2023, 2, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[2],
      };
    }
    case 'apr': {
      return {
        start: new Date(2023, 3, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[3],
      };
    }

    case 'mai': {
      return {
        start: new Date(2023, 4, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[4],
      };
    }
    case 'jun': {
      return {
        start: new Date(2023, 5, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[5],
      };
    }
    case 'jul': {
      return {
        start: new Date(2023, 6, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[6],
      };
    }
    case 'aug': {
      return {
        start: new Date(2023, 7, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[7],
      };
    }
    case 'sep': {
      return {
        start: new Date(2023, 8, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[8],
      };
    }

    case 'oct': {
      return {
        start: new Date(2023, 9, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[9],
      };
    }
    case 'nov': {
      return {
        start: new Date(2023, 10, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[10],
      };
    }
    case 'dec': {
      return {
        start: new Date(2023, 11, 1, 0, 0, 0),
        end: getAllendMontDatesInYear(2023)[11],
      };
    }

    default: {
      return {
        start: new Date(2023, 1, 1, 0, 0, 0),
        end: new Date(2023, 1, 1, 31, 59, 59),
      };
    }
  }
};

export const timeFromPeriod = (
  periode: '1d' | '1w' | '2w' | '1m' | '2m'
): number => {
  let time = 1000 * 60 * 60 * 24;

  if (periode === '1w') {
    return time * 7;
  }
  if (periode === '2w') {
    return time * 7 * 2;
  }

  return time;
};

export const getNextPeriodDate = (
  periode: '1d' | '1w' | '2w' | '1m' | '2m',
  firstDate: Date,
  currentYear: number
): Date[] => {
  const dates: Date[] = [];
  let date = firstDate;

  if (periode !== '1m' && periode !== '2m') {
    date.setTime(date.getTime() + timeFromPeriod(periode));
    while (date.getFullYear() <= currentYear) {
      dates.push(new Date(date.getTime()));
      date.setTime(date.getTime() + timeFromPeriod(periode));
    }
  } else {
    let step = periode === '1m' ? 1 : 2;
    date.setMonth(date.getMonth() + step);
    while (date.getFullYear() <= currentYear) {
      dates.push(new Date(date.getTime()));
      date.setMonth(date.getMonth() + step);
    }
  }

  return dates;
};

/**
 * 'jan',
        'feb',
        'mar',
        'apr',
        'mai',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
 * 
*/
