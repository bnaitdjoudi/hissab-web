import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

@Pipe({ name: 'dateHissab' })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date, exponent = 1): string {
    return formatInTimeZone(value, 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss");
  }
}
