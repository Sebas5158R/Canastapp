import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  IonicModule,
  ModalController,
  AlertController,
} from '@ionic/angular';

import {
  ProduccionService,
} from 'src/app/data/services/produccion.service';
import {
  TimelineModalComponent,
} from './modals/timeline-modal/timeline-modal.component';
import {
  ProduccionState,
} from 'src/app/data/state/produccion.state';

import {
  OrdenProduccion,
} from 'src/app/data/interfaces/orden-produccion.interface';

@Component({
  selector: 'app-produccion',

  templateUrl:
    './produccion.page.html',

  styleUrls: [
    './produccion.page.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class ProduccionPage
implements OnInit {

  private produccionService =
    inject(ProduccionService);

  private produccionState =
    inject(ProduccionState);

  private modalController =
    inject(ModalController);

  private alertController =
    inject(AlertController);

  ordenes$ =
    this.produccionState
      .ordenes$;

  ngOnInit(): void {

    this.cargarOrdenes();
  }

  cargarOrdenes(): void {

    this.produccionService
      .obtenerOrdenes()
      .subscribe();
  }
  async verTimeline(
  ordenId: number
): Promise<void> {

  const modal =
    await this.modalController
      .create({

        component:
          TimelineModalComponent,

        componentProps: {
          ordenId,
        },
      });

  await modal.present();
}

  cambiarEstado(

    orden: OrdenProduccion,

    estado:
      | 'pendiente'
      | 'en_produccion'
      | 'completada'
      | 'cancelada'

  ): void {

    this.produccionService
      .actualizarEstado(
        orden.id,
        estado
      )
      .subscribe();
  }
}