import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonMenu,
  IonContent,
  IonIcon,
  IonRouterOutlet,
  MenuController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline, cubeOutline, layersOutline, documentTextOutline,
  timeOutline, settingsOutline, chevronForwardOutline,
  logOutOutline, notificationsOutline, menuOutline,
} from 'ionicons/icons';
import { UsuarioService } from '../data/services/usuario.service';

export interface MenuItem {
  label: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonMenu,
    IonContent,
    IonIcon,
    IonRouterOutlet,
  ],
})
export class AppComponent implements OnInit {

  userName = 'Invitado';
  userRole = 'Sin sesión';
  userAvatar: string = 'assets/images/default-avatar.png';

  activeUrl: string = '';
  isAuthenticated = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard',            icon: 'grid-outline',          url: '/home' },
    { label: 'Productos',            icon: 'cube-outline',          url: '/productos' },
    { label: 'Inventario',           icon: 'layers-outline',        url: '/inventario' },
    { label: 'Órdenes',              icon: 'document-text-outline', url: '/ordenes' },
    { label: 'Historial de Órdenes', icon: 'time-outline',          url: '/historial-ordenes' },
  ];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private usuarioService: UsuarioService,
  ) {
    addIcons({
      gridOutline, cubeOutline, layersOutline, documentTextOutline,
      timeOutline, settingsOutline, chevronForwardOutline,
      logOutOutline, notificationsOutline, menuOutline,
    });
  }

  ngOnInit(): void {
    this.syncAuthState();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeUrl = event.urlAfterRedirects;
        this.syncAuthState();
      });
  }

  get showMenu(): boolean {
    return this.isAuthenticated && this.activeUrl !== '/login';
  }

  syncAuthState(): void {
    this.isAuthenticated = this.usuarioService.estaAutenticado();

    const usuario = this.usuarioService.getUsuarioActual();
    this.userName = usuario?.nombre_completo || 'Invitado';
    this.userRole = usuario?.rol?.nombre || 'Sin sesión';
  }

  isActive(url: string): boolean {
    return this.activeUrl === url || this.activeUrl.startsWith(url + '/');
  }

  async navigate(url: string): Promise<void> {
    await this.menuCtrl.close();
    this.router.navigateByUrl(url);
  }

  async goToSettings(): Promise<void> {
    await this.menuCtrl.close();
    console.log('Configuración — próximamente');
  }

  async logout(): Promise<void> {
    await this.menuCtrl.close();
    this.usuarioService.logout();
    this.router.navigateByUrl('/login');
  }
}