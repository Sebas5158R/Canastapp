import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  Usuario,
  LoginRequest,
  LoginResponse,
  CreateUsuarioRequest,
} from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  constructor(private api: ApiService) {}

  // ── Autenticación ──

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getUsuarioActual(): Usuario | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  // ── CRUD Usuarios ──

  getUsuarios(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>('usuarios');
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`usuarios/${id}`);
  }

  crearUsuario(data: CreateUsuarioRequest): Observable<Usuario> {
    return this.api.post<Usuario>('usuarios', data);
  }

  actualizarUsuario(id: number, data: Partial<CreateUsuarioRequest>): Observable<Usuario> {
    return this.api.put<Usuario>(`usuarios/${id}`, data);
  }

  desactivarUsuario(id: number): Observable<void> {
    return this.api.patch<void>(`usuarios/${id}/desactivar`, {});
  }
}
