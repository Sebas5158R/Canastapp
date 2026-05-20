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

  private readonly path = 'usuarios';

  constructor(private api: ApiService) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>(this.path);
  }

  getRoles(): Observable<string[]> {
    return this.api.get<string[]>(`${this.path}/roles`);
  }

  getPermisosRol(nombreRol: string): Observable<string[]> {
    return this.api.get<string[]>(`${this.path}/roles/${nombreRol}/permisos`);
  }
}
