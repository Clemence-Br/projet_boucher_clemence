import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Credentials, User } from '../models/user';
import { UserService } from '../services/user';
import { Session } from '../services/session';
import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  imports: [LoginForm, RegisterForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private readonly userService = inject(UserService);
  private readonly session = inject(Session);
  private readonly router = inject(Router);

  readonly mode = signal<Mode>('login');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.errorMessage.set(null);
  }

  onLogin(credentials: Credentials): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.userService
      .login(credentials)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => this.enter(user),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }

  /** Après la création du compte, on connecte directement l'utilisateur */
  onRegistered(user: User): void {
    this.enter(user);
  }

  private enter(user: User): void {
    this.session.login(user);
    this.router.navigate(['/pollutions']);
  }
}
