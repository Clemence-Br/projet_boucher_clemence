import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Session } from '../services/session';

/** Pages privées : redirige vers /connexion si personne n'est connecté */
export const authGuard: CanActivateFn = () =>
  inject(Session).isLoggedIn() ? true : inject(Router).createUrlTree(['/connexion']);

/** Page de connexion : redirige vers l'app si on est déjà connecté */
export const guestGuard: CanActivateFn = () =>
  inject(Session).isLoggedIn() ? inject(Router).createUrlTree(['/pollutions']) : true;
