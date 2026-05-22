import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonicModule,
  AlertController,
  ToastController,
  ModalController,
} from '@ionic/angular';

import { MateriaPrimaService } from 'src/app/data/services/materia-prima.service';
import { MateriaFormComponent } from './modals/materia-form/materia-form.component';
import { MovimientosComponent } from './modals/movimientos/movimientos.component';
import { MateriaPrima } from 'src/app/data/interfaces/materia-prima.interface';
import { InventarioState } from 'src/app/data/state/inventario.state';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class InventarioPage implements OnInit {

  private materiaPrimaService = inject(MateriaPrimaService);
  private inventarioState     = inject(InventarioState);
  private toastController     = inject(ToastController);
  private modalController     = inject(ModalController);
  private alertController     = inject(AlertController);

  inventario$ = this.inventarioState.inventario$;

  busqueda   = '';
  cargando   = true;
  errorCarga = false;

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.cargando   = true;
    this.errorCarga = false;

    this.materiaPrimaService.obtenerInventario().subscribe({
      next:  () => { this.cargando = false; },
      error: () => { this.cargando = false; this.errorCarga = true; },
    });
  }

  filtrarInventario(lista: MateriaPrima[]): MateriaPrima[] {
    const q = this.busqueda.trim().toLowerCase();
    return q ? lista.filter(m => m.nombre.toLowerCase().includes(q)) : lista;
  }

  contarCriticos(lista: MateriaPrima[]): number {
    return lista.filter((materia) => this.estadoStock(materia) === 'critico').length;
  }

  contarConVencimiento(lista: MateriaPrima[]): number {
    return lista.filter((materia) => !!materia.fecha_vencimiento).length;
  }

  estadoStock(m: MateriaPrima): 'critico' | 'exceso' | 'normal' {
    if (+m.cantidad_disponible <= +m.stock_minimo) return 'critico';
    if (+m.cantidad_disponible >= +m.stock_maximo) return 'exceso';
    return 'normal';
  }

  labelEstado(m: MateriaPrima): string {
    const e = this.estadoStock(m);
    return e === 'critico' ? 'CRÍTICO' : e === 'exceso' ? 'EXCESO' : 'NORMAL';
  }

  async crearMateria(): Promise<void> {
    const modal = await this.modalController.create({
      component: MateriaFormComponent,
      cssClass: 'materia-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<boolean>();
    if (data) await this.mostrarToast('Materia prima creada correctamente');
  }

  async editarMateria(materia: MateriaPrima): Promise<void> {
    const modal = await this.modalController.create({
      component: MateriaFormComponent,
      cssClass: 'materia-modal',
      componentProps: { materia },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<boolean>();
    if (data) await this.mostrarToast('Materia prima actualizada');
  }

  async abrirMovimientos(materia: MateriaPrima): Promise<void> {
    const modal = await this.modalController.create({
      component: MovimientosComponent,
      cssClass: 'materia-modal',
      componentProps: { materia },
    });
    await modal.present();
    await modal.onDidDismiss();
    this.cargarInventario();
  }

  async eliminarMateria(materia: MateriaPrima): Promise<void> {
    const alert = await this.alertController.create({
      header:  'Eliminar materia prima',
      message: `¿Estás seguro de eliminar <strong>${materia.nombre}</strong>? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.materiaPrimaService.eliminarMateriaPrima(materia.id).subscribe({
              next: async () => {
                await this.mostrarToast('Materia prima eliminada');
              },
              error: async (err: { error?: { message?: string } }) => {
                const msg = err?.error?.message || 'No se pudo eliminar';
                await this.mostrarToast(msg, 'danger');
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async refrescar(event: { target: { complete: () => void } }): Promise<void> {
    this.materiaPrimaService.obtenerInventario().subscribe({
      next:  () => event.target.complete(),
      error: () => event.target.complete(),
    });
  }

  async mostrarToast(mensaje: string, color = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message:  mensaje,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}