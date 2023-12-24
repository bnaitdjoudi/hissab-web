import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Account } from 'src/app/model/account.model';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { Operation } from 'src/app/model/operation.model';
import { PagingData } from 'src/app/model/paging-data';
import { PagingRequest } from 'src/app/model/paging-request.model';
import { deleteConfirmation } from 'src/app/tools/alert.contollers';
import { parseFloatTool } from 'src/app/tools/tools';
import { OperationFormComponent } from '../../forms/operation-form/operation-form.component';

@Component({
  selector: 'actif-view',
  templateUrl: './actif.view.component.html',
  styleUrls: ['./actif.view.component.scss'],
})
export class ActifViewComponent implements OnInit, OnDestroy {
  currBalfun: any;
  accountVal: Account;

  @Input() total: number | null = 0;
  @Input() title: string = '';
  @Input() leafAccounts: LeafAccount[] | null = [];
  @Input() set account(val: Account) {
    if (val) {
      this.accountVal = val;
      this.currBalfun = (debit: number, credit: number) => [
        val.type,
        debit - credit,
      ];
    }
  }

  @Input() periodLabel: string;

  get account(): Account {
    if (this.accountVal) return this.accountVal;

    return { type: '' } as Account;
  }

  @Input() isCreateOpModalOpen: boolean = false;

  @Input() operationsData: Observable<PagingData<Operation>>;

  totalPage: number = 0;
  currentPage: number = 0;

  operationSuscription: Subscription;

  operationsSubject: BehaviorSubject<Operation[]> = new BehaviorSubject<
    Operation[]
  >([]);

  currentAccountData: PagingData<Account> = {
    data: [],
    totalPage: 0,
    currentPage: 0,
  };

  @Input() set accountData(data: PagingData<Account>) {
    if (data) this.currentAccountData = data;
  }

  @Input() page: PagingRequest | BehaviorSubject<PagingRequest> = {
    page: 0,
    limit: 0,
  };

  @Input() accountPage: PagingRequest | BehaviorSubject<PagingRequest> = {
    page: 0,
    limit: 0,
  };

  @Input() deleteOperationSubject: BehaviorSubject<number>;
  @Input() deleteAccountSubject: BehaviorSubject<number>;

  @Output() ajusteAccount = new EventEmitter<void>();
  @Output() onBackToParentFiredEvent = new EventEmitter<void>();

  @Output() addOperationEmitter = new EventEmitter<Operation>();

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;

  newOperation: Operation;

  operationMode: 'edit' | 'update' = 'edit';

  handlerMessage = '';
  roleMessage = '';

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.operationSuscription = this.operationsData.subscribe((val) => {
      this.operationsSubject.next(val.data);
      this.totalPage = val.totalPage;
      this.currentPage = val.currentPage;
    });
  }

  setOpen(open: boolean) {
    this.isCreateOpModalOpen = open;
    this.newOperation = {
      id: 0,
      numTrans: '',
      time: new Date(),
      description: '',
      statut: 'r',
      credit: 0,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };
  }

  confirm() {
    console.log('confirme');
    if (this.operationFormComponent.isValidData()) {
      this.setOpen(false);
      let operation = {
        ...this.operationFormComponent.operation,
        debit: parseFloatTool(this.operationFormComponent.operation.debit),
        credit: parseFloatTool(this.operationFormComponent.operation.credit),
      };

      this.addOperationEmitter.emit(operation);
    }
  }

  cancel() {
    this.setOpen(false);
  }

  onOperationSelected(operation: Operation) {
    this.router.navigate(['/operation/' + operation.id], {});
  }

  onAccountSelected(account: Account) {
    this.router.navigate(['/account/' + account.id], {});
  }

  onIonInfiniteScrollOperation(ev: InfiniteScrollCustomEvent) {
    if (this.page instanceof PagingRequest) {
      this.page.page++;
    } else {
      if (this.page) {
        this.page.next({
          page: this.page.getValue().page + 1,
          limit: this.page.getValue().limit,
        });
      }
    }

    ev.target.complete();
  }

  onIonInfiniteScrollAccount(ev: InfiniteScrollCustomEvent) {
    if (this.accountPage instanceof PagingRequest) {
      this.accountPage.page++;
    } else {
      if (this.accountPage) {
        this.accountPage.next({
          page: this.accountPage.getValue().page + 1,
          limit: this.accountPage.getValue().limit,
        });
      }
    }

    ev.target.complete();
  }

  async presentDeleteAlert(id: number) {
    const alert = await this.alertController.create(
      deleteConfirmation(
        'Alert Operation suppression!',
        () => this.cancelDeleteOperation(id),
        () => this.confirmDeleteOperation(id),
        'custom-alert'
      )
    );

    await alert.present();
  }

  async presentDeleteAlertAccount(id: number) {
    const alert = await this.alertController.create(
      deleteConfirmation(
        'Alert Operation suppression!',
        () => this.cancelDeleteOperation(id),
        () => this.confirmDeleteAccount(id),
        'custom-alert'
      )
    );

    await alert.present();
  }

  cancelDeleteOperation(id: number) {}
  confirmDeleteOperation(id: number) {
    if (!!this.deleteOperationSubject) {
      this.deleteOperationSubject.next(id);
    }
  }

  confirmDeleteAccount(id: number) {
    if (!!this.deleteOperationSubject) {
      this.deleteAccountSubject.next(id);
    }
  }

  calculMultiplication(total: number, type: string): number {
    return type === 'passif' || type === 'depense' ? -total : total;
  }

  onBackToParentFired() {
    this.onBackToParentFiredEvent.emit();
  }
}
