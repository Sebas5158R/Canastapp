export interface MateriaPrima {

  id: number;

  nombre: string;

  descripcion?: string;

  cantidad_disponible: number;

  unidad_medida: string;

  stock_minimo: number;

  stock_maximo: number;

  fecha_vencimiento?: string;

  estado_inventario: string;

  created_at: string;

  updated_at: string;
}