export interface TrazabilidadProceso {

  id: number;

  orden_produccion_id: number;

  etapa: string;

  responsable_id: number;

  accion_realizada: string;

  observaciones?: string;

  fecha_hora: string;
}