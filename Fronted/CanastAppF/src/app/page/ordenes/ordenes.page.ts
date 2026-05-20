import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { OrdenState } from 'src/app/data/state/orden.state';
import { Orden } from 'src/app/data/interfaces/orden.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrearOrdenModalComponent } from './modals/crear-orden-modal/crear-orden-modal.component';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class OrdenesPage implements OnInit {
  private ordenState = inject(OrdenState);
  private destroyRef = inject(DestroyRef);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController); // ← AGREGAR

  // Signals del state
  ordenes = this.ordenState.ordenes;
  loading = this.ordenState.loading;
  error = this.ordenState.error;
  filtroEstado = this.ordenState.filtroEstado;
  registrosProduccion = this.ordenState.registrosProduccion;
  entregas = this.ordenState.entregas;

  // Estado local
  estadosDisponibles = ['pendiente', 'en_produccion', 'completada', 'cancelada'];
  selectedOrden: Orden | null = null;
  showModal = false;
   async abrirModalNuevaOrden() {
    const modal = await this.modalController.create({
      component: CrearOrdenModalComponent,
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.success) {
        this.cargarOrdenes(); // Recargar la lista
      }
    });

    await modal.present();
  }
  constructor() {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.ordenState.loadOrdenes();
  }

  verHistorial() {
    this.ordenState.loadHistorial();
  }

  filtrarPorEstado(event: any) {
    const estado = event.detail.value;
    this.ordenState.setFiltroEstado(estado);
  }

  verDetalle(orden: Orden) {
    this.selectedOrden = orden;
    this.ordenState.loadRegistrosProduccion(orden.id);
    this.ordenState.loadEntregas(orden.id);
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.selectedOrden = null;
  }

  async cambiarEstado() {
  if (!this.selectedOrden) return;

  const alert = await this.alertController.create({
    header: 'Cambiar Estado',
    subHeader: `Orden: ${this.selectedOrden.numero_orden}`,
    inputs: this.estadosDisponibles.map(estado => ({
      name: 'estado',
      type: 'radio' as const,
      label: this.getEstadoTexto(estado),
      value: estado,
      checked: estado === this.selectedOrden?.estado
    })),
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Actualizar',
        handler: (data) => {
          if (data && data !== this.selectedOrden?.estado) {
            this.ordenState.updateEstado(this.selectedOrden!.id, data);
            this.cerrarModal();
          }
        }
      }
    ]
  });

  await alert.present();
}

  getEstadoClass(estado: string): string {
    const clases = {
      'pendiente': 'warning',
      'en_produccion': 'primary',
      'completada': 'success',
      'cancelada': 'danger'
    };
    return clases[estado as keyof typeof clases] || 'secondary';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'pendiente': 'Pendiente',
      'en_produccion': 'En Producción',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  calcularProgreso(orden: Orden): number {
    if (orden.cantidad_planeada === 0) return 0;
    return (orden.cantidad_producida / orden.cantidad_planeada) * 100;
  }

  refresh(event: any) {
    this.cargarOrdenes();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}