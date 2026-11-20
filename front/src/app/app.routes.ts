import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },

  {
    path: 'connexion',
    canActivate: [guestGuard],
    loadComponent: () => import('./users/auth-page/auth-page').then((m) => m.AuthPage),
  },

  // Pages privées (authGuard)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'pollutions',
        loadChildren: () =>
          import('./pollution-report/pollution.routes').then((m) => m.POLLUTION_ROUTES),
      },
      {
        path: 'utilisateurs',
        loadChildren: () => import('./users/users.routes').then((m) => m.USER_ROUTES),
      },
    ],
  },

  { path: '**', redirectTo: 'pollutions' },
];
