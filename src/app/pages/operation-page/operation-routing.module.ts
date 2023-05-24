import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationPageEditComponent } from './edit/operation-page-edit.component';
import { OperationPageNewPage } from './new/operation-page-new.page';
import { OperationPageViewComponent } from './view/operation-page-view.component';
import { OperationSearchPage } from './search/operation-search.page';

const routes: Routes = [
  {
    path: 'new',
    component: OperationPageNewPage,
  },
  {
    path: 'new/:id',
    component: OperationPageNewPage,
  },
  {
    path: 'search',
    component: OperationSearchPage,
  },
  {
    path: ':id',
    component: OperationPageViewComponent,
  },
  {
    path: ':id/edit',
    component: OperationPageEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class OperationPageRoutingModule {}
