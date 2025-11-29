// // models/enums/bonus-type.enum.ts
// export enum BonusType {
//   VIVIENDA_TRADICIONAL = 'VIVIENDA_TRADICIONAL',
//   VIVIENDA_SOSTENIBLE = 'VIVIENDA_SOSTENIBLE',
//   INTEGRADOR_TRADICIONAL = 'INTEGRADOR_TRADICIONAL',
//   INTEGRADOR_SOSTENIBLE = 'INTEGRADOR_SOSTENIBLE',
//   NULL = 'NULL'
// }
//
// // models/enums/grace-period-type.enum.ts
// export enum GracePeriodType {
//   TOTAL = 'TOTAL',
//   PARCIAL = 'PARCIAL',
//   NULL = 'NULL'
// }
//
// // models/enums/interest-rate-type.enum.ts
// export enum InterestRateType {
//   NOMINAL = 'NOMINAL',
//   EFECTIVA = 'EFECTIVA'
// }
//
// // models/enums/period.enum.ts
// export enum Period {
//   DIARIA = 'DIARIA',
//   QUINCENAL = 'QUINCENAL',
//   MENSUAL = 'MENSUAL',
//   BIMESTRAL = 'BIMESTRAL',
//   TRIMESTRAL = 'TRIMESTRAL',
//   CUATRIMESTRAL = 'CUATRIMESTRAL',
//   SEMESTRAL = 'SEMESTRAL',
//   ANUAL = 'ANUAL',
//   NULL = 'NULL'
// }
//
// export interface BonusResource {
//   id: number;
//   isApplied: boolean;
//   givenAmount: number;
//   bonusType: BonusType | string;
// }
//
// export interface GracePeriodResource {
//   id: number;
//   type: GracePeriodType | string;
//   months: number;
// }
//
// export interface InterestRateResource {
//   id: number;
//   type: InterestRateType | string;
//   period: Period | string;
//   percentage: number;
//   nominalCapitalization: Period | string;
//   tem: number;
// }
//
// export interface InitialCostsResource {
//   notaryCost: number;
//   registryCost: number;
//   appraisal: number;
//   studyCommission: number;
//   activationCommission: number;
//   professionalFeesCost: number;
//   documentationFee: number;
// }
//
// export interface PeriodicCostsResource {
//   periodicCommission: number;
//   shippingCosts: number;
//   administrationExpenses: number;
//   lifeInsurance: number;
//   riskInsurance: number;
//   monthlyStatementDelivery: number;
// }
//
// export interface RentIndicatorsResource {
//   cok: number;
//   tir: number;
//   tcea: number;
//   van: number;
// }
//
// export interface TotalsResource {
//   totalInterest: number;
//   totalCapitalAmortization: number;
//   totaLifeInsurance: number;
//   totalRiskInsurance: number;
//   totalPeriodicCommission: number;
//   totalAdministrationFees: number;
// }
//
// export interface PaymentResource {
//   id: number;
//   paymentDate: string;
//   orderNumber: number;
//   tem: number;
//   gracePeriodType: GracePeriodType | string;
//   initialBalance: number;
//   interest: number;
//   fee: number;
//   amortization: number;
//   periodicCosts: PeriodicCostsResource;
//   finalBalance: number;
//   cashFlow: number;
// }
//
// export interface CreditApplicationFullResource {
//   id: number;
//   realStateCompanyId: number;
//   startDate: string;
//   clientId: number;
//   housingId: number;
//   currencyId: number;
//   financeEntityId: number;
//   financeEntityApproved: boolean;
//   financeEntityReason?: string;
//   interestRate: InterestRateResource;
//   cok: InterestRateResource;
//   gracePeriod: GracePeriodResource;
//   initialCosts: InitialCostsResource;
//   periodicCosts: PeriodicCostsResource;
//   downPaymentPercentage: number;
//   financing: number;
//   monthsPaymentTerm: number;
//   totals: TotalsResource;
//   rentIndicators: RentIndicatorsResource;
//   bonus: BonusResource;
//   payments: PaymentResource[];
// }
//
// export interface CreateCreditApplicationResource {
//   realStateCompanyId: number;
//   startDate: string;
//   clientId: number;
//   housingId: number;
//   currencyId: number;
//   financialEntityId: number;
//   interestRateType: string;
//   interestRatePeriod: string;
//   interestRatePercentage: number;
//   interestRateNominalCapitalization: string;
//   cokType: string;
//   cokPeriod: string;
//   cokPercentage: number;
//   cokNominalCapitalization: string;
//   isBonusRequired: boolean;
//   gracePeriodType: string;
//   gracePeriodMonths: number;
//   notaryCost: number;
//   registryCost: number;
//   appraisal: number;
//   studyCommission: number;
//   activationCommission: number;
//   professionalFeesCost: number;
//   documentationFee: number;
//   periodicCommission: number;
//   shippingCosts: number;
//   administrationExpenses: number;
//   lifeInsurance: number;
//   riskInsurance: number;
//   monthlyStatementDelivery: number;
//   yearsPaymentTerm: number;
//   downPaymentPercentage: number;
//   hasCreditHistory: boolean;
// }
//
// export interface CreditSimulationEnriched extends CreditApplicationFullResource {
//   clientFirstname: string;
//   clientLastname: string;
//   clientDni: string;
//   financeEntityName: string;
//   housingAddress?: string;     // opcional
//   housingPrice?: number;       // opcional
//   monthlyFee: number;          // calculado: totals.totalInterest / monthsPaymentTerm + amortización
// }

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

