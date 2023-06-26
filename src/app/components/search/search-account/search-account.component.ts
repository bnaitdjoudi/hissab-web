import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from 'src/app/model/account.model';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { PagingData } from 'src/app/model/paging-data';

@Component({
  selector: 'search-account',
  templateUrl: './search-account.component.html',
  styleUrls: ['./search-account.component.css'],
})
export class SearchAccountComponent {
  @Output()
  onSearchInputClick: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onSearchInputText: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onAccountSelected: EventEmitter<Account> = new EventEmitter<Account>();

  @Input() accountData: PagingData<Account> | null = {
    currentPage: 1,
    data: [],
    totalPage: 0,
  };

  onSearchInputClicked() {
    this.onSearchInputClick.emit();
  }

  onTextInputChange($event: any) {
    this.onSearchInputText.emit($event.target.value);
  }

  selectAccount(account: Account) {
    this.onAccountSelected.emit(account);
    
  }
}
