import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'his-currency', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return '$' + Math.round(value);
  }
}
