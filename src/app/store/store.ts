import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class Store<T> {
  private _state: BehaviorSubject<T>;
  private state$: Observable<T>;

  get state(): T {
    return this._state.getValue();
  }

  get observable(): Observable<T> {
    return this.state$;
  }

  constructor(initialState: T) {
    this._state = new BehaviorSubject<T>(initialState);
    this.state$ = this._state.asObservable();
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    );
  }

  protected subject<K>(nextFn: (val: K) => void, act: K): BehaviorSubject<K> {
    let sub = new BehaviorSubject(act);
    sub.subscribe({ next: nextFn });
    return sub;
  }

  setState(newState: Partial<T>) {
    if (newState == null) {
      this._state.next(newState);
    } else {
      this._state.next({
        ...this.state,
        ...newState,
      });
    }
  }
}
