import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Operation } from '../../../model/operation.model';
import { deleteConfirmation } from '../../../tools/alert.contollers';
import { OperationPageStore } from '../operation-page.store';
import { Location } from '@angular/common';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';
import {
  ValidatorFn,
  AbstractControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { format, parseISO } from 'date-fns';
import { showCreditField, showDebitField } from 'src/app/tools/tools';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operation-page',
  templateUrl: './operation-page-edit.component.html',
  styleUrls: ['./operation-page-edit.component.scss'],
})
export class OperationPageEditComponent implements OnInit, OnDestroy {
  operation: Operation;
  leafAccounts: LeafAccount[] = [];
  accountType: string;
  loadingDelete: HTMLIonLoadingElement;

  suscribtionLeafs: Subscription;
  suscribtionOperation: Subscription;

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;

  operationForm: FormGroup;
  defaultTransferFrom: LeafAccount | undefined;
  defaultTransferTo: LeafAccount | undefined;
  showDebitField: boolean = true;
  showCreditField: boolean = true;

  @ViewChild(IonModal) modal: IonModal;
  currentDate: string | string[] | null | undefined = format(
    new Date(),
    'yyyy-MM-dd HH:mm:ss'
  );
  isOpen = false;

  constructor(
    readonly operationStore: OperationPageStore,
    readonly alertController: AlertController,
    readonly _location: Location,
    readonly loadingCtrl: LoadingController,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}
  ngOnDestroy(): void {
    this.suscribtionLeafs?.unsubscribe();
    this.suscribtionOperation?.unsubscribe();
  }

  ngOnInit() {
    this.suscribtionOperation = this.operationStore.operation$.subscribe(
      (op) => {
        if (op) {
          this.operation = op;
          this.accountType = op && op.accountType ? op.accountType : 'actif';
          this.iniOperationForm();
          this.showFieldCreditAndDebit();
        }
      }
    );
    this.suscribtionLeafs =
      this.operationStore.accountStore.leafAccounts$.subscribe((leafs) => {
        this.leafAccounts = leafs;
        if (this.operation) {
          this.showFieldCreditAndDebit();
        }
      });

    this.operationStore.accountStore.loadLeadAccounts(undefined);
  }

  private showFieldCreditAndDebit() {
    this.defaultTransferTo = this.leafAccounts.find(
      (el) => el.path === this.operation?.transfer
    );
    this.defaultTransferFrom = this.leafAccounts.find(
      (el) => el.id === this.operation?.id
    );

    if (this.defaultTransferFrom && this.defaultTransferTo) {
      this.showDebitField = showDebitField(
        this.defaultTransferFrom.type,
        this.defaultTransferTo.type
      );

      this.showCreditField = showCreditField(
        this.defaultTransferFrom.type,
        this.defaultTransferTo.type
      );
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  private async showLoading(): Promise<HTMLIonLoadingElement> {
    return this.loadingCtrl.create({
      message: 'updating operation',
    });
  }

  async onSubmitFired() {
    const alert = await this.alertController.create(
      deleteConfirmation(
        'Voulez vous sauvegarder les changement?',
        undefined,
        undefined,
        'custom-alert'
      )
    );

    await alert.present();

    const { role } = await alert.onDidDismiss();
    switch (role) {
      case 'cancel': {
        console.log('cancel alert');
        break;
      }
      case 'confirm': {
        await this.submitOperationUpdate();
        break;
      }
    }
  }

  iniOperationForm() {
    const validatorCross: ValidatorFn = (control: AbstractControl) => {
      const debit = control.get('debit')?.value;
      const credit = control.get('credit')?.value;
      console.log('test match');
      return debit === 0 && credit === 0 ? { noMatch: true } : null;
    };
    this.operationForm = this.fb.group(
      {
        numTrans: [this.operation?.numTrans],
        time: [
          format(
            this.operation?.time ? this.operation?.time : new Date(),
            'yyyy-MM-dd HH:mm:ss'
          ),
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        description: [
          this.operation?.description,
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        statut: [
          this.operation?.statut,
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        credit: [
          this.operation?.credit,
          {
            validators: [Validators.required, Validators.min(0)],
            updateOn: 'blur',
          },
        ],
        debit: [
          this.operation?.debit,
          {
            validators: [
              Validators.required,
              Validators.min(0),
              validatorCross,
            ],
            updateOn: 'blur',
          },
        ],
      },
      { validators: validatorCross }
    );
    this.initReactionForm();
  }

  private async submitOperationUpdate() {
    this.loadingDelete = await this.showLoading();
    this.loadingDelete.present();
    if (this.operationFormComponent.isValidData()) {
      console.log(
        'description:::::' +
          this.operationFormComponent.currentOperation.description
      );
      this.operationStore
        .updateOperation(this.operationFormComponent.currentOperation)
        .then(() => {
          this.loadingDelete.dismiss();
          this._location.back();
        });
    } else {
      this.loadingDelete.dismiss();
    }
  }

  debitChanged($event: any) {
    if (this.operation) this.operation.debit = $event.target.value;
  }
  creditChanged($event: any) {
    if (this.operation) this.operation.credit = $event.target.value;
  }

  async onDateChange(value: string | string[] | null | undefined) {
    this.isOpen = false;
    await this.modal.dismiss(this.currentDate, 'confirm');
    if (!!value) {
      this.currentDate = value;
      if (value.length >= 0) {
        this.operation.time = parseISO(value.toString());

        this.operationForm
          .get('time')
          ?.setValue(format(this.operation.time, 'yyyy-MM-dd HH:mm:ss'));
      }
    }
  }

  async submit() {
    let op = await this.operationStore.updateOperation(this.operation);
    this.router.navigate(['operation/' + op.id]);
  }

  initReactionForm() {
    this.operationForm?.valueChanges.subscribe((val) => {
      Object.keys(val)
        .filter((k) => k !== 'debit' && k !== 'credit' && k !== 'time')
        .forEach((key) => {
          this.operation[key] = val[key];
        });
    });
  }
}
