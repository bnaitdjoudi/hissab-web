import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
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
@Injectable()
export class RouteParamsStore extends Store<RouteParams> {
  idAccount$ = this.select<number>(
    (state: RouteParams) => state.accountParams.id
  );

  idOperation$ = this.select<number>(
    (state: RouteParams) => state.operationParams.id
  );

  constructor(
    private readonly router: Router,
    private readonly mainStore: MainStore
  ) {
    super(store);

    

    this.router.events
      .pipe(
        filter((e) => e instanceof ActivationEnd),
        map((e) => (e instanceof ActivationEnd ? e.snapshot.params : {}))
      )
      .subscribe((params) => {
        if (this.router.url === '/') {
          this.mainStore.initMainAccounts();
        }
        if (this.router.url.includes('account/')) {
          this.setIdCount(params['id']);
        } else {
          this.setIdCount(0);
        }

        if (this.router.url.includes('operation/')) {
          this.setIdOperation(params['id']);
        } else {
          this.setIdOperation(0);
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
    console.log('id:::::::::::::' + idOp);
    this.setState({
      ...this.state,
      operationParams: { id: idOp },
    });
  }
}
