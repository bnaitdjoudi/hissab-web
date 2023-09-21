import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanLoadFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SignUpPageStore } from '../pages/signup-page/signup-page.store';
import { SessionStorageService } from '../services/sessionstorage.service';
import { resolve } from 'cypress/types/bluebird';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    readonly sessionStore: SessionStorageService,
    readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise<boolean | UrlTree>(async (resolve, reject) => {
      let can = await this.sessionStore.checkIsSignedIn();
      console.log('callllllllllllllllllllllllllllll' + can);
      if (!can) {
        this.router.navigate(['signup-page']);
      }
      resolve(can);
    });
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let can = this.sessionStore.checkIsSignedIn();

    if (!can) {
      this.router.navigate(['signup-page']);
    }
    return can;
  }
}

export const AuthGuardCanLoad: CanLoadFn = (
  route: Route,
  segments: UrlSegment[]
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(PermissionsService).canLoad(route, segments);
};

export const AuthGuardCanActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(PermissionsService).canActivate(route, state);
};
