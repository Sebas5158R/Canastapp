import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonSelectOption
} from '@ionic/angular/standalone';

import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-editar-usuario-modal',
  templateUrl: './editar-usuario-modal.component.html',
  styleUrls: ['./editar-usuario-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonLabel,
    IonSelectOption,
  ]
})
export class EditarUsuarioModalComponent {

  @Input() usuario: any;
  @Input() roles: any[] = [];

  form: any = {};

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.form = {
      nombre_completo: this.usuario.nombre_completo,
      correo: this.usuario.correo,
      numero_identificacion: this.usuario.numero_identificacion,
      rol_id: this.usuario.rol?.id ?? null,
      activo: this.usuario.activo
    };
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.modalCtrl.dismiss(this.form);
  }
}