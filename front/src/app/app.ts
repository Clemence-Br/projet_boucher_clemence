import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Session } from './services/session';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly session = inject(Session);
  private readonly router = inject(Router);

  logout(): void {
    this.session.logout();
    this.router.navigate(['/connexion']);
  }
}
