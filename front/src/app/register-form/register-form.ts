import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth';
import { SignUpResponse } from '../models/auth';

interface User {
  login: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  email: string;
}

@Component({
  selector: 'app-register-form',
  imports: [FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  private readonly authService = inject(AuthService);

  user: User = this.emptyUser();

  // États
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly registeredUser = signal<SignUpResponse | null>(null);

  // ===== Validation =====

  get passwordsMismatch(): boolean {
    return this.user.password !== this.user.confirmPassword;
  }

  // Un champ est en erreur ET l'utilisateur a interagi avec
  hasError(control: NgModel): boolean {
    return !!control.invalid && (!!control.dirty || !!control.touched);
  }

  // Une erreur précise (required, email...) est présente sur le champ
  hasErrorType(control: NgModel, errorType: string): boolean {
    return !!control.errors?.[errorType];
  }

  // Affiche l'erreur de correspondance une fois la confirmation touchée
  showMismatchError(confirmControl: NgModel): boolean {
    return this.passwordsMismatch && !!confirmControl.touched;
  }

  // Le formulaire peut être soumis
  canSubmit(form: NgForm): boolean {
    return !!form.valid && !this.passwordsMismatch && !this.loading();
  }

  // ===== Actions =====
  onSubmit(form: NgForm): void {
    if (!this.canSubmit(form)) {
      form.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    // confirmPassword est inutile au backend
    const { confirmPassword, ...payload } = this.user;

    this.authService
      .signUp(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.registeredUser.set(response),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }

  newRegistration(): void {
    this.user = this.emptyUser();
    this.registeredUser.set(null);
    this.errorMessage.set(null);
  }

  private emptyUser(): User {
    return { login: '', password: '', confirmPassword: '', nom: '', prenom: '', email: '' };
  }
}
