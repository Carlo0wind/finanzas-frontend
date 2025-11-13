import { Routes } from '@angular/router';
import {PublicLayoutComponent} from './presentation/layouts/public-layout/public-layout-component';
import {Login} from './presentation/pages/auth/login/login';
import {Register} from './presentation/pages/auth/register/register';
import {PrivateLayoutComponent} from './presentation/layouts/private-layout/private-layout-component';
import {Dashboard} from './presentation/pages/dashboard/dashboard';

export const routes: Routes = [
  //RUTAS PUBLICAS
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
    ]}
  ,
  { path: 'register', component: Register},
  //RUTAS PRIVADAS //las rutas de los hijos son para probar, se harán cambios
  {
    path: 'private',  component: PrivateLayoutComponent,
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'clientes', component: Dashboard},
      {path: 'ofertas', component: Dashboard},
      {path: 'entidades-financieras', component: Dashboard},
      {path: 'simulador', component: Dashboard},
      {path: 'profile/edit', component: Dashboard}
    ]
  }
];
