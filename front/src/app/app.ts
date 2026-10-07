import { Component, signal } from '@angular/core';
import { RegisterFormComponent } from './register-form/register-form';

@Component({
  selector: 'app-root',
  imports: [RegisterFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('exercice');
}
