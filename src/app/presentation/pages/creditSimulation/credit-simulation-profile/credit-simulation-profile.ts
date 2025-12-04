import {Component, computed, effect, inject, signal} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {CreditSimulationService} from '../../../../services/credit-simulation-service';
import {ClientManagamentService} from '../../../../services/client-managament-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HousingService} from '../../../../services/housing-service';
import {FinanceEntityService} from '../../../../services/finance-entity-service';
import {ClientResponse} from '../../../../model/clientManagement.model';
import {HousingResponse} from '../../../../model/housing.model';
import {EvaluateFinanceEntityRequest, FinanceEntity} from '../../../../model/financeEntity.model';
import {
  CreateCreditApplicationRequest, CreditApplication, GracePeriodType,
  InterestRateType, Period,
  UpdateCreditApplicationRequest
} from '../../../../model/creditApplication.model';
import {forkJoin} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {CurrencyService} from '../../../../services/currency-service';
import {CurrencyResource} from '../../../../model/currency.model';
import {
  FinanceEntityCardComponent
} from '../../../shared/components/finance-entity-card-component/finance-entity-card-component';
import {FINANCE_ENTITY_COSTS} from '../../../../model/finance-entity-costs.config';
import {MatDialog} from '@angular/material/dialog';
import {
  FinanceEntityModalDetails
} from '../../../shared/components/finance-entity-modal-details/finance-entity-modal-details';

