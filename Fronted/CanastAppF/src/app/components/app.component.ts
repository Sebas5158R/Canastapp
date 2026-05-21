import {
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { filter } from 'rxjs';

import { AuthService } from 'src/app/data/services/auth.service';
import { PermissionService } from 'src/app/data/services/permission.service';

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
export class AppComponent implements OnInit {

  private router      = inject(Router);
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  // ── Estado de sesión ──────────────────────────────────
  sesionActiva = false;
  isAdmin = false;

  userName   = '';
  userRole   = '';
  userAvatar = 'https://i.pravatar.cc/150?img=3';

  // ── Ítems del menú ────────────────────────────────────
  menuItems = [
    { title: 'Dashboard',  url: '/dashboard',  icon: 'grid'      },
    { title: 'Usuarios',   url: '/usuarios',   icon: 'people', adminOnly: true },
    { title: 'Producción', url: '/produccion', icon: 'construct' },
    { title: 'Inventario', url: '/inventario', icon: 'cube'      },
    { title: 'Productos',  url: '/productos',  icon: 'basket'    },
    { title: 'Órdenes',    url: '/ordenes',    icon: 'clipboard' },
  ];

  // ── Inicialización ────────────────────────────────────
  ngOnInit(): void {
    // Evaluar sesión en cada cambio de ruta
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.evaluarSesion());

    // Evaluar sesión al arrancar
    this.evaluarSesion();
  }

  private evaluarSesion(): void {
    this.sesionActiva = this.authService.isAuthenticated();

    if (this.sesionActiva) {
      const usuario = this.authService.getUsuario();
      this.isAdmin = this.permissionService.esAdministrador();
      this.userName  = usuario?.nombre_completo ?? 'Usuario';
      this.userRole  = usuario?.rol?.nombre
        ? this.formatearRol(usuario.rol.nombre)
        : 'Sin rol';
    } else {
      this.isAdmin = false;
      this.userName = '';
      this.userRole = '';
    }
  }

  private formatearRol(rol: string): string {
    const mapa: Record<string, string> = {
      administrativo:   'Administrativo',
      jefe_produccion:  'Jefe de Producción',
      auxiliar:         'Auxiliar',
    };
    return mapa[rol] ?? rol;
  }

  // ── Navegación ────────────────────────────────────────
  navigate(url: string): void {
    this.router.navigate([url]);
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.sesionActiva = false;
    this.router.navigate(['/login']);
  }
}