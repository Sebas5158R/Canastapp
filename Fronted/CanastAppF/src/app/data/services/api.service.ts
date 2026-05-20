import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NetworkService } from './network.service';
import { OfflineQueueService } from './offline-queue.service';
import { Observable, timeout, retry, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private networkService = inject(NetworkService);
  private offlineQueueService = inject(OfflineQueueService);

  private readonly apiUrl = environment.apiUrl;
  private readonly timeoutMs = 15000;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(endpoint: string, params?: HttpParams | { [param: string]: any }): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params: params,
      })
      .pipe(
        timeout(this.timeoutMs),
        retry(1),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, body: any, skipQueue: boolean = false): Observable<T> {
    if (!this.networkService.isOnline() && !skipQueue) {
      this.offlineQueueService.agregarOperacion(endpoint, 'POST', body);
      return throwError(() => new Error('SIN INTERNET - Operación guardada para sincronizar'));
    }

    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .patch<T>(`${this.apiUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API ERROR:', error);
    return throwError(() => error);
  }
}