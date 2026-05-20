import {
  Injectable,
  inject,
} from '@angular/core';

import {
  Observable,
} from 'rxjs';

import {
  ApiService,
} from './api.service';

import {
  RecetaItem,
} from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root',
})
export class RecetaService {

  private api =
    inject(ApiService);

  obtenerRecetaProducto(
    productoId: number
  ): Observable<
    RecetaItem[]
  > {

    return this.api.get<
      RecetaItem[]
    >(
      `productos/${productoId}/receta`
    );
  }
}