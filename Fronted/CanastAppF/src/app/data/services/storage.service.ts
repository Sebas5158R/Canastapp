import {
  Injectable,
} from '@angular/core';

import {
  Storage,
} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  private storage!: Storage;

  async init(): Promise<void> {

    this.storage =
      await new Storage().create();
  }

  async set(
    key: string,
    value: any
  ): Promise<void> {

    await this.storage.set(
      key,
      value
    );
  }

  async get<T>(
    key: string
  ): Promise<T | null> {

    return await this.storage.get(
      key
    );
  }

  async remove(
    key: string
  ): Promise<void> {

    await this.storage.remove(
      key
    );
  }

  async clear(): Promise<void> {

    await this.storage.clear();
  }
}