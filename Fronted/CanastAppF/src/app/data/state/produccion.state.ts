import {
  Injectable,
} from '@angular/core';

import {
  BehaviorSubject,
} from 'rxjs';

import {
  OrdenProduccion,
} from '../interfaces/orden-produccion.interface';

@Injectable({
  providedIn: 'root',
})
export class ProduccionState {

  private ordenesSubject =
    new BehaviorSubject<
      OrdenProduccion[]
    >([]);

  ordenes$ =
    this.ordenesSubject
      .asObservable();

  setOrdenes(
    ordenes: OrdenProduccion[]
  ): void {

    this.ordenesSubject.next(
      ordenes
    );
  }

  agregarOrden(
    orden: OrdenProduccion
  ): void {

    this.ordenesSubject.next([

      orden,

      ...this.ordenesSubject.value,
    ]);
  }

  actualizarOrden(
    ordenActualizada:
      OrdenProduccion
  ): void {

    const actualizadas =
      this.ordenesSubject.value
        .map(

          (orden) =>

            orden.id ===
            ordenActualizada.id

              ? ordenActualizada

              : orden
        );

    this.ordenesSubject.next(
      actualizadas
    );
  }
}