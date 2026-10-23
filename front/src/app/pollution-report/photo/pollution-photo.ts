import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-pollution-photo',
  templateUrl: './pollution-photo.html',
  styleUrl: './pollution-photo.scss',
})
export class PollutionPhoto {
  @Input({ required: true }) src!: string;
  @Input() alt = '';

  readonly loading = signal(true);
  readonly failed = signal(false);

  onLoad(): void {
    this.loading.set(false);
  }

  onError(): void {
    this.loading.set(false);
    this.failed.set(true);
  }
}
