import {
  MateriaPrima,
} from './materia-prima.interface';

import {
  OrdenProduccion,
} from './orden-produccion.interface';

import {
  DashboardResumen,
} from './dashboard.interface';

export interface InventarioActualizadoEvent {

  inventario: MateriaPrima[];
}

export interface ProduccionActualizadaEvent {

  orden: OrdenProduccion;
}

export interface DashboardActualizadoEvent {

  dashboard: DashboardResumen;
}