import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

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
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  user: User = this.emptyUser();

  submittedUser: User | null = null;

  get maskedPassword(): string {
    return '•'.repeat(this.submittedUser?.password.length ?? 0);
  }

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
    return !!form.valid && !this.passwordsMismatch;
  }

  // ===== Actions =====

  onSubmit(form: NgForm) {
    if (this.canSubmit(form)) {
      this.submittedUser = { ...this.user };
    } else {
      form.form.markAllAsTouched();
    }
  }

  newRegistration() {
    this.user = this.emptyUser();
    this.submittedUser = null;
  }

  private emptyUser(): User {
    return { login: '', password: '', confirmPassword: '', nom: '', prenom: '', email: '' };
  }
}