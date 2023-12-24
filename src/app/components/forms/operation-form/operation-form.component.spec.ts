import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NgxTranslateModule } from 'src/app/translate/translate.module';

import { OperationFormComponent } from './operation-form.component';

describe('OperationFormComponent', () => {
  let component: OperationFormComponent;
  let fixture: ComponentFixture<OperationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationFormComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, NgxTranslateModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debit and credit equals to 0 should be falsy', () => {
    component.debitChanged(0);
    component.creditChanged(0);
    expect(component.valideDebitAndCredit()).toBeFalsy();
  });

  it('debit and credit not euals to 0 should be truly', () => {
    component.debitChanged(0);
    component.creditChanged(60);
    expect(component.valideDebitAndCredit()).toBeTruthy();
  });

  it('onDateChange time formating', () => {
    let date: Date = new Date('2023-02-14T00:51:00');
    component.onDateChange('2023-02-14T00:51:00');
    let opDate: Date = new Date(component.operation.time);
    expect(date).toEqual(opDate);
  });

  it('valideDebitAndCredit should return false', () => {
    component.operation.debit = 0;
    component.operation.credit = 0;

    expect(component.valideDebitAndCredit()).toBeFalsy();
  });

  it('onTransferToChange should give one', () => {
    //given
    let event: any = { detail: { value: 1 } };

    component.leafsAccount = [
      {
        id: 1,
        acountName: 'one',
        path: 'one',
        isLeaf: true,
      },

      {
        id: 2,
        acountName: 'two',
        path: 'two',
        isLeaf: true,
      },

      {
        id: 3,
        acountName: 'tree',
        path: 'tee',
        isLeaf: true,
      },
    ];

    component.onTransferToChange(event);
    expect(component.operation.transfer).toEqual('one');
  });

  it('isValidData should return false debit', () => {
    component.debitChanged(-66);
    expect(component.isValidData()).toEqual(false);
  });

  it('isValidData should return false credit', () => {
    component.creditChanged(-66);
    expect(component.isValidData()).toEqual(false);
  });

  it('isValidData should return true', () => {
    component.creditChanged(66);
    component.operationForm.get('time')?.setValue('2023-02-14T00:51:00');
    expect(component.isValidData()).toEqual(true);
  });

  it('isError with control not defined should false', () => {
    expect(component.isError('nocontrol', 'min')).toEqual(false);
  });

  it('cancel test should run one with cancel', () => {
    spyOn(component.modal, 'dismiss');
    component.cancel();
    expect(component.modal.dismiss).toHaveBeenCalledTimes(1);
    expect(component.modal.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });

  it('getLanguage should be en-US', () => {
    expect(component.getLanguage()).toEqual('en-US');
  });
});
