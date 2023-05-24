import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Operation } from 'src/app/model/operation.model';
import { OperationPageStore } from '../operation-page.store';

import { OperationPageViewComponent } from './operation-page-view.component';

describe('OperationPageViewComponent', () => {
  let component: OperationPageViewComponent;
  let fixture: ComponentFixture<OperationPageViewComponent>;

  const subjectOperation: BehaviorSubject<Operation> = new BehaviorSubject(
    {} as Operation
  );

  const operationStore: any = {
    observable: subjectOperation.asObservable(),
    deleteCurrentOperatoion: () => Promise.resolve(),
    state: {} as Operation,
  };

  const alertControllerMock: any = {
    create: () => Promise.resolve(),
  };

  const loadingControllerMock: any = {
    create: () => Promise.resolve(),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationPageViewComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: OperationPageStore, useValue: operationStore },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: LoadingController, useValue: loadingControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDeleteFired should run cancel', async () => {
    const alert = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'cancel' })),
    };

    const alertControllerCreate = spyOn(
      alertControllerMock,
      'create'
    ).and.returnValue(Promise.resolve(alert));
    const processOperationDeleteSpy = spyOn<OperationPageViewComponent, any>(
      component,
      'processOperationDelete'
    );

    await component.onDeleteFired();

    expect(alertControllerCreate).toHaveBeenCalledTimes(1);
    expect(alert.present).toHaveBeenCalledTimes(1);
    expect(alert.onDidDismiss).toHaveBeenCalledTimes(1);
    expect(processOperationDeleteSpy).toHaveBeenCalledTimes(0);
  });

  it('onDeleteFired should run processOperationDelete', async () => {
    const alert = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'confirm' })),
    };

    const alertControllerCreate = spyOn(
      alertControllerMock,
      'create'
    ).and.returnValue(Promise.resolve(alert));
    const processOperationDeleteSpy = spyOn<OperationPageViewComponent, any>(
      component,
      'processOperationDelete'
    );

    await component.onDeleteFired();

    expect(alertControllerCreate).toHaveBeenCalledTimes(1);
    expect(alert.present).toHaveBeenCalledTimes(1);
    expect(alert.onDidDismiss).toHaveBeenCalledTimes(1);
    expect(processOperationDeleteSpy).toHaveBeenCalledTimes(1);
  });

  it('onDeleteFired  run processOperationDelete deleteCurrentOperatoion resolve', async () => {
    const alert = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'confirm' })),
    };

    const loading = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine
        .createSpy('dismiss')
        .and.returnValue(Promise.resolve('walou')),
    };

    const alertControllerCreate = spyOn(
      alertControllerMock,
      'create'
    ).and.returnValue(Promise.resolve(alert));

    const loadingControllerCreate = spyOn(
      loadingControllerMock,
      'create'
    ).and.returnValue(Promise.resolve(loading));

    const deleteCurrentOperatoionSpy = spyOn<OperationPageViewComponent, any>(
      operationStore,
      'deleteCurrentOperatoion'
    ).and.returnValue(Promise.resolve());

    await component.onDeleteFired();

    expect(alertControllerCreate).toHaveBeenCalledTimes(1);
    expect(loadingControllerCreate).toHaveBeenCalledTimes(1);
    expect(alert.present).toHaveBeenCalledTimes(1);
    expect(alert.onDidDismiss).toHaveBeenCalledTimes(1);
    expect(deleteCurrentOperatoionSpy).toHaveBeenCalledTimes(1);
    expect(loading.present).toHaveBeenCalledTimes(1);
    //expect(loading.dismiss).toHaveBeenCalledTimes(1);
  });

  it('onDeleteFired  run processOperationDelete deleteCurrentOperatoion reject', async () => {
    const alert = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'confirm' })),
    };

    const loading = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine
        .createSpy('dismiss')
        .and.returnValue(Promise.resolve('walou')),
    };

    const alertControllerCreate = spyOn(
      alertControllerMock,
      'create'
    ).and.returnValue(Promise.resolve(alert));

    const loadingControllerCreate = spyOn(
      loadingControllerMock,
      'create'
    ).and.returnValue(Promise.resolve(loading));

    const deleteCurrentOperatoionSpy = spyOn<OperationPageViewComponent, any>(
      operationStore,
      'deleteCurrentOperatoion'
    ).and.returnValue(Promise.reject());

    await component.onDeleteFired();

    expect(alertControllerCreate).toHaveBeenCalledTimes(1);
    expect(loadingControllerCreate).toHaveBeenCalledTimes(1);
    expect(alert.present).toHaveBeenCalledTimes(1);
    expect(alert.onDidDismiss).toHaveBeenCalledTimes(1);
    expect(deleteCurrentOperatoionSpy).toHaveBeenCalledTimes(1);
    expect(loading.present).toHaveBeenCalledTimes(1);
    //expect(loading.dismiss).toHaveBeenCalledTimes(1);
  });

  it('goToEditPage should run navigate', async () => {
    operationStore.state = { id: 0 } as Operation;
    const navigateSpy = spyOn(component.router, 'navigate').and.returnValue(
      Promise.resolve(true)
    );
    component.goToEditPage();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('goToEditPage should not run navigate', async () => {
    operationStore.state = undefined;
    const navigateSpy = spyOn(component.router, 'navigate').and.returnValue(
      Promise.resolve(true)
    );
    component.goToEditPage();
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
});
