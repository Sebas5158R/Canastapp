export interface MovimientoInventario {

  id: number;

  materia_prima_id: number;

  tipo_movimiento:
    | 'entrada'
    | 'salida'
    | 'ajuste';

  cantidad: number;

  fecha_movimiento: string;

  usuario_id: number;

  orden_produccion_id?: number;

  observaciones?: string;
}

export interface CreateMovimientoRequest {

  materia_prima_id: number;

  tipo_movimiento:
    | 'entrada'
    | 'salida'
    | 'ajuste';

  cantidad: number;

  usuario_id: number;

  orden_produccion_id?: number;

  observaciones?: string;
}