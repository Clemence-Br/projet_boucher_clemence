import { Routes } from '@angular/router';
import { RegisterForm } from './register-form/register-form';
import { PollutionPage } from './pollution-report/pollution-page';

export const routes: Routes = [
  { path: '', redirectTo: 'inscription', pathMatch: 'full' },
  { path: 'inscription', component: RegisterForm },
  { path: 'pollution', component: PollutionPage },
  { path: '**', redirectTo: 'inscription' },
];