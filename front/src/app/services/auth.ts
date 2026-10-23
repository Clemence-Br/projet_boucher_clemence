import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignUpRequest, SignUpResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // L'URL est construite à partir de l'environnement
  private readonly signUpUrl = `${environment.apiUrl}${environment.endpoints.signUp}`;

  signUp(payload: SignUpRequest): Observable<SignUpResponse> {
    return this.http
      .post<SignUpResponse>(this.signUpUrl, payload)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /** Transforme une erreur HTTP technique en message lisible */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    switch (error.status) {
      case 0:
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
        break;
      case 400:
        message = error.error?.message ?? 'Les données envoyées sont invalides.';
        break;
      case 409:
        message = 'Ce login ou cet email est déjà utilisé.';
        break;
      case 500:
        message = 'Erreur interne du serveur. Réessayez plus tard.';
        break;
      default:
        message = `Une erreur est survenue (code ${error.status}).`;
    }

    return throwError(() => new Error(message));
  }
}
