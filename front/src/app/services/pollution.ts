import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution, PollutionData } from '../models/pollution';

const ERROR_MESSAGES: Record<number, string> = {
  0: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
  400: 'Les données envoyées sont invalides.',
  404: 'Cette pollution est introuvable.',
  500: 'Erreur interne du serveur. Réessayez plus tard.',
};

/** Transforme une erreur HTTP technique en message lisible */
function handleError(error: HttpErrorResponse): Observable<never> {
  const message = ERROR_MESSAGES[error.status] ?? `Une erreur est survenue (code ${error.status}).`;
  return throwError(() => new Error(message));
}

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private readonly http = inject(HttpClient);

  // L'URL dépend de l'environnement
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.pollutions}`;

  /** READ : liste */
  getAll(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.baseUrl).pipe(catchError(handleError));
  }

  /** READ : détail */
  getById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.baseUrl}/${id}`).pipe(catchError(handleError));
  }

  /** CREATE */
  create(data: PollutionData): Observable<Pollution> {
    return this.http.post<Pollution>(this.baseUrl, data).pipe(catchError(handleError));
  }

  /** UPDATE */
  update(id: number, data: PollutionData): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.baseUrl}/${id}`, data).pipe(catchError(handleError));
  }

  /** DELETE */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(handleError));
  }
}
