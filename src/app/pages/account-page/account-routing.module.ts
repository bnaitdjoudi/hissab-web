import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPageViewComponent } from './view/account-page.component';
import { AccountNewPage } from './new/account-new.page';
import { AccountSearchPage } from './search/account-search.page';

const routes: Routes = [
  {
    path: 'new',
    component: AccountNewPage,
  },
  {
    path: 'search',
    component: AccountSearchPage,
  },
  {
    path: ':id',
    component: AccountPageViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AccountPageRoutingModule {}
