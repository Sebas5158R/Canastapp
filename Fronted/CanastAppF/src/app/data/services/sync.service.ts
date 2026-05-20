import {
  Injectable,
  inject,
} from '@angular/core';

import {
  NetworkService,
} from './network.service';

import {
  OfflineQueueService,
} from './offline-queue.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {

  private networkService =
    inject(NetworkService);

  private offlineQueueService =
    inject(OfflineQueueService);

  constructor() {

    this.networkService
      .isOnline$
      .subscribe(

        (online) => {

          if (online) {

            this.sincronizar();
          }
        }
      );
  }

  async sincronizar():
    Promise<void> {

    const cola =
      await this.offlineQueueService
        .obtenerCola();

    console.log(
      'SINCRONIZANDO',
      cola
    );

    // Aquí reenviamos
    // operaciones pendientes
  }
}