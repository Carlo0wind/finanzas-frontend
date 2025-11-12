import { Component } from '@angular/core';
import {Login} from '../../pages/auth/login/login';
import {Register} from '../../pages/auth/register/register';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-public-layout-component',
  imports: [
    Login,
  ],
  templateUrl: './public-layout-component.html',
  styleUrl: './public-layout-component.css',
})
export class PublicLayoutComponent {

}
