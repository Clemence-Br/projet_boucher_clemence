import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth';
import { AuthPage } from './users/auth-page/auth-page';
import { PollutionList } from './pollution-report/list/pollution-list';
import { PollutionDetails } from './pollution-report/details/pollution-details';
import { PollutionFormPage } from './pollution-report/form-page/pollution-form-page';
import { UserList } from './users/user-list/user-list';
import { UserCreatePage } from './users/user-create-page/user-create-page';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'connexion', component: AuthPage, canActivate: [guestGuard] },

  // Pages privées : un seul guard sur le parent sans chemin
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'pollutions', component: PollutionList },
      { path: 'pollutions/new', component: PollutionFormPage },
      { path: 'pollutions/:id', component: PollutionDetails },
      { path: 'pollutions/:id/edit', component: PollutionFormPage },
      { path: 'utilisateurs', component: UserList },
      { path: 'utilisateurs/new', component: UserCreatePage },
    ],
  },

  { path: '**', redirectTo: 'pollutions' },
];
