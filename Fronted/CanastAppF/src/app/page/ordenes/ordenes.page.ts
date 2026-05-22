import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { OrdenState } from 'src/app/data/state/orden.state';
import { Orden } from 'src/app/data/interfaces/orden.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrearOrdenModalComponent } from './modals/crear-orden-modal/crear-orden-modal.component';
import { JsonPipe } from '@angular/common';

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
  private modalController = inject(ModalController);

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
  console.log('1. Orden recibida:', orden);
  console.log('2. ID de orden:', orden.id);
  
  this.selectedOrden = orden;
  console.log('3. selectedOrden asignado:', this.selectedOrden);
  this.showModal = true;
  this.ordenState.loadRegistrosProduccion(orden.id.toString());
  this.ordenState.loadEntregas(orden.id.toString());
  
  
  console.log('4. showModal:', this.showModal);
}

  cerrarModal() {
    this.showModal = false;
    this.selectedOrden = null;
  }

  async abrirModalNuevaOrden() {
    const modal = await this.modalController.create({
      component: CrearOrdenModalComponent,
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.success) {
        this.cargarOrdenes();
      }
    });

    await modal.present();
  }

 async cambiarEstado() {
  if (!this.selectedOrden) return;

  // Filtrar el estado actual
  const estadosDisponibles = this.estadosDisponibles.filter(
    estado => estado !== this.selectedOrden?.estado
  );

  if (estadosDisponibles.length === 0) {
    const alert = await this.alertController.create({
      header: 'Sin cambios',
      message: 'La orden ya está en el estado final',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const alert = await this.alertController.create({
    header: 'Cambiar Estado',
    subHeader: `Orden: ${this.selectedOrden.numero_orden || this.selectedOrden.id}`,
    inputs: estadosDisponibles.map(estado => ({
      name: 'estado',
      type: 'radio' as const,
      label: this.getEstadoTexto(estado),
      value: estado,
      checked: false
    })),
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Actualizar',
        handler: (data) => {
          if (data) {
            this.ordenState.updateEstado(this.selectedOrden!.id.toString(), data);
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