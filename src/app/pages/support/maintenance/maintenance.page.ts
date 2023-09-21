import { Component, OnInit } from '@angular/core';
import { SupportPageStore } from '../support-page.store';

@Component({
  selector: 'ticket',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.scss'],
})
export class MaintenancePage implements OnInit {
  showSpinner = false;

  constructor(readonly supportPageStore: SupportPageStore) {}

  ngOnInit() {}

  async launch() {
    this.showSpinner = true;
    await this.supportPageStore.processToMaintaine();
    this.showSpinner = false;
  }
}
