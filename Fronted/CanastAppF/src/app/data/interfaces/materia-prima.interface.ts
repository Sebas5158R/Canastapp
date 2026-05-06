export type EstadoInventario = 'activo' | 'inactivo' | 'vencido';
export type EstadoStock = 'CRÍTICO' | 'NORMAL' | 'EXCESO';

export interface MateriaPrima {
  id: number;
  nombre: string;
  descripcion?: string;
  cantidad_disponible: number;
  unidad_medida: string;
  stock_minimo: number;
  stock_maximo: number;
  fecha_vencimiento?: string;
  estado_inventario: EstadoInventario;
  created_at?: string;
  updated_at?: string;
}

export interface MateriaPrimaConEstado extends MateriaPrima {
  estado_stock: EstadoStock;
}

export interface MovimientoInventario {
  id: number;
  materia_prima_id: number;
  materia_prima?: MateriaPrima;
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  fecha_movimiento?: string;
  usuario_id?: number;
  orden_produccion_id?: number;
  observaciones?: string;
}

export interface CreateMateriaPrimaRequest {
  nombre: string;
  descripcion?: string;
  cantidad_disponible: number;
  unidad_medida: string;
  stock_minimo?: number;
  stock_maximo?: number;
  fecha_vencimiento?: string;
}

export interface CreateMovimientoRequest {
  materia_prima_id: number;
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  observaciones?: string;
}

export interface UpdateMateriaPrimaRequest extends Partial<CreateMateriaPrimaRequest> {}
