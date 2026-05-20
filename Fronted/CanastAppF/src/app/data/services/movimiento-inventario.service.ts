import {
  Injectable,
  inject,
} from '@angular/core';

import {
  Observable,
} from 'rxjs';

import { ApiService }
from './api.service';

import {
  MovimientoInventario,
  CreateMovimientoRequest,
} from '../interfaces/movimiento-inventario.interface';

@Injectable({
  providedIn: 'root',
})
export class MovimientoInventarioService {

  private api =
    inject(ApiService);

  private readonly path =
    'inventario/movimientos';

  getMovimientos():
    Observable<MovimientoInventario[]> {

    return this.api.get<
      MovimientoInventario[]
    >(this.path);
  }

  registrarMovimiento(
    data: CreateMovimientoRequest
  ): Observable<MovimientoInventario> {

    return this.api.post<
      MovimientoInventario
    >(
      this.path,
      data
    );
  }
}