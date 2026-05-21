import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonBadge,
  IonSpinner
} from '@ionic/angular/standalone';

import {
  AlertController,
  ToastController,
} from '@ionic/angular';

import { ModalController } from '@ionic/angular/standalone';
import { EditarUsuarioModalComponent } from 'src/app/page/usuarios/editar-usuario-modal/editar-usuario-modal.component';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/data/services/usuario.service';
import { forkJoin } from 'rxjs';
import { RolInfo, Usuario } from 'src/app/data/interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios-listado',
  templateUrl: './usuarios-listado.page.html',
  styleUrls: ['./usuarios-listado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonBadge,
    IonSpinner,
  ]
})
export class UsuariosListadoPage implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  usuarios: Usuario[] = [];
  roles: RolInfo[] = [];
  cargando = false;

  errorMsg = '';

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMsg = '';

    forkJoin({
      usuarios: this.usuarioService.getUsuarios(),
      roles: this.usuarioService.getRoles(),
    }).subscribe({
      next: ({ usuarios, roles }) => {
        this.usuarios = usuarios;
        this.roles = roles;
        this.cargando = false;
      },
      error: (error) => {
        this.cargando = false;
        this.errorMsg = error?.error?.message || 'No fue posible cargar los usuarios.';
      },
    });
  }

  

  // Obtener usuario
  obtenerUsuarios() {

    this.cargando = true;

    this.usuarioService.getUsuarios()
      .subscribe({

        next: (usuarios) => {

          this.usuarios = usuarios;

          this.cargando = false;
        },

        error: (error) => {

          console.error(error);

          this.cargando = false;
        }

      });
  }

  async editarUsuario(usuario: any) {

    const modal = await this.modalController.create({
      component: EditarUsuarioModalComponent,
      componentProps: {
        usuario,
        roles: this.roles
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) return;

    this.usuarioService.updateUsuario(
      usuario.id,
      data
    ).subscribe({

      next: async () => {

        await this.obtenerUsuarios();

        const toast = await this.toastController.create({
          message: 'Usuario actualizado',
          duration: 2000,
          color: 'success'
        });

        toast.present();
      },

      error: async (error) => {

        console.error(error);

        const toast = await this.toastController.create({
          message: 'No se pudo actualizar',
          duration: 2000,
          color: 'danger'
        });

        toast.present();
      }

    });
  }

  async eliminarUsuario(id: string) {

    this.usuarioService.deleteUsuario(id)
      .subscribe({

        next: async () => {

          this.usuarios = this.usuarios.filter(
            u => u.id !== id
          );

          const toast = await this.toastController.create({
            message: 'Usuario eliminado',
            duration: 2000,
            color: 'success'
          });

          await toast.present();
        },

        error: async (error) => {

          console.error(error);

          const toast = await this.toastController.create({
            message: 'No se pudo eliminar',
            duration: 2000,
            color: 'danger'
          });

          await toast.present();
        }

      });
  }

  async confirmarEliminar(usuario: any) {

    const alert = await this.alertController.create({
      header: 'Eliminar usuario',
      message: `¿Deseas eliminar a ${usuario.nombre_completo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarUsuario(usuario.id);
          }
        }
      ]
    });

    await alert.present();
  }
}