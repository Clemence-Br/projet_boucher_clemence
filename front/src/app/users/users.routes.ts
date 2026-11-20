import { Routes } from '@angular/router';
import { UserList } from './user-list/user-list';
import { UserCreatePage } from './user-create-page/user-create-page';

export const USER_ROUTES: Routes = [
  { path: '', component: UserList },
  { path: 'new', component: UserCreatePage },
];
