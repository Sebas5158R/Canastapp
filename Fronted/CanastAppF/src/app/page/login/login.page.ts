import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, logInOutline } from 'ionicons/icons';
import { UsuarioService } from '../../data/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
  ],
})
export class LoginPage {
  correo = '';
  contrasena = '';
  cargando = false;
  error = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    addIcons({ lockClosedOutline, mailOutline, logInOutline });
  }

  login(): void {
    this.error = '';

    if (!this.correo.trim() || !this.contrasena.trim()) {
      this.error = 'Ingresa correo y contraseña.';
      return;
    }

    this.cargando = true;

    this.usuarioService.login({
      correo: this.correo.trim(),
      contrasena: this.contrasena,
    }).subscribe({
      next: () => {
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/home';
        this.router.navigateByUrl(redirectTo);
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo iniciar sesión.';
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }
}