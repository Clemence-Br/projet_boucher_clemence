import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterForm } from '../register-form/register-form';

@Component({
  selector: 'app-user-create-page',
  imports: [RouterLink, RegisterForm],
  template: `
    <a class="back-link" routerLink="/utilisateurs">← Retour à la liste</a>
    <app-register-form />
  `,
})
export class UserCreatePage {}
