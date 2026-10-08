import { Component, Input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Pollution } from '../../models/pollution';

@Component({
  selector: 'app-pollution-recap',
  imports: [DatePipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.scss',
})
export class PollutionRecap {
  @Input({ required: true }) pollution!: Pollution;

  readonly newDeclaration = output<void>();

  readonly imageLoading = signal(true);
  readonly imageFailed = signal(false);

  onImageLoad(): void {
    this.imageLoading.set(false);
  }

  onImageError(): void {
    this.imageLoading.set(false);
    this.imageFailed.set(true);
  }
}