import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'onlyHour' })
export class DateOnlyHourPipe implements PipeTransform {
  transform(value: Date): string {
    return format(value, 'HH:mm');
  }
}
