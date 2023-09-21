import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from 'src/app/model/account.model';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { PagingData } from 'src/app/model/paging-data';

@Component({
  selector: 'search-account',
  templateUrl: './search-account.component.html',
  styleUrls: ['./search-account.component.css'],
})
export class SearchAccountComponent implements OnInit {
  @Output()
  onSearchInputClick: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onSearchInputText: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onAccountSelected: EventEmitter<Account> = new EventEmitter<Account>();

  @Input() accountData: PagingData<Account> = {
    currentPage: 1,
    data: [],
    totalPage: 0,
  };

  text = '';

  ngOnInit(): void {
    this.onSearchInputText.emit(this.text);
  }

  onSearchInputClicked() {
    this.onSearchInputClick.emit();
  }

  onTextInputChange($event: any) {
    this.text = $event.target.value;
    this.onSearchInputText.emit(this.text);
  }

  selectAccount(account: Account) {
    this.onAccountSelected.emit(account);
  }
}
