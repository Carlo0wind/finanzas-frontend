// src/app/credit-simulation/model/creditApplication.model.ts

// ==================== ENUMS ====================

export enum BonusType {
  VIVIENDA_TRADICIONAL = 'VIVIENDA_TRADICIONAL',
  VIVIENDA_SOSTENIBLE = 'VIVIENDA_SOSTENIBLE',
  INTEGRADOR_TRADICIONAL = 'INTEGRADOR_TRADICIONAL',
  INTEGRADOR_SOSTENIBLE = 'INTEGRADOR_SOSTENIBLE',
  NULL = 'NULL'
}

export enum GracePeriodType {
  TOTAL = 'TOTAL',
  PARCIAL = 'PARCIAL',
  NULL = 'NULL'
}

export enum InterestRateType {
  NOMINAL = 'NOMINAL',
  EFECTIVA = 'EFECTIVA'
}

export enum Period {
  DIARIA = 'DIARIA',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
  BIMESTRAL = 'BIMESTRAL',
  TRIMESTRAL = 'TRIMESTRAL',
  CUATRIMESTRAL = 'CUATRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
  NULL = 'NULL'
}

// ==================== LABELS ====================

export const BonusTypeLabels: Record<BonusType, string> = {
  [BonusType.VIVIENDA_TRADICIONAL]: 'Vivienda Tradicional',
  [BonusType.VIVIENDA_SOSTENIBLE]: 'Vivienda Sostenible',
  [BonusType.INTEGRADOR_TRADICIONAL]: 'Integrador Tradicional',
  [BonusType.INTEGRADOR_SOSTENIBLE]: 'Integrador Sostenible',
  [BonusType.NULL]: 'Sin Bono'
};

export const GracePeriodTypeLabels: Record<GracePeriodType, string> = {
  [GracePeriodType.TOTAL]: 'Gracia Total',
  [GracePeriodType.PARCIAL]: 'Gracia Parcial',
  [GracePeriodType.NULL]: 'Sin Gracia'
};

export const InterestRateTypeLabels: Record<InterestRateType, string> = {
  [InterestRateType.NOMINAL]: 'Nominal',
  [InterestRateType.EFECTIVA]: 'Efectiva'
};

export const PeriodLabels: Record<Period, string> = {
  [Period.DIARIA]: 'Diaria',
  [Period.QUINCENAL]: 'Quincenal',
  [Period.MENSUAL]: 'Mensual',
  [Period.BIMESTRAL]: 'Bimestral',
  [Period.TRIMESTRAL]: 'Trimestral',
  [Period.CUATRIMESTRAL]: 'Cuatrimestral',
  [Period.SEMESTRAL]: 'Semestral',
  [Period.ANUAL]: 'Anual',
  [Period.NULL]: 'N/A'
};

// ==================== SUB-INTERFACES ====================

export interface InterestRate {
  id?: number;
  type: InterestRateType;
  period: Period;
  percentage: number;
  nominalCapitalization: Period;
  tem: number;
}

export interface GracePeriod {
  id?: number;
  type: GracePeriodType;
  months: number;
}

export interface InitialCosts {
  notaryCost: number;
  registryCost: number;
  appraisal: number;
  studyCommission: number;
  activationCommission: number;
  professionalFeesCost: number;
  documentationFee: number;
}

export interface PeriodicCosts {
  periodicCommission: number;
  shippingCosts: number;
  administrationExpenses: number;
  lifeInsurance: number;
  riskInsurance: number;
  monthlyStatementDelivery: number;
}

export interface Bonus {
  id?: number;
  isApplied: boolean;
  givenAmount: number;
  bonusType: BonusType;
}

export interface RentIndicators {
  cok: number;
  tir: number;
  tcea: number;
  van: number;
}

export interface Totals {
  totalInterest: number;
  totalCapitalAmortization: number;
  totaLifeInsurance: number;  // ⚠️ TYPO del backend (mantener)
  totalRiskInsurance: number;
  totalPeriodicCommission: number;
  totalAdministrationFees: number;
}

export interface Payment {
  id?: number;
  paymentDate: string;
  orderNumber: number;
  tem: number;
  gracePeriodType: GracePeriodType;
  initialBalance: number;
  interest: number;
  fee: number;
  amortization: number;
  periodicCosts: PeriodicCosts;
  finalBalance: number;
  cashFlow: number;
}

// ==================== MAIN INTERFACE (GET RESPONSE) ====================

export interface CreditApplication {
  id: number;
  realStateCompanyId: number;
  startDate: string;
  clientId: number;
  housingId: number;
  currencyId: number;
  financeEntityId: number;
  financeEntityApproved: boolean;
  financeEntityReason: string;
  interestRate: InterestRate;
  cok: InterestRate;
  gracePeriod: GracePeriod;
  initialCosts: InitialCosts;
  periodicCosts: PeriodicCosts;
  downPaymentPercentage: number;
  financing: number;
  monthsPaymentTerm: number;
  totals: Totals;
  rentIndicators: RentIndicators;
  bonus: Bonus;
  payments: Payment[];
}

