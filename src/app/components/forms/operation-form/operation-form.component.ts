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

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlertController, IonModal } from '@ionic/angular';
import {
  parseFloatTool,
  showCreditField,
  showDebitField,
} from 'src/app/tools/tools';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { Account } from 'src/app/model/account.model';
import { MatStepper } from '@angular/material/stepper';
import { ProfileModel } from 'src/app/model/profil.model';
import { PickedFile } from '@capawesome/capacitor-file-picker';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss'],
  providers: [CurrencyPipe],
})
export class OperationFormComponent implements OnInit, OnDestroy {
  fileAttachement: any;
  profileSelectionChanged($event: ProfileModel) {
    this.currentProfile = $event;
  }

  isModalProfileOpen = false;
  isModalAttachmentOpen = false;

  @Input() accountType: string = 'actif';
  @Input() currentProfile: ProfileModel;
  @Input() set operation(operation: Operation) {
    this.swiperRef?.reset();
    this.setOperation(operation);
    this.initTransferForm();
    this.iniOperationForm();
    this.initReactionForm();

    this.accountType = operation.accountType ? operation.accountType : 'actif';
  }

  @Input() leafsAccount: Observable<LeafAccount[]>;

  @Input() edit: boolean = false;

  @Input() set currentAccount(currentAccount: Account | undefined | null) {
    this.account = currentAccount;

    if (currentAccount && currentAccount.id) {
      this.defaultTransferFrom = { ...currentAccount };
    } else {
      this.defaultTransferFrom = undefined;
    }
    console.log(
      'currentaccount:::OperationFormComponent:' +
        JSON.stringify(currentAccount)
    );
  }

  @Input()
  profiles: Observable<ProfileModel[]>;
  profilesSuscrbtion: Subscription;
  items: ProfileModel[] = [];

  @Output()
  onLoadLeafAccount: EventEmitter<number | undefined> = new EventEmitter<
    number | undefined
  >();

  @Output()
  onSubmit: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onProfileListOpened: EventEmitter<void> = new EventEmitter<void>();

  account: Account | undefined | null;
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

  classeValideTransferFrom: string = '';
  classeValideTransferTo: string = '';
  tranferCase: string;

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

    this.buildLeafObserable();
    this.profiles.subscribe((profiles) => (this.items = profiles));
  }

  buildLeafObserable() {
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
      const mmm = debit === 0 && credit === 0 ? { noMatch: true } : null;

      return mmm;
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
        attachment: [this.currentOperation.attachment],
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
    this.operationForm?.valueChanges.subscribe((val) => {
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
        profile: this.currentProfile?.mail,
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

        this.accountType = this.defaultTransferFrom
          ? this.defaultTransferFrom.type
          : 'actifs';

        this.classeValideTransferFrom = 'card-account-valide';
      }

      if (this.modalTitle === 'Transfer to') {
        this.defaultTransferTo = this.leafsAccountTotal.find((el) => {
          return el.id == event.detail.value;
        });

        this.currentOperation.transfer = this.defaultTransferTo
          ? this.defaultTransferTo.path
          : '';
        this.currentOperation.idAccount = this.defaultTransferFrom
          ? this.defaultTransferFrom.id
          : 0;
        this.transferForm
          .get('idAccount')
          ?.setValue(this.currentOperation.idAccount);

        this.transferForm
          .get('transfer')
          ?.setValue(this.currentOperation.transfer);
        this.classeValideTransferTo = 'card-account-valide';
      }

      if (this.defaultTransferFrom && this.defaultTransferTo) {
        this.tranferCase = this.performTransferCase(
          this.defaultTransferFrom?.type,
          this.defaultTransferTo?.type
        );
      }

      this.modalLeaf.dismiss();
      this.isModalOpen = false;
    }
  }

  search(event: any) {
    this.searchText = event.target.value.toLowerCase();
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
    console.log('open modal:' + JSON.stringify(this.account));
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
    this.operationForm.updateValueAndValidity();
    this.transferForm.updateValueAndValidity();
    switch (this.swiperRef?.selectedIndex) {
      case 0: {
        this.validateAccount();
        break;
      }
      case 1: {
        if (this.operationForm.hasError('noMatch')) {
          this.presentAlert();
        }
        this.currentOperation.description =
          this.operationForm.get('description')?.value;

        break;
      }

      case 2: {
        this.onSubmit.emit();

        break;
      }
    }

    this.swiperRef?.next();
    this.controlNext = true;
  }
  validateAccount() {
    if (this.defaultTransferFrom) {
      this.transferForm
        .get('transferF')
        ?.setValue(this.defaultTransferFrom.path);
    }

    this.classeValideTransferFrom = this.defaultTransferFrom
      ? 'card-account-valide'
      : 'card-account-invalide';
    this.classeValideTransferTo = this.defaultTransferTo
      ? 'card-account-valide'
      : 'card-account-invalide';
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
      subHeader: '',
      message:
        this.showCredit() && this.showDebit()
          ? 'At less one of debit or credit be greater than 0!'
          : this.showCredit()
          ? 'Credit should greater than 0!'
          : this.showDebit()
          ? 'Debit should greater than 0!'
          : '',
      buttons: ['OK'],
    });

    await alert.present();
  }

  getFormattedDate(arg0: Date, arg1: string) {
    return format(arg0, arg1);
  }

  reset() {
    this.defaultTransferFrom = undefined;
    this.defaultTransferTo = undefined;
    this.classeValideTransferFrom = '';
    this.classeValideTransferTo = '';
    this.operationForm?.reset();
    this.transferForm?.reset();
  }

  openModeprofile() {
    this.onProfileListOpened.emit();
    this.isModalProfileOpen = true;
  }

  async onAttachementDone(attachement: PickedFile) {
    this.fileAttachement = attachement;
    const regex: any = /(?:\.([^.]+))?$/;
    const ext: string | null = regex.exec(attachement.name)[1];
    const fileName = Math.random().toString(36).slice(2) + '.' + ext;
    this.currentOperation.attachment = fileName;
    this.operationForm.get('attachment')?.setValue(fileName);
    this.isModalAttachmentOpen = false;
  }

  private performTransferCase(
    sourceType: string,
    destinationType: string
  ): string {
    const config: { [key: string]: any } = {
      actif: {
        actif: 'case1',
        passif: 'case5',
        depense: 'case9',
        income: 'case13',
      },
      passif: {
        actif: 'case2',
        passif: 'case6',
        depense: 'case10',
        income: 'case14',
      },
      depense: {
        actif: 'case3',
        passif: 'case7',
        depense: 'case11',
        income: 'case15',
      },
      income: {
        actif: 'case4',
        passif: 'case8',
        depense: 'case12',
        income: '',
      },
    };

    return config[sourceType][destinationType];
  }

  showDebit(): boolean {
    return (
      this.tranferCase === 'case6' ||
      this.tranferCase === 'case3' ||
      this.tranferCase === 'case4' ||
      this.tranferCase === 'case6' ||
      this.tranferCase === 'case7' ||
      this.tranferCase === 'case8' ||
      this.tranferCase === 'case11' ||
      this.tranferCase === 'case12' ||
      this.tranferCase === 'case15'
    );
  }

  showCredit(): boolean {
    return !this.showDebit();
  }

  async validateAttachment() {
    if (this.currentOperation.attachment) {
      await Filesystem.writeFile({
        path: this.currentOperation.attachment,
        data: this.fileAttachement.data ? this.fileAttachement.data : '',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    }
  }
}
