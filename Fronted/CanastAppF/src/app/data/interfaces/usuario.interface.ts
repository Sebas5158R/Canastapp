export interface Rol {
  id: string;
  nombre: 'administrativo' | 'jefe_produccion' | 'auxiliar' | string;
  descripcion?: string;
  permisos?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Usuario {
  id: string;
  nombre_completo: string;
  numero_identificacion?: string;
  correo: string;
  rol_id?: string;
  rol?: Rol | null;
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
  token_type?: string;
  expires_in?: string;
  user: Usuario;
}

export interface CreateUsuarioRequest {
  nombre_completo: string;
  numero_identificacion?: string;
  correo?: string;
  rol_id: string;
}

export interface RolInfo {
  id: string;
  nombre: string;
  descripcion?: string;
  permisos?: string[];
}

export interface CreateUsuarioResponse {
  message: string;
  correo_generado: string;
  usuario: Usuario;
}
