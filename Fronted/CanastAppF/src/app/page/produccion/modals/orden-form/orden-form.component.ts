import {
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import {
  ProduccionService,
} from 'src/app/data/services/produccion.service';

import {
  ProductoService,
} from 'src/app/data/services/producto.service';

import {
  Producto,
} from 'src/app/data/interfaces/producto.interface';

@Component({
  selector:
    'app-orden-form',

  templateUrl:
    './orden-form.component.html',

  styleUrls: [
    './orden-form.component.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class OrdenFormComponent
implements OnInit {

  // ============================================
  // INYECCIONES
  // ============================================

  private modalController =
    inject(ModalController);

  private toastController =
    inject(ToastController);

  private produccionService =
    inject(ProduccionService);

  private productoService =
    inject(ProductoService);

  // ============================================
  // VARIABLES
  // ============================================

  productos: Producto[] = [];

  loading = false;

  form = {

    producto_id: undefined as
      number | undefined,

    cantidad_solicitada: 0,

    fecha_requerida: '',

    observaciones: '',
  };

  // ============================================
  // INIT
  // ============================================

  ngOnInit(): void {

    this.cargarProductos();
  }

  // ============================================
  // CARGAR PRODUCTOS
  // ============================================

  cargarProductos(): void {

    this.productoService
      .getProductos()
      .subscribe({

        next: (response) => {

          this.productos =
            response;
        },

        error: async () => {

          await this.presentToast(

            'Error cargando productos',

            'danger'
          );
        },
      });
  }

  // ============================================
  // GUARDAR ORDEN
  // ============================================

  guardar(): void {

    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;

    this.produccionService
      .crearOrden(
        this.form
      )
      .subscribe({

        next: async () => {

          this.loading = false;

          await this.presentToast(
            'Orden creada correctamente'
          );

          this.modalController.dismiss(
            true
          );
        },

        error: async () => {

          this.loading = false;

          await this.presentToast(

            'Error creando orden',

            'danger'
          );
        },
      });
  }

  // ============================================
  // VALIDAR FORMULARIO
  // ============================================

  validarFormulario():
  boolean {

    if (!this.form.producto_id) {

      this.presentToast(

        'Seleccione un producto',

        'warning'
      );

      return false;
    }

    if (
      !this.form
        .cantidad_solicitada ||

      this.form
        .cantidad_solicitada <= 0
    ) {

      this.presentToast(

        'Cantidad inválida',

        'warning'
      );

      return false;
    }

    if (
      !this.form
        .fecha_requerida
    ) {

      this.presentToast(

        'Seleccione una fecha',

        'warning'
      );

      return false;
    }

    return true;
  }

  // ============================================
  // CERRAR MODAL
  // ============================================

  cerrar(): void {

    this.modalController.dismiss();
  }

  // ============================================
  // TOAST
  // ============================================

  async presentToast(

    message: string,

    color:
      | 'success'
      | 'warning'
      | 'danger'
      = 'success'

  ): Promise<void> {

    const toast =
      await this.toastController
        .create({

          message,

          duration: 2000,

          color,

          position: 'top',
        });

    await toast.present();
  }
}