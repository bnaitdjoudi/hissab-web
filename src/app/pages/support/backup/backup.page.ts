import { Component, OnInit } from '@angular/core';
import { SupportPageStore } from '../support-page.store';

@Component({
  selector: 'ticket',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
  showSpinner = false;

  constructor(readonly supportPageStore: SupportPageStore) {}

  ngOnInit() {}

  async launch() {
    this.showSpinner = true;
    await this.supportPageStore.processToMaintaine();
    this.showSpinner = false;
  }

  restore() {
    throw new Error('Method not implemented.');
  }
  async makebackup() {
    await this.supportPageStore.makeBackup();
  }
}
