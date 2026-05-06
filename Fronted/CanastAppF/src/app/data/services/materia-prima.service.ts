import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  MateriaPrima,
  MateriaPrimaConEstado,
  MovimientoInventario,
  CreateMateriaPrimaRequest,
  UpdateMateriaPrimaRequest,
  CreateMovimientoRequest,
} from '../interfaces/materia-prima.interface';

@Injectable({
  providedIn: 'root',
})
export class MateriaPrimaService {

  constructor(private api: ApiService) {}

  // ── Materia Prima ──

  getMateriaPrimas(): Observable<MateriaPrima[]> {
    return this.api.get<MateriaPrima[]>('materia-prima');
  }

  getInventarioActual(): Observable<MateriaPrimaConEstado[]> {
    return this.api.get<MateriaPrimaConEstado[]>('materia-prima/inventario');
  }

  getMateriaPrimaPorId(id: number): Observable<MateriaPrima> {
    return this.api.get<MateriaPrima>(`materia-prima/${id}`);
  }

  crearMateriaPrima(data: CreateMateriaPrimaRequest): Observable<MateriaPrima> {
    return this.api.post<MateriaPrima>('materia-prima', data);
  }

  actualizarMateriaPrima(id: number, data: UpdateMateriaPrimaRequest): Observable<MateriaPrima> {
    return this.api.put<MateriaPrima>(`materia-prima/${id}`, data);
  }

  eliminarMateriaPrima(id: number): Observable<void> {
    return this.api.delete<void>(`materia-prima/${id}`);
  }

  // ── Movimientos de Inventario ──

  getMovimientos(): Observable<MovimientoInventario[]> {
    return this.api.get<MovimientoInventario[]>('movimientos-inventario');
  }

  getMovimientosPorMateria(materiaPrimaId: number): Observable<MovimientoInventario[]> {
    return this.api.get<MovimientoInventario[]>(`materia-prima/${materiaPrimaId}/movimientos`);
  }

  registrarMovimiento(data: CreateMovimientoRequest): Observable<MovimientoInventario> {
    return this.api.post<MovimientoInventario>('movimientos-inventario', data);
  }
}
