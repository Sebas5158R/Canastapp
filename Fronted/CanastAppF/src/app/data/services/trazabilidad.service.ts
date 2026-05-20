import {
  Injectable,
  inject,
} from '@angular/core';

import {
  Observable,
} from 'rxjs';

import {
  ApiService,
} from './api.service';

import {
  TrazabilidadProceso,
} from '../interfaces/trazabilidad.interface';

@Injectable({
  providedIn: 'root',
})
export class TrazabilidadService {

  private api =
    inject(ApiService);

  obtenerTimelineOrden(

    ordenId: number

  ): Observable<
    TrazabilidadProceso[]
  > {

    return this.api.get<
      TrazabilidadProceso[]
    >(
      `trazabilidad/${ordenId}`
    );
  }
}