import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  menuOutline,
  gridOutline,
  cubeOutline,
  leafOutline,
  peopleOutline,
  clipboardOutline,
  flashOutline,
  warningOutline,
  checkmarkDoneOutline,
  timerOutline,
  arrowForwardOutline,
  trendingUpOutline,
  bagCheckOutline,
} from 'ionicons/icons';

interface DashboardCard {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'blue' | 'green' | 'amber' | 'rose';
}

interface DashboardAction {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
}

interface DashboardAlert {
  title: string;
  subtitle: string;
  status: string;
  icon: string;
  tone: 'danger' | 'warning' | 'success';
}

interface DashboardActivity {
  title: string;
  detail: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
  ],
})
export class HomePage {
    readonly metricas: DashboardCard[] = [
      {
        label: 'Órdenes pendientes',
        value: '18',
        detail: '5 requieren atención hoy',
        icon: 'clipboard-outline',
        tone: 'amber',
      },
      {
        label: 'Producción del día',
        value: '64%',
        detail: 'Avance respecto al objetivo',
        icon: 'trending-up-outline',
        tone: 'green',
      },
      {
        label: 'Stock crítico',
        value: '7',
        detail: 'Materias primas por debajo del mínimo',
        icon: 'warning-outline',
        tone: 'rose',
      },
      {
        label: 'Usuarios activos',
        value: '12',
        detail: 'Sesiones abiertas hoy',
        icon: 'people-outline',
        tone: 'blue',
      },
    ];

    readonly accionesRapidas: DashboardAction[] = [
      {
        title: 'Crear orden',
        subtitle: 'Registrar una nueva orden de producción',
        icon: 'clipboard-outline',
        route: '/ordenes',
      },
      {
        title: 'Agregar materia prima',
        subtitle: 'Actualizar inventario y stock',
        icon: 'leaf-outline',
        route: '/inventario',
      },
      {
        title: 'Nuevo producto',
        subtitle: 'Definir receta y costo estimado',
        icon: 'cube-outline',
        route: '/productos',
      },
      {
        title: 'Gestionar usuarios',
        subtitle: 'Asignar roles y credenciales',
        icon: 'people-outline',
        route: '/usuarios',
      },
    ];

    readonly alertas: DashboardAlert[] = [
      {
        title: 'Harina integral',
        subtitle: 'Quedan 4 kg disponibles',
        status: 'Stock bajo',
        icon: 'warning-outline',
        tone: 'danger',
      },
      {
        title: 'Mantequilla',
        subtitle: 'Se agotará en 2 jornadas',
        status: 'Revisar compra',
        icon: 'timer-outline',
        tone: 'warning',
      },
      {
        title: 'Lote A-204',
        subtitle: 'Orden completada y lista para entrega',
        status: 'Listo',
        icon: 'checkmark-done-outline',
        tone: 'success',
      },
    ];

    readonly actividadReciente: DashboardActivity[] = [
      {
        title: 'Se registró una salida de inventario',
        detail: 'Harina panificable - 12 kg',
        time: 'Hace 8 min',
        icon: 'flash-outline',
      },
      {
        title: 'Orden A-204 pasó a producción',
        detail: 'Responsable: María López',
        time: 'Hace 25 min',
        icon: 'clipboard-outline',
      },
      {
        title: 'Se creó un nuevo usuario',
        detail: 'Rol asignado: administrativo',
        time: 'Hace 1 h',
        icon: 'people-outline',
      },
    ];

    readonly resumenProduccion = {
      label: 'Meta diaria',
      value: '142 / 220 unidades',
      percent: 64,
    };

    private router = inject(Router);

  constructor() {
      addIcons({
        notificationsOutline,
        menuOutline,
        gridOutline,
        cubeOutline,
        leafOutline,
        peopleOutline,
        clipboardOutline,
        flashOutline,
        warningOutline,
        checkmarkDoneOutline,
        timerOutline,
        arrowForwardOutline,
        trendingUpOutline,
        bagCheckOutline,
      });
  }

    navegar(route: string): void {
      this.router.navigate([route]);
    }
}