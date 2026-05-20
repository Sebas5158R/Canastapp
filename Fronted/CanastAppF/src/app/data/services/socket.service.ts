import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private socket: Socket | null = null;

  connected$ = new BehaviorSubject<boolean>(false);

  // ── Conexión lazy: se llama solo cuando hay sesión activa ──────────
  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(
      environment.apiUrl.replace('/api', ''),
      { transports: ['websocket'] }
    );

    this.socket.on('connect', () => {
      console.log('SOCKET CONNECTED');
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED');
      this.connected$.next(false);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('SOCKET ERROR:', err.message);
    });
  }

  // ── Escuchar un evento; no-op si el socket no está listo ──────────
  listen(event: string, callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  // ── Emitir un evento; no-op si el socket no está listo ───────────
  emit(event: string, data: any): void {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  // ── Desconectar limpiamente ───────────────────────────────────────
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected$.next(false);
    }
  }
}