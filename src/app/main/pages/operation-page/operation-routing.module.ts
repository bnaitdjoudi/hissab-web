import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationPageEditComponent } from './edit/operation-page-edit.component';
import { OperationPageViewComponent } from './view/operation-page-view.component';

const routes: Routes = [
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
