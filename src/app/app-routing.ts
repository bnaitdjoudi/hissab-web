import { CanActivateFn, CanLoadFn, Routes } from '@angular/router';

export const routes: (
  canLoadGuard: CanLoadFn,
  canActivateGuard: CanActivateFn
) => Routes = (canLoadGuard: CanLoadFn, canActivateGuard: CanActivateFn) => [
  {
    path: '',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
    canActivate: [canActivateGuard],
  },
  {
    path: 'signup-page',
    loadChildren: () =>
      import('./pages/signup-page/signup-page.module').then(
        (m) => m.SignupPagePageModule
      ),
  },
];
