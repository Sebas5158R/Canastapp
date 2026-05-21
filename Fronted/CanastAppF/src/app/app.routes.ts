import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./page/login/login.page')
        .then(m => m.LoginPage),
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./page/home/home.page')
        .then(m => m.HomePage),
  },

  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./page/productos/productos.page')
        .then(m => m.ProductosPage),
  },

  {
    path: 'inventario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./page/inventario/inventario.page')
        .then(m => m.InventarioPage),
  },

  {
    path: 'ordenes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./page/ordenes/ordenes.page')
        .then(m => m.OrdenesPage),
  },

  {
    path: 'usuarios',
    canActivate: [authGuard, permissionGuard],
    loadComponent: () =>
      import('./page/usuarios/usuarios.page')
        .then(m => m.UsuariosPage),
  },
  {
    path: 'usuarios/listado',
    canActivate: [authGuard, permissionGuard],
    loadComponent: () =>
      import('./page/usuarios/usuarios-listado/usuarios-listado.page')
        .then(m => m.UsuariosListadoPage),
  },


];