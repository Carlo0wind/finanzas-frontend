import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import { ClientManagamentService } from "../../../../services/client-managament-service";
import {FinanceEntityService} from '../../../../services/finance-entity-service';
import {CreditSimulationService} from '../../../../services/credit-simulation-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {
  BonusTypeLabels,
  CreditApplication,
  CreditApplicationListItem,
} from '../../../../model/creditApplication.model';
import {HousingService} from '../../../../services/housing-service';

@Component({
  selector: 'app-credit-simulation-management',
  imports: [
    FormsModule,
    MatIcon,

  ],
  templateUrl: './credit-simulation-management.html',
  styleUrl: './credit-simulation-management.css',
})
export class CreditSimulationManagement {
  private creditSimulationService = inject(CreditSimulationService);
  private clientService = inject(ClientManagamentService);
  private financeEntityService = inject(FinanceEntityService);
  private housingService = inject(HousingService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  creditApplications = signal<CreditApplicationListItem[]>([]);
  searchTerm = '';
  isLoading = signal(true);

  // Filtro de simulaciones
  filteredSimulations = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.creditApplications();
    }

    return this.creditApplications().filter(simulation =>
      simulation.clientName?.toLowerCase().includes(term) ||
      simulation.financeEntityName?.toLowerCase().includes(term) ||
      simulation.housingTitle?.toLowerCase().includes(term) ||
      simulation.bonusTypeLabel?.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadCreditApplications();
  }

  loadCreditApplications(): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      this.snackBar.open('No se encontró información de la empresa', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.creditSimulationService.getAllCreditApplicationsByCompany(+companyId).subscribe({
      next: (applications) => {
        this.enrichApplicationsData(applications);
      },
      error: (error) => {
        console.error('Error al cargar simulaciones:', error);
        this.isLoading.set(false);
        this.snackBar.open('Error al cargar las simulaciones', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  enrichApplicationsData(applications: CreditApplication[]): void {
    if (applications.length === 0) {
      this.creditApplications.set([]);
      this.isLoading.set(false);
      return;
    }

    const companyId = localStorage.getItem('companyId');
    if (!companyId) return;

    forkJoin({
      clients: this.clientService.getAllClientsByCompany(+companyId),
      financeEntities: this.financeEntityService.getAllFinanceEntities(),
      housings: this.housingService.getAllHousingsByCompany(+companyId)
    }).subscribe({
      next: ({ clients, financeEntities, housings }) => {
        const enrichedApplications: CreditApplicationListItem[] = applications.map(app => {
          const client = clients.find(c => c.id === app.clientId);
          const financeEntity = financeEntities.find(f => f.id === app.financeEntityId);
          const housing = housings.find(h => h.id === app.housingId);
          return {
            ...app,
            clientName: client ? `${client.firstname} ${client.lastname}` : 'Cliente no encontrado',
            financeEntityName: financeEntity?.name || 'Banco no encontrado',
            housingTitle: housing?.title || 'Oferta no encontrada',
            bonusTypeLabel: BonusTypeLabels[app.bonus.bonusType] || 'Sin Bono'
          };
        });

        this.creditApplications.set(enrichedApplications);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al enriquecer datos:', error);
        this.isLoading.set(false);
      }
    });
  }

  openNewSimulation(): void {
    this.router.navigate(['/private/credit-simulation/new']);
  }

  editSimulation(simulationId: number): void {
    this.router.navigate(['/private/credit-simulation/edit', simulationId]);
  }

  viewSimulationDetails(simulationId: number): void {
    this.router.navigate(['/private/credit-simulation/details', simulationId]);
  }

  confirmDelete(simulation: CreditApplicationListItem): void {
    const confirmed = confirm(
      `¿Estás seguro de que deseas eliminar la simulación de ${simulation.clientName}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      this.deleteSimulation(simulation.id);
    }
  }

  deleteSimulation(simulationId: number): void {
    this.creditSimulationService.deleteCreditApplication(simulationId).subscribe({
      next: () => {
        this.creditApplications.update(apps =>
          apps.filter(a => a.id !== simulationId)
        );
        this.snackBar.open('✅ Simulación eliminada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al eliminar simulación:', error);
        this.snackBar.open('❌ Error al eliminar la simulación', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  private readonly BLOCKED_REASONS = [
    'El precio de la vivienda es menor al mínimo permitido.',
    'El precio de la vivienda supera el máximo permitido.',
    'El monto de financiamiento es menor al mínimo permitido.',
    'El monto de financiamiento supera el máximo permitido.',
    'El monto de financiamiento excede el porcentaje máximo del valor de la vivienda.',
    'El salario es menor al mínimo requerido.',
    'La cuota inicial es menor al porcentaje mínimo permitido.',
    'La cuota inicial supera el porcentaje máximo permitido.',
    'El periodo de gracia excede el máximo permitido para viviendas en proyecto.',
    'El periodo de gracia excede el máximo permitido para viviendas en general.',
    'Los años de trabajo dependiente son menores al mínimo requerido.',
    'Los años de trabajo independiente son menores al mínimo requerido.',
    'Se requiere historial crediticio.',
    'No se permite financiar vivienda usada.',
    'No se permite tener otro financiamiento de vivienda vigente.'
  ];
  private isBlockedReason(reason: string): boolean {
    return this.BLOCKED_REASONS.includes(reason);
  }

  getApprovalStatus(simulation: CreditApplicationListItem): string {
    if (this.isBlockedReason(simulation.financeEntityReason)) {
      return 'Rechazado';
    }

    if (simulation.rentIndicators.van < 0) {
      return 'Rechazado';
    }

    if (simulation.rentIndicators.van === 0) {
      return 'Decisión del Cliente';
    }

    return 'Aprobado';
  }

  getApprovalClass(simulation: CreditApplicationListItem): string {
    if (this.isBlockedReason(simulation.financeEntityReason)) {
      return 'status-rejected';
    }

    if (simulation.rentIndicators.van < 0) {
      return 'status-rejected';
    }

    if (simulation.rentIndicators.van === 0) {
      return 'status-neutral';
    }

    return 'status-approved';
  }


  getBonusBadgeClass(bonusType: string): string {
    if (bonusType === 'Sin Bono') return 'bonus-none';
    if (bonusType.includes('SOSTENIBLE')) return 'bonus-sustainable';
    return 'bonus-traditional';
  }
}
