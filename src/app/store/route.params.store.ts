import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { RouteParams } from '../model/route.params.model';
import { MainStore } from './main.store';
import { Store } from './store';

const store: RouteParams = {
  accountParams: {
    id: 0,
  },

  operationParams: {
    id: 0,
  },
};
@Injectable({
  providedIn: 'root',
})
export class RouteParamsStore extends Store<RouteParams> {
  idAccount$ = this.select<number>(
    (state: RouteParams) => state.accountParams.id
  );

  idOperation$ = this.select<number>(
    (state: RouteParams) => state.operationParams.id
  );

  reee: string;

  constructor(readonly router: Router, readonly mainStore: MainStore) {
    super(store);
    this.reee = new Date().toUTCString();
    this.router.events
      .pipe(
        filter((e: any) => e instanceof ActivationEnd),
        map((e: any) =>
          e instanceof ActivationEnd
            ? { params: e.snapshot.params, url: e.snapshot.url }
            : { params: [], url: '' }
        )
      )
      .subscribe((event: any) => {
        console.log('current url: ' + this.router.url);

        if (this.router.url === '/dashboard') {
          this.mainStore.synchronusData();
          this.setIdCount(0);
        }
        if (this.router.url.includes('account/')) {
          this.setIdCount(event.params['id']);
        } else {
        }

        if (this.router.url.includes('operation/')) {
          if (this.router.url.includes('operation/new')) {
            this.setIdOperation(event.params['id'] * -1);
          } else {
            this.setIdOperation(event.params['id']);
          }
        } else {
          this.setIdOperation(0);
        }
      });

    this.mainStore.flags$.subscribe((mapFlags) => {
      console.log('ROOOOOOOOOOOOOOOOOO' + JSON.stringify(mapFlags));
      if (mapFlags.size > 0 && !mapFlags.has('PROFIL_SIGNED_UP')) {
        this.router.navigate(['sgins']);
      }
    });
  }

  setIdCount(id: number) {
    this.setState({
      ...this.state,
      accountParams: { ...this.state.accountParams, id: id },
    });
  }

  setIdOperation(idOp: number) {
    console.log('setIdOperation idOp == ' + idOp);
    this.setState({
      ...this.state,
      operationParams: { id: idOp },
    });
  }

  goto(arg0: string) {
    this.router.navigate([arg0]);
  }
}
