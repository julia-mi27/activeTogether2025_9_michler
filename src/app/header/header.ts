import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public title: string = 'ActiveTogether';
  public tagline: string = 'Kurse · Anmeldungen · Überblick';
  public imagePath: string = 'assets/images/active-together-mark.svg';
}