@Component({
  selector: 'app-credit-simulation-profile',
  imports: [
    FormsModule,
    MatIcon,
    FinanceEntityCardComponent
  ],
  templateUrl: './credit-simulation-profile.html',
  styleUrl: './credit-simulation-profile.css',
})
export class CreditSimulationProfile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private creditSimService = inject(CreditSimulationService);
  private clientService = inject(ClientManagamentService);
  private housingService = inject(HousingService);
  private financeEntityService = inject(FinanceEntityService);
  private currencyService = inject(CurrencyService);
  private dialog = inject(MatDialog);

  // ==================== MODE & LOADING ====================
  isEditMode = signal(false);
  creditApplicationId = signal<number | null>(null);
  isLoading = signal(true);
  isSimulating = signal(false);

  // ==================== DATA SOURCES ====================
  clients = signal<ClientResponse[]>([]);
  allHousings = signal<HousingResponse[]>([]);
  allFinanceEntities = signal<FinanceEntity[]>([]);
  currencies = signal<CurrencyResource[]>([]);

  // ==================== FORM MODEL ====================
  formData = signal<CreateCreditApplicationRequest>({
    realStateCompanyId: 0,
    startDate: new Date().toISOString().split('T')[0],
    clientId: 0,
    housingId: 0,
    currencyId: 1,
    financialEntityId: 0,
    interestRateType: 'EFECTIVA',
    interestRatePeriod: 'ANUAL',
    interestRatePercentage: 0,
    interestRateNominalCapitalization: 'NULL',
    cokType: 'EFECTIVA',
    cokPeriod: 'ANUAL',
    cokPercentage: 0,
    cokNominalCapitalization: 'NULL',
    isBonusRequired: false,
    gracePeriodType: 'NULL',
    gracePeriodMonths: 0,
    notaryCost: 0,
    registryCost: 0,
    appraisal: 0,
    studyCommission: 0,
    activationCommission: 0,
    professionalFeesCost: 0,
    documentationFee: 0,
    periodicCommission: 0,
    shippingCosts: 0,
    administrationExpenses: 0,
    lifeInsurance: 0.0,
    riskInsurance: 0.0,
    monthlyStatementDelivery: 0,
    yearsPaymentTerm: 0,
    downPaymentPercentage: 0,
    hasCreditHistory: false
  });

  // ==================== HOUSING PAGINATION & SEARCH ====================
  housingSearchTerm = signal('');
  housingCurrentPage = signal(0);
  housingPageSize = 6;

  filteredHousings = computed(() => {
    const term = this.housingSearchTerm().toLowerCase().trim();
    const housings = this.allHousings();
    if (!term) return housings;
    return housings.filter(h =>
      h.title.toLowerCase().includes(term) ||
      h.province.toLowerCase().includes(term) ||
      h.district.toLowerCase().includes(term)
    );
  });

  paginatedHousings = computed(() => {
    const filtered = this.filteredHousings();
    const start = this.housingCurrentPage() * this.housingPageSize;
    return filtered.slice(start, start + this.housingPageSize);
  });

  totalHousingPages = computed(() =>
    Math.ceil(this.filteredHousings().length / this.housingPageSize)
  );

  // ==================== FINANCE ENTITY PAGINATION & SEARCH ====================
  financeSearchTerm = signal('');
  financeCurrentPage = signal(0);
  financePageSize = 6;
  financeCurrentTypeIndex = signal(0);

  filteredFinanceEntities = computed(() => {
    const term = this.financeSearchTerm().toLowerCase().trim();
    const entities = this.allFinanceEntities();
    if (!term) return entities;
    return entities.filter(e => e.name.toLowerCase().includes(term));
  });

  currentFinanceGroup = computed(() => {
    const groups = this.groupedFinanceEntities();
    const index = this.financeCurrentTypeIndex();
    return groups[index] || null;
  });

  totalFinanceTypePages = computed(() => this.groupedFinanceEntities().length);

  nextFinanceTypePage(): void {
    const total = this.totalFinanceTypePages();
    if (this.financeCurrentTypeIndex() < total - 1) {
      this.financeCurrentTypeIndex.update(i => i + 1);
    }
  }

  previousFinanceTypePage(): void {
    if (this.financeCurrentTypeIndex() > 0) {
      this.financeCurrentTypeIndex.update(i => i - 1);
    }
  }

  paginatedFinanceEntities = computed(() => {
    const filtered = this.filteredFinanceEntities();
    const start = this.financeCurrentPage() * this.financePageSize;
    return filtered.slice(start, start + this.financePageSize);
  });

  totalFinancePages = computed(() =>
    Math.ceil(this.filteredFinanceEntities().length / this.financePageSize)
  );

  // ==================== EVALUATION RESULT ====================
  evaluationResult = signal<{ accepted: boolean; reason: string } | null>(null);

  // ==================== ENUMS ====================
  interestRateTypes: InterestRateType[] = [InterestRateType.NOMINAL, InterestRateType.EFECTIVA];
  periods: Period[] = [
    Period.DIARIA,
    Period.QUINCENAL,
    Period.MENSUAL,
    Period.BIMESTRAL,
    Period.TRIMESTRAL,
    Period.CUATRIMESTRAL,
    Period.SEMESTRAL,
    Period.ANUAL
  ];
  gracePeriodTypes: GracePeriodType[] = [GracePeriodType.NULL, GracePeriodType.TOTAL, GracePeriodType.PARCIAL];

  gracePeriodTypeLabels: Record<GracePeriodType, string> = {
    [GracePeriodType.NULL]: 'Sin Período de Gracia',
    [GracePeriodType.PARCIAL]: 'Parcial',
    [GracePeriodType.TOTAL]: 'Total'
  };
  // ==================== COMPUTED SELECTIONS ====================
  selectedClient = computed(() => {
    const id = this.formData().clientId;
    return this.clients().find(c => c.id === id);
  });

  selectedHousing = computed(() => {
    const id = this.formData().housingId;
    return this.allHousings().find(h => h.id === id);
  });

  selectedFinanceEntity = computed(() => {
    const id = this.formData().financialEntityId;
    return this.allFinanceEntities().find(f => f.id === id);
  });

  selectedCurrency = computed(() => {
    const id = this.formData().currencyId;
    return this.currencies().find(c => c.id === id);
  });

  selectedCurrencySymbol = computed(() => {
    const currency = this.selectedCurrency();
    if (!currency) return 'S/ ';

    // Mapeo de nombres/códigos a símbolos
    const symbolMap: Record<string, string> = {
      'SOLES': 'S/ ',
      'DOLARES': '$ ',
      'DOLLARS': '$ ',
      'PEN': 'S/ ',
      'USD': '$ ',
      'S/': 'S/ ',
      '$': '$ '
    };

    return symbolMap[currency.symbol] || symbolMap[currency.name] || currency.symbol + ' ';
  });

  showInterestCapitalization = computed(() =>
    this.formData().interestRateType === 'NOMINAL'
  );

  showCokCapitalization = computed(() =>
    this.formData().cokType === 'NOMINAL'
  );

  isFormValid = computed(() => {
    const form = this.formData();
    return (
      form.clientId > 0 &&
      form.housingId > 0 &&
      form.financialEntityId > 0 &&
      form.yearsPaymentTerm > 0 &&
      form.downPaymentPercentage > 0 &&
      form.downPaymentPercentage < 100 &&
      form.interestRatePercentage > 0 &&
      form.cokPercentage > 0
    );
  });

  isGracePeriodMonthsDisabled = computed(() =>
    this.formData().gracePeriodType === 'NULL'
  );

  onGracePeriodTypeChange(value: GracePeriodType): void {
    this.formData.update(f => ({
      ...f,
      gracePeriodType: value,
      gracePeriodMonths: value === 'NULL' ? 0 : f.gracePeriodMonths
    }));

    this.triggerEvaluationIfReady();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.creditApplicationId.set(+id);
      }
      this.loadInitialData();
    });

    effect(() => {
      this.financeSearchTerm();
      this.financeCurrentTypeIndex.set(0);
    });
  }

  loadInitialData(): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      this.snackBar.open('No se encontró información de la empresa', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/private/credit-simulation']);
      return;
    }

    this.formData.update(f => ({ ...f, realStateCompanyId: +companyId }));
    this.isLoading.set(true);

    forkJoin({
      clients: this.clientService.getAllClientsByCompany(+companyId),
      housings: this.housingService.getAllHousingsByCompany(+companyId),
      financeEntities: this.financeEntityService.getAllFinanceEntities(),
      currencies: this.currencyService.getAllCurrencies()
    }).subscribe({
      next: ({ clients, housings, financeEntities, currencies }) => {
        this.clients.set(clients);
        this.allHousings.set(housings);
        this.allFinanceEntities.set(financeEntities);
        this.currencies.set(currencies);

        if (this.isEditMode() && this.creditApplicationId()) {
          this.loadExistingApplication(this.creditApplicationId()!);
        } else {
          this.isLoading.set(false);
        }
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.isLoading.set(false);
        this.snackBar.open('Error al cargar los datos iniciales', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  loadExistingApplication(id: number): void {
    this.creditSimService.getCreditApplicationById(id).subscribe({
      next: (app) => {
        this.populateFormFromApplication(app);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando aplicación:', error);
        this.snackBar.open('Error al cargar la simulación', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/private/credit-simulation']);
      }
    });
  }

  // ==================== PERCENTAGE HELPERS ====================

  private percentageToDecimal(percentage: number): number {
    return percentage / 100;
  }


  private decimalToPercentage(decimal: number): number {
    return decimal * 100;
  }

  populateFormFromApplication(app: CreditApplication): void {
    this.formData.set({
      realStateCompanyId: app.realStateCompanyId,
      startDate: app.startDate,
      clientId: app.clientId,
      housingId: app.housingId,
      currencyId: app.currencyId,
      financialEntityId: app.financeEntityId,
      interestRateType: app.interestRate.type,
      interestRatePeriod: app.interestRate.period,
      interestRatePercentage: app.interestRate.percentage * 100,
      interestRateNominalCapitalization: app.interestRate.nominalCapitalization,
      cokType: app.cok.type,
      cokPeriod: app.cok.period,
      cokPercentage: app.cok.percentage * 100,
      cokNominalCapitalization: app.cok.nominalCapitalization,
      isBonusRequired: app.bonus.isApplied,
      gracePeriodType: app.gracePeriod.type,
      gracePeriodMonths: app.gracePeriod.months,
      notaryCost: app.initialCosts.notaryCost,
      registryCost: app.initialCosts.registryCost,
      appraisal: app.initialCosts.appraisal,
      studyCommission: app.initialCosts.studyCommission,
      activationCommission: app.initialCosts.activationCommission,
      professionalFeesCost: app.initialCosts.professionalFeesCost,
      documentationFee: app.initialCosts.documentationFee,
      periodicCommission: app.periodicCosts.periodicCommission,
      shippingCosts: app.periodicCosts.shippingCosts,
      administrationExpenses: app.periodicCosts.administrationExpenses,
      lifeInsurance: app.periodicCosts.lifeInsurance,
      riskInsurance: app.periodicCosts.riskInsurance,
      monthlyStatementDelivery: app.periodicCosts.monthlyStatementDelivery,
      yearsPaymentTerm: app.monthsPaymentTerm / 12,
      downPaymentPercentage: app.downPaymentPercentage,
      hasCreditHistory: true
    });

    this.evaluationResult.set({
      accepted: app.financeEntityApproved,
      reason: app.financeEntityReason
    });
  }

  // ==================== SELECTION HANDLERS ====================
  selectHousing(housingId: number): void {
    this.formData.update(f => ({ ...f, housingId }));

    // Re-evaluar si ya hay entidad seleccionada
    this.triggerEvaluationIfReady();
  }

  async selectFinanceEntity(entityId: number): Promise<void> {
    this.formData.update(f => ({ ...f, financialEntityId: entityId }));

    this.loadEntityCostsFromConfig(entityId);

    this.triggerEvaluationIfReady();

    setTimeout(() => {
      const parametersSection = document.querySelector('.form-section:nth-child(4)');
      if (parametersSection) {
        parametersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }


  // ✅ NUEVO: Cargar costos desde FINANCE_ENTITY_COSTS config
  private loadEntityCostsFromConfig(entityId: number): void {
    const entityCosts = FINANCE_ENTITY_COSTS[entityId];

    if (!entityCosts) {
      console.warn(`No se encontraron costos configurados para la entidad ${entityId}`);
      return;
    }

    this.formData.update(f => ({
      ...f,
      monthlyStatementDelivery: entityCosts.defaultCosts.monthlyStatementDelivery ?? 0
    }));

    const message = entityCosts.defaultCosts.monthlyStatementDelivery === null
      ? '⚠️ Ingresa el costo de envío de estado mensual manualmente'
      : '✅ Costos de la entidad cargados';

    this.snackBar.open(message, 'Cerrar', {
      duration: 2500
    });
  }

  onDownPaymentChange(value: number): void {
    this.formData.update(f => ({ ...f, downPaymentPercentage: value }));
    this.triggerEvaluationIfReady();
  }

  onYearsPaymentTermChange(value: number): void {
    this.formData.update(f => ({ ...f, yearsPaymentTerm: value }));
    this.triggerEvaluationIfReady();
  }

  onGracePeriodMonthsChange(value: number): void {
    this.formData.update(f => ({ ...f, gracePeriodMonths: value }));
    this.triggerEvaluationIfReady();
  }

  // ✅ NUEVO: Método centralizado para evaluar cuando esté listo
  private triggerEvaluationIfReady(): void {
    const form = this.formData();
    if (
      form.clientId > 0 &&
      form.housingId > 0 &&
      form.financialEntityId > 0 &&
      form.downPaymentPercentage > 0 &&
      form.yearsPaymentTerm > 0
    ) {
      this.evaluateClientWithEntity();
    }
  }

  async evaluateClientWithEntity(): Promise<void> {
    const form = this.formData();
    if (!form.clientId || !form.housingId || !form.financialEntityId) {
      return;
    }

    const client = this.selectedClient();
    const housing = this.selectedHousing();

    if (!client || !housing) return;

    const evaluationData: EvaluateFinanceEntityRequest = {
      clientId: form.clientId,
      housingId: form.housingId,
      requestedAmount: housing.salePrice * (1 - form.downPaymentPercentage / 100),
      downPaymentPercentage: form.downPaymentPercentage,
      monthPaymentTerm: form.yearsPaymentTerm * 12,
      gracePeriodMonths: form.gracePeriodMonths,
      hasAnotherHousingFinancing: false,
      hasCreditHistory: form.hasCreditHistory
    };

    this.financeEntityService.evaluateFinanceEntity(form.financialEntityId, evaluationData)
      .subscribe({
        next: (result) => {
          this.evaluationResult.set(result);
          if (!result.accepted) {
            this.snackBar.open(`⚠️ ${result.reason}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['warning-snackbar']
            });
          } else {
            this.snackBar.open('✅ Cliente califica con esta entidad', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error en evaluación:', error);
        }
      });
  }

  // ==================== PAGINATION ====================
  nextHousingPage(): void {
    if (this.housingCurrentPage() < this.totalHousingPages() - 1) {
      this.housingCurrentPage.update(p => p + 1);
    }
  }

  previousHousingPage(): void {
    if (this.housingCurrentPage() > 0) {
      this.housingCurrentPage.update(p => p - 1);
    }
  }

  nextFinancePage(): void {
    if (this.financeCurrentPage() < this.totalFinancePages() - 1) {
      this.financeCurrentPage.update(p => p + 1);
    }
  }

  previousFinancePage(): void {
    if (this.financeCurrentPage() > 0) {
      this.financeCurrentPage.update(p => p - 1);
    }
  }

  // ==================== SIMULATE ====================
  simulate(): void {
    if (!this.isFormValid()) {
      this.snackBar.open('⚠️ Completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Verificar evaluación
    const evaluation = this.evaluationResult();
    if (evaluation && !evaluation.accepted) {
      const confirmSimulate = confirm(
        `⚠️ El cliente NO califica con esta entidad financiera.\n\n` +
        `Razón: ${evaluation.reason}\n\n` +
        `¿Deseas continuar de todas formas?`
      );
      if (!confirmSimulate) {
        return;
      }
    }

    this.isSimulating.set(true);
    const formData = this.formData();

    const requestData: CreateCreditApplicationRequest = {
      ...formData,
      interestRatePercentage: formData.interestRatePercentage,
      cokPercentage: formData.cokPercentage,
      lifeInsurance: formData.lifeInsurance,
      riskInsurance: formData.riskInsurance
    };

    const isEditing = this.isEditMode() && this.creditApplicationId() !== null;

    if (isEditing) {
      this.creditSimService.updateCreditApplication(
        this.creditApplicationId()!,
        this.convertToUpdateRequest(requestData)
      ).subscribe({
        next: (result: CreditApplication) => {
          this.handleSimulationSuccess(result.id, true);
        },
        error: (error) => {
          this.handleSimulationError(error, true);
        }
      });
    } else {
      this.creditSimService.createCreditApplication(requestData).subscribe({
        next: (id: number) => {
          this.handleSimulationSuccess(id, false);
        },
        error: (error) => {
          this.handleSimulationError(error, false);
        }
      });
    }
  }

  private handleSimulationSuccess(creditApplicationId: number, isEditing: boolean): void {
    this.isSimulating.set(false);

    const action = isEditing ? 'actualizada' : 'creada';

    this.snackBar.open(`✅ Simulación ${action} exitosamente`, 'Cerrar', {
      duration: 3000
    });

    // Redirigir a la página de detalles usando el ID
    this.router.navigate(['/private/credit-simulation/details', creditApplicationId]);
  }

  private handleSimulationError(error: any, isEditing: boolean): void {
    console.error('❌ Error al procesar simulación:', error);
    this.isSimulating.set(false);

    const errorMessage = error.error?.message ||
      (isEditing ? 'Error al actualizar la simulación' : 'Error al crear la simulación');

    this.snackBar.open(`❌ ${errorMessage}`, 'Cerrar', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }


  private convertToUpdateRequest(
    createRequest: CreateCreditApplicationRequest
  ): UpdateCreditApplicationRequest {
    const { realStateCompanyId, ...updateData } = createRequest;
    return updateData as UpdateCreditApplicationRequest;
  }

  cancel(): void {
    const hasChanges = this.formData().clientId > 0 ||
      this.formData().housingId > 0 ||
      this.formData().financialEntityId > 0;

    if (hasChanges) {
      if (confirm('¿Cancelar? Los cambios no guardados se perderán.')) {
        this.router.navigate(['/private/credit-simulation']);
      }
    } else {
      this.router.navigate(['/private/credit-simulation']);
    }
  }

  private getCurrencySymbol(currency: CurrencyResource | undefined): string {
    if (!currency) return 'S/ ';
    const symbolMap: Record<string, string> = {
      'SOLES': 'S/ ',
      'soles': 'S/ ',
      'Soles': 'S/ ',
      'DOLARES': '$ ',
      'DOLLARS': '$ ',
      'Dólares': '$ ',
      'dollars': '$ ',
      'PEN': 'S/ ',
      'USD': '$ ',
      'S/ ': 'S/ ',
      '$ ': '$ '
    };
    return symbolMap[currency.symbol] || symbolMap[currency.name] || currency.symbol + ' ';
  }

  clientCurrencySymbol = computed(() => {
    const client = this.selectedClient();
    if (!client) return 'S/ ';
    const currency = this.currencies().find(c => c.id === client.currencyId);
    return this.getCurrencySymbol(currency);
  });

  housingCurrencySymbol = computed(() => {
    const housing = this.selectedHousing();
    if (!housing) return 'S/ ';

    const currency = this.currencies().find(c => c.id === housing.currencyId);
    return this.getCurrencySymbol(currency);
  });

  formatClientCurrency(value: number): string {
    const client = this.selectedClient();
    const symbol = client?.currencySymbol || 'S/ ';
    return `${symbol}${value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  formatHousingCurrency(value: number): string {
    const housing = this.selectedHousing();
    const symbol = housing?.currencySymbol || 'S/ ';

    return `${symbol}${value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  formatNumber(value: number): string {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  formatCurrency(value: number): string {
    const symbol = this.selectedCurrencySymbol();
    return `${symbol}${value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  updateFormField(field: keyof CreateCreditApplicationRequest, value: any): void {
    this.formData.update(f => ({ ...f, [field]: value }));
  }

  onInterestRateTypeChange(value: string): void {
    this.formData.update(f => ({
      ...f,
      interestRateType: value,
      interestRateNominalCapitalization: value === 'EFECTIVA' ? 'NULL' : f.interestRateNominalCapitalization
    }));
  }

  getCurrencyDisplayName(currency: CurrencyResource): string {
    const translations: { [key: string]: string } = {
      'Dollars': 'Dólares',
      'dollars': 'Dólares',
      'Soles': 'Soles',
      'soles': 'Soles'
    };
    return translations[currency.name] || currency.name;
  }
  onCokTypeChange(value: string): void {
    this.formData.update(f => ({
      ...f,
      cokType: value,
      cokNominalCapitalization: value === 'EFECTIVA' ? 'NULL' : f.cokNominalCapitalization
    }));
  }

  groupedFinanceEntities = computed(() => {
    const filtered = this.filteredFinanceEntities();

    return [
      {
        type: 'BANCA_MULTIPLE',
        label: 'Banca Múltiple',
        entities: filtered.filter(e => e.type === 'BANCA_MULTIPLE')
      },
      {
        type: 'CMAC',
        label: 'Cajas Municipales (CMAC)',
        entities: filtered.filter(e => e.type === 'CMAC')
      },
      {
        type: 'FINANCIERA',
        label: 'Financieras',
        entities: filtered.filter(e => e.type === 'FINANCIERA')
      },
      {
        type: 'EMPRESA_DE_CREDITO',
        label: 'Empresas de Crédito',
        entities: filtered.filter(e => e.type === 'EMPRESA_DE_CREDITO')
      }
    ].filter(g => g.entities.length > 0);
  });

  openEntityDetails(entityId: number): void {
    const entity = this.allFinanceEntities().find(e => e.id === entityId);

    if (!entity) {
      this.snackBar.open('⚠️ No se encontró la entidad financiera', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(FinanceEntityModalDetails, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        entity: entity,
        selectable: true
      },
      panelClass: 'finance-entity-modal',
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.selected && result?.entityId) {
        this.selectFinanceEntity(result.entityId);

        this.snackBar.open('✅ Entidad financiera seleccionada', 'Cerrar', {
          duration: 2500
        });
      }
    });
  }


}
