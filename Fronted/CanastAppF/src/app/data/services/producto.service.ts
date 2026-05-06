import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Producto,
  Receta,
  CreateProductoRequest,
  UpdateProductoRequest,
} from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  constructor(private api: ApiService) {}

  // ── Productos ──

  getProductos(): Observable<Producto[]> {
    return this.api.get<Producto[]>('productos');
  }

  getProductoPorId(id: number): Observable<Producto> {
    return this.api.get<Producto>(`productos/${id}`);
  }

  crearProducto(data: CreateProductoRequest): Observable<Producto> {
    return this.api.post<Producto>('productos', data);
  }

  actualizarProducto(id: number, data: UpdateProductoRequest): Observable<Producto> {
    return this.api.put<Producto>(`productos/${id}`, data);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.api.delete<void>(`productos/${id}`);
  }

  // ── Recetas ──

  getRecetasPorProducto(productoId: number): Observable<Receta[]> {
    return this.api.get<Receta[]>(`productos/${productoId}/recetas`);
  }

  crearReceta(data: Omit<Receta, 'id' | 'created_at'>): Observable<Receta> {
    return this.api.post<Receta>('recetas', data);
  }

  eliminarReceta(id: number): Observable<void> {
    return this.api.delete<void>(`recetas/${id}`);
  }
}
