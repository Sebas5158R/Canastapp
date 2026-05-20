import {
  Component,
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
  AlertController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import {
  MovimientosComponent,
} from './modals/movimientos/movimientos.component';

import {
  MateriaPrimaService,
} from 'src/app/data/services/materia-prima.service';
import {
  MateriaFormComponent,
} from './modals/materia-form/materia-form.component';

import {
  MateriaPrima,
} from 'src/app/data/interfaces/materia-prima.interface';
import {
  InventarioState,
} from 'src/app/data/state/inventario.state';

@Component({
  selector: 'app-inventario',

  templateUrl:
    './inventario.page.html',

  styleUrls: [
    './inventario.page.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class InventarioPage
implements OnInit {

  private materiaPrimaService =
    inject(MateriaPrimaService);

  private inventarioState =
    inject(InventarioState);

  private toastController =
    inject(ToastController);

  private modalController =
    inject(ModalController);

  private alertController =
    inject(AlertController);

  inventario$ =
    this.inventarioState
      .inventario$;

  busqueda = '';

  ngOnInit(): void {

    this.cargarInventario();
  }

  cargarInventario(): void {

    this.materiaPrimaService
      .obtenerInventario()
      .subscribe();
  }
  async abrirMovimientos(
  materia: MateriaPrima
): Promise<void> {

  const modal =
    await this.modalController
      .create({

        component:
          MovimientosComponent,

        componentProps: {
          materia,
        },
      });

  await modal.present();
}
  async crearMateria():
Promise<void> {

  const modal =
    await this.modalController
      .create({

        component:
          MateriaFormComponent,
      });

  await modal.present();

  await modal.onDidDismiss();
}
async editarMateria(
  materia: MateriaPrima
): Promise<void> {

  const modal =
    await this.modalController
      .create({

        component:
          MateriaFormComponent,

        componentProps: {
          materia,
        },
      });

  await modal.present();

  await modal.onDidDismiss();
}
async eliminarMateria(
  materia: MateriaPrima
): Promise<void> {

  const alert =
    await this.alertController
      .create({

        header: 'Eliminar',

        message:
          `¿Eliminar ${materia.nombre}?`,

        buttons: [

          {
            text: 'Cancelar',
            role: 'cancel',
          },

          {
            text: 'Eliminar',

            role: 'destructive',

            handler: () => {

              this.materiaPrimaService
                .eliminarMateriaPrima(
                  materia.id
                )
                .subscribe();
            },
          },
        ],
      });

  await alert.present();
}
  async refrescar(
    event: any
  ): Promise<void> {

    this.materiaPrimaService
      .obtenerInventario()
      .subscribe({

        next: () => {

          event.target.complete();
        },

        error: () => {

          event.target.complete();
        },
      });
  }

  async mostrarToast(
    mensaje: string,
    color = 'success'
  ): Promise<void> {

    const toast =
      await this.toastController
        .create({

          message: mensaje,

          duration: 2000,

          color,
        });

    await toast.present();
  }
}