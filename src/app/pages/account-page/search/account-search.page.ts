import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountPageStore } from '../account-page.store';
import { Account } from 'src/app/model/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'account-new',
  templateUrl: './account-search.page.html',
  styleUrls: ['./account-search.page.scss'],
})
export class AccountSearchPage implements OnInit, OnDestroy {
  constructor(
    readonly accountStore: AccountPageStore,
    private router: Router
  ) {}

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.accountStore.listAccounts$.subscribe((accs) => {
      this.results = accs;
    });

    this.accountStore.searchAccount('%%');
  }
  public results: Account[] = [];

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.accountStore.searchAccount('%' + query + '%');
  }

  goToAccountOrResult(id: number) {
    if (this.accountStore.state.editing) {
      this.accountStore.reloadAccount(id);
      this.router.navigate(['account/new']);
      console.log('l;js;dlfj;lsdjf;lasjdf;lsdf;l');
    } else {
      this.router.navigate(['account/' + id]);
    }
  }
}
