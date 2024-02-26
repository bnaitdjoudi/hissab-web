import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AdminStore } from '../admin.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'language-page',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit, OnDestroy {
  langSubscription: Subscription;
  lang: string = 'en';

  constructor(
    private navCtrl: NavController,
    readonly adminStore: AdminStore
  ) {}
  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.langSubscription = this.adminStore.lang$.subscribe((lang) => {
      this.lang = lang;
    });
  }
  back() {
    this.navCtrl.back();
  }

  valueChange(event: any) {
    this.lang = event.detail.value;
  }

  get slot(): string {
    if (this.lang === 'ar') {
      return 'end';
    }
    return '';
  }

  apply() {
    this.adminStore.updateLang(this.lang);
  }
}
