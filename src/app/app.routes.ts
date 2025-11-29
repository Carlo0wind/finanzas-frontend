import { Routes } from '@angular/router';
import {PublicLayoutComponent} from './presentation/layouts/public-layout/public-layout-component';
import {Login} from './presentation/pages/auth/login/login';
import {Register} from './presentation/pages/auth/register/register';
import {PrivateLayoutComponent} from './presentation/layouts/private-layout/private-layout-component';
import {Dashboard} from './presentation/pages/dashboard/dashboard';
import {ProfileEdit} from './presentation/pages/auth/profile-edit/profile-edit';
import {ClientManagement} from './presentation/pages/client-management/client-management';
import {Housing} from './presentation/pages/housing/housing';
import {FinanceEntities} from './presentation/pages/finance-entities/finance-entities';
import {
  CreditSimulationManagement
} from './presentation/pages/creditSimulation/credit-simulation-management/credit-simulation-management';
import {
  CreditSimulationProfile
} from './presentation/pages/creditSimulation/credit-simulation-profile/credit-simulation-profile';

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
      {path: 'clientes', component: ClientManagement},
      {path: 'ofertas', component: Housing},
      {path: 'entidades-financieras', component: FinanceEntities},
      {path: 'profile/edit', component: ProfileEdit},
      {
        path: 'simulador',
        children: [
          { path: '', redirectTo: 'gestion', pathMatch: 'full' },
          { path: 'gestion', component: CreditSimulationManagement },     // Lista
          { path: 'nueva', component: CreditSimulationProfile },             // Formulario paso a paso
          { path: 'perfil/:id', component: CreditSimulationProfile },     // Ver detalle + cronograma
          { path: 'editar/:id', component: CreditSimulationProfile }         // Editar simulación (opcional)
        ]
      }
    ]
  }
];
