import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

export class CustomTranslateLoader extends TranslateHttpLoader {
  constructor(http: HttpClient, prefix?: string, suffix?: string) {
    super(http, prefix, suffix);
  }

  /**
   * Gets the translations from the server
   */
  override getTranslation(lang: string): Observable<Object> {
    return super.getTranslation(lang);
  }
}
