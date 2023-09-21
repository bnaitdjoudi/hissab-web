import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';
import { DateListFormatPipe } from './date-list-format.pipe';
import { DateFormatDayPipe } from './date-format-day.pipe';
import { DateOnlyHourPipe } from './date.only.hour.pipe';

@NgModule({
  declarations: [
    DateFormatPipe,
    DateListFormatPipe,
    DateFormatDayPipe,
    DateOnlyHourPipe,
  ],

  exports: [
    DateFormatPipe,
    DateListFormatPipe,
    DateFormatDayPipe,
    DateOnlyHourPipe,
  ],
})
export class PipeModule {}
