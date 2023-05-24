import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './../account-page/account-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'account/:id',
    component: AccountPageComponent,
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
