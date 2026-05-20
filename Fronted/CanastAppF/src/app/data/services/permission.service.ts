import {
  Injectable,
  inject,
} from '@angular/core';

import {
  AuthService,
} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  private authService =
    inject(AuthService);

  // ============================================
  // VALIDAR ROL
  // ============================================

  tieneRol(
    rolesPermitidos: string[]
  ): boolean {

    const usuario =
      this.authService
        .getUsuario();

    if (!usuario) {

      return false;
    }

    const rol =
      usuario?.rol?.nombre ?? '';

    return rolesPermitidos
      .includes(rol);
  }

  // ============================================
  // ADMIN
  // ============================================

  esAdministrador():
  boolean {

    const usuario =
      this.authService
        .getUsuario();

    return usuario
      ?.rol
      ?.nombre
      ?.toLowerCase() ===
      'administrativo';
  }

  // ============================================
  // JEFE PRODUCCION
  // ============================================

  esJefeProduccion():
  boolean {

    const usuario =
      this.authService
        .getUsuario();

    return usuario
      ?.rol
      ?.nombre
      ?.toLowerCase() ===
      'jefe_produccion';
  }

  // ============================================
  // AUXILIAR
  // ============================================

  esAuxiliar():
  boolean {

    const usuario =
      this.authService
        .getUsuario();

    return usuario
      ?.rol
      ?.nombre
      ?.toLowerCase() ===
      'auxiliar';
  }
}