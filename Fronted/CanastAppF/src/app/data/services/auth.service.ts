import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { MateriaPrimaService } from './materia-prima.service';

import {
  LoginRequest,
  LoginResponse,
  UsuarioAuth,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private api            = inject(ApiService);
  private socketService  = inject(SocketService);
  private materiaPrimaService = inject(MateriaPrimaService);

  private readonly path = 'auth';

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.api
      .post<LoginResponse>(`${this.path}/login`, data)
      .pipe(
        tap((response) => {
          // 1. Persistir credenciales
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.user));

          // 2. Conectar socket y registrar listeners ahora que hay sesión
          this.socketService.connect();
          this.materiaPrimaService.registrarSocketListeners();
        })
      );
  }

  me(): Observable<UsuarioAuth> {
    return this.api.get<UsuarioAuth>(`${this.path}/me`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Desconectar socket al cerrar sesión
    this.socketService.disconnect();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsuario(): UsuarioAuth | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? (JSON.parse(usuario) as UsuarioAuth) : null;
  }
}