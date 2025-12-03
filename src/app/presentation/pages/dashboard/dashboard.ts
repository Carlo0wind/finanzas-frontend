import {Component, inject, OnInit, signal} from '@angular/core';
import {DashboardCard} from '../../shared/components/dashboard-card/dashboard-card';
import {HousingService} from '../../../services/housing-service';
import {CreditSimulationService} from '../../../services/credit-simulation-service';
import {ClientManagamentService} from '../../../services/client-managament-service';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {MatIcon} from '@angular/material/icon';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  route: string;
  linkText: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: string;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardCard,
    MatIcon
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private clientService = inject(ClientManagamentService);
  private housingService = inject(HousingService);
  private creditSimService = inject(CreditSimulationService);

  // Signals
  isLoadingStats = signal(true);
  stats = signal<StatCard[]>([]);

  cards: DashboardCardProps[] = [
    {
      title: 'Registrar Clientes',
      description: 'Gestiona la información de tus clientes, incluyendo datos personales, ingresos y estado laboral.',
      icon: 'people',
      iconBg: '#BE65C4',
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
      title: 'Ver Entidades Financieras',
      description: 'Accede y consulta el directorio completo de las entidades autorizadas para el financiamiento del Crédito MiVivienda',
      icon: 'account_balance',
      iconBg: '#DE3B40',
      route: '/private/entidades-financieras',
      linkText: 'Ver Lista'
    },
    {
      title: 'Iniciar Simulación',
      description: 'Crea simulaciones de crédito personalizadas con diferentes entidades financieras y parámetros.',
      icon: 'calculate',
      iconBg: '#1DD75B',
      route: '/private/credit-simulation',
      linkText: 'Comenzar'
    }
  ];

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      this.isLoadingStats.set(false);
      return;
    }

    forkJoin({
      clients: this.clientService.getAllClientsByCompany(+companyId),
      housings: this.housingService.getAllHousingsByCompany(+companyId),
      simulations: this.creditSimService.getAllCreditApplicationsByCompany(+companyId)
    }).subscribe({
      next: ({clients, housings, simulations}) => {
        // Calcular simulaciones aprobadas
        const approvedSimulations = simulations.filter(s => s.financeEntityApproved).length;
        const approvalRate = simulations.length > 0
          ? Math.round((approvedSimulations / simulations.length) * 100)
          : 0;

        this.stats.set([
          {
            title: 'Clientes Registrados',
            value: clients.length,
            icon: 'people',
            iconBg: '#BE65C4'
          },
          {
            title: 'Ofertas Disponibles',
            value: housings.length,
            icon: 'house',
            iconBg: '#007bff'
          },
          {
            title: 'Simulaciones Realizadas',
            value: simulations.length,
            icon: 'calculate',
            iconBg: '#1DD75B'
          },
        ]);

        this.isLoadingStats.set(false);
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
        this.isLoadingStats.set(false);
      }
    });
  }

  navigateToGuide(): void {
    this.router.navigate(['/private/guia-usuario']);
  }
}
