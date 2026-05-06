import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notificacion, MarcarLeidaRequest } from '../interfaces/notificacion.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {

  constructor(private api: ApiService) {}

  getNotificaciones(): Observable<Notificacion[]> {
    return this.api.get<Notificacion[]>('notificaciones');
  }

  getNoLeidas(): Observable<Notificacion[]> {
    return this.api.get<Notificacion[]>('notificaciones?leida=false');
  }

  marcarComoLeida(id: number): Observable<Notificacion> {
    return this.api.patch<Notificacion>(`notificaciones/${id}/leer`, {});
  }

  marcarTodasLeidas(data: MarcarLeidaRequest): Observable<void> {
    return this.api.patch<void>('notificaciones/leer-todas', data);
  }
}
