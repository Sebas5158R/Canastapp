import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UpdateEstadoDTO, CreateOrdenDTO, EntregaProducto, RegistroProduccion, OrdenProduccion } from '../interfaces/orden-produccion.interface';
 
 




@Injectable({
  providedIn: 'root'
})
export class ProduccionService {
  private api = inject(ApiService);
  private readonly path = 'ordenes-produccion';

  // Órdenes
  getOrdenes(params?: { estado?: string }): Observable<OrdenProduccion[]> {
    return this.api.get<OrdenProduccion[]>(this.path, params);
  }

  getHistorial(): Observable<OrdenProduccion[]> {
    return this.api.get<OrdenProduccion[]>(`${this.path}/historial`);
  }

  getOrdenById(id: string): Observable<OrdenProduccion> {
    return this.api.get<OrdenProduccion>(`${this.path}/${id}`);
  }

  createOrden(orden: CreateOrdenDTO): Observable<OrdenProduccion> {
    return this.api.post<OrdenProduccion>(this.path, orden);
  }

  actualizarEstado(id: string, data: UpdateEstadoDTO): Observable<OrdenProduccion> {
    return this.api.patch<OrdenProduccion>(`${this.path}/${id}/estado`, data);
  }

  // Registros
  getRegistrosPorOrden(ordenId: string): Observable<RegistroProduccion[]> {
    return this.api.get<RegistroProduccion[]>(`${this.path}/${ordenId}/registros`);
  }

  crearRegistroProduccion(registro: Partial<RegistroProduccion>): Observable<RegistroProduccion> {
    return this.api.post<RegistroProduccion>('registros-produccion', registro);
  }

  // Entregas
  getEntregasPorOrden(ordenId: string): Observable<EntregaProducto[]> {
    return this.api.get<EntregaProducto[]>(`${this.path}/${ordenId}/entregas`);
  }

  registrarEntrega(entrega: Partial<EntregaProducto>): Observable<EntregaProducto> {
    return this.api.post<EntregaProducto>('entregas-producto', entrega);
  }

  // Trazabilidad
  getTrazabilidadPorOrden(ordenId: string): Observable<any> {
    return this.api.get<any>(`${this.path}/${ordenId}/trazabilidad`);
  }
}