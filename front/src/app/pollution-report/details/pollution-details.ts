import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Pollution } from '../../models/pollution';
import { PollutionService } from '../../services/pollution';
import { PollutionPhoto } from '../photo/pollution-photo';

@Component({
  selector: 'app-pollution-details',
  imports: [DatePipe, RouterLink, PollutionPhoto],
  templateUrl: './pollution-details.html',
  styleUrl: './pollution-details.scss',
})
export class PollutionDetails implements OnInit {
  private readonly service = inject(PollutionService);
  private readonly router = inject(Router);

  /** Paramètre de route :id (grâce à withComponentInputBinding) */
  readonly id = input.required<string>();

  readonly pollution = signal<Pollution | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.service
      .getById(Number(this.id()))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (p) => this.pollution.set(p),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }

  remove(pollution: Pollution): void {
    if (!confirm(`Supprimer « ${pollution.title} » ?`)) return;

    this.service.delete(pollution.id).subscribe({
      next: () => this.router.navigate(['/pollutions']),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }
}
