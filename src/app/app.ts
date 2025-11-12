import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Login} from './presentation/pages/auth/login/login';
import {PublicLayoutComponent} from './presentation/layouts/public-layout/public-layout-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Hominy');
}
