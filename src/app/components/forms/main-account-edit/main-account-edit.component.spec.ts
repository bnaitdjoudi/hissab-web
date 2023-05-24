import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainAccountEditComponent } from './main-account-edit.component';

describe('MainAccountEditComponent', () => {
  let component: MainAccountEditComponent;
  let fixture: ComponentFixture<MainAccountEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainAccountEditComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MainAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel test should run one with cancel', () => {
    spyOn(component.modal, 'dismiss');
    component.cancel();
    expect(component.modal.dismiss).toHaveBeenCalledTimes(1);
    expect(component.modal.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });

  it('confirm test should run one with cancel', () => {
    spyOn(component.modal, 'dismiss');
    component.confirm();
    expect(component.modal.dismiss).toHaveBeenCalledTimes(1);
    expect(component.modal.dismiss).toHaveBeenCalledWith(
      component.montant,
      'confirm'
    );
  });

  it('onWillDismissEvent and call OnConfirm', () => {
    spyOn(component.onConfirm, 'emit');
    let event: Event = { detail: { role: 'confirm' } } as unknown as Event;
    component.onWillDismissEvent(event);
    expect(component.onConfirm.emit).toHaveBeenCalledTimes(1);
    expect(component.onConfirm.emit).toHaveBeenCalledWith(component.montant);
  });
});
