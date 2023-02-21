import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

@Pipe({ name: 'dateOperation' })
export class DateListFormatPipe implements PipeTransform {
  transform(value: Date, exponent = 1): string {
    return formatInTimeZone(value, 'America/New_York', 'dd MMM yyyy');
  }
}
