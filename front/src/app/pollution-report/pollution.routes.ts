import { Routes } from '@angular/router';
import { PollutionList } from './list/pollution-list';
import { PollutionDetails } from './details/pollution-details';
import { PollutionFormPage } from './form-page/pollution-form-page';

export const POLLUTION_ROUTES: Routes = [
  { path: '', component: PollutionList },
  { path: 'new', component: PollutionFormPage },
  { path: ':id', component: PollutionDetails },
  { path: ':id/edit', component: PollutionFormPage },
];
