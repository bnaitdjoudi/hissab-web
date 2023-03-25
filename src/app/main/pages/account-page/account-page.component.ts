import { Component, OnInit, ViewChild } from '@angular/core';
import { skip, Subscription } from 'rxjs';
import { Account } from '../../model/account.model';
import { AccountPageStore } from './account-page.store';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { ActionSheetController } from '@ionic/angular';
import { actionSheetCtrlOperation } from '../../tools/action.sheet.controllers';
import { TranslateService } from '@ngx-translate/core';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';
import { parseFloatTool } from '../../tools/tools';
import { LeafAccount } from '../../model/leaf-account.model';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent implements OnInit {
  newOperation: Operation;
  isCreateOpModalOpen = false;

  result: string;

  leafAccounts: LeafAccount[] = [];

  accountSuscription: Subscription;
  dataListSubscription: Subscription;
  leafAccountSuscription: Subscription;

  currentAccount: Account = {
    id: 0,
    acountName: '',
    totalAccount: 0,
    type: '',
    isMain: false,
    parentId: 0,
    path: '',
    isLeaf: true,
  };

  operations: PagingData<Operation> = {
    data: [],
    currentPage: 1,
    totalPage: 1,
  };

  accountsData: PagingData<Account> = {
    data: [],
    currentPage: 1,
    totalPage: 1,
  };
  isAccountModalOpen = false;
  nameAccount: string;

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;
  alertController: any;

  constructor(
    readonly accountStore: AccountPageStore,
    readonly actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.accountSuscription.unsubscribe();
    this.dataListSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.accountSuscription = this.accountStore.currentAccount$
      .pipe(skip(1))
      .subscribe((val) => {
        this.currentAccount = val;
      });

    this.dataListSubscription = this.accountStore.listDataCombined$.subscribe(
      (data) => {
        [this.accountsData, this.operations] = data;
      }
    );

    this.leafAccountSuscription = this.accountStore.leafAccounts$.subscribe(
      (leafs) => {
        if (leafs !== null) {
          this.leafAccounts = leafs;
        }
      }
    );
  }

  addOperation(row: Operation) {
    this.accountStore.setNewOrUpdateOperation(row);
    this.isCreateOpModalOpen = false;
  }

  async presentActionSheet() {
    let actions: string[] = ['cancel'];
    if (
      this.operations.data.length > 0 &&
      this.accountsData.data.length === 0
    ) {
      actions = ['createOp', ...actions];
    }

    if (
      this.operations.data.length === 0 &&
      this.accountsData.data.length > 0
    ) {
      actions = ['createAcc', ...actions];
    }

    if (
      this.operations.data.length === 0 &&
      this.accountsData.data.length === 0
    ) {
      actions = ['createOp', 'createAcc', ...actions];
    }

    const actionSheet = await this.actionSheetCtrl.create(
      actionSheetCtrlOperation(
        'Operations',
        undefined,
        actions,
        this.translateService
      )
    );

    await actionSheet.present();

    actionSheet.onDidDismiss().then((result) => {
      switch (result.role) {
        case 'createOp': {
          this.createOperation();
          break;
        }

        case 'createAcc': {
          this.modalAccount();
          break;
        }
      }
    });
  }

  createOperation() {
    this.isCreateOpModalOpen = true;
  }

  modalAccount() {
    this.isAccountModalOpen = !this.isAccountModalOpen;
  }

  confirmAccount() {
    this.modalAccount();
    this.accountStore._newAccountSubject.next({
      id: 0,
      totalAccount: 0,
      isMain: false,
      acountName: this.nameAccount,
      type: '',
      parentId: 0,
      path: '',
      isLeaf: true,
    });
  }

  confirm() {
    console.log('confirme');
    if (this.operationFormComponent.isValidData()) {
      this.cancel();
      let operation = {
        ...this.operationFormComponent.operation,
        debit: parseFloatTool(this.operationFormComponent.operation.debit),
        credit: parseFloatTool(this.operationFormComponent.operation.credit),
      };

      this.addOperation(operation);
    }
  }

  cancel() {
    console.log('cancel');

    this.isCreateOpModalOpen = false;
  }
}
