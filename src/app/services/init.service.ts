import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  initialisationSubject: BehaviorSubject<boolean>;

  constructor() {
    this.initialisationSubject = new BehaviorSubject<boolean>(false);
  }
}
