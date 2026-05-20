export interface RecetaIngrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  cantidad_disponible: number;
  unidad_medida: string;
  stock_minimo: number;
  stock_maximo: number;
  estado_inventario: string;
}

export interface RecetaItem {
  id?: number;
  producto_id?: number;
  ingrediente_id: number;
  cantidad_necesaria: number;
  unidad_medida: string;
  materia_prima?: RecetaIngrediente;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
  costo_estimado?: number;
  recetas?: RecetaItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
  costo_estimado?: number;
  receta: {
    ingrediente_id: number;
    cantidad_necesaria: number;
    unidad_medida: string;
  }[];
  usuario_id?: number;
  observaciones?: string;
}

export interface UpdateProductoRequest {
  nombre?: string;
  descripcion?: string;
  unidad_medida?: string;
  costo_estimado?: number;
}
