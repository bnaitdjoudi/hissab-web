import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
  },
  {
    path: 'account/:id',
    component: AccountPageComponent,
  },
  {
    path: 'operation',
    loadChildren: () =>
      import('./pages/operation-page/operation.module').then(
        (m) => m.OperationPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainPageRoutingModule {}
