import { Routes } from '@angular/router';
import { RegisterForm } from './register-form/register-form';
import { PollutionList } from './pollution-report/list/pollution-list';
import { PollutionForm } from './pollution-report/form/pollution-form';
import { PollutionDetails } from './pollution-report/details/pollution-details';
import { PollutionFormPage } from './pollution-report/form-page/pollution-form-page';

export const routes: Routes = [
  { path: '', redirectTo: '/inscription', pathMatch: 'full' },
  { path: 'inscription', component: RegisterForm },
  { path: 'pollutions', component: PollutionList },
  { path: 'pollutions/new', component: PollutionForm },
  { path: 'pollutions/:id', component: PollutionDetails },
  { path: 'pollutions/:id/edit', component: PollutionFormPage },
  { path: '**', redirectTo: 'inscription' },
];
