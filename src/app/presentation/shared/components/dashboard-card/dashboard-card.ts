import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-card',
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
  @Input() iconBg!: string;
  @Input() route!: string;
  @Input() linkText: string = 'Comenzar';
}
