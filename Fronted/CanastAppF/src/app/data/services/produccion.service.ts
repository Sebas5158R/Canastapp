import {
  Injectable,
  inject,
} from '@angular/core';

import {
  Observable,
  tap,
} from 'rxjs';

import {
  ApiService,
} from './api.service';

import {
  SocketService,
} from './socket.service';

import {
  ProduccionState,
} from '../state/produccion.state';

import {
  OrdenProduccion,
} from '../interfaces/orden-produccion.interface';

import {
  RegistroProduccion,
} from '../interfaces/registro-produccion.interface';

import {
  EntregaProducto,
} from '../interfaces/entrega-producto.interface';
import {
  forkJoin,
  switchMap,
  map,
  of,
} from 'rxjs';

import {
  RecetaService,
} from './receta.service';

import {
  MateriaPrimaService,
} from './materia-prima.service';
@Injectable({
  providedIn: 'root',
})
export class ProduccionService {

  private api =
    inject(ApiService);

  private socketService =
    inject(SocketService);

  private produccionState =
    inject(ProduccionState);
    private recetaService =
  inject(RecetaService);

private materiaPrimaService =
  inject(MateriaPrimaService);

  constructor() {

    this.socketService.listen(

      'orden-actualizada',

      (response) => {

        this.produccionState
          .actualizarOrden(
            response
          );
      }
    );
  }
  

  obtenerOrdenes():
    Observable<
      OrdenProduccion[]
    > {

    return this.api
      .get<
        OrdenProduccion[]
      >(
        'ordenes-produccion'
      )
      .pipe(

        tap((response) => {

          this.produccionState
            .setOrdenes(
              response
            );
        })
      );
  }

  crearOrden(
    body: Partial<
      OrdenProduccion
    >
  ): Observable<
    OrdenProduccion
  > {

    return this.api
      .post<
        OrdenProduccion
      >(
        'ordenes-produccion',
        body
      )
      .pipe(

        tap((response) => {

          this.produccionState
            .agregarOrden(
              response
            );
        })
      );
  }

  actualizarEstado(

    id: number,

    estado: string

  ): Observable<
    OrdenProduccion
  > {

    return this.api
      .patch<
        OrdenProduccion
      >(

        `ordenes-produccion/${id}/estado`,

        { estado }
      )
      .pipe(

        tap((response) => {

          this.produccionState
            .actualizarOrden(
              response
            );
        })
      );
  }

  registrarProduccion(

    body:
      Partial<
        RegistroProduccion
      >

  ): Observable<
    RegistroProduccion
  > {

    return this.api.post<
      RegistroProduccion
    >(
      'registro-produccion',
      body
    );
  }

  registrarEntrega(

    body:
      Partial<
        EntregaProducto
      >

  ): Observable<
    EntregaProducto
  > {

    return this.api.post<
      EntregaProducto
    >(
      'entregas-producto',
      body
    );
  }
}