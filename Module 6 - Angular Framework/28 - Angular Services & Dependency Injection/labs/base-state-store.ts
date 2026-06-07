import { BehaviorSubject, Observable } from 'rxjs';

export abstract class BaseStateStore<T> {
  // TODO: Create a private BehaviorSubject of type T
  // private stateSubject: BehaviorSubject<T>;

  // TODO: Expose public readonly state$ Observable
  // public state$: Observable<T>;

  constructor(initialState: T) {
    // TODO: Initialize behavior subject and observable
  }

  // TODO: Implement getState returning current state snapshot
  getState(): T {
    // Hint: return stateSubject.getValue();
    return {} as T;
  }

  // TODO: Implement setState merging partialState into current state and emitting
  setState(partialState: Partial<T>): void {
    // Hint: Use spread operator to merge: { ...current, ...partialState }
  }
}
