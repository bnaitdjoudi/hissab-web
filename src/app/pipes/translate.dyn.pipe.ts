import {
  ChangeDetectorRef,
  Injector,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MainStore } from '../store/main.store';
import { TranslateService } from '@ngx-translate/core';

import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AdminStore } from '../pages/admin/admin.store';

@Pipe({ name: 'traduction', pure: false })
export class TranslatePipe implements PipeTransform {
  private asyncPipe: AsyncPipe;
  constructor(
    readonly mainStore: MainStore,
    readonly translateService: TranslateService,
    readonly adminStore: AdminStore,
    private injector: Injector
  ) {
    this.asyncPipe = new AsyncPipe(injector.get(ChangeDetectorRef));
    this.adminStore.lang$.subscribe((val) => {
      this.translateService.setDefaultLang(val);
    });
  }

  transform(value: string): Observable<string> {
    value = value ? value : 'val';
    return this.asyncPipe.transform(this.translateService.get(value));
  }
}
