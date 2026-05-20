export interface Permiso {

  id: number;

  nombre: string;

  codigo: string;
}

export interface Rol {

  id: number;

  nombre: string;

  permisos: Permiso[];
}