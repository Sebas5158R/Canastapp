import {
  Injectable,
  inject,
} from '@angular/core';

import {
  Observable,
  tap,
} from 'rxjs';

import { ApiService } from './api.service';

import {
  LoginRequest,
  LoginResponse,
  UsuarioAuth,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private api = inject(ApiService);

  private readonly path = 'auth';

  login(
    data: LoginRequest
  ): Observable<LoginResponse> {

    return this.api
      .post<LoginResponse>(
        `${this.path}/login`,
        data
      )
      .pipe(
        tap((response) => {

          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem(
            'usuario',
            JSON.stringify(response.usuario)
          );
        })
      );
  }

  me(): Observable<UsuarioAuth> {

    return this.api.get<UsuarioAuth>(
      `${this.path}/me`
    );
  }

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('usuario');
  }

  isAuthenticated(): boolean {

    return !!localStorage.getItem('token');
  }

  getUsuario(): UsuarioAuth | null {

    const usuario =
      localStorage.getItem('usuario');

    return usuario
      ? JSON.parse(usuario)
      : null;
  }
}