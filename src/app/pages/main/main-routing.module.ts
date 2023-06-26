import { NgModule, inject } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./../account-page/account.module').then(
        (m) => m.AccountPageModule
      ),
  },
  {
    path: 'operation',
    loadChildren: () =>
      import('./../operation-page/operation.module').then(
        (m) => m.OperationPageModule
      ),
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./../dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainPageRoutingModule {}
