import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  user: User = this.emptyUser();

  // Copie des données soumises, affichée dans le récapitulatif
  submittedUser: User | null = null;

  // Le mot de passe n'est jamais affiché en clair
  get maskedPassword(): string {
    return '•'.repeat(this.submittedUser?.password.length ?? 0);
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      this.submittedUser = { ...this.user }; // copie pour figer les valeurs
      console.log('Inscription réussie, données soumises :', this.submittedUser);
    } else {
      console.error('Le formulaire contient des erreurs.');
      form.form.markAllAsTouched();
    }
  }

  newRegistration() {
    this.user = this.emptyUser();
    this.submittedUser = null; // réaffiche un formulaire vierge
  }

  private emptyUser(): User {
    return { login: '', password: '', confirmPassword: '', nom: '', prenom: '', email: '' };
  }
}
