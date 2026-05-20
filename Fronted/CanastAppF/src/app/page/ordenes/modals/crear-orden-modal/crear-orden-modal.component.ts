import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ProductoService } from 'src/app/data/services/producto.service';
import { OrdenesService } from 'src/app/data/services/ordenes.service';
import { Producto } from 'src/app/data/interfaces/producto.interface';
import { RecetaProducto, CreateOrdenRequest } from 'src/app/data/interfaces/orden.interface';

@Component({
  selector: 'app-crear-orden-modal',
  templateUrl: './crear-orden-modal.component.html',
  styleUrls: ['./crear-orden-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CrearOrdenModalComponent implements OnInit {
  private productoService = inject(ProductoService);
  private ordenesService = inject(OrdenesService);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

  // Signals
  productos = signal<Producto[]>([]);
  productoSeleccionado = signal<Producto | null>(null);
  receta = signal<RecetaProducto | null>(null);
  cantidadSolicitada = signal<number>(1);
  fechaRequerida = signal<string>(new Date().toISOString());
  observaciones = signal<string>('');
  cargandoProductos = signal(false);
  cargandoReceta = signal(false);
 today = new Date().toISOString()
  // Computed para validación de stock
  stockValido = computed(() => {
    const recetaActual = this.receta();
    const cantidad = this.cantidadSolicitada();
    if (!recetaActual || cantidad <= 0) return false;
    return recetaActual.ingredientes.every(i => 
      i.stock_disponible >= (i.cantidad_necesaria * cantidad)
    );
  });

  faltantes = computed(() => {
    const recetaActual = this.receta();
    const cantidad = this.cantidadSolicitada();
    if (!recetaActual || cantidad <= 0) return [];
    return recetaActual.ingredientes.filter(i => {
      const requerido = i.cantidad_necesaria * cantidad;
      return i.stock_disponible < requerido;
    }).map(i => ({
      ...i,
      requerido_total: i.cantidad_necesaria * cantidad,
      faltante: (i.cantidad_necesaria * cantidad) - i.stock_disponible
    }));
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargandoProductos.set(true);
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargandoProductos.set(false);
      },
      error: () => {
        this.cargandoProductos.set(false);
        this.mostrarError('Error al cargar productos');
      }
    });
  }

  onProductoChange(event: any) {
    const productoId = event.detail.value;
    const producto = this.productos().find(p => p.id === productoId);
    this.productoSeleccionado.set(producto || null);
    
    if (productoId) {
      this.cargarReceta(productoId);
    } else {
      this.receta.set(null);
    }
  }

  cargarReceta(productoId: number) {
    this.cargandoReceta.set(true);
    this.productoService.getRecetaByProducto(productoId).subscribe({
      next: (receta) => {
        this.receta.set(receta);
        this.cargandoReceta.set(false);
      },
      error: () => {
        this.cargandoReceta.set(false);
        this.mostrarError('Error al cargar la receta del producto');
      }
    });
  }

  onCantidadChange() {
    // Solo fuerza la actualización de los computeds
  }

  async crearOrden() {
    if (!this.stockValido()) {
      await this.mostrarErrorNoStock();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar creación',
      message: `¿Crear orden de producción?\n\nProducto: ${this.productoSeleccionado()?.nombre}\nCantidad: ${this.cantidadSolicitada()} unidades`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Crear', handler: () => this.ejecutarCreacion() }
      ]
    });
    await alert.present();
  }

  async ejecutarCreacion() {
    const loading = await this.loadingController.create({
      message: 'Creando orden y descontando inventario...'
    });
    await loading.present();

    const ordenData: CreateOrdenRequest = {
      producto_id: this.productoSeleccionado()!.id,
      cantidad_solicitada: this.cantidadSolicitada(),
      fecha_requerida: this.fechaRequerida(),
      observaciones: this.observaciones() || undefined
    };

    this.ordenesService.createOrden(ordenData as any).subscribe({
      next: (response) => {
        loading.dismiss();
        this.modalController.dismiss({ success: true, orden: response });
      },
      error: (error) => {
        loading.dismiss();
        const mensaje = error.error?.faltantes 
          ? 'Stock insuficiente para algunas materias primas'
          : error.error?.message || 'Error al crear la orden';
        this.mostrarError(mensaje);
      }
    });
  }

  async mostrarErrorNoStock() {
    const faltantesList = this.faltantes()
      .map(f => `${f.nombre}: requiere ${f.requerido_total} ${f.unidad_medida}, disponible: ${f.stock_disponible} (faltan ${f.faltante})`)
      .join('\n');

    const alert = await this.alertController.create({
      header: 'Stock insuficiente',
      message: `No hay suficiente stock:\n\n${faltantesList}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  cerrar() {
    this.modalController.dismiss();
  }
}