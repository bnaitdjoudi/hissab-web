import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RappelPageStore } from '../rappel-page.store';
import { PagingData } from 'src/app/model/paging-data';
import { Account } from 'src/app/model/account.model';
import { Rappel } from 'src/app/model/rappel.model';

@Component({
  selector: 'app-view',
  templateUrl: './rappel-edit.component.html',
  styleUrls: ['./rappel-edit.component.scss'],
})
export class RappelEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  accountSubscription: Subscription;
  id: any;
  accountData: PagingData<Account>;

  constructor(
    private activeRoute: ActivatedRoute,
    readonly rappelStore: RappelPageStore,
    readonly router: Router
  ) {}
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.activeRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
      } else {
        this.id = '';
      }
    });
    this.accountSubscription =
      this.rappelStore.accountStore.searchAccountResult$.subscribe(
        (data) => (this.accountData = data)
      );
  }

  onTextAccountSearchChange(text: string) {
    this.rappelStore.updateAcountSearch(text);
  }

  async onSubmit(rappel: Rappel) {
    try {
      await this.rappelStore.saveRappel(rappel);
      await this.rappelStore.relaodRappels({ limit: 10, page: 1 });
      this.router.navigate(['rappel']);
    } catch (error) {
      console.log(error);
    }
  }
}
