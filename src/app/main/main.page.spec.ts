import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from } from 'rxjs';
import { NgxTranslateModule } from '../translate/translate.module';

import { MainPage } from './main.page';
import { Account } from './model/account.model';
import { MainStore } from './store/main.store';

describe('MainPage', () => {
  let component: MainPage;
  let fixture: ComponentFixture<MainPage>;

  const account1: Account = {
    id: 2,
    acountName: 'account 1',
    isLeaf: false,
    isMain: false,
    parentId: 0,
    path: 'account1',
    totalAccount: 0,
    type: 'actif',
  };

  const accounts: Account[] = [
    {
      id: 2,
      acountName: 'account 1',
      isLeaf: false,
      isMain: false,
      parentId: 0,
      path: 'account1',
      totalAccount: 0,
      type: 'actif',
    },
    {
      id: 3,
      acountName: '',
      isLeaf: false,
      isMain: false,
      parentId: 0,
      path: '',
      totalAccount: 0,
      type: 'actif',
    },
  ];

  const givenMainAccounts$ = from([accounts]);
  const givenBalanceAccount$ = from([account1]);
  let mainStoreMock: any = {
    mainAccounts$: givenMainAccounts$,
    balanceAccount$: givenBalanceAccount$,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPage],
      providers: [{ provide: MainStore, useValue: mainStoreMock }],
      imports: [NgxTranslateModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.balanceAccount).toEqual(account1);
  });

  it('multiply should return 1', () => {
    expect(component.multiplyFor('actif')).toEqual(1);
  });

  it('multiply should return -1', () => {
    expect(component.multiplyFor('passif')).toEqual(-1);
  });

  it('accountClass should return actif positif', () => {
    const account2: Account = {
      id: 3,
      acountName: 'account 1',
      isLeaf: false,
      isMain: false,
      parentId: 0,
      path: 'account1',
      totalAccount: 50,
      type: 'actif',
    };

    expect(component.accountClass(account2)).toEqual('actif positif');
  });
});
