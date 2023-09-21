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
  {
    path: 'support',
    loadChildren: () =>
      import('./../support/support-page.module').then(
        (m) => m.SupportPageModule
      ),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./../profile-page/profile.module').then(
        (m) => m.ProfilePageModule
      ),
  },

  {
    path: 'rapport',
    loadChildren: () =>
      import('./../rapport/rapport.module').then((m) => m.RapportPageModule),
  },

  {
    path: 'rappel',
    loadChildren: () =>
      import('./../rappel/rappel.module').then((m) => m.RappelPageModule),
  },

  {
    path: 'notification',
    loadChildren: () =>
      import('./../notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainPageRoutingModule {}
