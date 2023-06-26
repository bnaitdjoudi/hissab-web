import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupLoadPage } from './load/sign-up.load.page';
import { SignupPage } from './signup/sign-up.page';
import { SignInPage } from './signin/sign-in.page';

const routes: Routes = [
  {
    path: '',
    component: SignupLoadPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: 'signin',
    component: SignInPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPagePageRoutingModule {}
