import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  IonicModule,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkCircleOutline,
  peopleOutline,
  personAddOutline,
  refreshOutline,
  alertCircleOutline,
} from 'ionicons/icons';

import { UsuarioService } from 'src/app/data/services/usuario.service';
import {
  CreateUsuarioRequest,
  CreateUsuarioResponse,
  RolInfo,
  Usuario,
} from 'src/app/data/interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
})
export class UsuariosPage implements OnInit {
  private usuarioService = inject(UsuarioService);
  private toastCtrl = inject(ToastController);

  usuarios: Usuario[] = [];
  roles: RolInfo[] = [];

  cargando = false;
  guardando = false;
  errorMsg = '';
  exitoMsg = '';

  form: CreateUsuarioRequest = {
    nombre_completo: '',
    numero_identificacion: '',
    correo: '',
    rol_id: '',
  };

  ultimoUsuarioCreado: CreateUsuarioResponse | null = null;

  constructor() {
    addIcons({
      addOutline,
      checkmarkCircleOutline,
      peopleOutline,
      personAddOutline,
      refreshOutline,
      alertCircleOutline,
    });
  }

  ngOnInit(): void {
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

  limpiarFormulario(): void {
    this.form = {
      nombre_completo: '',
      numero_identificacion: '',
      correo: '',
      rol_id: '',
    };
    this.errorMsg = '';
    this.exitoMsg = '';
    this.ultimoUsuarioCreado = null;
  }

  guardar(): void {
    this.errorMsg = '';
    this.exitoMsg = '';

    if (!this.form.nombre_completo.trim()) {
      this.errorMsg = 'El nombre completo es obligatorio.';
      return;
    }

    if (!this.form.rol_id) {
      this.errorMsg = 'Debes seleccionar un rol.';
      return;
    }

    this.guardando = true;

    const payload: CreateUsuarioRequest = {
      nombre_completo: this.form.nombre_completo.trim(),
      numero_identificacion: this.form.numero_identificacion?.trim() || undefined,
      correo: this.form.correo?.trim() || undefined,
      rol_id: String(this.form.rol_id),
    };

    this.usuarioService.createUsuario(payload).subscribe({
      next: async (response) => {
        this.guardando = false;
        this.ultimoUsuarioCreado = response;
        this.exitoMsg = `${response.message} Correo generado: ${response.correo_generado}`;
        this.limpiarFormulario();
        this.cargarDatos();
        await this.mostrarToast('Usuario creado y correo enviado', 'success');
      },
      error: async (error) => {
        this.guardando = false;
        this.errorMsg = error?.error?.message || 'No se pudo crear el usuario.';
        await this.mostrarToast(this.errorMsg, 'danger');
      },
    });
  }

  nombreRol(rolId: string): string {
    return this.roles.find((rol) => rol.id === rolId)?.nombre ?? rolId;
  }

  trackByUsuario(_: number, usuario: Usuario): string {
    return usuario.id;
  }

  trackByRol(_: number, rol: RolInfo): string {
    return rol.id;
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}