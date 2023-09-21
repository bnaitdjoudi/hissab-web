import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { routes } from './app-routing';
import { AuthGuardCanLoad, AuthGuardCanActivate } from './guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(routes(AuthGuardCanLoad, AuthGuardCanActivate), {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
