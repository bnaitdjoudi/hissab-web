import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Operation } from 'src/app/main/model/operation.model';
import { format, parseISO } from 'date-fns';
import { CurrencyPipe, formatNumber } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { IonInput, IonModal } from '@ionic/angular';
import { parseFloatTool } from 'src/app/main/tools/tools';
import { LeafAccount } from 'src/app/main/model/leaf-account.model';

@Component({
  selector: 'operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss'],
  providers: [CurrencyPipe],
})
export class OperationFormComponent implements OnInit, OnDestroy {
  @Input() accountType: string = 'actifs';
  @Input() operation: Operation;
  @Input() leafsAccount: LeafAccount[] = [];
  defaultTransferTo: LeafAccount | undefined;

  @ViewChild('debit') debitElement: IonInput;

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

  operationForm: FormGroup;

  operationFormSuscribtion: Subscription;

  isCreditAndDebitValide = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly currency: CurrencyPipe
  ) {}

  ngOnInit() {
    this.initOperation();
    this.iniOperationForm();
    this.initReactionForm();
    this.operation.transfer = this.defaultTransferTo
      ? this.defaultTransferTo.path
      : '';
  }

  ngOnDestroy(): void {
    this.operationFormSuscribtion?.unsubscribe();
  }

  iniOperationForm() {
    this.operationForm = this.fb.group({
      numTrans: [this.operation.numTrans],
      time: [
        format(this.operation.time, 'yyyy-MM-dd HH:mm:ss'),
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      description: [
        this.operation.description,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      statut: [this.operation.statut],
      credit: [
        this.currency.transform(this.operation.credit),
        {
          validators: [Validators.required, Validators.min(0)],
          updateOn: 'blur',
        },
      ],
      debit: [
        this.currency.transform(this.operation.debit),
        {
          validators: [Validators.required, Validators.min(0)],
          updateOn: 'blur',
        },
      ],
    });
  }

  initReactionForm() {
    this.operationForm.valueChanges.subscribe((val) => {
      Object.keys(val)
        .filter((k) => k !== 'debit' && k !== 'credit')
        .forEach((key) => (this.operation[key] = val[key]));
    });
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
        this.operation['time'] = parseISO(value.toString());

        this.operationForm
          .get('time')
          ?.setValue(format(this.operation.time, 'yyyy-MM-dd HH:mm:ss'));
      }
    }
  }

  initOperation() {
    if (this.operation === undefined) {
      this.operation = {
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

  isValidData(): boolean {
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
      parseFloatTool(this.operation.credit) === 0 &&
      parseFloatTool(this.operation.debit) === 0
    );

    return this.isCreditAndDebitValide;
  }

  isError(control: string, errotType: string): boolean {
    if (('debit' === control || 'credit' === control) && 'min' === errotType) {
      return !this.valideMinDebitOrCredit(control);
    }

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
  }
  valideMinDebitOrCredit(control: string): boolean {
    return this.operation[control] >= 0;
  }

  getLanguage(): string {
    return navigator.language;
  }

  debitChanged($event: number) {
    this.operation.debit = $event;
  }
  creditChanged($event: number) {
    this.operation.credit = $event;
  }

  onTransferToChange(event: any) {
    if (event.detail.value !== undefined) {
      this.defaultTransferTo = this.leafsAccount.find((el) => {
        return el.id == event.detail.value;
      });
    }

    this.operation.transfer = this.defaultTransferTo
      ? this.defaultTransferTo.path
      : '';
  }
}
