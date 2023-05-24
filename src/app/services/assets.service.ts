import { Injectable, OnInit } from '@angular/core';
import { Account } from '../model/account.model';

@Injectable()
export class AssetsService {
  constructor() {
    // this.assetsStore.setState({totalAccount:80})
  }

  getCurrentTotalAssets(): Account {
    return {
      id: 0,
      acountName: 'Assets',
      totalAccount: 880,
      isMain: false,
      type: 'no',
      parentId: 0,
      path: '',
      isLeaf: true,
      resume: { debit: 0, credit: 0, sons: 0 },
    };
  }
}
