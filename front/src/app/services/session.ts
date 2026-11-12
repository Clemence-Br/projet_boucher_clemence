import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user';

const STORAGE_KEY = 'binthere.user';

@Injectable({ providedIn: 'root' })
export class Session {
  private readonly _user = signal<User | null>(this.read());

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(user: User): void {
    this._user.set(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      /* stockage indisponible : la session vit en mémoire uniquement */
    }
  }

  logout(): void {
    this._user.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* rien à faire */
    }
  }

  private read(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null; // stockage inaccessible ou contenu corrompu
    }
  }
}