// ==================== REQUEST INTERFACES ====================

export interface CreateCreditApplicationRequest {
  realStateCompanyId: number;
  startDate: string;
  clientId: number;
  housingId: number;
  currencyId: number;
  financialEntityId: number;
  interestRateType: string;
  interestRatePeriod: string;
  interestRatePercentage: number;
  interestRateNominalCapitalization: string;
  cokType: string;
  cokPeriod: string;
  cokPercentage: number;
  cokNominalCapitalization: string;
  isBonusRequired: boolean;
  gracePeriodType: string;
  gracePeriodMonths: number;
  notaryCost: number;
  registryCost: number;
  appraisal: number;
  studyCommission: number;
  activationCommission: number;
  professionalFeesCost: number;
  documentationFee: number;
  periodicCommission: number;
  shippingCosts: number;
  administrationExpenses: number;
  lifeInsurance: number;
  riskInsurance: number;
  monthlyStatementDelivery: number;
  yearsPaymentTerm: number;
  downPaymentPercentage: number;
  hasCreditHistory: boolean;
}

export interface UpdateCreditApplicationRequest {
  startDate: string;
  clientId: number;
  housingId: number;
  currencyId: number;
  financialEntityId: number;
  interestRateType: string;
  interestRatePeriod: string;
  interestRatePercentage: number;
  interestRateNominalCapitalization: string;
  cokType: string;
  cokPeriod: string;
  cokPercentage: number;
  cokNominalCapitalization: string;
  isBonusRequired: boolean;
  gracePeriodType: string;
  gracePeriodMonths: number;
  notaryCost: number;
  registryCost: number;
  appraisal: number;
  studyCommission: number;
  activationCommission: number;
  professionalFeesCost: number;
  documentationFee: number;
  periodicCommission: number;
  shippingCosts: number;
  administrationExpenses: number;
  lifeInsurance: number;
  riskInsurance: number;
  monthlyStatementDelivery: number;
  yearsPaymentTerm: number;
  downPaymentPercentage: number;
  hasCreditHistory: boolean;
}

// ==================== HELPER CLASS ====================

export class CreditApplicationHelper {
  /**
   * Calcula el total de costos iniciales
   */
  static getTotalInitialCosts(costs: InitialCosts): number {
    return (
      costs.notaryCost +
      costs.registryCost +
      costs.appraisal +
      costs.studyCommission +
      costs.activationCommission +
      costs.professionalFeesCost +
      costs.documentationFee
    );
  }

  /**
   * Calcula el total de costos periódicos (sin seguros)
   */
  static getTotalPeriodicCosts(costs: PeriodicCosts): number {
    return (
      costs.periodicCommission +
      costs.shippingCosts +
      costs.administrationExpenses +
      costs.monthlyStatementDelivery
    );
  }

  /**
   * Formatea un número como moneda
   */
  static formatCurrency(value: number, currencySymbol: string = 'S/ '): string {
    return `${currencySymbol}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  /**
   * Formatea un porcentaje
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Obtiene el color del estado de aprobación
   */
  static getApprovalStatusColor(approved: boolean): string {
    return approved ? 'success' : 'danger';
  }

  /**
   * Obtiene el ícono del estado de aprobación
   */
  static getApprovalStatusIcon(approved: boolean): string {
    return approved ? 'check_circle' : 'cancel';
  }

  /**
   * Calcula la cuota inicial en monto
   */
  static calculateDownPaymentAmount(
    salePrice: number,
    downPaymentPercentage: number
  ): number {
    return (salePrice * downPaymentPercentage) / 100;
  }

  /**
   * Verifica si hay período de gracia activo en un pago
   */
  static hasGracePeriod(payment: Payment): boolean {
    return payment.gracePeriodType !== GracePeriodType.NULL;
  }

  /**
   * Obtiene el label del tipo de gracia de un pago
   */
  static getGracePeriodLabel(gracePeriodType: GracePeriodType): string {
    return GracePeriodTypeLabels[gracePeriodType] || 'N/A';
  }

  /**
   * Calcula el total a pagar (financiamiento + intereses + costos)
   */
  static calculateTotalToPay(creditApp: CreditApplication): number {
    return (
      creditApp.financing +
      creditApp.totals.totalInterest +
      creditApp.totals.totaLifeInsurance +
      creditApp.totals.totalRiskInsurance +
      creditApp.totals.totalPeriodicCommission +
      creditApp.totals.totalAdministrationFees
    );
  }

  /**
   * Obtiene el color según el valor del VAN
   */
  static getVanColor(van: number): string {
    if (van > 0) return 'success';
    if (van < 0) return 'danger';
    return 'warning';
  }

  /**
   * Obtiene descripción del VAN
   */
  static getVanDescription(van: number): string {
    if (van > 0) return 'Proyecto rentable';
    if (van < 0) return 'Proyecto no rentable';
    return 'Punto de equilibrio';
  }
}

export interface CreditApplicationListItem extends CreditApplication {
  clientName?: string;
  financeEntityName?: string;
  housingTitle?: string;
  bonusTypeLabel?: string;
}
