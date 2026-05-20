import {
  Component,
  Input,
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
  MateriaPrimaService,
} from 'src/app/data/services/materia-prima.service';

@Component({
  selector:
    'app-materia-form',

  templateUrl:
    './materia-form.component.html',

  styleUrls: [
    './materia-form.component.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class MateriaFormComponent {

  private modalController =
    inject(ModalController);

  private toastController =
    inject(ToastController);

  private materiaPrimaService =
    inject(MateriaPrimaService);

  @Input()
  materia?: MateriaPrima;

  form: Partial<MateriaPrima> = {

    nombre: '',

    descripcion: '',

    cantidad_disponible: 0,

    unidad_medida: 'kg',

    stock_minimo: 0,

    stock_maximo: 0,

    estado_inventario:
      'activo',
  };

  ngOnInit(): void {

    if (this.materia) {

      this.form = {
        ...this.materia,
      };
    }
  }

  guardar(): void {

    if (!this.form.nombre) {

      this.presentToast(
        'Nombre requerido',
        'danger'
      );

      return;
    }

    if (this.materia) {

      this.actualizar();
      return;
    }

    this.crear();
  }

  crear(): void {

    this.materiaPrimaService
      .crearMateriaPrima(
        this.form
      )
      .subscribe({

        next: async () => {

          await this.presentToast(
            'Materia prima creada'
          );

          this.modalController.dismiss(
            true
          );
        },

        error: async () => {

          await this.presentToast(
            'Error creando materia',
            'danger'
          );
        },
      });
  }

  actualizar(): void {

    this.materiaPrimaService
      .actualizarMateriaPrima(

        this.materia!.id,

        this.form

      )
      .subscribe({

        next: async () => {

          await this.presentToast(
            'Materia actualizada'
          );

          this.modalController.dismiss(
            true
          );
        },

        error: async () => {

          await this.presentToast(
            'Error actualizando',
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