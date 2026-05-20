import {
  Component,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import {
  IonicModule,
} from '@ionic/angular';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss'],

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {

  private router =
    inject(Router);

  // ============================================
  // USER
  // ============================================

  userName =
    'Administrador';

  userRole =
    'ERP Manager';

  userAvatar =
    'https://i.pravatar.cc/150?img=3';

  // ============================================
  // MENU
  // ============================================

  showMenu = true;

  menuItems = [

    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'grid',
    },

    {
      title: 'Producción',
      url: '/produccion',
      icon: 'construct',
    },

    {
      title: 'Inventario',
      url: '/inventario',
      icon: 'cube',
    },

    {
      title: 'Productos',
      url: '/productos',
      icon: 'basket',
    },

    {
      title: 'Órdenes',
      url: '/ordenes',
      icon: 'clipboard',
    },
  ];

  // ============================================
  // NAVIGATION
  // ============================================

  navigate(
    url: string
  ): void {

    this.router.navigate([
      url,
    ]);
  }
  logout(): void {

  localStorage.clear();

  this.router.navigate([
    '/login',
  ]);
}
  isActive(
    url: string
  ): boolean {

    return this.router.url === url;
  }

  goToSettings():
  void {

    this.router.navigate([
      '/settings',
    ]);
  }
}