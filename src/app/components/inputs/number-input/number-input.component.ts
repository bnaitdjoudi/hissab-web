import { CurrencyPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { CONSTANTS } from '../../../shared/constants';

@Component({
  selector: 'number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    CurrencyPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements OnInit, ControlValueAccessor {
  private static BACKSPACE_KEY = 'Backspace';
  private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';

  @ViewChild('dummyFacade', { static: false }) private dummyFacade: IonInput;

  @Input() formGroup: FormGroup<any>;

  @Input() formControlName: string;

  @Input() precision: number;

  @Input() amount: string;

  @Output() amountEntered = new EventEmitter<number>();

  onChange: any = () => {};
  onTouch: any = () => {};
  val: string | null = '';

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    if (this.amount && this.amount.trim() !== '') {
      this.amountEntered.emit(+this.amount);
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    // this handles keyboard input for backspace

    if (event.key === NumberInputComponent.BACKSPACE_KEY) {
      this.delDigit();
    }
  }


  

  handleInput(event: Event) {
    // check if digit
    if (
      this.isCustomEvent(event) &&
      event.detail.data &&
      !isNaN(event.detail.data)
    ) {
      this.addDigit(event.detail.data);
    } else if (
      this.isCustomEvent(event) &&
      event.detail.inputType === NumberInputComponent.BACKSPACE_INPUT_TYPE
    ) {
      // this handles numpad input for delete/backspace
      this.delDigit();
    }
  }

  private addDigit(key: string) {
    this.amount = this.amount + key;
    this.amountEntered.emit(+this.amount / Math.pow(10, this.precision));
    this.onChange(this.amount);
    this.onTouch(this.amount);
  }

  private delDigit() {
    this.amount = new String(this.amount).substring(0, this.amount.length - 1);
    this.amountEntered.emit(+this.amount / Math.pow(10, this.precision));
    this.onChange(this.amount);
    this.onTouch(this.amount);
  }

  private clearInput() {
    this.dummyFacade.value = CONSTANTS.EMPTY; // ensures work for mobile devices
    // ensures work for browser
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = CONSTANTS.EMPTY;
    });
  }

  get formattedAmount(): string | null {
    this.val = this.currencyPipe.transform(
      +this.amount / Math.pow(10, this.precision)
    );
    return this.val;
  }

  openInput() {
    this.dummyFacade.setFocus();
  }

  isCustomEvent(event: Event): event is CustomEvent {
    return 'detail' in event;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  writeValue(obj: any): void {
    this.val = obj;
  }
}
