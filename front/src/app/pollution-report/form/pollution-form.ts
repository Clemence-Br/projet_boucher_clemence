import { Component, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { POLLUTION_TYPES, Pollution } from '../../models/pollution';

type ControlName =
  | 'title' | 'type' | 'description' | 'observationDate'
  | 'location' | 'latitude' | 'longitude' | 'photoUrl';

/** La date doit être valide et ne pas être dans le futur */
function observationDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null; // `required` s'en charge
  const date = new Date(value);
  if (isNaN(date.getTime())) return { invalidDate: true };
  return date > new Date() ? { futureDate: true } : null;
}

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.scss',
})
export class PollutionForm {
  readonly declared = output<Pollution>();

  readonly pollutionTypes = POLLUTION_TYPES;
  readonly today = new Date().toISOString().split('T')[0];

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    observationDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, observationDateValidator],
    }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    latitude: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(-90),
      Validators.max(90),
    ]),
    longitude: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(-180),
      Validators.max(180),
    ]),
    photoUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^$|^https?:\/\/\S+$/i)], // optionnel
    }),
  });

  private readonly messages: Record<ControlName, Record<string, string>> = {
    title: {
      required: 'Le titre est requis.',
      maxlength: 'Le titre ne doit pas dépasser 100 caractères.',
    },
    type: { required: 'Le type de pollution est requis.' },
    description: { required: 'La description est requise.' },
    observationDate: {
      required: 'La date est requise.',
      invalidDate: 'La date est invalide.',
      futureDate: 'La date ne peut pas être dans le futur.',
    },
    location: { required: 'Le lieu est requis.' },
    latitude: {
      required: 'La latitude est requise (nombre valide).',
      min: 'La latitude doit être comprise entre -90 et 90.',
      max: 'La latitude doit être comprise entre -90 et 90.',
    },
    longitude: {
      required: 'La longitude est requise (nombre valide).',
      min: 'La longitude doit être comprise entre -180 et 180.',
      max: 'La longitude doit être comprise entre -180 et 180.',
    },
    photoUrl: { pattern: "L'URL doit commencer par http:// ou https://." },
  };

  /** Retourne le message d'erreur à afficher, ou null */
  errorMessage(name: ControlName): string | null {
    const control = this.form.controls[name];
    if (!control.invalid || !(control.touched || control.dirty)) return null;
    const firstError = Object.keys(control.errors ?? {})[0];
    return this.messages[name][firstError] ?? 'Valeur invalide.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.declared.emit({
      title: value.title.trim(),
      type: value.type as Pollution['type'],
      description: value.description.trim(),
      observationDate: value.observationDate,
      location: value.location.trim(),
      latitude: value.latitude!,
      longitude: value.longitude!,
      photoUrl: value.photoUrl.trim() || null,
    });
  }
}