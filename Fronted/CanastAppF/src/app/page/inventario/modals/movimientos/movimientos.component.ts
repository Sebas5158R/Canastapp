import {
  Component,
  Input,
  OnInit,
  inject,
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
  MateriaPrima,
} from 'src/app/data/interfaces/materia-prima.interface';

import {
  MovimientoInventario,
} from 'src/app/data/interfaces/movimiento-inventario.interface';

import {
  MateriaPrimaService,
} from 'src/app/data/services/materia-prima.service';

@Component({
  selector:
    'app-movimientos',

  templateUrl:
    './movimientos.component.html',

  styleUrls: [
    './movimientos.component.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class MovimientosComponent
implements OnInit {

  private modalController =
    inject(ModalController);

  private toastController =
    inject(ToastController);

  private materiaPrimaService =
    inject(MateriaPrimaService);

  @Input()
  materia!: MateriaPrima;

  movimientos:
    MovimientoInventario[] = [];

  form:
    Partial<MovimientoInventario> = {

    tipo_movimiento:
      'entrada',

    cantidad: 0,

    observaciones: '',
  };

  ngOnInit(): void {

    this.cargarMovimientos();
  }

  cargarMovimientos(): void {

    this.materiaPrimaService
      .obtenerMovimientos(
        this.materia.id
      )
      .subscribe({

        next: (response) => {

          this.movimientos =
            response;
        },
      });
  }

  registrarMovimiento():
  void {

    const body = {

      ...this.form,

      materia_prima_id:
        this.materia.id,
    };

    this.materiaPrimaService
      .registrarMovimiento(
        body
      )
      .subscribe({

        next: async () => {

          await this.presentToast(
            'Movimiento registrado'
          );

          this.cargarMovimientos();

          this.form = {

            tipo_movimiento:
              'entrada',

            cantidad: 0,

            observaciones: '',
          };
        },

        error: async () => {

          await this.presentToast(
            'Error registrando',
            'danger'
          );
        },
      });
  }

  cerrar(): void {

    this.modalController.dismiss();
  }

  async presentToast(

    message: string,

    color = 'success'

  ): Promise<void> {

    const toast =
      await this.toastController
        .create({

          message,

          duration: 2000,

          color,
        });

    await toast.present();
  }
}