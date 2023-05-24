import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  Event,
  Router,
  RouterEvent,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MainStore } from './main.store';
import { RouteParamsStore } from './route.params.store';

describe('RouteParamStore ', () => {
  describe('RouteParamStore methods', () => {
    let routeParamsStore: RouteParamsStore;

    const spyMainStore = {
      initMainAccounts: jasmine.createSpy('initMainAccounts'),
    };

    let eventsSubject: BehaviorSubject<Event> = new BehaviorSubject<Event>(
      new RouterEvent(0, '')
    );

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        // Provide both the service-to-test and its (spy) dependency
        providers: [
          RouteParamsStore,
          { provide: MainStore, useValue: spyMainStore },
        ],
      });

      routeParamsStore = TestBed.inject(RouteParamsStore);
    }));

    it('should create', (done) => {
      expect(routeParamsStore).toBeTruthy();
      done();
    });

    it('RouteParamStore setIdCount', (done) => {
      routeParamsStore.setIdCount(500);
      expect(routeParamsStore.state.accountParams.id).toEqual(500);
      done();
    });

    it('RouteParamStore setIdOperation', (done) => {
      routeParamsStore.setIdOperation(500);
      expect(routeParamsStore.state.operationParams.id).toEqual(500);
      done();
    });

    it('RouteParamStore sould not happen on route event', (done) => {
      const spySetIdOperation = spyOn(routeParamsStore, 'setIdOperation');
      const spySetIdCount = spyOn(routeParamsStore, 'setIdCount');

      eventsSubject.next(new RouterEvent(400, 'blablabla'));

      //expect(mainStoreSpy.initMainAccounts).toHaveBeenCalledTimes(0);
      expect(spySetIdCount).toHaveBeenCalledTimes(0);
      expect(spySetIdOperation).toHaveBeenCalledTimes(0);
      done();
    });
  });

  describe('RouteParamsStore route event', () => {
    let routeParamsStore: RouteParamsStore;
    let mainStoreSpy: MainStore;

    let eventsSubject: BehaviorSubject<Event | undefined>;

    const beforeEach = async (routerUrl: string): Promise<void> => {
      eventsSubject = new BehaviorSubject<Event | undefined>(undefined);

      const spyRouter = {
        url: routerUrl,
        events: eventsSubject.asObservable(),
      };

      const spyMainStore = {
        initMainAccounts: jasmine.createSpy('initMainAccounts'),
      };

      TestBed.configureTestingModule({
        teardown: { destroyAfterEach: true },
        // Provide both the service-to-test and its (spy) dependency
        providers: [
          RouteParamsStore,
          { provide: MainStore, useValue: spyMainStore },
          { provide: Router, useValue: spyRouter },
        ],
      });

      routeParamsStore = TestBed.inject(RouteParamsStore);
      mainStoreSpy = TestBed.inject(MainStore);
    };

    it('RouteParamStore sould run initMainAccounts', async () => {
      console.info('test 1');
      await beforeEach('/');
      const spySetIdOperation = spyOn(routeParamsStore, 'setIdOperation');
      const spySetIdCount = spyOn(routeParamsStore, 'setIdCount');
      eventsSubject.next(
        new ActivationEnd({
          params: { id: 45 },
          url: [{ path: 'account/', parameters: { id: 2 } }],
        } as unknown as ActivatedRouteSnapshot)
      );
      expect(mainStoreSpy.initMainAccounts).toHaveBeenCalledTimes(1);
      expect(spySetIdCount).toHaveBeenCalledOnceWith(0);
      expect(spySetIdOperation).toHaveBeenCalledOnceWith(0);
      console.info('test 1 end');
    });

    it('RouteParamStore sould run setIdCount', async () => {
      console.info('test 2');
      await beforeEach('/account/');
      const spySetIdOperation = spyOn(routeParamsStore, 'setIdOperation');
      const spySetIdCount = spyOn(routeParamsStore, 'setIdCount');
      eventsSubject.next(
        new ActivationEnd({
          params: { id: 45 },
          url: [{ path: '/account/', parameters: { id: 2 } }],
        } as unknown as ActivatedRouteSnapshot)
      );

      expect(mainStoreSpy.initMainAccounts).toHaveBeenCalledTimes(0);
      expect(spySetIdCount).toHaveBeenCalledOnceWith(45);
      expect(spySetIdOperation).toHaveBeenCalledOnceWith(0);
      console.info('test 2 end');
    });

    it('RouteParamStore sould run setIdOperation', () => {
      console.info('test 3');
      beforeEach('/operation/');
      const spySetIdOperation = spyOn(routeParamsStore, 'setIdOperation');
      const spySetIdCount = spyOn(routeParamsStore, 'setIdCount');
      eventsSubject.next(
        new ActivationEnd({
          params: { id: 45 },
          url: [{ path: '/operation/', parameters: { id: 2 } }],
        } as unknown as ActivatedRouteSnapshot)
      );

      expect(mainStoreSpy.initMainAccounts).toHaveBeenCalledTimes(0);
      expect(spySetIdCount).toHaveBeenCalledOnceWith(0);
      expect(spySetIdOperation).toHaveBeenCalledOnceWith(45);
      console.info('test 3');
    });
  });
});
