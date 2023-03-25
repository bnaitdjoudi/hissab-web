import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';
import { LeafAccount } from 'src/app/main/model/leaf-account.model';
import { Operation } from 'src/app/main/model/operation.model';
import { OperationPageStore } from '../operation-page.store';

import { OperationPageEditComponent } from './operation-page-edit.component';

describe('OperationPageComponent', () => {
  let component: OperationPageEditComponent;
  let fixture: ComponentFixture<OperationPageEditComponent>;

  let subjectOperation: BehaviorSubject<Operation> = new BehaviorSubject(
    {} as Operation
  );

  let subjectLeafs: BehaviorSubject<LeafAccount[]> = new BehaviorSubject<
    LeafAccount[]
  >([]);

  const operationStore: any = {
    observable: subjectOperation.asObservable(),
    accountStore: { leafAccounts$: subjectLeafs.asObservable() },
    updateOperation: (operation: Operation) => Promise.resolve(),
  };

  const alertControllerMock: any = {
    create: () => Promise.resolve(),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationPageEditComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: OperationPageStore, useValue: operationStore },
        { provide: AlertController, useValue: alertControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationPageEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OperationPageEditComponent onSubmitFired', async () => {
    const alert = {
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve({ role: 'confirm' }),
    } as unknown as HTMLIonAlertElement;

    const alertMockPresent = spyOn(alert, 'present').and.returnValue(
      Promise.resolve()
    );

    const alertMockonDidDismiss = spyOn(alert, 'onDidDismiss').and.returnValue(
      Promise.resolve({ role: 'confirm' })
    );

    let spyAlertControllerCreate = spyOn<AlertController, any>(
      component.alertController,
      'create'
    ).and.returnValue(Promise.resolve(alert));

    let spySubmitOperationUpdate = spyOn<OperationPageEditComponent, any>(
      component,
      'submitOperationUpdate'
    );

    await component.onSubmitFired();
    expect(spyAlertControllerCreate).toHaveBeenCalledTimes(1);

    expect(alertMockPresent).toHaveBeenCalledTimes(1);
    expect(alertMockonDidDismiss).toHaveBeenCalledTimes(1);

    expect(spySubmitOperationUpdate).toHaveBeenCalledTimes(1);
  });

  it('OperationPageEditComponent onSubmitFired role cancel', async () => {
    const alert = {
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve({ role: 'confirm' }),
    } as unknown as HTMLIonAlertElement;

    const alertMockPresent = spyOn(alert, 'present').and.returnValue(
      Promise.resolve()
    );

    const alertMockonDidDismiss = spyOn(alert, 'onDidDismiss').and.returnValue(
      Promise.resolve({ role: 'cancel' })
    );

    let spyAlertControllerCreate = spyOn<AlertController, any>(
      component.alertController,
      'create'
    ).and.returnValue(Promise.resolve(alert));

    let spySubmitOperationUpdate = spyOn<OperationPageEditComponent, any>(
      component,
      'submitOperationUpdate'
    );

    await component.onSubmitFired();
    expect(spyAlertControllerCreate).toHaveBeenCalledTimes(1);

    expect(alertMockPresent).toHaveBeenCalledTimes(1);
    expect(alertMockonDidDismiss).toHaveBeenCalledTimes(1);

    expect(spySubmitOperationUpdate).toHaveBeenCalledTimes(0);
  });

  it('OperationPageEditComponent onSubmitFired submitOperationUpdate ', async () => {
    const alert = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'confirm' })),
    } as unknown as HTMLIonAlertElement;

    const loading = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve()),
    } as unknown as HTMLIonLoadingElement;

    let spyAlertControllerCreate = spyOn<AlertController, any>(
      component.alertController,
      'create'
    ).and.returnValue(Promise.resolve(alert));

    let spyshowLoading = spyOn<LoadingController, any>(
      component.loadingCtrl,
      'create'
    ).and.returnValue(Promise.resolve(loading));

    const operation: Operation = {
      id: 0,
      numTrans: 'operation',
      time: new Date(),
      description: '',
      statut: '',
      credit: 600,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };

    const operationFormComponent = {
      isValidData: () => true,
      operation: operation,
    } as unknown as OperationFormComponent;

    spyOn<OperationFormComponent, any>(
      operationFormComponent,
      'isValidData'
    ).and.returnValue(true);

    component.operationFormComponent = operationFormComponent;

    let spySubmitOperationUpdate = spyOn<OperationPageStore, any>(
      operationStore,
      'updateOperation'
    ).and.returnValue(Promise.resolve());

    await component.onSubmitFired();
    expect(spyAlertControllerCreate).toHaveBeenCalledTimes(1);

    expect(alert.present).toHaveBeenCalledTimes(1);
    expect(alert.onDidDismiss).toHaveBeenCalledTimes(1);

    expect(spyshowLoading).toHaveBeenCalledTimes(1);

    expect(spySubmitOperationUpdate).toHaveBeenCalledTimes(1);
    expect(spySubmitOperationUpdate).toHaveBeenCalledOnceWith(operation);

    expect(loading.present).toHaveBeenCalledTimes(1);
    expect(loading.dismiss).toHaveBeenCalledTimes(1);
  });

  it('OperationPageEditComponent operationFormComponent not validate', async () => {
    const alert = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'confirm' })),
    } as unknown as HTMLIonAlertElement;

    const loading = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve()),
    } as unknown as HTMLIonLoadingElement;

    let spyAlertControllerCreate = spyOn<AlertController, any>(
      component.alertController,
      'create'
    ).and.returnValue(Promise.resolve(alert));

    let spyshowLoading = spyOn<LoadingController, any>(
      component.loadingCtrl,
      'create'
    ).and.returnValue(Promise.resolve(loading));

    const operation: Operation = {
      id: 0,
      numTrans: 'operation',
      time: new Date(),
      description: '',
      statut: '',
      credit: 600,
      debit: 0,
      balance: 0,
      idAccount: 0,
      transfer: '',
    };

    const operationFormComponent = {
      isValidData: () => true,
      operation: operation,
    } as unknown as OperationFormComponent;

    spyOn<OperationFormComponent, any>(
      operationFormComponent,
      'isValidData'
    ).and.returnValue(false);

    component.operationFormComponent = operationFormComponent;

    let spySubmitOperationUpdate = spyOn<OperationPageStore, any>(
      operationStore,
      'updateOperation'
    ).and.returnValue(Promise.resolve());

    await component.onSubmitFired();
    expect(spyAlertControllerCreate).toHaveBeenCalledTimes(1);

    expect(alert.present).toHaveBeenCalledTimes(1);
    expect(alert.onDidDismiss).toHaveBeenCalledTimes(1);

    expect(spyshowLoading).toHaveBeenCalledTimes(1);

    expect(spySubmitOperationUpdate).toHaveBeenCalledTimes(0);

    expect(loading.present).toHaveBeenCalledTimes(1);
    expect(loading.dismiss).toHaveBeenCalledTimes(1);
  });
});
