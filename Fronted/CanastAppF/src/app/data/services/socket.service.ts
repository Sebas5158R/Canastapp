import {
  Injectable,
} from '@angular/core';

import {
  io,
  Socket,
} from 'socket.io-client';

import {
  BehaviorSubject,
} from 'rxjs';

import {
  environment,
} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private socket!: Socket;

  connected$ =
    new BehaviorSubject<boolean>(
      false
    );

  connect(): void {

    this.socket = io(
      environment.apiUrl.replace(
        '/api',
        ''
      ),
      {
        transports: ['websocket'],
      }
    );

    this.socket.on(
      'connect',
      () => {

        console.log(
          'SOCKET CONNECTED'
        );

        this.connected$.next(
          true
        );
      }
    );

    this.socket.on(
      'disconnect',
      () => {

        console.log(
          'SOCKET DISCONNECTED'
        );

        this.connected$.next(
          false
        );
      }
    );
  }

  listen(
    event: string,
    callback: (data: any) => void
  ): void {

    this.socket.on(
      event,
      callback
    );
  }

  emit(
    event: string,
    data: any
  ): void {

    this.socket.emit(
      event,
      data
    );
  }

  disconnect(): void {

    if (this.socket) {

      this.socket.disconnect();
    }
  }
}