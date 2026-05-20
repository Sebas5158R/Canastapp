import {
  Injectable,
  inject,
} from '@angular/core';

import {
  Observable,
  tap,
} from 'rxjs';

import { ApiService }
from './api.service';

import {
  Producto,
  RecetaItem,
  CreateProductoRequest,
  UpdateProductoRequest,
} from '../interfaces/producto.interface';

import { ProductosState } from '../state/producto.state';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private api =
    inject(ApiService);

  private productosState =
    inject(ProductosState);

  private readonly path =
    'productos';

  getProductos():
    Observable<Producto[]> {

    return this.api
      .get<Producto[]>(
        this.path
      )
      .pipe(
        tap((response) => {

          this.productosState
            .setProductos(response);
        })
      );
  }

  getProductoPorId(
    id: number
  ): Observable<Producto> {

    return this.api.get<Producto>(
      `${this.path}/${id}`
    );
  }

  crearProducto(
    data: CreateProductoRequest
  ): Observable<Producto> {

    return this.api
      .post<Producto>(
        this.path,
        data
      )
      .pipe(
        tap((response) => {

          this.productosState
            .agregarProducto(response);
        })
      );
  }

  actualizarProducto(
    id: number,
    data: UpdateProductoRequest
  ): Observable<Producto> {

    return this.api
      .patch<Producto>(
        `${this.path}/${id}`,
        data
      )
      .pipe(
        tap((response) => {

          this.productosState
            .actualizarProducto(response);
        })
      );
  }

  actualizarReceta(
    id: number,
    receta: RecetaItem[]
  ): Observable<Producto> {

    return this.api
      .put<Producto>(
        `${this.path}/${id}/receta`,
        { receta }
      )
      .pipe(
        tap((response) => {

          this.productosState
            .actualizarProducto(response);
        })
      );
  }

  eliminarProducto(
    id: number
  ): Observable<any> {

    return this.api
      .delete<any>(
        `${this.path}/${id}`
      )
      .pipe(
        tap(() => {

          this.productosState
            .eliminarProducto(id);
        })
      );
  }
}