import { TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, from } from 'rxjs';
import { Operation } from '../../model/operation.model';
import { PagingData } from '../../model/paging-data';
import { PagingRequest } from '../../model/paging-request.model';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { AccountPageStore } from '../account-page/account-page.store';
import { OperationPageStore } from './operation-page.store';

describe('AccountPageStore creation', () => {
  let operationPageStore: OperationPageStore;
  let operationServiceSpy: OperationService;
  let operationIdSubject = new BehaviorSubject<number>(0);

  beforeEach(waitForAsync(() => {
    const spyOperationService = {
      getOperationsByPagingAndAccountId: (
        paging: PagingRequest,
        id: number
      ): Promise<PagingData<Operation>> => {
        return Promise.resolve({
          data: [],
          totalPage: 0,
          currentPage: 0,
        });
      },
      deleteOperationDate: (id: number) => Promise.resolve(),
      getOperationJoinAccountById: (id: number) =>
        Promise.resolve({ id: id } as Operation),

      businessUpdateOperationDate: (operation: Operation) => {
        return Promise.resolve(operation);
      },
    } as OperationService;

    const spyRouteParamsStore = {
      idOperation$: operationIdSubject.asObservable(),
    } as RouteParamsStore;

    const spyAccountPageStore = {} as AccountPageStore;

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        OperationPageStore,
        { provide: OperationService, useValue: spyOperationService },
        { provide: RouteParamsStore, useValue: spyRouteParamsStore },
        { provide: AccountPageStore, useValue: spyAccountPageStore },
      ],
    });

    operationPageStore = TestBed.inject(OperationPageStore);
    operationServiceSpy = TestBed.inject(OperationService);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('AccountPageStore should create', async () => {
    expect(operationPageStore).toBeTruthy();
  });

  it('getOperationJoinAccountById should be called by right id', async () => {
    let operation: Operation = {
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

    let spy = spyOn<OperationService, any>(
      operationServiceSpy,
      'getOperationJoinAccountById'
    ).and.returnValue(Promise.resolve(operation));

    operationIdSubject.next(3);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledOnceWith(3);
  });

  it('deleteCurrentOperatoion should call right id', async () => {
    let operation: Operation = {
      id: 78,
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

    let spy = spyOn<OperationPageStore, any>(
      operationPageStore,
      'deleteOperationById'
    ).and.returnValue(Promise.resolve());

    operationPageStore.setOperation(operation);
    operationPageStore.deleteCurrentOperatoion();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledOnceWith(78);
  });

  it('deleteCurrentOperatoion should call right id and perform reject', async () => {
    let operation: Operation = {
      id: 78,
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

    let spy = spyOn<OperationPageStore, any>(
      operationPageStore,
      'deleteOperationById'
    ).and.returnValue(Promise.reject('gkdk'));

    operationPageStore.setOperation(operation);
    try {
      await operationPageStore.deleteCurrentOperatoion();
    } catch (e) {
      expect(e).toEqual('gkdk');
    }

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledOnceWith(78);
  });

  it('deleteCurrentOperatoion should with state == null', async () => {
    let spy = spyOn<OperationPageStore, any>(
      operationPageStore,
      'deleteOperationById'
    ).and.returnValue(Promise.resolve());

    operationPageStore.setOperation({} as unknown as Operation);
    try {
      await operationPageStore.deleteCurrentOperatoion();
    } catch (e) {
      expect(e).toEqual('no operation selected!!!!');
    }

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('deleteOperationById deleteOperationDate should run then', async () => {
    let spy = spyOn<OperationService, any>(
      operationServiceSpy,
      'deleteOperationDate'
    ).and.returnValue(Promise.resolve());

    await operationPageStore.deleteOperationById(3);

    expect(spy).toHaveBeenCalledTimes(1);

    spy.and.rejectWith('erreur lors de la suppression');
    try {
      await operationPageStore.deleteOperationById(3);
    } catch (e) {
      expect(e).toEqual('erreur lors de la suppression');
    }

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('deleteCurrentOperatoion deep test to deleteOperationById -> deleteOperationDate should reject ', async () => {
    let operation: Operation = {
      id: 78,
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

    let spy = spyOn<OperationService, any>(
      operationServiceSpy,
      'deleteOperationDate'
    ).and.returnValue(Promise.reject());

    operationPageStore.setOperation(operation);
    try {
      await operationPageStore.deleteCurrentOperatoion();
    } catch (e) {
      expect(e).toEqual('erreur lors de la suppression');
    }

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledOnceWith(78);
  });

  it('updateOperation businessUpdateOperationDate should run then ', async () => {
    let operation: Operation = {
      id: 78,
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

    let spy = spyOn<OperationService, any>(
      operationServiceSpy,
      'businessUpdateOperationDate'
    ).and.returnValue(Promise.resolve());

    await operationPageStore.updateOperation(operation);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledOnceWith(operation);
  });
  it('updateOperation businessUpdateOperationDate should run reject ', async () => {
    let operation: Operation = {
      id: 78,
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

    let spy = spyOn<OperationService, any>(
      operationServiceSpy,
      'businessUpdateOperationDate'
    ).and.returnValue(Promise.reject('erreur'));

    try {
      await operationPageStore.updateOperation(operation);
    } catch (e) {
      expect(e).toEqual('erreur durant excecusion du service');
    }

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledOnceWith(operation);
  });
});
