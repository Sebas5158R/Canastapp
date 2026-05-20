import {
  Injectable,
} from '@angular/core';

import {
  BehaviorSubject,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {

  isOnline$ =
    new BehaviorSubject<boolean>(
      navigator.onLine
    );

  constructor() {

    window.addEventListener(
      'online',

      () => {

        this.isOnline$.next(true);
      }
    );

    window.addEventListener(
      'offline',

      () => {

        this.isOnline$.next(false);
      }
    );
  }

  isOnline(): boolean {

    return navigator.onLine;
  }
}