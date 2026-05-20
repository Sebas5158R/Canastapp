import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { 
  Orden, 
  RegistroProduccion, 
  EntregaProducto, 
  CreateOrdenDTO, 
  UpdateEstadoDTO 
} from '../interfaces/orden.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private api = inject(ApiService);
  private readonly path = 'ordenes-produccion';

  // ── Órdenes ──────────────────────────────────────────────
  getOrdenes(params?: { estado?: string }): Observable<Orden[]> {
    let httpParams = new HttpParams();
    if (params?.estado) {
      httpParams = httpParams.set('estado', params.estado);
    }
    return this.api.get<Orden[]>(this.path, httpParams);
  }

  getHistorial(): Observable<Orden[]> {
    return this.api.get<Orden[]>(`${this.path}/historial`);
  }

  getOrdenById(id: string): Observable<Orden> {
    return this.api.get<Orden>(`${this.path}/${id}`);
  }

  createOrden(orden: CreateOrdenDTO): Observable<Orden> {
    return this.api.post<Orden>(this.path, orden);
  }

  actualizarEstado(id: string, data: UpdateEstadoDTO): Observable<Orden> {
    return this.api.patch<Orden>(`${this.path}/${id}/estado`, data);
  }

  // ── Registros de producción ──────────────────────────────
  getRegistrosPorOrden(ordenId: string): Observable<RegistroProduccion[]> {
    return this.api.get<RegistroProduccion[]>(`${this.path}/${ordenId}/registros`);
  }

  crearRegistroProduccion(registro: { 
    orden_id: string; 
    cantidad_producida: number; 
    observaciones?: string 
  }): Observable<RegistroProduccion> {
    return this.api.post<RegistroProduccion>('registros-produccion', registro);
  }

  // ── Entregas ──────────────────────────────────────────────
  getEntregasPorOrden(ordenId: string): Observable<EntregaProducto[]> {
    return this.api.get<EntregaProducto[]>(`${this.path}/${ordenId}/entregas`);
  }

  registrarEntrega(entrega: { 
    orden_id: string; 
    cantidad_entregada: number; 
    observaciones?: string 
  }): Observable<EntregaProducto> {
    return this.api.post<EntregaProducto>('entregas-producto', entrega);
  }

  // ── Trazabilidad ──────────────────────────────────────────
  getTrazabilidadPorOrden(ordenId: string): Observable<any> {
    return this.api.get<any>(`${this.path}/${ordenId}/trazabilidad`);
  }
}