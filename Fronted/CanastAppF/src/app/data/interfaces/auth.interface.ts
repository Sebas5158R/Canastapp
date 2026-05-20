export interface Rol {
  id: string;
  nombre: string;
  descripcion?: string;
  permisos?: string[];
}

export interface UsuarioAuth {
  id: string;
  nombre_completo: string;
  numero_identificacion?: string;
  correo: string;
  activo?: boolean;
  fecha_creacion?: string;
  ultimo_acceso?: string;
  rol: Rol | null;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: string;
  user: UsuarioAuth;
}