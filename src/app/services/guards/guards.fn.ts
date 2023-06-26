import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { inject } from '@angular/core';

export const isAuthentitacated = (
  route: Route,
  segments: UrlSegment[]
) => {
  return inject(AuthGuardService).canLoad();
};
