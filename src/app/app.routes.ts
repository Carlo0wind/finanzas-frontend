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
import {
  CreditSimulationProfileDetails
} from './presentation/pages/creditSimulation/credit-simulation-profile-details/credit-simulation-profile-details';
import {UserGuideComponent} from './presentation/pages/user-guide-component/user-guide-component';

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
      { path: 'guia-usuario', component: UserGuideComponent },
      {path: 'clientes', component: ClientManagement},
      {path: 'ofertas', component: Housing},
      {path: 'entidades-financieras', component: FinanceEntities},
      {path: 'profile/edit', component: ProfileEdit},
      { path: 'credit-simulation', component: CreditSimulationManagement },
      { path: 'credit-simulation/new', component: CreditSimulationProfile },
      { path: 'credit-simulation/edit/:id', component: CreditSimulationProfile },
      { path: 'credit-simulation/details/:id', component: CreditSimulationProfileDetails }
    ]
  }
];
