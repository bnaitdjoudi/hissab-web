import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Operation } from 'src/app/model/operation.model';
import { format, parseISO } from 'date-fns';
import { CurrencyPipe } from '@angular/common';
import { register } from 'swiper/element/bundle';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlertController, IonModal } from '@ionic/angular';
import { parseFloatTool } from 'src/app/tools/tools';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { Account } from 'src/app/model/account.model';
import { MatStepper } from '@angular/material/stepper';
import { ErrorStateMatcher } from '@angular/material/core';

register();

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ) {
    return (control?.invalid && control.dirty) ?? false;
  }
}

@Component({
  selector: 'operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss'],
  providers: [CurrencyPipe],
})
export class OperationFormComponent implements OnInit, OnDestroy {
  @Input() accountType: string = 'actifs';
  @Input() set operation(operation: Operation) {
    this.swiperRef?.previous();
    this.swiperRef?.previous();
    this.transferForm?.reset();
    this.operationForm?.reset();
    this.operationForm?.markAsTouched();
    this.transferForm?.markAsTouched();
    this.setOperation(operation);
  }

  @Input() leafsAccount: Observable<LeafAccount[]>;

  @Input() edit: boolean = false;

  @Input() set currentAccount(currentAccount: Account | undefined) {
    console.log('ddd::::' + currentAccount?.acountName);
    this.account = currentAccount;
    if (currentAccount) {
      this.defaultTransferFrom = { ...currentAccount };
    } else {
      this.defaultTransferFrom = {} as LeafAccount;
    }
  }

  @Output()
  onLoadLeafAccount: EventEmitter<number | undefined> = new EventEmitter<
    number | undefined
  >();

  @Output()
  onSubmit: EventEmitter<void> = new EventEmitter<void>();

  account: Account | undefined;
  defaultTransferFrom: LeafAccount | undefined;
  defaultTransferTo: LeafAccount | undefined;
  leafsAccountFiltred: LeafAccount[] = [];
  leafsAccountTotal: LeafAccount[] = [];
  currentOperation: Operation;
  @ViewChild('modal') modalLeaf: IonModal;

  required_message = 'ce champs ne peut pas etre null!';

  validation_messages: { [key: string]: any[] } = {
    time: [
      { type: 'required', message: this.required_message },
      { type: 'time', message: 'le format de le data dois etre comme suit' },
    ],
    credit: [
      { type: 'required', message: this.required_message },
      { type: 'min', message: 'la valeur dois etre superieur ou equal a 0' },
    ],
    debit: [
      { type: 'required', message: this.required_message },
      { type: 'min', message: 'la valeur dois etre superieur  ou equal a 0' },
    ],
  };

  currentDate: string | string[] | null | undefined = format(
    new Date(),
    'yyyy-MM-dd HH:mm:ss'
  );

  @ViewChild('stepper')
  swiperRef: MatStepper | undefined;

  transferForm: FormGroup;
  operationForm: FormGroup;

  operationFormSuscribtion: Subscription;
  leafAccountSuscription: Subscription;

  isCreditAndDebitValide = true;
  searchText: string = '';

  currentSlide: string;
  slides: string[];
  isModalOpen = false;
  modalTitle: string;
  progressShown = true;
  controlNext = false;
  constructor(
    private readonly fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initOperation();
    this.initTransferForm();
    this.iniOperationForm();
    this.initReactionForm();
    this.currentOperation.transfer = this.defaultTransferTo
      ? this.defaultTransferTo.path
      : this.currentOperation.transfer;

    this.buildSlides();
  }

