import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  IonicModule,
  RefresherCustomEvent,
} from '@ionic/angular';

import {
  Observable,
} from 'rxjs';
import {
  ExportService,
} from 'src/app/data/services/export.service';

import {
  firstValueFrom,
} from 'rxjs';
import {
  DashboardService,
} from 'src/app/data/services/dashboard.service';

import {
  DashboardState,
} from 'src/app/data/state/dashboard.state';

import {
  DashboardResumen,
  DashboardMovimiento,
  DashboardStockBajo,
} from 'src/app/data/interfaces/dashboard.interface';

import {
  KpiCardComponent,
} from './components/kpi-card/kpi-card.component';

@Component({
  selector:
    'app-dashboard',

  templateUrl:
    './dashboard.page.html',

  styleUrls: [
    './dashboard.page.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
    KpiCardComponent,
  ],
})
export class DashboardPage
implements OnInit {

  // ============================================
  // INYECCIONES
  // ============================================

  private dashboardService =
    inject(DashboardService);
  private exportService =
  inject(ExportService);
  private dashboardState =
    inject(DashboardState);

  // ============================================
  // OBSERVABLES STATE
  // ============================================

  resumen$:
    Observable<
      DashboardResumen | null
    > =
      this.dashboardState
        .resumen$;

  movimientos$:
    Observable<
      DashboardMovimiento[]
    > =
      this.dashboardState
        .movimientos$;

  alertas$:
    Observable<
      DashboardStockBajo[]
    > =
      this.dashboardState
        .alertas$;

  // ============================================
  // LOADING
  // ============================================

  loading = false;
  async exportarExcel():
Promise<void> {

  const resumen =
    await firstValueFrom(
      this.resumen$
    );

  if (!resumen) {
    return;
  }

  const data = [

    {
      'Órdenes Pendientes':
        resumen
          .ordenes_pendientes,

      'Órdenes Producción':
        resumen
          .ordenes_produccion,

      'Órdenes Completadas':
        resumen
          .ordenes_completadas,

      'Stock Crítico':
        resumen
          .stock_critico,

      'Producción Hoy':
        resumen
          .produccion_hoy,

      'Eficiencia':
        resumen
          .eficiencia,
    },
  ];

  this.exportService
    .exportToExcel(

      data,

      'dashboard-erp'
    );
}
async exportarPDF():
Promise<void> {

  const resumen =
    await firstValueFrom(
      this.resumen$
    );

  if (!resumen) {
    return;
  }

  const headers = [

    'Pendientes',

    'Producción',

    'Completadas',

    'Stock Crítico',

    'Producción Hoy',

    'Eficiencia',
  ];

  const body = [[

    resumen
      .ordenes_pendientes,

    resumen
      .ordenes_produccion,

    resumen
      .ordenes_completadas,

    resumen
      .stock_critico,

    resumen
      .produccion_hoy,

    resumen
      .eficiencia,
  ]];

  this.exportService
    .exportToPDF(

      'Reporte Dashboard ERP',

      headers,

      body,

      'dashboard-erp'
    );
}
  // ============================================
  // INIT
  // ============================================

  ngOnInit(): void {

    this.cargarDashboard();
  }

  // ============================================
  // CARGAR DASHBOARD
  // ============================================

  cargarDashboard(): void {

    this.loading = true;

    // ========================================
    // RESUMEN
    // ========================================

    this.dashboardService
      .obtenerResumen()
      .subscribe({

        next: () => {

          this.loading = false;
        },

        error: () => {

          this.loading = false;
        },
      });

    // ========================================
    // MOVIMIENTOS
    // ========================================

    this.dashboardService
      .obtenerMovimientos()
      .subscribe();

    // ========================================
    // ALERTAS
    // ========================================

    this.dashboardService
      .obtenerAlertasStock()
      .subscribe();
  }

  // ============================================
  // REFRESH
  // ============================================

  refrescar(
    event:
      RefresherCustomEvent
  ): void {

    this.cargarDashboard();

    setTimeout(() => {

      event.target.complete();

    }, 1000);
  }

  // ============================================
  // TRACK BY
  // ============================================

  trackById(
    index: number,

    item: {
      id: number;
    }
  ): number {

      return item.id;
  }
}