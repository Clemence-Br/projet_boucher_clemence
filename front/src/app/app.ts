import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';
import { Logout } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // Signals alimentés par les sélecteurs du store
  protected readonly isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
  protected readonly username = this.store.selectSignal(AuthState.username);

  logout(): void {
    this.store.dispatch(new Logout());
    this.router.navigate(['/connexion']);
  }
}
