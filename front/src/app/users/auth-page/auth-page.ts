import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { finalize } from 'rxjs';
import { Credentials, User } from '../../models/user';
import { UserService } from '../../services/user';
import { Login } from '../../store/auth/auth.actions';
import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  imports: [LoginForm, RegisterForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private readonly userService = inject(UserService);
  private readonly store = inject(Store);
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
    this.store.dispatch(new Login({ email: user.email, nom: `${user.prenom} ${user.nom}` }));
    this.router.navigate(['/pollutions']);
  }
}
