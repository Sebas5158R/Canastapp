import { Producto } from './producto.interface';
import { Usuario } from './usuario.interface';

export type EstadoOrden = 'pendiente' | 'en_produccion' | 'completada' | 'cancelada';

export interface OrdenProduccion {
  id: number;
  producto_id: number;
  producto?: Producto;
  cantidad_solicitada: number;
  fecha_requerida: string;
  fecha_creacion?: string;
  estado: EstadoOrden;
  usuario_creador_id?: number;
  usuario_creador?: Usuario;
  observaciones?: string;
  notificado_bodega?: boolean;
  fecha_cancelacion?: string;
}

export interface RegistroProduccion {
  id: number;
  orden_produccion_id: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  cantidad_real_producida: number;
  incidencias?: string;
  responsable_id?: number;
  responsable?: Usuario;
  created_at?: string;
}

export interface EntregaProducto {
  id: number;
  orden_produccion_id: number;
  fecha_hora_entrega?: string;
  cantidad_entregada: number;
  responsable_id?: number;
  responsable?: Usuario;
  observaciones?: string;
}

export interface TrazabilidadProceso {
  id: number;
  orden_produccion_id: number;
  etapa: string;
  responsable_id?: number;
  responsable?: Usuario;
  accion_realizada: string;
  observaciones?: string;
  fecha_hora?: string;
}

export interface CreateOrdenRequest {
  producto_id: number;
  cantidad_solicitada: number;
  fecha_requerida: string;
  observaciones?: string;
}

export interface UpdateOrdenEstadoRequest {
  estado: EstadoOrden;
  observaciones?: string;
}

export interface CreateRegistroProduccionRequest {
  orden_produccion_id: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  cantidad_real_producida: number;
  incidencias?: string;
}
