import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CommmonService {
  constructor(private translateService: TranslateService) {}

  translatePath(path: string) {
    return path
      .split('/')
      .map((el) => this.translateService.instant(el))
      .join('/');
  }
}
