import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';

@Component({
  selector: 'app-data',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './data.html',
  styleUrl: './data.scss',
})
export class Data {
  readonly store = inject(Store);
  private readonly backend = inject(Backend);

  readonly searchTerm = signal('');
  readonly deletingId = signal<string | number | null>(null);

  readonly filteredRegistrations = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) {
      return this.store.registrations;
    }

    return this.store.registrations.filter((registration) => {
      const searchText =
        `${registration.name} ${registration.birthdate} ${registration.course?.name ?? ''}`.toLowerCase();
      return searchText.includes(query);
    });
  });

  readonly resultCount = computed(() => this.filteredRegistrations().length);

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }

  deleteRegistration(id: string | number): void {
    this.deletingId.set(id);
    this.backend
      .deleteRegistration(id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe();
  }
}
