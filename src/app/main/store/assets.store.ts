import { Injectable } from '@angular/core';
import { Account } from '../model/account.model';
import { AssetsService } from '../services/assets.service';
import { Store } from './store';

const store: Account = {
  id: 0,
  acountName: 'Assets',
  totalAccount: 0,
  type: '',
  isMain: false,
  parentId: 0,
  path: '',
  isLeaf: true,
};

@Injectable()
export class AssetsStore extends Store<Account> {
  totalAccount$ = this.select<number>((state: Account) => state.totalAccount);

  constructor(private readonly assetsService: AssetsService) {
    super(store);
    this.setState(this.assetsService.getCurrentTotalAssets());
  }

  get totalAccount(): number {
    return this.totalAccount;
  }
}