// ==================== LABELS/TRADUCCIONES ====================

export const BonusTypeLabels: Record<BonusType, string> = {
  [BonusType.VIVIENDA_TRADICIONAL]: 'Vivienda Tradicional',
  [BonusType.VIVIENDA_SOSTENIBLE]: 'Vivienda Sostenible',
  [BonusType.INTEGRADOR_TRADICIONAL]: 'Integrador Tradicional',
  [BonusType.INTEGRADOR_SOSTENIBLE]: 'Integrador Sostenible',
  [BonusType.NULL]: 'Sin Bono'
};

export const GracePeriodTypeLabels: Record<GracePeriodType, string> = {
  [GracePeriodType.TOTAL]: 'Total',
  [GracePeriodType.PARCIAL]: 'Parcial',
  [GracePeriodType.NULL]: 'Sin Período de Gracia'
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

// ==================== INTERFACES - RESOURCES ====================

export interface BonusResource {
  id: number;
  isApplied: boolean;
  givenAmount: number;
  bonusType: string;
}

export interface InterestRateResource {
  id: number;
  type: string;
  period: string;
  percentage: number;
  nominalCapitalization: string;
  tem: number;
}

export interface GracePeriodResource {
  id: number;
  type: string;
  months: number;
}

export interface InitialCostsResource {
  notaryCost: number;
  registryCost: number;
  appraisal: number;
  studyCommission: number;
  activationCommission: number;
  professionalFeesCost: number;
  documentationFee: number;
}

export interface PeriodicCostsResource {
  periodicCommission: number;
  shippingCosts: number;
  administrationExpenses: number;
  lifeInsurance: number;
  riskInsurance: number;
  monthlyStatementDelivery: number;
}

export interface TotalsResource {
  totalInterest: number;
  totalCapitalAmortization: number;
  totaLifeInsurance: number;
  totalRiskInsurance: number;
  totalPeriodicCommission: number;
  totalAdministrationFees: number;
}

export interface RentIndicatorsResource {
  cok: number;
  tir: number;
  tcea: number;
  van: number;
}

export interface PaymentResource {
  id: number;
  paymentDate: string;
  orderNumber: number;
  tem: number;
  gracePeriodType: GracePeriodType;
  initialBalance: number;
  interest: number;
  fee: number;
  amortization: number;
  periodicCosts: PeriodicCostsResource;
  finalBalance: number;
  cashFlow: number;
}

export interface CreditApplicationResource {
  id: number;
  realStateCompanyId: number;
  startDate: string;
  clientId: number;
  housingId: number;
  currencyId: number;
  financeEntityId: number;
  financeEntityApproved: boolean;
  financeEntityReason: string;
  interestRate: InterestRateResource;
  cok: InterestRateResource;
  gracePeriod: GracePeriodResource;
  initialCosts: InitialCostsResource;
  periodicCosts: PeriodicCostsResource;
  downPaymentPercentage: number;
  financing: number;
  monthsPaymentTerm: number;
  totals: TotalsResource;
  rentIndicators: RentIndicatorsResource;
  bonus: BonusResource;
  payments: PaymentResource[];
}

// ==================== INTERFACES - REQUESTS ====================

export interface CreateBonusRequest {
  isRequired: boolean;
  housingCategory: string;
  housingSalePrice: number;
  currency: any; // Currency object
  isIntegrator: boolean;
}

export interface CreateInterestRateRequest {
  type: string;
  period: string;
  percentage: number;
  nominalCapitalization: string;
}

export interface CreateGracePeriodRequest {
  type: string;
  months: number;
}

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

// ==================== INTERFACES EXTENDIDAS CON DATOS RELACIONADOS ====================

// Para mostrar en el listado con datos completos
export interface CreditApplicationListItem extends CreditApplicationResource {
  clientName?: string;
  financeEntityName?: string;
  housingTitle?: string;
  currencySymbol?: string;
}

// ==================== HELPERS/UTILITIES ====================

export class CreditSimulationHelper {

  // Formatear moneda
  static formatCurrency(amount: number, currencySymbol: string = 'S/'): string {
    return `${currencySymbol} ${amount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Formatear porcentaje
  static formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  // Calcular cuota inicial basada en el porcentaje
  static calculateInitialPayment(salePrice: number, percentage: number): number {
    return (salePrice * percentage) / 100;
  }

  // Obtener color según aprobación
  static getApprovalColor(approved: boolean): string {
    return approved ? '#10B981' : '#EF4444';
  }

  // Obtener label de período de gracia
  static getGracePeriodLabel(type: string, months: number): string {
    if (type === 'NULL' || months === 0) return 'Sin período de gracia';
    return `${GracePeriodTypeLabels[type as GracePeriodType]} - ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }

  // Calcular total de costos iniciales
  static calculateTotalInitialCosts(costs: InitialCostsResource): number {
    return costs.notaryCost + costs.registryCost + costs.appraisal +
      costs.studyCommission + costs.activationCommission +
      costs.professionalFeesCost + costs.documentationFee;
  }

  // Calcular total de costos periódicos (sin seguros que ya están en la cuota)
  static calculateTotalPeriodicCosts(costs: PeriodicCostsResource): number {
    return costs.periodicCommission + costs.shippingCosts +
      costs.administrationExpenses + costs.monthlyStatementDelivery;
  }
}

