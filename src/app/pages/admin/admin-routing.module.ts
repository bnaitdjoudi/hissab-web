import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguagePage } from './language/language.page';

const routes: Routes = [
  {
    path: 'lang',
    component: LanguagePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminRoutingModule {}
