import { inject, Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import {
  NetworkService,
} from './network.service';

import {
  OfflineQueueService,
} from './offline-queue.service';
import {
  Observable,
  timeout,
  retry,
  catchError,
  throwError,
} from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  private readonly timeoutMs = 15000;
  private networkService =
  inject(NetworkService);

private offlineQueueService =
  inject(OfflineQueueService);

  private getHeaders(): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  get<T>(endpoint: string): Observable<T> {

    return this.http
      .get<T>(
        `${this.apiUrl}/${endpoint}`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        timeout(this.timeoutMs),
        retry(1),
        catchError(this.handleError)
      );
  }

  post<T>(
  endpoint: string,
  body: any
): Observable<T> {

  if (
    !this.networkService.isOnline()
  ) {

    this.offlineQueueService
      .agregarOperacion(
        endpoint,
        'POST',
        body
      );

    return throwError(
      () =>
        new Error(
          'SIN INTERNET'
        )
    );
  }

  return this.http
    .post<T>(
      `${this.apiUrl}/${endpoint}`,
      body,
      {
        headers:
          this.getHeaders(),
      }
    )
    .pipe(
      timeout(
        this.timeoutMs
      ),

      catchError(
        this.handleError
      )
    );
}

  patch<T>(
    endpoint: string,
    body: any
  ): Observable<T> {

    return this.http
      .patch<T>(
        `${this.apiUrl}/${endpoint}`,
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  put<T>(
    endpoint: string,
    body: any
  ): Observable<T> {

    return this.http
      .put<T>(
        `${this.apiUrl}/${endpoint}`,
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<T> {

    return this.http
      .delete<T>(
        `${this.apiUrl}/${endpoint}`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {

    console.error(
      'API ERROR:',
      error
    );

    return throwError(
      () => error
    );
  }
}