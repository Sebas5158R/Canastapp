import {
  Injectable,
  inject,
} from '@angular/core';

import {
  v4 as uuidv4,
} from 'uuid';

import {
  OfflineQueueItem,
} from '../interfaces/offline-queue.interface';

import {
  StorageService,
} from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class OfflineQueueService {

  private storageService =
    inject(StorageService);

  private readonly STORAGE_KEY =
    'offline_queue';

  async agregarOperacion(

    endpoint: string,

    method:
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'DELETE',

    body?: any

  ): Promise<void> {

    const actual =
      await this.obtenerCola();

    const item:
      OfflineQueueItem = {

      id: uuidv4(),

      endpoint,

      method,

      body,

      createdAt: Date.now(),
    };

    actual.push(item);

    await this.storageService.set(
      this.STORAGE_KEY,
      actual
    );
  }

  async obtenerCola():
    Promise<OfflineQueueItem[]> {

    return (
      await this.storageService.get<
        OfflineQueueItem[]
      >(
        this.STORAGE_KEY
      )
    ) || [];
  }

  async limpiarCola():
    Promise<void> {

    await this.storageService.remove(
      this.STORAGE_KEY
    );
  }
}