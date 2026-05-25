export interface Orden {
  id: number;
  producto_id: number;
  producto_nombre?: string;
  cantidad_planeada: number;
  cantidad_producida: number;
  cantidad_entregada: number;
  estado: 'pendiente' | 'en_produccion' | 'completada' | 'cancelada';
  fecha_inicio: Date | string;        // 
  fecha_fin_estimada: Date | string;  // 
  prioridad: 'alta' | 'media' | 'baja';  
  observaciones?: string;
  created_at: Date | string;
  updated_at: Date | string;           
  created_by?: number;                 
  creador_nombre?: string;
  
 
  notificado_bodega?: boolean;
  fecha_cancelacion?: Date | string | null;
  cantidad_solicitada?: number;       
  fecha_requerida?: Date | string;    
}
export interface RegistroProduccion {
  id: number;
  orden_produccion_id: number;
  cantidad_real_producida: number;
  fecha_inicio: Date | string | null;
  fecha_fin: Date | string | null;
  incidencias?: string | null;
  responsable_id?: number;
  responsable_nombre?: string;
  created_at: Date | string;
}

export interface EntregaProducto {
  id: number;
  orden_produccion_id: number;
  cantidad_entregada: number;
  fecha_hora_entrega: Date | string;
  observaciones?: string | null;
  responsable_id?: number;
  responsable_nombre?: string;
}

export interface CreateOrdenRequest {
  producto_id: number;
  cantidad_solicitada: number;
  fecha_requerida: Date | string;
  observaciones?: string;
}

export interface UpdateEstadoDTO {
  estado: Orden['estado'];
  observaciones?: string;
}

export interface RecetaProducto {
  producto_id: number;
  producto_nombre: string;
  ingredientes: MateriaPrimaReceta[];
}

export interface MateriaPrimaReceta {
  materia_prima_id: number;
  nombre: string;
  cantidad_necesaria: number;
  unidad_medida: string;
  stock_disponible: number;
  stock_requerido: number;
  stock_suficiente: boolean;
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