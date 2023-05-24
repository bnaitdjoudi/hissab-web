import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Account } from 'src/app/model/account.model';
import { Operation } from 'src/app/model/operation.model';
import { PagingData } from 'src/app/model/paging-data';
import { PagingRequest } from 'src/app/model/paging-request.model';
import { deleteConfirmation } from 'src/app/tools/alert.contollers';
import { parseFloatTool } from 'src/app/tools/tools';
import { OperationFormComponent } from '../../forms/operation-form/operation-form.component';

@Component({
  selector: 'passif-view',
  templateUrl: './passif.view.component.html',
  styleUrls: ['./passif.view.component.scss'],
})
export class PassifViewComponent implements OnInit, OnDestroy {
  @Input() total: number | null = 0;
  @Input() title: string = '';
  @Input() account: Account;
  @Input() operations: PagingData<Operation> = {
    data: [],
    currentPage: 0,
    totalPage: 0,
  };

  @Input() page: PagingRequest | BehaviorSubject<PagingRequest> = {
    page: 0,
    limit: 0,
  };
  @Input() isCreateOpModalOpen: boolean = false;

  @Input() deleteOperationSubject: BehaviorSubject<number>;

  @Output() ajusteAccount = new EventEmitter<void>();
  @Output() addOperationEmitter = new EventEmitter<Operation>();

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;

  newOperation: Operation;

  operationMode: 'edit' | 'update' = 'edit';

  handlerMessage = '';
  roleMessage = '';
  currBalfun = (debit: number, credit: number) => ['passif', credit - debit];

  constructor(private alertController: AlertController) {}

  ngOnDestroy(): void {
    //console.log('CardMainAccountComponent::ngOnDestroy');
  }
  ngOnInit(): void {
    //console.log('CardMainAccountComponent::ngOnInit');
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
    console.log('cancel');

    this.setOpen(false);
  }

  onOperationSelected(operation: Operation) {
    this.newOperation = operation;
    this.operationMode = 'update';
    this.isCreateOpModalOpen = true;
  }

  onIonInfiniteScroll(ev: InfiniteScrollCustomEvent) {
    console.log('onIonInfiniteScroll');
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

  cancelDeleteOperation(id: number) {
    console.log('cancel:' + id);
  }
  confirmDeleteOperation(id: number) {
    if (!!this.deleteOperationSubject) {
      this.deleteOperationSubject.next(id);
    }
  }
}
