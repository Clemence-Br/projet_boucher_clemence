import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Pollution, PollutionData } from '../../models/pollution';
import { PollutionService } from '../../services/pollution';
import { PollutionForm } from '../form/pollution-form';

@Component({
  selector: 'app-pollution-form-page',
  imports: [RouterLink, PollutionForm],
  templateUrl: './pollution-form-page.html',
})
export class PollutionFormPage implements OnInit {
  private readonly service = inject(PollutionService);
  private readonly router = inject(Router);

  /** Présent sur /pollutions/:id/edit, absent sur /pollutions/new */
  readonly id = input<string>();
  readonly isEdit = computed(() => this.id() !== undefined);

  readonly pollution = signal<Pollution | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) return; // création : rien à charger

    this.loading.set(true);
    this.service
      .getById(Number(id))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (p) => this.pollution.set(p),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }

  onSubmit(data: PollutionData): void {
    this.saving.set(true);
    this.errorMessage.set(null);

    const id = this.id();
    const request$ =
      id !== undefined ? this.service.update(Number(id), data) : this.service.create(data);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (saved) => this.router.navigate(['/pollutions', saved.id]),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }
}
