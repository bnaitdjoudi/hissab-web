import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RapportPage } from './rapport.page';
import { GlobalRapportComponent } from './rapport-views/asset-rapport/global-rapport/global-rapport.component';
import { OverTimeRapportComponent } from './rapport-views/asset-rapport/overtime-rapport/overtime-rapport.component';

const routes: Routes = [
  {
    path: '',
    component: RapportPage,
  },

  {
    path: ':page',
    component: RapportPage,
    children: [
      {
        path: 'global',
        component: GlobalRapportComponent,
      },

      {
        path: 'aor',
        component: OverTimeRapportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RapportPageRoutingModule {}
