import {
  Component,
  Input,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  IonicModule,
} from '@ionic/angular';

@Component({
  selector:
    'app-kpi-card',

  templateUrl:
    './kpi-card.component.html',

  styleUrls: [
    './kpi-card.component.scss',
  ],

  standalone: true,

  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class KpiCardComponent {

  @Input()
  title = '';

  @Input()
  value:
    string | number = 0;

  @Input()
  color = 'primary';

  @Input()
  icon = 'stats-chart';
}