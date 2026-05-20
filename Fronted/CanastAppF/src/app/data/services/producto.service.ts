import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from './api.service';

import {
  Producto,
  RecetaItem,
  CreateProductoRequest,
  UpdateProductoRequest,
} from '../interfaces/producto.interface';
import { ProductosState } from '../state/producto.state';

import { RecetaProducto, ValidacionStockResponse } from '../interfaces/orden.interface';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private api            = inject(ApiService);

  private productosState = inject(ProductosState);

  private readonly path = 'productos';

  getProductos(): Observable<Producto[]> {
    return this.api
      .get<Producto[]>(this.path)
      .pipe(tap((r) => this.productosState.setProductos(r)));
  }

  getProductoPorId(id: number): Observable<Producto> {
    return this.api.get<Producto>(`${this.path}/${id}`);
  }
   // ── Nuevos métodos para órdenes de producción ──
  getRecetaByProducto(id: number): Observable<RecetaProducto> {
    return this.api.get<RecetaProducto>(`${this.path}/${id}/receta`);
  }

  validarStock(id: number, cantidad_solicitada: number): Observable<ValidacionStockResponse> {
    return this.api.post<ValidacionStockResponse>(`${this.path}/${id}/validar-stock`, {
      cantidad_solicitada
    });
  }

  crearProducto(data: CreateProductoRequest): Observable<Producto> {
    const raw = localStorage.getItem('usuario');
    const usuario = raw ? JSON.parse(raw) : null;
    const payload = {
      ...data,
      usuario_id: usuario?.id ?? null,
    };
    return this.api
      .post<Producto>(this.path, payload)
      .pipe(tap((r) => this.productosState.agregarProducto(r)));
  }

  actualizarProducto(id: number, data: UpdateProductoRequest): Observable<Producto> {
    return this.api
      .patch<Producto>(`${this.path}/${id}`, data)
      .pipe(tap((r) => this.productosState.actualizarProducto(r)));
  }

  actualizarReceta(id: number, receta: RecetaItem[]): Observable<Producto> {
    return this.api
      .put<Producto>(`${this.path}/${id}/receta`, { receta })
      .pipe(tap((r) => this.productosState.actualizarProducto(r)));
  }

  eliminarProducto(id: number): Observable<any> {
    return this.api
      .delete<any>(`${this.path}/${id}`)
      .pipe(tap(() => this.productosState.eliminarProducto(id)));
  }
}
