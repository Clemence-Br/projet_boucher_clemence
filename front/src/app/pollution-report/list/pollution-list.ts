import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { POLLUTION_TYPES, Pollution } from '../../models/pollution';
import { PollutionService } from '../../services/pollution';

@Component({
  selector: 'app-pollution-list',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.scss',
})
export class PollutionList implements OnInit {
  private readonly service = inject(PollutionService);

  readonly pollutionTypes = POLLUTION_TYPES;

  // ===== États =====
  readonly pollutions = signal<Pollution[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  // ===== Filtres =====
  readonly filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    type: new FormControl('', { nonNullable: true }),
    dateFrom: new FormControl('', { nonNullable: true }),
    dateTo: new FormControl('', { nonNullable: true }),
  });

  private readonly filterValues = toSignal(this.filters.valueChanges, {
    initialValue: this.filters.getRawValue(),
  });

  readonly hasActiveFilters = computed(() => {
    const f = this.filterValues();
    return !!(f.search || f.type || f.dateFrom || f.dateTo);
  });

  /** Liste filtrée, triée de la plus récente à la plus ancienne */
  readonly filtered = computed(() => {
    const { search = '', type = '', dateFrom = '', dateTo = '' } = this.filterValues();
    const term = search.trim().toLowerCase();

    return this.pollutions()
      .filter(
        (p) =>
          (!term ||
            p.title.toLowerCase().includes(term) ||
            p.location.toLowerCase().includes(term)) &&
          (!type || p.type === type) &&
          (!dateFrom || p.observationDate >= dateFrom) && // dates ISO : comparables en texte
          (!dateTo || p.observationDate <= dateTo),
      )
      .sort((a, b) => b.observationDate.localeCompare(a.observationDate));
  });

  // ===== Actions =====
  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.service
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.pollutions.set(list),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }

  remove(pollution: Pollution): void {
    if (!confirm(`Supprimer « ${pollution.title} » ?`)) return;

    this.service.delete(pollution.id).subscribe({
      next: () => this.pollutions.update((list) => list.filter((p) => p.id !== pollution.id)),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }
}