  buildSlides() {
    this.leafAccountSuscription = this.leafsAccount.subscribe((val) => {
      this.leafsAccountTotal = val;
      this.leafsAccountFiltred = val.filter((el) => this.filterLeaf(el));
      this.progressShown = false;
    });
  }
  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.operationFormSuscribtion?.unsubscribe();
    this.leafAccountSuscription?.unsubscribe();
    console.log('OperationFormComponent::: destroyed');
    this.modalLeaf?.dismiss();
  }
  initTransferForm() {
    this.transferForm = this.fb.group({
      transferF: [
        this.defaultTransferFrom?.path,
        {
          validators: [Validators.required],
          updateOn: 'blur',
        },
      ],
      idAccount: [
        this.currentOperation.idAccount,
        {
          validators: [Validators.required, Validators.min(1)],
          updateOn: 'blur',
        },
      ],
      transfer: [
        this.currentOperation.transfer,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
    });
  }
  iniOperationForm() {
    const validatorCross: ValidatorFn = (control: AbstractControl) => {
      const debit = control.get('debit')?.value;
      const credit = control.get('credit')?.value;
      console.log('test match');
      return debit == 0 && credit == 0 ? { noMatch: true } : null;
    };
    this.operationForm = this.fb.group(
      {
        numTrans: [this.currentOperation.numTrans],
        time: [
          format(
            this.currentOperation.time
              ? this.currentOperation.time
              : new Date(),
            'yyyy-MM-dd HH:mm:ss'
          ),
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        description: [
          this.currentOperation.description,
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        statut: [
          this.currentOperation.statut,
          { validators: [Validators.required], updateOn: 'blur' },
        ],
        credit: [
          this.currentOperation.credit,
          {
            validators: [Validators.required, Validators.min(0)],
            updateOn: 'blur',
          },
        ],
        debit: [
          this.currentOperation.debit,
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
  }

  initReactionForm() {
    this.operationForm.valueChanges.subscribe((val) => {
      Object.keys(val)
        .filter((k) => k !== 'debit' && k !== 'credit' && k !== 'time')
        .forEach((key) => {
          this.currentOperation[key] = val[key];
        });
    });

    this.leafsAccountFiltred = this.leafsAccountTotal.filter((el) =>
      this.filterLeaf(el)
    );
  }

  @ViewChild(IonModal) modal: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onDateChange(value: string | string[] | null | undefined) {
    this.modal.dismiss(this.currentDate, 'confirm');
    if (!!value) {
      this.currentDate = value;
      if (value.length >= 0) {
        this.currentOperation.time = parseISO(value.toString());

        this.operationForm
          .get('time')
          ?.setValue(format(this.currentOperation.time, 'yyyy-MM-dd HH:mm:ss'));
      }
    }
  }

  initOperation() {
    if (
      this.currentOperation === undefined ||
      this.currentOperation.id === undefined
    ) {
      this.currentOperation = {
        id: 0,
        numTrans: '',
        balance: 0,
        credit: 0,
        debit: 0,
        statut: 'r',
        description: '',
        time: new Date(),
        idAccount: 0,
        transfer: '',
      };
    }
  }

  setOperation(operation: Operation) {
    this.currentOperation = operation;
    this.initOperation();
    this.iniOperationForm();
    this.initReactionForm();
  }

  isValidData(): boolean {
    console.log('validate:' + JSON.stringify(this.operation));
    this.operationForm.updateValueAndValidity();
    let res = true;
    Object.keys(this.operationForm.controls).forEach((el: string) => {
      this.validation_messages[el]?.forEach((l) => {
        res = res && !this.isError(el, l.type);
      });
    });

    return res && this.valideDebitAndCredit();
  }

  valideDebitAndCredit(): boolean {
    this.isCreditAndDebitValide = !(
      parseFloatTool(this.currentOperation.credit) === 0 &&
      parseFloatTool(this.currentOperation.debit) === 0
    );

    return this.isCreditAndDebitValide;
  }

  isError(control: string, errotType: string): boolean {
    if (('debit' === control || 'credit' === control) && 'min' === errotType) {
      return !this.valideMinDebitOrCredit(control);
    }
    if (this.operationForm) {
      let formControl: AbstractControl<any, any> | null =
        this.operationForm.get(control);

      if (!!formControl) {
        return (
          formControl.hasError(errotType) &&
          (formControl.dirty || formControl.touched)
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  valideMinDebitOrCredit(control: string): boolean {
    return this.currentOperation[control] >= 0;
  }

  getLanguage(): string {
    return navigator.language;
  }

  debitChanged($event: any) {
    this.currentOperation.debit = $event.target.value;
  }
  creditChanged($event: any) {
    this.currentOperation.credit = $event.target.value;
  }

  onTransferChange(event: any) {
    if (event.detail.value !== undefined) {
      if (this.modalTitle === 'Transfer from') {
        this.defaultTransferFrom = this.leafsAccountTotal.find((el) => {
          return el.id == event.detail.value;
        });
        this.currentOperation.idAccount = this.defaultTransferFrom
          ? this.defaultTransferFrom.id
          : 0;

        this.transferForm
          .get('idAccount')
          ?.setValue(this.currentOperation.idAccount);

        this.transferForm
          .get('transferF')
          ?.setValue(this.defaultTransferFrom?.path);
      }

      if (this.modalTitle === 'Transfer to') {
        this.defaultTransferTo = this.leafsAccountTotal.find((el) => {
          return el.id == event.detail.value;
        });

        this.currentOperation.transfer = this.defaultTransferTo
          ? this.defaultTransferTo.path
          : '';

        this.transferForm
          .get('transfer')
          ?.setValue(this.currentOperation.transfer);
      }

      this.modalLeaf.dismiss();
      this.isModalOpen = false;
    }
  }

  search(event: Event) {
    this.leafsAccountFiltred = this.leafsAccountTotal.filter((el) =>
      this.filterLeaf(el)
    );
  }

  private filterLeaf(leaf: LeafAccount): boolean {
    return (
      this.searchText === '' ||
      leaf.acountName.toUpperCase().includes(this.searchText.toUpperCase())
    );
  }

  get operation() {
    return this.currentOperation;
  }

  openMode(mode: string) {
    switch (mode) {
      case 'from': {
        this.modalTitle = 'Transfer from';
        this.loadDataLeaf();
        this.isModalOpen = true;
        break;
      }

      case 'to': {
        this.modalTitle = 'Transfer to';
        this.loadDataLeaf();
        this.isModalOpen = true;
        break;
      }
    }
  }

  next() {
    this.transferForm.updateValueAndValidity();
    this.operationForm.updateValueAndValidity();

    switch (this.swiperRef?.selectedIndex) {
      case 0: {
        break;
      }
      case 1:
        if (this.operationForm.hasError('noMatch')) {
          this.presentAlert();
        }
        break;
      case 2: {
        this.onSubmit.emit();
        break;
      }
    }

    this.swiperRef?.next();
    this.controlNext = true;
  }

  back() {
    this.swiperRef?.previous();
  }

  isError1A() {
    return (
      this.controlNext &&
      this.swiperRef?.selectedIndex === 0 &&
      this.transferForm.get('idAccount')?.hasError('min')
    );
  }

  isError1B() {
    return (
      this.controlNext &&
      this.swiperRef?.selectedIndex === 0 &&
      this.transferForm.get('transfer')?.hasError('required')
    );
  }

  isErrorTime() {
    return (
      this.controlNext &&
      this.swiperRef?.selectedIndex === 1 &&
      this.operationForm.get('time')?.hasError('required')
    );
  }
  private loadDataLeaf() {
    this.progressShown = true;
    this.onLoadLeafAccount.emit(
      this.modalTitle === 'Transfer to'
        ? this.defaultTransferFrom?.id
        : undefined
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert ',
      subHeader: 'Alert Debit and Credit equals to 0',
      message: 'At less one of debit or credit be greater than 0!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  getFormattedDate(arg0: Date, arg1: string) {
    return format(arg0, arg1);
  }
}
