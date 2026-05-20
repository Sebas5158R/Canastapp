export interface Orden {
  id: string;
  numero_orden: string;
  producto_id: string;
  producto_nombre?: string;
  cantidad_planeada: number;
  cantidad_producida: number;
  cantidad_entregada: number;
  estado: 'pendiente' | 'en_produccion' | 'completada' | 'cancelada';
  fecha_inicio: Date | string;
  fecha_fin_estimada: Date | string;
  fecha_fin_real?: Date | string;
  prioridad: 'alta' | 'media' | 'baja';
  observaciones?: string;
  created_at: Date | string;
  updated_at: Date | string;
  created_by?: number;
}

export interface RegistroProduccion {
  id: string;
  orden_id: string;
  cantidad_producida: number;
  fecha_registro: Date | string;
  observaciones?: string;
  usuario_nombre?: string;
}

export interface EntregaProducto {
  id: string;
  orden_id: string;
  cantidad_entregada: number;
  fecha_entrega: Date | string;
  observaciones?: string;
  usuario_nombre?: string;
}

export interface CreateOrdenDTO {
  producto_id: string;
  cantidad_planeada: number;
  fecha_fin_estimada: Date | string;
  prioridad: 'alta' | 'media' | 'baja';
  observaciones?: string;
}

export interface UpdateEstadoDTO {
  estado: Orden['estado'];
  observaciones?: string;
}