import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'dateHissabDay' })
export class DateFormatDayPipe implements PipeTransform {
  transform(value: Date, period: any): string {
    if (!period) {
      return format(value, 'EEEE dd MMM yyyy');
    }
    switch (period) {
      case '1m': {
        return format(value, 'dd ') + ' in month';
      }

      default: {
        return format(value, 'EEEE dd MMM yyyy');
      }
    }
  }
}
