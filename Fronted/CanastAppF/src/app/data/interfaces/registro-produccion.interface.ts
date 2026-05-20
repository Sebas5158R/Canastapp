export interface RegistroProduccion {

  id: number;

  orden_produccion_id: number;

  fecha_inicio?: string;

  fecha_fin?: string;

  cantidad_real_producida: number;

  incidencias?: string;

  responsable_id: number;

  created_at: string;
}