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

  @Input() amount: number;

  @Output() amountEntered = new EventEmitter<number>();

  onChange: any = () => {};
  onTouch: any = () => {};
  val: string | null = '';

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnInit() {}

  valueChange(event: any) {
    // this handles keyboard input for backspace
    console.log(event.target.value);
    this.amountEntered.emit(event.target.value);
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
