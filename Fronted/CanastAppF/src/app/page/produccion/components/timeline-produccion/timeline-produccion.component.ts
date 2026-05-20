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
  IonicModule,
} from '@ionic/angular';

import {
  TrazabilidadService,
} from 'src/app/data/services/trazabilidad.service';

import {
  TrazabilidadProceso,
} from 'src/app/data/interfaces/trazabilidad.interface';

@Component({
  selector:
    'app-timeline-produccion',

  templateUrl:
    './timeline-produccion.component.html',

  styleUrls: [
    './timeline-produccion.component.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class TimelineProduccionComponent
implements OnInit {

  private trazabilidadService =
    inject(TrazabilidadService);

  @Input()
  ordenId!: number;

  timeline:
    TrazabilidadProceso[] = [];

  loading = false;

  ngOnInit(): void {

    this.cargarTimeline();
  }

  cargarTimeline(): void {

    this.loading = true;

    this.trazabilidadService
      .obtenerTimelineOrden(
        this.ordenId
      )
      .subscribe({

        next: (response) => {

          this.timeline =
            response;

          this.loading = false;
        },

        error: () => {

          this.loading = false;
        },
      });
  }

  getColor(
    etapa: string
  ): string {

    switch (etapa) {

      case 'orden_creada':
        return 'primary';

      case 'cambio_estado':
        return 'warning';

      case 'produccion':
        return 'success';

      case 'inventario':
        return 'tertiary';

      case 'entrega':
        return 'secondary';

      default:
        return 'medium';
    }
  }
}