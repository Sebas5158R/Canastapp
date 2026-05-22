import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Orden, RegistroProduccion, EntregaProducto } from '../interfaces/orden.interface';
import { OrdenesService } from '../services/ordenes.service';

@Injectable({ providedIn: 'root' })
export class OrdenState {
  private ordenesService = inject(OrdenesService);

  // Signals
  ordenes = signal<Orden[]>([]);
  ordenSeleccionada = signal<Orden | null>(null);
  registrosProduccion = signal<RegistroProduccion[]>([]);
  entregas = signal<EntregaProducto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  filtroEstado = signal<string>('');

  // Cargar órdenes
  loadOrdenes(params?: { estado?: string }): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.ordenesService.getOrdenes(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (ordenes) => this.ordenes.set(ordenes),
        error: (err) => this.error.set(err.message || 'Error al cargar órdenes')
      });
  }

  loadHistorial(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.ordenesService.getHistorial()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (ordenes) => this.ordenes.set(ordenes),
        error: (err) => this.error.set(err.message || 'Error al cargar historial')
      });
  }

  loadOrdenById(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.ordenesService.getOrdenById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (orden) => this.ordenSeleccionada.set(orden),
        error: (err) => this.error.set(err.message || 'Error al cargar orden')
      });
  }

  loadRegistrosProduccion(ordenId: string): void {
    this.ordenesService.getRegistrosPorOrden(ordenId)
      .subscribe({
        next: (registros) => this.registrosProduccion.set(registros),
        error: (err) => console.error('Error cargando registros:', err)
      });
  }

  loadEntregas(ordenId: string): void {
    this.ordenesService.getEntregasPorOrden(ordenId)
      .subscribe({
        next: (entregas) => this.entregas.set(entregas),
        error: (err) => console.error('Error cargando entregas:', err)
      });
  }

  updateEstado(id: string, estado: string, observaciones?: string): void {
  this.loading.set(true);
  
  this.ordenesService.actualizarEstado(id, { estado: estado as any, observaciones })
    .subscribe({
      next: (ordenActualizada) => {
        this.ordenes.update(ordenes => 
          ordenes.map(orden => orden.id.toString() === id ? ordenActualizada : orden)  // ← Convertir a string para comparar
        );
        if (this.ordenSeleccionada()?.id.toString() === id) {  // ← Convertir a string
          this.ordenSeleccionada.set(ordenActualizada);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al actualizar estado');
        this.loading.set(false);
      }
    });
}

  setFiltroEstado(estado: string): void {
    this.filtroEstado.set(estado);
    const params = estado ? { estado } : undefined;
    this.loadOrdenes(params);
  }

  // Limpiar estado
  clearState(): void {
    this.ordenes.set([]);
    this.ordenSeleccionada.set(null);
    this.registrosProduccion.set([]);
    this.entregas.set([]);
    this.error.set(null);
    this.filtroEstado.set('');
  }
}