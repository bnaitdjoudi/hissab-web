import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Account } from '../../../model/account.model';
import { AccountPageStore } from './../account-page.store';
import { Operation } from '../../../model/operation.model';
import { PagingData } from '../../../model/paging-data';
import {
  ActionSheetController,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { actionSheetCtrlOperation } from '../../../tools/action.sheet.controllers';
import { TranslateService } from '@ngx-translate/core';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';
import { parseFloatTool } from '../../../tools/tools';
import { LeafAccount } from '../../../model/leaf-account.model';
import { Router } from '@angular/router';
import { getLabelPeriode } from '../../../tools/period.label';

@Component({
  selector: 'account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageViewComponent implements OnInit {
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
    resume: { debit: 0, credit: 0, sons: 0 },
  };

  operations: Observable<PagingData<Operation>>;

  accountsData: PagingData<Account> = {
    data: [],
    currentPage: 1,
    totalPage: 1,
  };

  operationData: PagingData<Operation> = {
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
    private alertPeriodController: AlertController,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.operations = this.accountStore.listDataCombined$.pipe(
      map((val) => val[1])
    );
  }

  ngOnDestroy(): void {
    this.accountSuscription.unsubscribe();
    this.dataListSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.accountSuscription = this.accountStore.currentAccount$.subscribe(
      (val) => {
        this.currentAccount = val;
      }
    );

    this.dataListSubscription = this.accountStore.listDataCombined$.subscribe(
      (data) => {
        console.log('account and operaton list updated:::::');

        [this.accountsData, this.operationData] = data;
      }
    );

    this.leafAccountSuscription = this.accountStore.leafAccounts$.subscribe(
      (leafs) => {
        if (leafs !== null) {
          this.leafAccounts = leafs;
        }
      }
    );

    console.log('account local period:' + this.accountStore.getCurrentPeriod());
  }

  addOperation(row: Operation) {
    this.accountStore.setNewOrUpdateOperation(row);
    this.isCreateOpModalOpen = false;
  }

  async presentActionSheet() {
    let actions: string[] = ['cancel', 'period'];
    if (this.currentAccount.isLeaf && this.accountsData.data.length === 0) {
      actions = ['createOp', ...actions];
    }

    if (this.currentAccount.resume.sons === 0) {
      actions = ['createAcc', ...actions];
      console.log('CAS 2');
    }

    const actionSheet = await this.actionSheetCtrl.create(
      actionSheetCtrlOperation(
        'Actions',
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

        case 'period': {
          this.presentAlertPeriod();
          break;
        }
      }
    });
  }

  createOperation() {
    this.router.navigate(['/operation/new/'], {});
  }

  modalAccount() {
    this.router.navigate(['/account/new/'], {});
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
      resume: { debit: 0, credit: 0, sons: 0 },
    });

    this.nameAccount = '';
  }

  confirm() {
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
    this.isCreateOpModalOpen = false;
  }

  private async presentAlertPeriod() {
    let alertInputs: AlertInput[] = [
      {
        label: 'Current month',
        type: 'radio',
        value: 'month',
        checked: this.accountStore.getCurrentPeriod() === 'month',
      },
      {
        label: 'Current year',
        type: 'radio',
        value: 'cyear',
        checked: this.accountStore.getCurrentPeriod() === 'cyear',
      },
      {
        label: 'All',
        type: 'radio',
        value: 'global',
        checked: this.accountStore.getCurrentPeriod() === 'global',
      },
    ];

    const alert = await this.alertPeriodController.create({
      header: 'Period',
      buttons: ['CANCEL', 'OK'],
      inputs: alertInputs,
    });

    await alert.present();

    alert.onDidDismiss().then((result) => {
      this.accountStore.setPeriod(result.data.values);
    });
  }

  get periodLabel() {
    return getLabelPeriode(this.accountStore.getCurrentPeriod());
  }

  goToHome() {
    this.router.navigate(['/dashboard'], {});
  }

  backToPrent() {
    if (this.currentAccount.parentId > 0) {
      this.router.navigate(['account/' + this.currentAccount.parentId], {});
    } else {
      this.router.navigate(['/dashboard'], {});
    }
  }

  goToSearch() {
    this.router.navigate(['account/search'], {});
  }
}
