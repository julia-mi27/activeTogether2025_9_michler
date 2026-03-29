import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Backend } from './shared/backend';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly backend = inject(Backend);
}
