export interface Rol {
  id: number;
  nombre: 'administrativo' | 'jefe_produccion' | 'auxiliar';
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Usuario {
  id: number;
  nombre_completo: string;
  numero_identificacion?: string;
  correo: string;
  rol_id: number;
  rol?: Rol;
  activo: boolean;
  fecha_creacion?: string;
  ultimo_acceso?: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface CreateUsuarioRequest {
  nombre_completo: string;
  numero_identificacion?: string;
  correo: string;
  contrasena: string;
  rol_id: number;
}
