import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';
import { DateListFormatPipe } from './date-list-format.pipe';

@NgModule({
  declarations: [DateFormatPipe, DateListFormatPipe],

  exports: [DateFormatPipe, DateListFormatPipe],
})
export class PipeModule {}
