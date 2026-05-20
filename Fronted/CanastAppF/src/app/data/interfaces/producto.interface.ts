export interface RecetaItem {

  id?: number;

  producto_id: number;

  ingrediente_id: number;

  cantidad_necesaria: number;

  unidad_medida: string;

  ingrediente?: {

    id: number;

    nombre: string;

    unidad_medida: string;
  };
}
export interface Producto {

  id: number;

  nombre: string;

  descripcion?: string;

  precio: number;

  receta?: RecetaItem[];

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateProductoRequest {

  nombre: string;

  descripcion?: string;

  precio: number;
}

export interface UpdateProductoRequest {

  nombre?: string;

  descripcion?: string;

  precio?: number;
}