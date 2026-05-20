export interface DashboardResumen {

  ordenes_pendientes: number;

  ordenes_produccion: number;

  ordenes_completadas: number;

  stock_critico: number;

  produccion_hoy: number;

  eficiencia: number;
}

export interface DashboardMovimiento {

  id: number;

  accion: string;

  usuario?: string;

  fecha: string;
}

export interface DashboardStockBajo {

  id: number;

  nombre: string;

  cantidad_disponible: number;

  stock_minimo: number;

  unidad_medida: string;
}