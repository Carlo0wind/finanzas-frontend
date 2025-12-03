import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CreditSimulationService} from '../../../../services/credit-simulation-service';
import {ClientManagamentService} from '../../../../services/client-managament-service';
import {HousingService} from '../../../../services/housing-service';
import {FinanceEntityService} from '../../../../services/finance-entity-service';
import {CurrencyService} from '../../../../services/currency-service';
import {CreditApplication, Payment, PeriodicCosts} from '../../../../model/creditApplication.model';
import {ClientResponse} from '../../../../model/clientManagement.model';
import {HousingResponse} from '../../../../model/housing.model';
import {FinanceEntity} from '../../../../model/financeEntity.model';
import {CurrencyResource} from '../../../../model/currency.model';
import {forkJoin} from 'rxjs';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-credit-simulation-profile-details',
  imports: [
    MatIcon,
  ],
  templateUrl: './credit-simulation-profile-details.html',
  styleUrl: './credit-simulation-profile-details.css',
})
export class CreditSimulationProfileDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private creditSimService = inject(CreditSimulationService);
  private clientService = inject(ClientManagamentService);
  private housingService = inject(HousingService);
  private financeEntityService = inject(FinanceEntityService);

  // ==================== SIGNALS ====================
  creditApplication = signal<CreditApplication | null>(null);
  client = signal<ClientResponse | null>(null);
  housing = signal<HousingResponse | null>(null);
  financeEntity = signal<FinanceEntity | null>(null);
  isLoading = signal(true);

  // ==================== COMPUTED - NOMBRES REALES ====================
  clientName = computed(() => {
    const c = this.client();
    return c ? `${c.firstname} ${c.lastname}` : 'Cargando...';
  });

  housingInfo = computed(() => {
    const h = this.housing();
    return h ? `${h.title} - ${h.district}, ${h.province}` : 'Cargando...';
  });

  financeEntityName = computed(() => {
    const f = this.financeEntity();
    return f ? f.name : 'Cargando...';
  });

  currencySymbol = computed(() => {
    const app = this.creditApplication();
    return app?.currencyId === 1 ? 'S/' : '$';
  });

  // ==================== COMPUTED - CÁLCULOS ====================
  totalInitialCosts = computed(() => {
    const app = this.creditApplication();
    if (!app) return 0;
    const costs = app.initialCosts;
    return (
      costs.notaryCost +
      costs.registryCost +
      costs.appraisal +
      costs.studyCommission +
      costs.activationCommission +
      costs.professionalFeesCost +
      costs.documentationFee
    );
  });

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

  monthlyFee = computed(() => {
    const app = this.creditApplication();
    if (!app?.payments || app.payments.length === 0) return 0;

    const firstNormalPayment = app.payments.find((p: { gracePeriodType: string; }) => p.gracePeriodType === 'NULL');
    return firstNormalPayment
      ? Math.abs(firstNormalPayment.fee)
      : Math.abs(app.payments[0].fee);
  });

  // ==================== COLUMNAS VISIBLES ====================
  displayedColumns: string[] = [
    'paymentDate',
    'orderNumber',
    'tem',
    'gracePeriodType',
    'initialBalance',
    'interest',
    'fee',
    'amortization',
    'periodicCommission',
    'shippingCosts',
    'administrationExpenses',
    'lifeInsurance',
    'riskInsurance',
    'monthlyStatementDelivery',
    'finalBalance',
    'cashFlow'
  ];

  columnLabels: Record<string, string> = {
    paymentDate: 'FECHA',
    orderNumber: 'N°',
    tem: 'TEM',
    gracePeriodType: 'GRACIA',
    initialBalance: 'SALDO INICIAL',
    interest: 'INTERÉS',
    fee: 'CUOTA',
    amortization: 'AMORTIZACIÓN',
    periodicCommission: 'COM. PERIÓDICA',
    shippingCosts: 'PORTES',
    administrationExpenses: 'GASTOS ADM.',
    lifeInsurance: 'SEG. DESGRAVAMEN',
    riskInsurance: 'SEG. RIESGO',
    monthlyStatementDelivery: 'ENVÍO ESTADO',
    finalBalance: 'SALDO FINAL',
    cashFlow: 'FLUJO'
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadCreditApplicationWithDetails(id);
      } else {
        this.snackBar.open('ID de simulación no válido', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/private/credit-simulation']);
      }
    });
  }

  loadCreditApplicationWithDetails(id: number): void {
    this.isLoading.set(true);

    this.creditSimService.getCreditApplicationById(id).subscribe({
      next: (app) => {
        this.creditApplication.set(app);

        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
          this.isLoading.set(false);
          return;
        }

        // Cargar datos relacionados
        forkJoin({
          client: this.clientService.getClientById(app.clientId),
          housing: this.housingService.getHousingById(app.housingId),
          financeEntity: this.financeEntityService.getFinanceEntityById(app.financeEntityId)
        }).subscribe({
          next: ({client, housing, financeEntity}) => {
            this.client.set(client);
            this.housing.set(housing);
            this.financeEntity.set(financeEntity);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error cargando datos relacionados:', error);
            this.isLoading.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error cargando simulación:', error);
        this.snackBar.open('Error al cargar la simulación', 'Cerrar', {
          duration: 3000
        });
        this.isLoading.set(false);
        this.router.navigate(['/private/credit-simulation']);
      }
    });
  }

  // ==================== FORMATTERS ====================
  formatCurrency(value: number): string {
    return Math.abs(value).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatPercentage(value: number): string {
    return (value * 100).toFixed(2);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // ==================== HELPERS PARA TABLA ====================
  getGracePeriodClass(type: string): string {
    switch (type) {
      case 'TOTAL':
        return 'grace-total';
      case 'PARCIAL':
        return 'grace-partial';
      default:
        return '';
    }
  }

  getGracePeriodText(type: string): string {
    switch (type) {
      case 'TOTAL':
        return 'Total';
      case 'PARCIAL':
        return 'Parcial';
      case 'NULL':
        return '-';
      default:
        return type;
    }
  }

  getVanClass(): string {
    const app = this.creditApplication();
    if (!app) return 'indicator-card';
    if (app.rentIndicators.van < 0) {
      return 'indicator-card indicator-negative';
    } else if (app.rentIndicators.van === 0) {
      return 'indicator-card indicator-neutral';
    } else {
      return 'indicator-card indicator-positive';
    }
  }

  shouldShowDetails = computed(() => {
    const app = this.creditApplication();
    if (!app) return false;

    // Ocultar si la razón es "otro financiamiento vigente"
    const blockedReason = 'No se permite tener otro financiamiento de vivienda vigente.';
    return app.financeEntityReason !== blockedReason;
  });

  isNegative(value: number): boolean {
    return value < 0;
  }

  getPeriodicCostValue(payment: Payment, costType: keyof PeriodicCosts): number {
    return payment.periodicCosts[costType];
  }

  clientQualifies = computed(() => {
    const app = this.creditApplication();
    if (!app) return false;

    if (app.rentIndicators.van < 0) return false;

    if (app.rentIndicators.van === 0) {
      return app.financeEntityApproved;
    }

    if (!app.financeEntityApproved) return false;

    return true;
  });

  qualificationMessage = computed(() => {
    const app = this.creditApplication();
    if (!app) return '';

    if (app.rentIndicators.van < 0) {
      return 'El crédito no es rentable para el cliente';
    }

    if (app.rentIndicators.van === 0) {
      if (app.financeEntityApproved) {
        return 'El crédito no genera ni quita rentabilidad. La decisión está en el cliente.';
      } else {
        return app.financeEntityReason;
      }
    }

    if (app.rentIndicators.van >= 0 && !app.financeEntityApproved) {
      return app.financeEntityReason;
    }

    return 'Cumple con todos los requisitos';
  });


  // ==================== COMPUTED - CONTROL DE VISUALIZACIÓN ====================

  shouldShowResults = computed(() => {
    const app = this.creditApplication();
    if (!app) return false;

    // Ocultar resultados si la razón está en la lista de bloqueos
    return !this.BLOCKED_REASONS.includes(app.financeEntityReason);
  });

  shouldShowInputData = computed(() => {
    return true; // Siempre mostrar datos que ingresó el cliente
  });

  getBlockedMessage = computed(() => {
    const app = this.creditApplication();
    if (!app) return '';

    const reason = app.financeEntityReason;

    // Mensajes personalizados según la razón
    const messages: Record<string, string> = {
      'El precio de la vivienda es menor al mínimo permitido.':
        'El precio de la vivienda no cumple con el mínimo establecido por la entidad financiera.',
      'El precio de la vivienda supera el máximo permitido.':
        'El precio de la vivienda excede el máximo permitido por la entidad financiera.',
      'El monto de financiamiento es menor al mínimo permitido.':
        'El monto solicitado es inferior al mínimo que la entidad puede financiar.',
      'El monto de financiamiento supera el máximo permitido.':
        'El monto solicitado excede el máximo que la entidad puede financiar.',
      'El monto de financiamiento excede el porcentaje máximo del valor de la vivienda.':
        'El porcentaje de financiamiento solicitado supera el límite establecido sobre el valor de la vivienda.',
      'El salario es menor al mínimo requerido.':
        'Los ingresos del cliente no alcanzan el mínimo requerido por la entidad financiera.',
      'La cuota inicial es menor al porcentaje mínimo permitido.':
        'La cuota inicial debe ser mayor para cumplir con los requisitos de la entidad.',
      'La cuota inicial supera el porcentaje máximo permitido.':
        'La cuota inicial excede el porcentaje máximo establecido.',
      'El periodo de gracia excede el máximo permitido para viviendas en proyecto.':
        'El período de gracia solicitado supera el límite para viviendas en proyecto.',
      'El periodo de gracia excede el máximo permitido para viviendas en general.':
        'El período de gracia solicitado supera el límite establecido.',
      'Los años de trabajo dependiente son menores al mínimo requerido.':
        'Se requiere mayor antigüedad laboral como trabajador dependiente.',
      'Los años de trabajo independiente son menores al mínimo requerido.':
        'Se requiere mayor antigüedad laboral como trabajador independiente.',
      'Se requiere historial crediticio.':
        'La entidad financiera requiere que el cliente cuente con historial crediticio.',
      'No se permite financiar vivienda usada.':
        'La entidad financiera solo financia viviendas nuevas.',
      'No se permite tener otro financiamiento de vivienda vigente.':
        'El cliente ya cuenta con un financiamiento de vivienda vigente. Para obtener un nuevo crédito hipotecario, debe liquidar su financiamiento actual.'
    };

    return messages[reason] || reason;
  });

  getBlockedIcon = computed(() => {
    const app = this.creditApplication();
    if (!app) return 'block';

    const reason = app.financeEntityReason;

    const icons: Record<string, string> = {
      'El precio de la vivienda es menor al mínimo permitido.': 'home',
      'El precio de la vivienda supera el máximo permitido.': 'home',
      'El monto de financiamiento es menor al mínimo permitido.': 'attach_money',
      'El monto de financiamiento supera el máximo permitido.': 'attach_money',
      'El monto de financiamiento excede el porcentaje máximo del valor de la vivienda.': 'percent',
      'El salario es menor al mínimo requerido.': 'payments',
      'La cuota inicial es menor al porcentaje mínimo permitido.': 'savings',
      'La cuota inicial supera el porcentaje máximo permitido.': 'savings',
      'El periodo de gracia excede el máximo permitido para viviendas en proyecto.': 'schedule',
      'El periodo de gracia excede el máximo permitido para viviendas en general.': 'schedule',
      'Los años de trabajo dependiente son menores al mínimo requerido.': 'work',
      'Los años de trabajo independiente son menores al mínimo requerido.': 'work',
      'Se requiere historial crediticio.': 'history',
      'No se permite financiar vivienda usada.': 'new_releases',
      'No se permite tener otro financiamiento de vivienda vigente.': 'block'
    };

    return icons[reason] || 'block';
  });

  formatBonusType(type: string): string {
    const bonusLabels: Record<string, string> = {
      'VIVIENDA_TRADICIONAL': 'Vivienda Tradicional',
      'VIVIENDA_SOSTENIBLE': 'Vivienda Sostenible',
      'INTEGRADOR_TRADICIONAL': 'Integrador Tradicional',
      'INTEGRADOR_SOSTENIBLE': 'Integrador Sostenible',
      'NULL': 'Sin Bono'
    };
    return bonusLabels[type] || type;
  }

  formatVAN(value: number): string {
    const absValue = Math.abs(value);
    const formatted = absValue.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return value < 0 ? `-${formatted}` : formatted;
  }

  // ==================== ACTIONS ====================
  goBack(): void {
    this.router.navigate(['/private/credit-simulation']);
  }

  editSimulation(): void {
    const app = this.creditApplication();
    if (app) {
      this.router.navigate(['/private/credit-simulation/edit', app.id]);
    }
  }

  deleteSimulation(): void {
    const app = this.creditApplication();
    if (!app) return;

    const confirmed = confirm(
      `¿Estás seguro de eliminar esta simulación?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      this.creditSimService.deleteCreditApplication(app.id).subscribe({
        next: () => {
          this.snackBar.open('✅ Simulación eliminada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/private/credit-simulation']);
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.snackBar.open('❌ Error al eliminar la simulación', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
