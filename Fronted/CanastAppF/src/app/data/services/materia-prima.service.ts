import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { MateriaPrima } from '../interfaces/materia-prima.interface';
import { MovimientoInventario } from '../interfaces/movimiento-inventario.interface';
import { InventarioState } from '../state/inventario.state';

@Injectable({
  providedIn: 'root',
})
export class MateriaPrimaService {

  private api            = inject(ApiService);
  private socketService  = inject(SocketService);
  private inventarioState = inject(InventarioState);

  // ── El listener de socket se registra DESPUÉS de conectar,
  //    llamado desde AuthService.login() para evitar que se
  //    ejecute antes de que el socket exista. ─────────────────
  registrarSocketListeners(): void {
    this.socketService.listen('inventario-actualizado', (response) => {
      this.inventarioState.setInventario(response.inventario);
    });
  }

  obtenerInventario(): Observable<MateriaPrima[]> {
    return this.api
      .get<MateriaPrima[]>('inventario/materia-prima')
      .pipe(tap((response) => this.inventarioState.setInventario(response)));
  }

  crearMateriaPrima(body: Partial<MateriaPrima>): Observable<MateriaPrima> {
    return this.api
      .post<MateriaPrima>('inventario/materia-prima', body)
      .pipe(tap((response) => this.inventarioState.agregarMateria(response)));
  }

  registrarMovimiento(body: Partial<MovimientoInventario>): Observable<MovimientoInventario> {
    return this.api.post<MovimientoInventario>('inventario/movimientos', body);
  }

  actualizarMateriaPrima(id: number, body: Partial<MateriaPrima>): Observable<MateriaPrima> {
    return this.api
      .patch<MateriaPrima>(`inventario/materia-prima/${id}`, body)
      .pipe(tap((response) => this.inventarioState.actualizarMateria(response)));
  }

  eliminarMateriaPrima(id: number): Observable<void> {
    return this.api
      .delete<void>(`inventario/materia-prima/${id}`)
      .pipe(tap(() => this.inventarioState.eliminarMateria(id)));
  }

  obtenerMovimientos(materiaPrimaId: number): Observable<MovimientoInventario[]> {
    return this.api.get<MovimientoInventario[]>(
      `inventario/movimientos?materia_prima_id=${materiaPrimaId}`
    );
  }
}