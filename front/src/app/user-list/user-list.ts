import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private readonly service = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.service
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.users.set(list),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }
}
