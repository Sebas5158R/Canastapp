export interface Rol {

  id: number;

  nombre: string;
}

export interface UsuarioAuth {

  id: number;

  nombre_completo: string;

  correo: string;

  rol: Rol;
}

export interface LoginRequest {

  correo: string;

  contrasena: string;
}

export interface LoginResponse {

  token: string;

  usuario: UsuarioAuth;
}