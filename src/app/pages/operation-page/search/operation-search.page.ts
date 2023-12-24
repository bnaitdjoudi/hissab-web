import { Component, OnInit } from '@angular/core';
import { OperationPageStore } from '../operation-page.store';

import { Account } from 'src/app/model/account.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GoHome } from 'src/app/shared/direction.shared';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Operation } from 'src/app/model/operation.model';
import { Location } from '@angular/common';

@Component({
  selector: 'search',
  templateUrl: './operation-search.page.html',
  styleUrls: ['./operation-search.page.scss'],
})
export class OperationSearchPage extends GoHome implements OnInit {
  accoutModal = false;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  selectedAccount: Account = { acountName: '' } as Account;
  currentAccounts: Operation[] = [];
  suscribtion: Subscription;

  constructor(
    readonly operationStore: OperationPageStore,
    override readonly router: Router,
    readonly location: Location
  ) {
    super(router);
  }

  ngOnInit() {
    this.operationStore.accountStore.setTextSearch(undefined);
    this.description = '';
    this.validate();
    this.suscribtion = this.operationStore.operationSearchResult$.subscribe(
      (result) => {
        this.currentAccounts = result ? result?.data : [];
      }
    );
  }

  onAccontSearchChange(value: string) {
    this.operationStore.accountStore.setTextSearch(value);
  }

  openAccountSearch() {
    this.accoutModal = true;
    this.operationStore.accountStore.setTextSearch('');
  }

  model2Dismiss() {
    this.accoutModal = false;
    this.operationStore.accountStore.setTextSearch(undefined);
  }

  onAccountSelected(account: Account) {
    this.selectedAccount = account;
    this.accoutModal = false;
  }
  changeDate(type: string, $event: MatDatepickerInputEvent<Date>) {
    switch (type) {
      case 'end': {
        this.endDate = $event.value;
        break;
      }
      case 'start': {
        this.startDate = $event.value;
        this.endDate = null;
      }
    }
  }

  handleInput($event: any) {
    this.description = $event.target.value;
    this.validate();
  }

  clearFilter() {
    this.endDate = null;
    this.startDate = null;
    this.selectedAccount = { acountName: '' } as Account;
  }
  validate() {
    this.operationStore.setOperationSerachData({
      description: this.description,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 15,
      page: 1,
      accountId: this.selectedAccount.id,
    });
  }

  add() {
    this.router.navigate(['/operation/new'], {});
  }

  goToSelected(arg0: number) {
    this.router.navigate(['/operation/' + arg0], {});
  }

  backNavigation() {
    this.location.back();
  }
}
