export interface EntregaProducto {

  id: number;

  orden_produccion_id: number;

  fecha_hora_entrega: string;

  cantidad_entregada: number;

  responsable_id: number;

  observaciones?: string;
}