import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RappelPageStore } from '../rappel-page.store';
import { Rappel } from 'src/app/model/rappel.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './rappel-list.component.html',
  styleUrls: ['./rappel-list.component.scss'],
})
export class RappelListComponent implements OnInit, AfterViewInit {
  rappels: Rappel[] = [];

  selectedRappel: Rappel;

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.isAlertOpen = false;
      },
    },
    {
      text: 'Confirm',
      role: 'confirm',
      handler: () => {
        this.isAlertOpen = false;
        this.deleteSelectedRappel();
      },
    },
  ];
  isAlertOpen: boolean;

  constructor(readonly rappelStore: RappelPageStore, readonly route: Router) {}
  ngAfterViewInit(): void {
    this.rappelStore.relaodRappels({ limit: 10, page: 1 });
  }

  ngOnInit(): void {
    this.rappelStore.rappels$.subscribe((rappels) => (this.rappels = rappels));
    this.rappelStore.relaodRappels({ limit: 10, page: 1 });
  }

  goToNew() {
    this.route.navigate(['rappel/edit/new']);
  }

  confirmDelete(rappel: Rappel) {
    console.log('confim');
    this.selectedRappel = rappel;
    this.isAlertOpen = true;
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    this.isAlertOpen = false;
  }

  async deleteSelectedRappel() {
    try {
      await this.rappelStore.deleteRappel(this.selectedRappel);
      this.rappelStore.relaodRappels({ limit: 10, page: 1 });
    } catch (error) {
      console.error(error);
    }
  }

  goHome() {
    this.route.navigate(['']);
  }
}
