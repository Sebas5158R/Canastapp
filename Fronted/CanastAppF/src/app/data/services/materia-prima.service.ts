import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  MateriaPrima,
  MovimientoInventario,
  CreateMateriaPrimaRequest,
  UpdateMateriaPrimaRequest,
  CreateMovimientoRequest,
} from '../interfaces/materia-prima.interface';

@Injectable({
  providedIn: 'root',
})
export class MateriaPrimaService {

  private readonly path = 'inventario/materia-prima';

  constructor(private api: ApiService) {}

  getMateriaPrimas(): Observable<MateriaPrima[]> {
    return this.api.get<MateriaPrima[]>(this.path);
  }

  getMateriaPrimaPorId(id: number): Observable<MateriaPrima> {
    return this.api.get<MateriaPrima>(`${this.path}/${id}`);
  }

  crearMateriaPrima(data: CreateMateriaPrimaRequest): Observable<MateriaPrima> {
    return this.api.post<MateriaPrima>(this.path, data);
  }

  actualizarMateriaPrima(id: number, data: UpdateMateriaPrimaRequest): Observable<MateriaPrima> {
    return this.api.put<MateriaPrima>(`${this.path}/${id}`, data);
  }

  eliminarMateriaPrima(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`${this.path}/${id}`);
  }

  // ── Movimientos — pendiente de confirmar endpoint con el equipo ──
  getMovimientosPorMateria(materiaPrimaId: number): Observable<MovimientoInventario[]> {
    return this.api.get<MovimientoInventario[]>(`${this.path}/${materiaPrimaId}/movimientos`);
  }

  registrarMovimiento(data: CreateMovimientoRequest): Observable<MovimientoInventario> {
    return this.api.post<MovimientoInventario>('movimientos-inventario', data);
  }
}