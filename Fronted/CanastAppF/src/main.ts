import { bootstrapApplication } from '@angular/platform-browser';

import {
  RouteReuseStrategy,
} from '@angular/router';

import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app/app.routes';

import { AppComponent } from './app/components/app.component';

import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {

  providers: [

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },

    provideIonicAngular(),

    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),

    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
      ])
    ),
  ],

}).catch((err) => console.error(err));