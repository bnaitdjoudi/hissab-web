import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { Account } from 'src/app/main/model/account.model';

import { AccountListComponent } from './account-list.component';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountListComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onIonInfinite should emit once onIonInfiniteScroll.emit', () => {
    spyOn(component.onIonInfiniteScroll, 'emit');
    component.onIonInfinite({} as InfiniteScrollCustomEvent);
    expect(component.onIonInfiniteScroll.emit).toHaveBeenCalledTimes(1);
  });

  it('onSelectAccount should emit once onElementSelected.emit', () => {
    let givenAccount: Account = {
      id: 0,
      acountName: 'accountTest',
      totalAccount: 50,
      isMain: false,
      type: '',
      parentId: 0,
      path: 'accountTest',
      isLeaf: false,
    };

    spyOn(component.onElementSelected, 'emit');
    component.onSelectAccount(givenAccount);
    expect(component.onElementSelected.emit).toHaveBeenCalledTimes(1);
    expect(component.onElementSelected.emit).toHaveBeenCalledWith(givenAccount);
  });

  it('onDeleteFired should emit once onDelete.emit', () => {
    spyOn(component.onDelete, 'emit');
    component.onDeleteFired(1);
    expect(component.onDelete.emit).toHaveBeenCalledTimes(1);
  });

  it('onDeleteFired should not emit onDelete.emit', () => {
    spyOn(component.onDelete, 'emit');
    component.onDeleteFired(0);
    expect(component.onDelete.emit).toHaveBeenCalledTimes(0);
  });

  it('accountClass should return actif positif', () => {
    let givenAccount: Account = {
      id: 0,
      acountName: 'accountTest',
      totalAccount: 50,
      isMain: false,
      type: 'actif',
      parentId: 0,
      path: 'accountTest',
      isLeaf: false,
    };

    expect(component.accountClass(givenAccount)).toEqual('actif positif');
  });

  it('accountClass should return actif negatif', () => {
    let givenAccount: Account = {
      id: 0,
      acountName: 'accountTest',
      totalAccount: -50,
      isMain: false,
      type: 'actif',
      parentId: 0,
      path: 'accountTest',
      isLeaf: false,
    };

    expect(component.accountClass(givenAccount)).toEqual('actif negatif');
  });

  it('multiply should return -1', () => {
    expect(component.multiply('passif')).toEqual(-1);
  });

  it('multiply should return 1', () => {
    expect(component.multiply('actif')).toEqual(1);
  });
});
