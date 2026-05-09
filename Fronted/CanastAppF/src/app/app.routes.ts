import { Routes } from '@angular/router';
import { authGuard } from './data/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./page/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () => import('./page/productos/productos.page').then(m => m.ProductosPage),
  },
  {
    path: 'inventario',
    canActivate: [authGuard],
    loadComponent: () => import('./page/inventario/inventario.page').then(m => m.InventarioPage),
  },
  {
    path: 'ordenes',
    canActivate: [authGuard],
    loadComponent: () => import('./page/ordenes/ordenes.page').then(m => m.OrdenesPage),
  },
  // {
  //   path: 'historial-ordenes',
  //   loadComponent: () => import('./page/historial-ordenes/historial-ordenes.page').then(m => m.HistorialOrdenesPage),
  // },
];