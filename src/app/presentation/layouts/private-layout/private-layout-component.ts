import { Component } from '@angular/core';
import {Navbar} from '../../shared/components/navbar/navbar';
import {RouterOutlet} from '@angular/router';
import {Footer} from '../../shared/components/footer/footer';

@Component({
  selector: 'app-private-layout-component',
  imports: [
    Navbar,
    RouterOutlet,
    Footer
  ],
  templateUrl: './private-layout-component.html',
  styleUrl: './private-layout-component.css',
})
export class PrivateLayoutComponent {

}
