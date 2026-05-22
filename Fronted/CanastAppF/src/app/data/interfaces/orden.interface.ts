export interface Orden {
  id: number;
  numero_orden?: string;
  producto_id: number;
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
  creador_nombre?: string;
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
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
  costo_estimado?: number;
}

export interface MateriaPrimaReceta {
  materia_prima_id: number;
  nombre: string;
  cantidad_necesaria: number;  // por unidad de producto
  unidad_medida: string;
  stock_disponible: number;
  stock_requerido: number;      // cantidad_solicitada * cantidad_necesaria
  stock_suficiente: boolean;
}

export interface RecetaProducto {
  producto_id: number;
  producto_nombre: string;
  ingredientes: MateriaPrimaReceta[];
}

export interface CreateOrdenRequest {
  producto_id: number;
  cantidad_solicitada: number;
  fecha_requerida: Date | string;
  observaciones?: string;
}

export interface CreateOrdenResponse {
  id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad_solicitada: number;
  estado: string;
  fecha_requerida: string;
  observaciones?: string;
  created_at: string;
}

export interface ValidacionStockResponse {
  valida: boolean;
  faltantes?: {
    materia_prima_id: number;
    nombre: string;
    disponible: number;
    requerido: number;
    faltante: number;
    unidad_medida: string;
  }[];
  mensaje?: string;
}