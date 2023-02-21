import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Account } from 'src/app/main/model/account.model';
import { Operation } from 'src/app/main/model/operation.model';

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
  @Input() accounts: Account[] = [];
  @Input() isMoreData: boolean = true;
  @Input() currBalFun: (debit: number, credit: number) => any[];

  @Output() onElementSelected = new EventEmitter<Account>();
  @Output() onIonInfiniteScroll = new EventEmitter<InfiniteScrollCustomEvent>();
  @Output() onDelete = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  onIonInfinite(ev: Event) {
    this.onIonInfiniteScroll.emit(ev as InfiniteScrollCustomEvent);
    console.log('onIonInfinite');
  }

  onSelectOperation(account: Account) {
    this.onElementSelected.emit(account);
  }

  onDeleteFired(id: number | undefined) {
    if (!!id) {
      this.onDelete.emit(id);
    }
  }

  accountClass(currentAccount: Account): string {
    return (
      currentAccount.type +
      ' ' +
      (currentAccount.totalAccount > 0 ? 'positif' : 'negatif')
    );
  }

  multiply(type: string): number {
    return type === 'actif' || type === 'income' ? 1 : -1;
  }
}
