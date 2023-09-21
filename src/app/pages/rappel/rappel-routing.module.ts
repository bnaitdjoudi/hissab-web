import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RappelListComponent } from './list/rappel-list.component';
import { RappelEditComponent } from './edit/rappel-edit.component';

const routes: Routes = [
  {
    path: '',
    component: RappelListComponent,
  },

  {
    path: 'edit/:id',
    component: RappelEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RappelPageRoutingModule {}
