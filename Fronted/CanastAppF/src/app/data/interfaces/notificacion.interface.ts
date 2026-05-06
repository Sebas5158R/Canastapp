export type TipoNotificacion = 'produccion' | 'administrativa' | 'alerta' | 'vencimiento';

export interface Notificacion {
  id: number;
  usuario_id: number;
  mensaje: string;
  leida: boolean;
  fecha_creacion?: string;
  tipo?: TipoNotificacion;
  referencia_id?: number;
}

export interface MarcarLeidaRequest {
  ids: number[];
}
