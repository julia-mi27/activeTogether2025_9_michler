import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { Store } from './store';
import { Course } from './Interfaces/Course';
import { RegistrationDto, RegistrationModel } from './Interfaces/Registration';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private http = inject(HttpClient);
  private store = inject(Store);

  private readonly api = 'http://localhost:5000';
  readonly loading = signal(false);
  private activeRequests = 0;

  private beginRequest(): void {
    this.activeRequests++;
    this.loading.set(true);
  }

  private endRequest(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.loading.set(this.activeRequests > 0);
  }

  private registrationsUrl(): string {
    return `${this.api}/registrations?_expand=course`;
  }

  public getCourses(): void {
    this.beginRequest();
    this.http
      .get<Course[]>(`${this.api}/courses?_expand=eventLocation`)
      .pipe(
        tap((data) => {
          this.store.courses = data;
        }),
        finalize(() => this.endRequest()),
      )
      .subscribe();
  }

  public getRegistrations(silent = false): void {
    if (!silent) {
      this.beginRequest();
    }
    this.http
      .get<RegistrationDto[]>(this.registrationsUrl())
      .pipe(
        tap((data) => {
          this.store.registrations = data;
        }),
        finalize(() => {
          if (!silent) {
            this.endRequest();
          }
        }),
      )
      .subscribe();
  }

  public addRegistration(registration: RegistrationModel): Observable<RegistrationDto[]> {
    this.beginRequest();
    return this.http.post<RegistrationDto>(`${this.api}/registrations`, registration).pipe(
      switchMap(() => this.http.get<RegistrationDto[]>(this.registrationsUrl())),
      tap((data) => {
        this.store.registrations = data;
      }),
      finalize(() => this.endRequest()),
    );
  }

  public deleteRegistration(id: string | number): Observable<RegistrationDto[]> {
    return this.http.delete<void>(`${this.api}/registrations/${id}`).pipe(
      switchMap(() => this.http.get<RegistrationDto[]>(this.registrationsUrl())),
      tap((data) => {
        this.store.registrations = data;
      }),
    );
  }
}
