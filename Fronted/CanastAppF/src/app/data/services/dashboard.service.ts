import { Injectable, inject } from '@angular/core';

import {
  Observable,
  map,
  tap,
} from 'rxjs';

import { DashboardState } from '../state/dashboard.state';

import {
  DashboardResumen,
  DashboardMovimiento,
  DashboardStockBajo,
} from '../interfaces/dashboard.interface';

import { OrdenProduccionService }
from './orden-produccion.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private ordenService =
    inject(OrdenProduccionService);

  private state =
    inject(DashboardState);

  // ============================================
  // RESUMEN
  // ============================================

  obtenerResumen():
  Observable<DashboardResumen> {

    return this.ordenService
      .getOrdenes()
      .pipe(

        map((ordenes) => {

          const resumen:
          DashboardResumen = {

            ordenes_pendientes:

              ordenes.filter(
                o => o.estado === 'pendiente'
              ).length,

            ordenes_produccion:

              ordenes.filter(
                o => o.estado === 'en_produccion'
              ).length,

            ordenes_completadas:

              ordenes.filter(
                o => o.estado === 'completada'
              ).length,

            stock_critico: 0,

            produccion_hoy:

              ordenes
                .filter(
                  o =>
                    o.estado ===
                    'completada'
                )
                .reduce(
                  (acc, o) =>
                    acc + o.cantidad_solicitada,
                  0
                ),

            eficiencia: 95,
          };

          return resumen;
        }),

        tap((resumen) => {

          this.state.setResumen(
            resumen
          );
        })
      );
  }

  // ============================================
  // MOVIMIENTOS
  // ============================================

  obtenerMovimientos():
  Observable<DashboardMovimiento[]> {

    const movimientos:
    DashboardMovimiento[] = [];

    this.state.setMovimientos(
      movimientos
    );

    return new Observable(
      observer => {

        observer.next(
          movimientos
        );

        observer.complete();
      }
    );
  }

  // ============================================
  // ALERTAS
  // ============================================

  obtenerAlertasStock():
  Observable<DashboardStockBajo[]> {

    const alertas:
    DashboardStockBajo[] = [];

    this.state.setAlertas(
      alertas
    );

    return new Observable(
      observer => {

        observer.next(
          alertas
        );

        observer.complete();
      }
    );
  }
}