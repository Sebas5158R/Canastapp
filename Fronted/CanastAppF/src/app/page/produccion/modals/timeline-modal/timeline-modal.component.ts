import {
  Component,
  Input,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  IonicModule,
  ModalController,
} from '@ionic/angular';

import {
  TimelineProduccionComponent,
} from '../../components/timeline-produccion/timeline-produccion.component';

@Component({
  selector:
    'app-timeline-modal',

  templateUrl:
    './timeline-modal.component.html',

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
    TimelineProduccionComponent,
  ],
})
export class TimelineModalComponent {

  @Input()
  ordenId!: number;

  constructor(
    private modalController:
      ModalController
  ) {}

  cerrar(): void {

    this.modalController.dismiss();
  }
}