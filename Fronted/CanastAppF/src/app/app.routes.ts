import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./page/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'productos',
    loadComponent: () => import('./page/productos/productos.page').then(m => m.ProductosPage),
  },
  {
    path: 'inventario',
    loadComponent: () => import('./page/inventario/inventario.page').then(m => m.InventarioPage),
  },
  {
    path: 'ordenes',
    loadComponent: () => import('./page/ordenes/ordenes.page').then(m => m.OrdenesPage),
  },
  // {
  //   path: 'historial-ordenes',
  //   loadComponent: () => import('./page/historial-ordenes/historial-ordenes.page').then(m => m.HistorialOrdenesPage),
  // },
];