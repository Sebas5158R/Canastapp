import {
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { MateriaPrima } from 'src/app/data/interfaces/materia-prima.interface';
import { MateriaPrimaService } from 'src/app/data/services/materia-prima.service';

@Component({
  selector: 'app-materia-form',
  templateUrl: './materia-form.component.html',
  styleUrls: ['./materia-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class MateriaFormComponent implements OnInit {

  private modalController     = inject(ModalController);
  private toastController     = inject(ToastController);
  private materiaPrimaService = inject(MateriaPrimaService);

  @Input() materia?: MateriaPrima;

  guardando = false;

  form: Partial<MateriaPrima> = {
    nombre:              '',
    descripcion:         '',
    cantidad_disponible: 0,
    unidad_medida:       'kg',
    stock_minimo:        0,
    stock_maximo:        999999,
    fecha_vencimiento:   undefined,
    estado_inventario:   'activo',
  };

  unidades = ['kg', 'g', 'litro', 'ml', 'unidad', 'docena', 'caja'];

  get esEdicion(): boolean {
    return !!this.materia;
  }

  ngOnInit(): void {
    if (this.materia) {
      this.form = {
        ...this.materia,
        // Normalizar fecha para el input[type=date]
        fecha_vencimiento: this.materia.fecha_vencimiento
          ? this.materia.fecha_vencimiento.substring(0, 10)
          : undefined,
      };
    }
  }

  guardar(): void {
    if (!this.form.nombre?.trim()) {
      this.presentToast('El nombre es obligatorio', 'danger');
      return;
    }

    if (this.form.stock_minimo! > this.form.stock_maximo!) {
      this.presentToast('El stock mínimo no puede superar el máximo', 'danger');
      return;
    }

    this.guardando = true;
    this.esEdicion ? this.actualizar() : this.crear();
  }

  private crear(): void {
    this.materiaPrimaService.crearMateriaPrima(this.form).subscribe({
      next: async () => {
        await this.presentToast('Materia prima creada correctamente');
        this.modalController.dismiss(true);
      },
      error: async (err) => {
        this.guardando = false;
        const msg = err?.error?.message || 'Error al crear la materia prima';
        await this.presentToast(msg, 'danger');
      },
    });
  }

  private actualizar(): void {
    this.materiaPrimaService
      .actualizarMateriaPrima(this.materia!.id, this.form)
      .subscribe({
        next: async () => {
          await this.presentToast('Materia prima actualizada');
          this.modalController.dismiss(true);
        },
        error: async (err) => {
          this.guardando = false;
          const msg = err?.error?.message || 'Error al actualizar';
          await this.presentToast(msg, 'danger');
        },
      });
  }

  cerrar(): void {
    this.modalController.dismiss(false);
  }

  private async presentToast(message: string, color = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}