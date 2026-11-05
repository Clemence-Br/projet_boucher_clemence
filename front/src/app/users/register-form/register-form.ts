import { Component, inject, output, signal } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserService } from '../../services/user';
import { User, UserCreate } from '../../models/user';

/** Modèle du formulaire (inclut confirmPassword, qui reste côté client) */
interface RegisterModel extends UserCreate {
  confirmPassword: string;
}

@Component({
  selector: 'app-register-form',
  imports: [FormsModule],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private readonly userService = inject(UserService);

  model: RegisterModel = this.emptyModel();

  // États
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly registeredUser = signal<User | null>(null);
  readonly registered = output<User>();

  // ===== Validation =====

  get passwordsMismatch(): boolean {
    return this.model.password !== this.model.confirmPassword;
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

    const payload: UserCreate = {
      login: this.model.login,
      nom: this.model.nom,
      prenom: this.model.prenom,
      email: this.model.email,
      password: this.model.password,
    };

    this.userService
      .create(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.registeredUser.set(response);
          this.registered.emit(response);
        },
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }

  newRegistration(): void {
    this.model = this.emptyModel();
    this.registeredUser.set(null);
    this.errorMessage.set(null);
  }

  private emptyModel(): RegisterModel {
    return { login: '', password: '', confirmPassword: '', nom: '', prenom: '', email: '' };
  }
}
