import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminStore } from 'src/app/pages/admin/admin.store';

@Component({
  selector: 'hissab-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  langSubscription: Subscription;

  @Input() title: string;
  @Input() showTitle: boolean = false;
  slot: string = 'start';
  constructor(readonly adminStore: AdminStore) {}

  ngOnDestroy(): void {
    console.log('HeaderComponent.', 'ngOnDestroy');
  }
  ngOnInit(): void {
    this.langSubscription = this.adminStore.lang$.subscribe((val) => {
      if (val === 'ar') {
        this.slot = 'end';
      } else {
        this.slot = 'start';
      }
    });
  }
}
