import {
  Component,
  inject,
} from '@angular/core';

import {
  Router,
} from '@angular/router';

import {
  FormsModule,
} from '@angular/forms';

import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  ToastController,
} from '@ionic/angular/standalone';

import { AuthService }
from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-login',

  templateUrl: './login.page.html',

  styleUrls: ['./login.page.scss'],

  standalone: true,

  imports: [
    FormsModule,

    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
  ],
})
export class LoginPage {

  private authService =
    inject(AuthService);

  private router =
    inject(Router);

  private toastController =
    inject(ToastController);

  email = '';

  password = '';

  loading = false;

  async login() {

    this.loading = true;

    this.authService.login({

      correo: this.email,

      contrasena: this.password,

    }).subscribe({

      next: async () => {

        this.loading = false;

        const toast =
          await this.toastController.create({

            message: 'Bienvenido',

            duration: 2000,

            position: 'bottom',
          });

        await toast.present();

        this.router.navigate(['/dashboard']);
      },

      error: async (error) => {

        this.loading = false;

        const toast =
          await this.toastController.create({

            message:
              error?.error?.message ||
              'Credenciales inválidas',

            duration: 3000,

            color: 'danger',
          });

        await toast.present();
      },
    });
  }
}