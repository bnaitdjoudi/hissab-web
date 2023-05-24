import { waitForAsync, TestBed } from '@angular/core/testing';
import { skip } from 'rxjs';
import { Account } from '../model/account.model';
import { AccountsService } from '../services/accounts.service';
import { MainStore } from './main.store';

describe('MainStore', () => {
  let mainStore: MainStore;
  let accountServiceSpy: AccountsService;
  const account = { id: 4, acountName: 'balance' } as Account;
  beforeEach(waitForAsync(() => {
    let spyAccountService = {
      getMainAccounts: jasmine
        .createSpy('getMainAccounts')
        .and.returnValue(Promise.resolve([])),
      getAccountByType: jasmine
        .createSpy('getAccountByType')
        .and.returnValue(Promise.resolve([account])),
    };
    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        MainStore,
        { provide: AccountsService, useValue: spyAccountService },
      ],
    });

    mainStore = TestBed.inject(MainStore);
    accountServiceSpy = TestBed.inject(AccountsService);
  }));

  it('MainStore should be create', () => {
    expect(mainStore).toBeTruthy();
  });

  it('MainStore currentAccountId$ fire the right number', () => {
    let spyObj = {
      method: jasmine.createSpy('method'),
    };

    mainStore.currentAccountId$.pipe(skip(1)).subscribe((num) => {
      spyObj.method(num);
    });

    mainStore.setCurrentAccountId(3);
    expect(spyObj.method).toHaveBeenCalledWith(3);
  });

  it('MainStore balanceAccount$. fire the account', () => {
    let spyObj = {
      method: jasmine.createSpy('method'),
    };

    mainStore.balanceAccount$.pipe().subscribe((num) => {
      spyObj.method(num);
    });

    expect(spyObj.method).toHaveBeenCalledOnceWith(account);
  });

  it('MainStore mainAccounts$. fire the account', () => {
    let spyObj = {
      method: jasmine.createSpy('method'),
    };

    mainStore.mainAccounts$.pipe().subscribe((num) => {
      spyObj.method(num);
    });

    expect(spyObj.method).toHaveBeenCalledOnceWith([]);
  });
});
