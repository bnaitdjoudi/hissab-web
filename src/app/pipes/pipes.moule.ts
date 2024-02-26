import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';
import { DateListFormatPipe } from './date-list-format.pipe';
import { DateFormatDayPipe } from './date-format-day.pipe';
import { DateOnlyHourPipe } from './date.only.hour.pipe';
import { TranslatePipe } from './translate.dyn.pipe';
import { NgxTranslateModule } from '../translate/translate.module';

@NgModule({
  imports: [NgxTranslateModule],
  declarations: [
    DateFormatPipe,
    DateListFormatPipe,
    DateFormatDayPipe,
    DateOnlyHourPipe,
    TranslatePipe,
  ],

  exports: [
    DateFormatPipe,
    DateListFormatPipe,
    DateFormatDayPipe,
    DateOnlyHourPipe,
    TranslatePipe,
  ],
})
export class PipeModule {}
