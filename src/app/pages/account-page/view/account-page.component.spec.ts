import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { combineLatest, from } from 'rxjs';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { Account } from '../../../model/account.model';
import { LeafAccount } from '../../../model/leaf-account.model';
import { Operation } from '../../../model/operation.model';
import { PagingData } from '../../../model/paging-data';

import { AccountPageViewComponent } from './account-page.component';
import { AccountPageStore } from './../account-page.store';

describe('AccountPageComponent ', () => {
  const presentActionSheet = async (
    returnSheet: any,
    component: AccountPageViewComponent
  ) => {
    const htmlAction: HTMLIonActionSheetElement = {
      present: (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
          resolve();
        });
      },
      onDidDismiss: (): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
          resolve({ role: '' });
        });
      },
    } as HTMLIonActionSheetElement;

    spyOn(component.actionSheetCtrl, 'create').and.returnValue(
      Promise.resolve(htmlAction)
    );
    await component.presentActionSheet();

    expect(component.actionSheetCtrl.create).toHaveBeenCalledWith(returnSheet);
  };

  const presentActionSheetChooseAction = async (
    role: any,
    component: AccountPageViewComponent,
    spyMethod: keyof AccountPageViewComponent
  ) => {
    const htmlAction: HTMLIonActionSheetElement = {
      present: (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
          resolve();
        });
      },
      onDidDismiss: (): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
          resolve(role);
        });
      },
    } as HTMLIonActionSheetElement;

    spyOn(component.actionSheetCtrl, 'create').and.returnValue(
      Promise.resolve(htmlAction)
    );

    spyOn(component, spyMethod);
    await component.presentActionSheet();

    expect(component[spyMethod]).toHaveBeenCalledTimes(1);
  };

  describe('AccountPageComponent mode account', () => {
    let component: AccountPageViewComponent;
    let fixture: ComponentFixture<AccountPageViewComponent>;

    const currentAccount: Account = {
      id: 2,
      acountName: 'account 1',
      isLeaf: false,
      isMain: false,
      parentId: 0,
      path: 'account1',
      totalAccount: 0,
      type: 'actif',
      resume: { debit: 0, credit: 0, sons: 0 },
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
        resume: { debit: 0, credit: 0, sons: 0 },
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
        resume: { debit: 0, credit: 0, sons: 0 },
      },
    ];

    const accountData: PagingData<Account> = {
      data: accounts,
      totalPage: 1,
      currentPage: 0,
    };

    const operationData: PagingData<Operation> = {
      data: [],
      totalPage: 0,
      currentPage: 0,
    };

    const accountData$ = from([accountData]);
    const operationData$ = from([operationData]);
    const combinedData$ = combineLatest([accountData$, operationData$]);

    // leafAccounts

    const leafAccounts: LeafAccount[] = [];

    const givenCurrentAccounts$ = from([{} as Account, currentAccount]);

    const accountPageStoreMock: any = {
      currentAccount$: givenCurrentAccounts$,
      listDataCombined$: combinedData$,
      leafAccounts$: from([leafAccounts]),
      _newAccountSubject: {
        next: (account: Account) => {
          console.log(account);
        },
      },
    };

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AccountPageViewComponent],
        imports: [IonicModule.forRoot(), NgxTranslateModule],
        providers: [
          { provide: AccountPageStore, useValue: accountPageStoreMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountPageViewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('presentActionSheet not show operations action', waitForAsync(async () => {
      const returnSheet: any = {
        header: 'Operations',
        subHeader: undefined,
        buttons: [
          {
            text: 'Create Account',
            role: 'createAcc',
            data: {
              action: 'createAcc',
            },
          },
          { text: 'Cancel', role: 'cancel', data: { action: 'cancel' } },
        ],
      };

      await presentActionSheet(returnSheet, component);
    }));

    it('presentActionSheet choose createAcc operation', waitForAsync(async () => {
      await presentActionSheetChooseAction(
        { role: 'createAcc' },
        component,
        'modalAccount'
      );
    }));

    it('modalAccount isAccountModalOpen should be !isAccountModalOpen', () => {
      const isAccountModalOpen = component.isAccountModalOpen;
      component.modalAccount();
      expect(component.isAccountModalOpen).toEqual(!isAccountModalOpen);
    });

    it('addOperation isAccountModalOpen should be !isAccountModalOpen', () => {
      const isAccountModalOpen = component.isAccountModalOpen;
      component.modalAccount();
      expect(component.isAccountModalOpen).toEqual(!isAccountModalOpen);
    });

    it('confirmAccount call modalAccount and next new Account', () => {
      component.nameAccount = 'Account name';
      const giventAccount: Account = {
        id: 0,
        acountName: component.nameAccount,
        isMain: false,
        parentId: 0,
        totalAccount: 0,
        type: '',
        path: '',
        isLeaf: true,
        resume: { debit: 0, credit: 0, sons: 0 },
      };

      spyOn(component.accountStore._newAccountSubject, 'next');
      spyOn(component, 'modalAccount');

      component.confirmAccount();

      expect(component.modalAccount).toHaveBeenCalledTimes(1);
      expect(
        component.accountStore._newAccountSubject.next
      ).toHaveBeenCalledTimes(1);
      expect(
        component.accountStore._newAccountSubject.next
      ).toHaveBeenCalledWith(giventAccount);
    });
  });

  describe('AccountPageComponent mode Operation', () => {
    const currentAccount: Account = {
      id: 2,
      acountName: 'account 1',
      isLeaf: false,
      isMain: false,
      parentId: 0,
      path: 'account1',
      totalAccount: 0,
      type: 'actif',
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    const operations: Operation[] = [
      {
        id: 50,
        numTrans: 'sdfsadfsafd',
        time: new Date(),
        description: 'fdsadfsadf',
        balance: 1000,
        credit: 0,
        debit: 500,
        idAccount: 1,
        statut: 'r',
        transfer: 'walou',
      },

      {
        id: 55,
        numTrans: 'sdfsadfdfdsafd',
        time: new Date(),
        description: 'fdsadfsadf',
        balance: 500,
        credit: 0,
        debit: 500,
        idAccount: 1,
        statut: 'r',
        transfer: 'walou',
      },
    ];

    const accountData: PagingData<Account> = {
      data: [],
      totalPage: 1,
      currentPage: 0,
    };

    const operationData: PagingData<Operation> = {
      data: operations,
      totalPage: 0,
      currentPage: 0,
    };

    const accountData$ = from([accountData]);
    const operationData$ = from([operationData]);

    const combinedData$ = combineLatest([accountData$, operationData$]);

    const leafAccounts: LeafAccount[] = [];

    const givenCurrentAccounts$ = from([{} as Account, currentAccount]);

    const accountPageStoreMock: any = {
      currentAccount$: givenCurrentAccounts$,
      listDataCombined$: combinedData$,
      leafAccounts$: from([leafAccounts]),
      _newAccountSubject: {
        next: (account: Account) => {
          console.log(account);
        },
      },
      setNewOrUpdateOperation: (operation: Operation) => {
        console.info(operation);
      },
    };

    let component: AccountPageViewComponent;
    let fixture: ComponentFixture<AccountPageViewComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AccountPageViewComponent],
        imports: [IonicModule.forRoot(), NgxTranslateModule],
        providers: [
          { provide: AccountPageStore, useValue: accountPageStoreMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountPageViewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('presentActionSheet not show operations action', waitForAsync(async () => {
      const returnSheet: any = {
        header: 'Operations',
        subHeader: undefined,
        buttons: [
          {
            text: 'Create Operation',
            role: 'createOp',
            data: {
              action: 'createOp',
            },
          },
          { text: 'Cancel', role: 'cancel', data: { action: 'cancel' } },
        ],
      };

      await presentActionSheet(returnSheet, component);
    }));

    it('presentActionSheet choose createOp operation', waitForAsync(async () => {
      await presentActionSheetChooseAction(
        { role: 'createOp' },
        component,
        'createOperation'
      );
    }));

    it('createOperation isCreateOpModalOpen should be !isCreateOpModalOpen', () => {
      const isCreateOpModalOpen = component.isCreateOpModalOpen;
      component.createOperation();
      expect(component.isCreateOpModalOpen).toEqual(!isCreateOpModalOpen);
    });

    it('confirm operaton should be isCreateOpModalOpen = false isValidData return true', () => {
      const givenNewOperation: Operation = {
        id: 55,
        numTrans: 'sdfsadfsafd',
        time: new Date(),
        description: 'fdsadfsadf',
        balance: 1000,
        credit: 0,
        debit: 500,
        idAccount: 1,
        statut: 'r',
        transfer: 'walou',
      };

      component.operationFormComponent = {
        isValidData: (): boolean => {
          return true;
        },
        operation: givenNewOperation,
      } as OperationFormComponent;

      spyOn(component, 'addOperation');

      component.confirm();

      expect(component.addOperation).toHaveBeenCalledWith(givenNewOperation);
      expect(component.addOperation).toHaveBeenCalledTimes(1);
      expect(component.addOperation).toHaveBeenCalledTimes(1);
    });

    it('confirm operaton should be isCreateOpModalOpen = false isValidData return false', () => {
      const givenNewOperation: Operation = {
        id: 55,
        numTrans: 'sdfsadfsafd',
        time: new Date(),
        description: 'fdsadfsadf',
        balance: 1000,
        credit: 0,
        debit: 500,
        idAccount: 1,
        statut: 'r',
        transfer: 'walou',
      };

      component.operationFormComponent = {
        isValidData: (): boolean => {
          return false;
        },
        operation: givenNewOperation,
      } as OperationFormComponent;

      spyOn(component, 'addOperation');
      spyOn(component, 'cancel');

      component.confirm();

      expect(component.addOperation).toHaveBeenCalledTimes(0);
      expect(component.addOperation).toHaveBeenCalledTimes(0);
    });

    it('addOperation setNewOrUpdateOperation should called once', () => {
      const givenNewOperation: Operation = {
        id: 55,
        numTrans: 'sdfsadfsafd',
        time: new Date(),
        description: 'fdsadfsadf',
        balance: 1000,
        credit: 0,
        debit: 500,
        idAccount: 1,
        statut: 'r',
        transfer: 'walou',
      };

      spyOn(component.accountStore, 'setNewOrUpdateOperation');

      component.addOperation(givenNewOperation);

      expect(
        component.accountStore.setNewOrUpdateOperation
      ).toHaveBeenCalledTimes(1);

      expect(
        component.accountStore.setNewOrUpdateOperation
      ).toHaveBeenCalledWith(givenNewOperation);
    });
  });

  describe('AccountPageComponent mode Operation and Account', () => {
    const currentAccount: Account = {
      id: 2,
      acountName: 'account 1',
      isLeaf: false,
      isMain: false,
      parentId: 0,
      path: 'account1',
      totalAccount: 0,
      type: 'actif',
      resume: { debit: 0, credit: 0, sons: 0 },
    };

    const accountData: PagingData<Account> = {
      data: [],
      totalPage: 1,
      currentPage: 0,
    };

    const operationData: PagingData<Operation> = {
      data: [],
      totalPage: 0,
      currentPage: 0,
    };

    const accountData$ = from([accountData]);
    const operationData$ = from([operationData]);

    const combinedData$ = combineLatest([accountData$, operationData$]);

    const leafAccounts: LeafAccount[] = [];

    const givenCurrentAccounts$ = from([{} as Account, currentAccount]);

    const accountPageStoreMock: any = {
      currentAccount$: givenCurrentAccounts$,
      listDataCombined$: combinedData$,
      leafAccounts$: from([leafAccounts]),
      _newAccountSubject: {
        next: (account: Account) => {
          console.log(account);
        },
      },
      setNewOrUpdateOperation: (operation: Operation) => {
        console.info(operation);
      },
    };

    let component: AccountPageViewComponent;
    let fixture: ComponentFixture<AccountPageViewComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AccountPageViewComponent],
        imports: [IonicModule.forRoot(), NgxTranslateModule],
        providers: [
          { provide: AccountPageStore, useValue: accountPageStoreMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountPageViewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('presentActionSheet not show operations action', waitForAsync(async () => {
      const returnSheet: any = {
        header: 'Operations',
        subHeader: undefined,
        buttons: [
          {
            text: 'Create Operation',
            role: 'createOp',
            data: {
              action: 'createOp',
            },
          },
          {
            text: 'Create Account',
            role: 'createAcc',
            data: {
              action: 'createAcc',
            },
          },
          { text: 'Cancel', role: 'cancel', data: { action: 'cancel' } },
        ],
      };

      await presentActionSheet(returnSheet, component);
    }));
  });
});
