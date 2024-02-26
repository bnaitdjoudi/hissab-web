import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminStore } from 'src/app/pages/admin/admin.store';
import { MainStore } from 'src/app/store/main.store';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit, OnDestroy {
  langSubscription: Subscription;

  @Input() selectedRoute: 'dash' | 'operation' | 'account';
  @Output() onMenuSelected: EventEmitter<void> = new EventEmitter<void>();

  iconslot: string = 'start';
  labelclass: string = 'ltr-label';

  constructor(
    readonly router: Router,
    readonly mainService: MainStore,
    readonly adminStore: AdminStore
  ) {}
  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    console.log(this.selectedRoute);
    this.langSubscription = this.adminStore.lang$.subscribe((val) => {
      if (val === 'ar') {
        this.iconslot = 'end';
        this.labelclass = 'rtl-label';
      } else {
        this.iconslot = 'start';
        this.labelclass = 'ltr-label';
      }
    });
  }

  getSelectedClass(menuRoute: any) {
    return this.selectedRoute === menuRoute ? 'selected' : '';
  }

  goto(url: string) {
    this.onMenuSelected.emit();
    this.router.navigate([url]);
  }

  getDashBoard(): string {
    return this.mainService.getTranslation('menu.dashbord');
  }
}
