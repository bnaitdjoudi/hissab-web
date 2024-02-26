import { Injectable } from '@angular/core';
import { AdminModel } from 'src/app/model/admin.model';
import { Store } from 'src/app/store/store';
import { AdminService } from './admin.service';

import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class AdminStore extends Store<AdminModel> {
  lang$: Observable<string> = this.select((state: AdminModel) => state.lang);

  constructor(
    readonly adminService: AdminService,
    readonly translateService: TranslateService
  ) {
    super({ lang: 'en' });
    this.adminService
      .getCurrentLang()
      .then((lang) => this.setState({ lang: lang }))
      .catch((error) => console.warn('error with session store', error));
    this.lang$.subscribe((val) => {
      this.adminService.setCurrentLang(val);
      this.translateService.setDefaultLang(val);
      this.translateService.reloadLang(val);
    });
  }

  updateLang(value: string) {
    this.setState({ ...this.state, lang: value });
  }
}
