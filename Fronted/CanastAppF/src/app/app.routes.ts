import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

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
      import('./page/dashboard/dashboard.page')
        .then(m => m.DashboardPage),
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
    path: 'produccion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./page/produccion/produccion.page')
        .then(m => m.ProduccionPage),
  },
];