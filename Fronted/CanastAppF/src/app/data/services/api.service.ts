import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  readonly BASE_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<T>(`${this.BASE_URL}/${path}`, { headers: this.getHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(`${this.BASE_URL}/${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<T>(`${this.BASE_URL}/${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<T>(`${this.BASE_URL}/${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.BASE_URL}/${path}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}