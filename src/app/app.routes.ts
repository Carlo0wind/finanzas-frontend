import { Routes } from '@angular/router';
import {PublicLayoutComponent} from './presentation/layouts/public-layout/public-layout-component';
import {Login} from './presentation/pages/auth/login/login';
import {Register} from './presentation/pages/auth/register/register';
import {PrivateLayoutComponent} from './presentation/layouts/private-layout/private-layout-component';
import {Dashboard} from './presentation/pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
    ]
  },
  {path: 'register', component: Register},
  {path: 'dashboard', component: Dashboard}
];
