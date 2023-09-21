import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Account } from 'src/app/model/account.model';
import { PagingData } from 'src/app/model/paging-data';
import { FloatLabelType } from '@angular/material/form-field';
import { IonModal } from '@ionic/angular';
import { Rappel } from 'src/app/model/rappel.model';
import { format, parseISO } from 'date-fns';
import { MatStepper } from '@angular/material/stepper';
import { CREATE_RAPPEL_TABLE } from 'src/app/services/databases/tables';
@Component({
  selector: 'rappel-form',
  templateUrl: './rappel-form.component.html',
  styleUrls: ['./rappel-form.component.scss'],
})
export class RappelFormComponent implements OnInit {
  eventForm: FormGroup;
  notificationForm: FormGroup;
  isModalOpenAccount: boolean = false;

  selectedAccount: Account;

  @Input()
  accountData: PagingData<Account>;

  @Input()
  rappel: Rappel = {
    id: 0,
    accountId: 0,
    description: '',
    eventDate: new Date(),
    notifyDate: new Date(),
    notifyPeriode: '1d',
    isPeriode: false,
    periode: '1m',
    isActive: false,
    accountName: '',
  };

  @Output()
  onTextAccountSearchChange: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(IonModal) modal: IonModal;
  periodLabelControl = new FormControl('non' as FloatLabelType);
  periodControl = new FormControl(this.rappel.periode as FloatLabelType);

  currentDate: string | string[] | null | undefined = format(
    new Date(),
    'yyyy-MM-dd HH:mm:ss'
  );

  @ViewChild('stepper')
  swiperRef: MatStepper | undefined;

  @Output()
  onSubmit: EventEmitter<Rappel> = new EventEmitter<Rappel>();
  controlNext: boolean;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.setEventForm();
    this.setNotificationForm();
  }

  setNotificationForm() {
    this.notificationForm = this.fb.group({
      notifyDate: [
        format(this.rappel.notifyDate, 'yyyy-MM-dd HH:mm:ss'),
        {
          validators: [Validators.required],
        },
      ],
    });
  }

  setEventForm() {
    this.eventForm = this.fb.group({
      isPeriod: this.periodLabelControl,
      time: [
        format(this.rappel.eventDate, 'yyyy-MM-dd HH:mm:ss'),
        {
          validators: [Validators.required],
        },
      ],
      description: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      accountId: [
        0,
        {
          validators: [Validators.required],
        },
      ],
      period: this.periodControl,
    });

    this.eventForm.valueChanges.subscribe((val) => {
      Object.keys(val)
        .filter((k) => k !== 'time')
        .forEach((key) => {
          switch (key) {
            case 'description': {
              this.rappel.description = val[key];
              break;
            }
            case 'isPeriod': {
              this.rappel.isPeriode = val[key] === 'oui';

              break;
            }

            case 'period': {
              this.rappel.periode = val[key];
              break;
            }
          }
        });
    });
  }

  setOpen(arg0: boolean) {
    this.isModalOpenAccount = arg0;
  }

  onTextAccountSearch(text: string) {
    this.onTextAccountSearchChange.emit(text);
  }
  updateSelectedAccount(account: Account) {
    this.selectedAccount = account;
    this.isModalOpenAccount = false;
    this.rappel.accountId = account.id;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  onEventDateChange(value: string | string[] | null | undefined) {
    if (!!value) {
      if (value.length >= 0) {
        this.rappel.eventDate = parseISO(value.toString());

        this.eventForm
          .get('time')
          ?.setValue(format(this.rappel.eventDate, 'yyyy-MM-dd HH:mm:ss'));
      }
    }
  }

  back() {
    this.swiperRef?.previous();
  }
  next() {
    this.eventForm.updateValueAndValidity();

    switch (this.swiperRef?.selectedIndex) {
      case 0: {
        break;
      }
      case 1: {
        if (this.eventForm.hasError('noMatch')) {
          this.presentAlert();
        }
        this.rappel.description = this.eventForm.get('description')?.value;

        break;
      }

      case 2: {
        this.onSubmit.emit(this.rappel);
        break;
      }
    }

    this.swiperRef?.next();
    this.controlNext = true;
  }
  presentAlert() {
    throw new Error('Method not implemented.');
  }

  onNotifyDateChange(value: string | string[] | null | undefined) {
    if (!!value) {
      if (value.length >= 0) {
        this.rappel.notifyDate = parseISO(value.toString());

        this.notificationForm
          .get('notifyDate')
          ?.setValue(format(this.rappel.notifyDate, 'yyyy-MM-dd HH:mm:ss'));
      }
    }
  }
}
