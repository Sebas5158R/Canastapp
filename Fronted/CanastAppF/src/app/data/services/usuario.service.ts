import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Usuario,
  CreateUsuarioRequest,
  CreateUsuarioResponse,
  RolInfo,
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

  createUsuario(data: CreateUsuarioRequest): Observable<CreateUsuarioResponse> {
    return this.api.post<CreateUsuarioResponse>(this.path, data);
  }

  updateUsuario(id: string, data: Partial<CreateUsuarioRequest>): Observable<CreateUsuarioResponse> {
    return this.api.put<CreateUsuarioResponse>(`${this.path}/${id}`, data);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }

  getRoles(): Observable<RolInfo[]> {
    return this.api.get<RolInfo[]>(`${this.path}/roles`);
  }

  getPermisosRol(nombreRol: string): Observable<string[]> {
    return this.api.get<string[]>(`${this.path}/roles/${nombreRol}/permisos`);
  }
}
