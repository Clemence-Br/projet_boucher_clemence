import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../environments/environment';
import { SignUpRequest, SignUpResponse } from '../models/auth';

const SIGN_UP_URL = `${environment.apiUrl}${environment.endpoints.signUp}`;

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // Seule l'inscription est interceptée, le reste part normalement
  if (req.method !== 'POST' || req.url !== SIGN_UP_URL) {
    return next(req);
  }

  // On renvoie les données reçues, sans le mot de passe, avec un id
  const { password, ...data } = req.body as SignUpRequest;
  const response: SignUpResponse = { id: Date.now(), ...data };

  return of(new HttpResponse({ status: 201, body: response })).pipe(delay(800));
};
