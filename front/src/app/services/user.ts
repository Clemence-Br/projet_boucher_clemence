import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserCreate, Credentials } from '../models/user';

const ERROR_MESSAGES: Record<number, string> = {
  0: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
  500: 'Erreur interne du serveur. Réessayez plus tard.',
};

function handleError(error: HttpErrorResponse): Observable<never> {
  const showApiMessage = [400, 401, 409].includes(error.status);
  const apiMessage = showApiMessage ? error.error?.message : null;
  const message =
    apiMessage ?? ERROR_MESSAGES[error.status] ?? `Une erreur est survenue (code ${error.status}).`;
  return throwError(() => new Error(message));
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.users}`;
  private readonly loginUrl = `${environment.apiUrl}${environment.endpoints.login}`;

  /** READ : liste */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(catchError(handleError));
  }

  /** CREATE */
  create(payload: UserCreate): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload).pipe(catchError(handleError));
  }

  /** LOGIN */
  login(credentials: Credentials): Observable<User> {
    return this.http.post<User>(this.loginUrl, credentials).pipe(catchError(handleError));
  }
}
