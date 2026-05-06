export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
  costo_estimado?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Receta {
  id: number;
  producto_id: number;
  producto?: Producto;
  ingrediente_id: number;
  cantidad_necesaria: number;
  unidad_medida: string;
  created_at?: string;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
  costo_estimado?: number;
}

export interface UpdateProductoRequest extends Partial<CreateProductoRequest> {}
