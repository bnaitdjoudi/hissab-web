import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { Operation } from 'src/app/model/operation.model';

import { OperationListComponent } from './operation-list.component';

describe('OperationListComponent', () => {
  let component: OperationListComponent;
  let fixture: ComponentFixture<OperationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationListComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onIonInfinite should emit once onIonInfiniteScroll.emit', () => {
    spyOn(component.onIonInfiniteScroll, 'emit');
    component.onIonInfinite({} as InfiniteScrollCustomEvent);
    expect(component.onIonInfiniteScroll.emit).toHaveBeenCalledTimes(1);
  });

  it('onSelectAccount should emit once onElementSelected.emit', () => {
    let givenOperation: Operation = {
      id: 0,
      numTrans: '',
      time: new Date(),
      description: '',
      statut: '',
      credit: 0,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };

    spyOn(component.onElementSelected, 'emit');
    component.onSelectOperation(givenOperation);
    expect(component.onElementSelected.emit).toHaveBeenCalledTimes(1);
    expect(component.onElementSelected.emit).toHaveBeenCalledWith(
      givenOperation
    );
  });

  it('onDeleteFired should emit once onDelete.emit', () => {
    spyOn(component.onDelete, 'emit');
    component.onDeleteFired(1);
    expect(component.onDelete.emit).toHaveBeenCalledTimes(1);
  });

  it('onDeleteFired should not emit onDelete.emit', () => {
    spyOn(component.onDelete, 'emit');
    component.onDeleteFired(0);
    expect(component.onDelete.emit).toHaveBeenCalledTimes(0);
  });

  it('multiply should return -1', () => {
    expect(component.multiply('passif')).toEqual(-1);
  });

  it('multiply should return 1', () => {
    expect(component.multiply('actif')).toEqual(1);
  });
});
