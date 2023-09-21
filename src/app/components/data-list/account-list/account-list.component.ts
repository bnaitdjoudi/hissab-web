import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Account } from 'src/app/model/account.model';
import { PagingData } from 'src/app/model/paging-data';

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss', './../data-list-header.scss'],
})
export class AccountListComponent implements OnInit {
  currentAccountData: Account[] = [];

  @Input() set accountData(data: PagingData<Account>) {
    this.currentAccountData = data.data;
    this.currentAccountData = [...this.currentAccountData];
  }
  @Input() isMoreData: boolean = true;
  @Input() currBalFun: (debit: number, credit: number) => any[];
  @Input() account: Account;
  @Input() periodLabel: string;

  @Output() onElementSelected = new EventEmitter<Account>();
  @Output() onIonInfiniteScroll = new EventEmitter<InfiniteScrollCustomEvent>();
  @Output() onDelete = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
    console.log(
      'init ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'
    );
  }

  onIonInfinite(ev: Event) {
    console.log('infinitie');
    this.onIonInfiniteScroll.emit(ev as InfiniteScrollCustomEvent);
  }

  onSelectAccount(account: Account) {
    this.onElementSelected.emit(account);
  }

  onDeleteFired(id: number | undefined) {
    if (!!id) {
      this.onDelete.emit(id);
    }
  }

  accountClass(currentAccount: Account): string {
    return 'balance';
  }

  multiply(type: string): number {
    return type === 'actif' || type === 'income' ? 1 : -1;
  }

  trackItem(index: number, item: Account) {
    return item.id + this.currentAccountData?.length;
  }

  multiplyFor(type: string): number {
    return type === 'actif' || type === 'income' ? 1 : -1;
  }
}
