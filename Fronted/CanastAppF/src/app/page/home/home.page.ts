import { Component, inject, OnInit, signal } from '@angular/core';
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
import { IonRefresher } from '@ionic/angular/standalone';
import { IonRefresherContent } from '@ionic/angular/standalone';
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
import { OrdenesService } from '../../data/services/ordenes.service';
import { MateriaPrimaService } from '../../data/services/materia-prima.service';
import { AuthService } from '../../data/services/auth.service';
import { Orden } from '../../data/interfaces/orden.interface';
import { MateriaPrima } from '../../data/interfaces/materia-prima.interface';


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
    IonRefresher,
    IonRefresherContent
  ],
})
export class HomePage implements OnInit {
  private ordenesService = inject(OrdenesService);
  private materiaPrimaService = inject(MateriaPrimaService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para datos dinámicos
  ordenesPendientes = signal<number>(0);
  ordenesEnProduccion = signal<number>(0);
  ordenesCompletadas = signal<number>(0);
  produccionTotalPlaneada = signal<number>(0);
  produccionTotalReal = signal<number>(0);
  stockCritico = signal<number>(0);
  usuariosActivos = signal<number>(0);
  alertas = signal<DashboardAlert[]>([]);
  actividadReciente = signal<DashboardActivity[]>([]);
  resumenProduccionPercent = signal<number>(0);
  resumenProduccionValue = signal<string>('0 / 0');
  loading = signal<boolean>(true);
  metricas = signal<DashboardCard[]>([]);

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

  // Objeto simple para el template
  resumenProduccion = {
    label: 'Meta diaria',
    percent: 0,
    value: '0 / 0'
  };

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

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  async cargarDatosDashboard() {
    this.loading.set(true);
    
    try {
      // Cargar todas las órdenes
      const todasOrdenes = await this.ordenesService.getOrdenes().toPromise();
      const ordenes = todasOrdenes || [];
      
      // Calcular métricas de órdenes
      const pendientes = ordenes.filter(o => o.estado === 'pendiente').length;
      const enProduccion = ordenes.filter(o => o.estado === 'en_produccion').length;
      const completadas = ordenes.filter(o => o.estado === 'completada').length;
      
      this.ordenesPendientes.set(pendientes);
      this.ordenesEnProduccion.set(enProduccion);
      this.ordenesCompletadas.set(completadas);
      
      // Calcular producción total
      const totalPlaneada = ordenes.reduce((sum, o) => sum + (o.cantidad_planeada || 0), 0);
      const totalReal = ordenes.reduce((sum, o) => sum + (o.cantidad_producida || 0), 0);
      this.produccionTotalPlaneada.set(totalPlaneada);
      this.produccionTotalReal.set(totalReal);
      
      const percent = totalPlaneada > 0 ? (totalReal / totalPlaneada) * 100 : 0;
      this.resumenProduccionPercent.set(percent);
      this.resumenProduccionValue.set(`${totalReal} / ${totalPlaneada}`);
      this.resumenProduccion.percent = percent;
      this.resumenProduccion.value = `${totalReal} / ${totalPlaneada}`;
      
      // Calcular eficiencia (producción del día - últimas 24h)
      const hoy = new Date();
      const ordenesHoy = ordenes.filter(o => {
        const fechaCreacion = new Date(o.created_at);
        return fechaCreacion.toDateString() === hoy.toDateString();
      });
      
      const eficienciaPlaneadaHoy = ordenesHoy.reduce((sum, o) => sum + (o.cantidad_planeada   || 0), 0);
      const eficienciaRealHoy = ordenesHoy.reduce((sum, o) => sum + (o.cantidad_producida || 0), 0);
      const eficienciaPercent = eficienciaPlaneadaHoy > 0 ? (eficienciaRealHoy / eficienciaPlaneadaHoy) * 100 : 0;
      
      // Cargar inventario para stock crítico
      const inventario = await this.materiaPrimaService.obtenerInventario().toPromise();
      const materiasPrimas = inventario || [];
      const criticos = materiasPrimas.filter(m => m.cantidad_disponible <= (m.stock_minimo || 0));
      this.stockCritico.set(criticos.length);
      
      // Usuarios activos (simulado - si no hay endpoint real, mostrar total de usuarios)
      const usuarios = await this.obtenerUsuariosActivos();
      this.usuariosActivos.set(usuarios);
      
      // Actualizar métricas
      this.metricas.set([
        {
          label: 'Órdenes pendientes',
          value: pendientes.toString(),
          detail: `${this.contarOrdenesHoy(ordenes)} requieren atención hoy`,
          icon: 'clipboard-outline',
          tone: 'amber',
        },
        {
          label: 'Producción del día',
          value: `${Math.round(eficienciaPercent)}%`,
          detail: 'Avance respecto al objetivo',
          icon: 'trending-up-outline',
          tone: 'green',
        },
        {
          label: 'Stock crítico',
          value: criticos.length.toString(),
          detail: 'Materias primas por debajo del mínimo',
          icon: 'warning-outline',
          tone: 'rose',
        },
        {
          label: 'Usuarios activos',
          value: usuarios.toString(),
          detail: 'Sesiones abiertas hoy',
          icon: 'people-outline',
          tone: 'blue',
        },
      ]);
      
      // Generar alertas reales
      await this.generarAlertas(materiasPrimas, ordenes);
      
      // Generar actividad reciente
      await this.generarActividadReciente(ordenes, materiasPrimas);
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private contarOrdenesHoy(ordenes: Orden[]): number {
    const hoy = new Date();
    return ordenes.filter(o => {
      const fechaCreacion = new Date(o.created_at);
      return fechaCreacion.toDateString() === hoy.toDateString() && o.estado === 'pendiente';
    }).length;
  }

  private async obtenerUsuariosActivos(): Promise<number> {
    try {
      const usuarios = await this.authService.getUsuario();
      return usuarios ? 1 : 0;
    } catch {
      return 1;
    }
  }

  private async generarAlertas(materiasPrimas: MateriaPrima[], ordenes: Orden[]) {
    const nuevasAlertas: DashboardAlert[] = [];
    
    // Alertas de stock crítico (top 2)
    const stockCriticos = materiasPrimas
      .filter(m => m.cantidad_disponible <= (m.stock_minimo || 0))
      .slice(0, 2);
    
    stockCriticos.forEach(m => {
      nuevasAlertas.push({
        title: m.nombre,
        subtitle: `Quedan ${m.cantidad_disponible} ${m.unidad_medida} disponibles`,
        status: 'Stock bajo',
        icon: 'warning-outline',
        tone: 'danger',
      });
    });
    
    // Alertas de órdenes próximas a vencer
    const hoy = new Date();
    const ordenesProximas = ordenes
      .filter(o => {
        const fechaEstimada = new Date(o.fecha_fin_estimada);
        const dias = Math.ceil((fechaEstimada.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
        return o.estado !== 'completada' && dias <= 2 && dias >= 0;
      })
      .slice(0, 3 - nuevasAlertas.length);
    
    ordenesProximas.forEach(o => {
      nuevasAlertas.push({
        title: `Orden #${o.id}`,
        subtitle: `Fecha estimada: ${new Date(o.fecha_fin_estimada).toLocaleDateString()}`,
        status: 'Próxima a vencer',
        icon: 'timer-outline',
        tone: 'warning',
      });
    });
    
    this.alertas.set(nuevasAlertas);
  }

  private async generarActividadReciente(ordenes: Orden[], materiasPrimas: MateriaPrima[]) {
    const actividades: DashboardActivity[] = [];
    
    // Últimas órdenes
    const ordenesRecientes = ordenes
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
    
    ordenesRecientes.forEach(o => {
      const tiempo = this.calcularTiempoRelativo(new Date(o.created_at));
      actividades.push({
        title: `Orden ${o.estado === 'pendiente' ? 'creada' : 'actualizada'}`,
        detail: `${o.producto_nombre || 'Producto'} - ${o.cantidad_planeada} unidades`,
        time: tiempo,
        icon: 'clipboard-outline',
      });
    });
    
    this.actividadReciente.set(actividades);
  }

  private calcularTiempoRelativo(fecha: Date): string {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);
    
    if (minutos < 1) return 'Hace unos segundos';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    return `Hace ${dias} d`;
  }

  navegar(route: string): void {
    this.router.navigate([route]);
  }

  refresh(event: any) {
    this.cargarDatosDashboard();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
} 