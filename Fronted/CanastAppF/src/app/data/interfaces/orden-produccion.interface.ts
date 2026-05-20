export type EstadoProduccion =
  | 'pendiente'
  | 'en_produccion'
  | 'completada'
  | 'cancelada';

export interface OrdenProduccion {

  id: number;

  producto_id: number;

  cantidad_solicitada: number;

  fecha_requerida: string;

  fecha_creacion: string;

  estado: EstadoProduccion;

  usuario_creador_id: number;

  observaciones?: string;

  notificado_bodega: boolean;

  fecha_cancelacion?: string;

  producto?: any;
}

// Alias para no romper imports viejos
export type EstadoOrden =
  EstadoProduccion;

// Requests

export interface CreateOrdenRequest {

  producto_id: number;

  cantidad_solicitada: number;

  fecha_requerida: string;

  observaciones?: string;
}

export interface UpdateOrdenEstadoRequest {

  estado: EstadoProduccion;

  observaciones?: string;
}

// Producción

export interface RegistroProduccion {

  id: number;

  orden_produccion_id: number;

  fecha_inicio?: string;

  fecha_fin?: string;

  cantidad_real_producida: number;

  incidencias?: string;

  responsable_id: number;

  created_at?: string;
}

export interface CreateRegistroProduccionRequest {

  orden_produccion_id: number;

  fecha_inicio?: string;

  fecha_fin?: string;

  cantidad_real_producida: number;

  incidencias?: string;

  responsable_id: number;
}

// Entregas

export interface EntregaProducto {

  id: number;

  orden_produccion_id: number;

  fecha_hora_entrega?: string;

  cantidad_entregada: number;

  responsable_id: number;

  observaciones?: string;
}

// Trazabilidad

export interface TrazabilidadProceso {

  id: number;

  orden_produccion_id: number;

  etapa: string;

  responsable_id: number;

  accion_realizada: string;

  observaciones?: string;

  fecha_hora?: string;
}