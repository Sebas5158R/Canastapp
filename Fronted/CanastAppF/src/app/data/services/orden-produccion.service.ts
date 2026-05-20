import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  OrdenProduccion,
  EstadoProduccion,
  RegistroProduccion,
  EntregaProducto,
  TrazabilidadProceso,
  CreateOrdenRequest,
  UpdateOrdenEstadoRequest,
  CreateRegistroProduccionRequest,
} from '../interfaces/orden-produccion.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdenProduccionService {

  constructor(private api: ApiService) {}

  // ── Órdenes ──

  getOrdenes(): Observable<OrdenProduccion[]> {
    return this.api.get<OrdenProduccion[]>('ordenes-produccion');
  }

  getOrdenesPorEstado(estado: EstadoProduccion): Observable<OrdenProduccion[]> {
    return this.api.get<OrdenProduccion[]>(`ordenes-produccion?estado=${estado}`);
  }

  getOrdenPorId(id: number): Observable<OrdenProduccion> {
    return this.api.get<OrdenProduccion>(`ordenes-produccion/${id}`);
  }

  crearOrden(data: CreateOrdenRequest): Observable<OrdenProduccion> {
    return this.api.post<OrdenProduccion>('ordenes-produccion', data);
  }

  actualizarEstado(id: number, data: UpdateOrdenEstadoRequest): Observable<OrdenProduccion> {
    return this.api.patch<OrdenProduccion>(`ordenes-produccion/${id}/estado`, data);
  }

  cancelarOrden(id: number, observaciones?: string): Observable<OrdenProduccion> {
    return this.actualizarEstado(id, { estado: 'cancelada', observaciones });
  }

  // ── Historial ──

  getHistorialOrdenes(): Observable<OrdenProduccion[]> {
    return this.api.get<OrdenProduccion[]>('ordenes-produccion/historial');
  }

  // ── Registro de Producción ──

  getRegistrosPorOrden(ordenId: number): Observable<RegistroProduccion[]> {
    return this.api.get<RegistroProduccion[]>(`ordenes-produccion/${ordenId}/registros`);
  }

  crearRegistroProduccion(data: CreateRegistroProduccionRequest): Observable<RegistroProduccion> {
    return this.api.post<RegistroProduccion>('registros-produccion', data);
  }

  // ── Entregas ──

  getEntregasPorOrden(ordenId: number): Observable<EntregaProducto[]> {
    return this.api.get<EntregaProducto[]>(`ordenes-produccion/${ordenId}/entregas`);
  }

  registrarEntrega(data: Omit<EntregaProducto, 'id' | 'fecha_hora_entrega'>): Observable<EntregaProducto> {
    return this.api.post<EntregaProducto>('entregas-producto', data);
  }

  // ── Trazabilidad ──

  getTrazabilidadPorOrden(ordenId: number): Observable<TrazabilidadProceso[]> {
    return this.api.get<TrazabilidadProceso[]>(`ordenes-produccion/${ordenId}/trazabilidad`);
  }
}
