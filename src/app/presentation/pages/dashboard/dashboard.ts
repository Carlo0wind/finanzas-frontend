import { Component } from '@angular/core';
import {DashboardCard} from '../../shared/components/dashboard-card/dashboard-card';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  route: string;
  linkText: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardCard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cards: DashboardCardProps[] = [
    {
      title: 'Registrar Clientes',
      description: 'Gestiona la información de tus clientes, incluyendo datos personales, ingresos y estado laboral.',
      icon: 'people',
      iconBg: '#BE65C4FF',
      route: '/private/clientes',
      linkText: 'Comenzar'
    },
    {
      title: 'Registrar Ofertas',
      description: 'Administra las propiedades disponibles con detalles completos de ubicación, precio y características.',
      icon: 'house',
      iconBg: '#007bff',
      route: '/private/ofertas',
      linkText: 'Comenzar'
    },
    {
      title: 'Ver Entidades Financieras Autorizadas',
      description: 'Accede y consulta el directorio completo de las entidades autorizadas para el financiamiento del Crédito MiVivienda',
      icon: 'account_balance',
      iconBg: '#DE3B40FF',
      route: '/private/entidades-financieras',
      linkText: 'Ver Lista'
    },
    {
      title: 'Iniciar Simulación',
      description: 'Crea simulaciones de crédito personalizadas con diferentes entidades financieras y parámetros.',
      icon: 'calculate',
      iconBg: '#1DD75BFF',
      route: '/private/simulador',
      linkText: 'Comenzar'
    }
  ]
}
