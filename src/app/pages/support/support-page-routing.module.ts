import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketPage } from './tickets/ticket.page';
import { PatchPage } from './patch/patch.page';
import { SupportPage } from './home/support.page';
import { MaintenancePage } from './maintenance/maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: SupportPage,
  },
  {
    path: 'ticket',
    component: TicketPage,
  },
  {
    path: 'patch',
    component: PatchPage,
  },
  {
    path: 'auto-maintenance',
    component: MaintenancePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPagePageRoutingModule {}
