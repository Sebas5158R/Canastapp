import {
  Injectable,
} from '@angular/core';

import {
  BehaviorSubject,
} from 'rxjs';

import {
  Producto,
} from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductosState {

  private productosSubject =
    new BehaviorSubject<Producto[]>([]);

  productos$ =
    this.productosSubject.asObservable();

  setProductos(
    productos: Producto[]
  ): void {

    this.productosSubject.next(
      productos
    );
  }

  agregarProducto(
    producto: Producto
  ): void {

    const actual =
      this.productosSubject.value;

    this.productosSubject.next([
      producto,
      ...actual,
    ]);
  }

  actualizarProducto(
    productoActualizado:
      Producto
  ): void {

    const actual =
      this.productosSubject.value;

    const actualizado =
      actual.map((producto) =>

        producto.id ===
        productoActualizado.id

          ? productoActualizado

          : producto
      );

    this.productosSubject.next(
      actualizado
    );
  }

  eliminarProducto(
    id: number
  ): void {

    const actual =
      this.productosSubject.value;

    this.productosSubject.next(

      actual.filter(
        (item) => item.id !== id
      )
    );
  }
}