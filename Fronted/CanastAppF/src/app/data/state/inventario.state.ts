import {
  Injectable,
} from '@angular/core';

import {
  BehaviorSubject,
} from 'rxjs';

import {
  MateriaPrima,
} from '../interfaces/materia-prima.interface';

@Injectable({
  providedIn: 'root',
})
export class InventarioState {

  private inventarioSubject =
    new BehaviorSubject<
      MateriaPrima[]
    >([]);

  inventario$ =
    this.inventarioSubject
      .asObservable();

  setInventario(
    inventario: MateriaPrima[]
  ): void {

    this.inventarioSubject.next(
      inventario
    );
  }

  agregarMateria(
    materia: MateriaPrima
  ): void {

    const actual =
      this.inventarioSubject.value;

    this.inventarioSubject.next([
      materia,
      ...actual,
    ]);
  }

  actualizarMateria(
    materiaActualizada:
      MateriaPrima
  ): void {

    const actualizado =
      this.inventarioSubject.value
        .map(

          (materia) =>

            materia.id ===
            materiaActualizada.id

              ? materiaActualizada

              : materia
        );

    this.inventarioSubject.next(
      actualizado
    );
  }

  eliminarMateria(
    id: number
  ): void {

    const filtrado =
      this.inventarioSubject.value
        .filter(

          (materia) =>

            materia.id !== id
        );

    this.inventarioSubject.next(
      filtrado
    );
  }
}