import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';

/** Pages privées : redirige vers /connexion si personne n'est connecté */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return store.selectSnapshot(AuthState.isAuthenticated)
    ? true
    : router.createUrlTree(['/connexion']);
};

/** Page de connexion : redirige vers l'app si on est déjà connecté */
export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return store.selectSnapshot(AuthState.isAuthenticated)
    ? router.createUrlTree(['/pollutions'])
    : true;
};
