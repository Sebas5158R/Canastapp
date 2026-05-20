import {
  Injectable,
} from '@angular/core';

import {
  BehaviorSubject,
} from 'rxjs';

import {
  DashboardResumen,
  DashboardMovimiento,
  DashboardStockBajo,
} from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardState {

  private resumenSubject =
    new BehaviorSubject<
      DashboardResumen | null
    >(null);

  resumen$ =
    this.resumenSubject.asObservable();

  private movimientosSubject =
    new BehaviorSubject<
      DashboardMovimiento[]
    >([]);

  movimientos$ =
    this.movimientosSubject.asObservable();

  private alertasSubject =
    new BehaviorSubject<
      DashboardStockBajo[]
    >([]);

  alertas$ =
    this.alertasSubject.asObservable();

  setResumen(
    resumen: DashboardResumen
  ): void {

    this.resumenSubject.next(
      resumen
    );
  }

  setMovimientos(
    movimientos:
      DashboardMovimiento[]
  ): void {

    this.movimientosSubject.next(
      movimientos
    );
  }

  setAlertas(
    alertas:
      DashboardStockBajo[]
  ): void {

    this.alertasSubject.next(
      alertas
    );
  }
}