import { Component, signal } from '@angular/core';
import { PollutionForm } from './form/pollution-form';
import { PollutionRecap } from './recap/pollution-recap';
import { Pollution } from '../models/pollution';

@Component({
  selector: 'app-pollution-page',
  imports: [PollutionForm, PollutionRecap],
  template: `
    @if (declaration(); as pollution) {
      <app-pollution-recap [pollution]="pollution" (newDeclaration)="declaration.set(null)" />
    } @else {
      <app-pollution-form (declared)="declaration.set($event)" />
    }
  `,
})
export class PollutionPage {
  readonly declaration = signal<Pollution | null>(null);
}