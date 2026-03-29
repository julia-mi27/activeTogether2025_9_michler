import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';
import { RegistrationModel } from '../../shared/Interfaces/Registration';

function endOfToday(): Date {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-data.html',
  styleUrl: './add-data.scss',
})
export class AddData {
  public store = inject(Store);
  private backend = inject(Backend);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  readonly submitting = signal(false);
  readonly minBirthDate = new Date(1900, 0, 1);
  readonly maxBirthDate = endOfToday();

  signupForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    birthdate: [null as Date | null, [Validators.required]],
    courseId: ['', [Validators.required]],
    newsletter: [false],
  });

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    if (!payload) {
      return;
    }

    this.submitting.set(true);
    this.backend
      .addRegistration(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Anmeldung wurde gespeichert.', 'Schließen', {
            duration: 5000,
          });
          this.signupForm.reset({
            name: '',
            birthdate: null,
            courseId: '',
            newsletter: false,
          });
        },
      });
  }

  private buildPayload(): RegistrationModel | null {
    const value = this.signupForm.getRawValue();
    const birthdate = value.birthdate;
    const name = (value.name ?? '').trim();
    const courseId = value.courseId ?? '';

    if (!birthdate || !name || !courseId) {
      return null;
    }

    return {
      name,
      birthdate: this.toIsoDate(birthdate),
      courseId,
      newsletter: Boolean(value.newsletter),
    };
  }

  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
