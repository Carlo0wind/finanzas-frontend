export enum FinanceEntityType {
  BANCA_MULTIPLE = 'BANCA_MULTIPLE',
  CMAC = 'CMAC',
  FINANCIERA = 'FINANCIERA',
  EMPRESA_DE_CREDITO = 'EMPRESA_DE_CREDITO'
}

export interface FinanceEntity {
  id: number;
  name: string;
  type: FinanceEntityType;
  minimumHousingPrice?: number;
  maximumHousingPrice?: number;
  minimumFinance?: number;
  maximumFinance?: number;
  minimumSalary?: number;
  minimumDownPaymentPercentage?: number;
  maximumDownPaymentPercentage?: number;
  allowsUsedHousing?: boolean;
  inProjectMaxGracePeriodMonths?: number;
  generalMaxGracePeriodMonths?: number;
  minimumMonthPaymentTerm?: number;
  maximumMonthPaymentTerm?: number;
  allowsAnotherHousingFinancing?: boolean;
  minYearsDependentEmploymentTenure?: number;
  minYearsIndependentEmploymentTenure?: number;
  requiresCreditHistory?: boolean;
}

export interface EvaluateFinanceEntityRequest {
  clientId: number;
  housingId: number;
  requestedAmount: number;
  downPaymentPercentage: number;
  monthPaymentTerm: number;
  gracePeriodMonths: number;
  hasAnotherHousingFinancing: boolean;
  hasCreditHistory: boolean;
}

export interface EvaluateFinanceEntityResponse {
  accepted: boolean;
  reason: string;
}

// ==================== LABELS ====================

export const FinanceEntityTypeLabels: Record<FinanceEntityType, string> = {
  [FinanceEntityType.BANCA_MULTIPLE]: 'Banca Múltiple',
  [FinanceEntityType.CMAC]: 'Caja Municipal',
  [FinanceEntityType.FINANCIERA]: 'Financiera',
  [FinanceEntityType.EMPRESA_DE_CREDITO]: 'Empresa de Crédito'
};

export class FinanceEntityHelper {
  /**
   * Obtiene el label del tipo de entidad
   */
  static getTypeLabel(type: FinanceEntityType): string {
    return FinanceEntityTypeLabels[type] || type;
  }

  /**
   * Verifica si la entidad acepta viviendas usadas
   */
  static allowsUsedHousing(entity: FinanceEntity): boolean {
    return entity.allowsUsedHousing ?? false;
  }

  /**
   * Obtiene el rango de precios de vivienda
   */
  static getHousingPriceRange(entity: FinanceEntity): string {
    if (!entity.minimumHousingPrice && !entity.maximumHousingPrice) {
      return 'Sin restricción';
    }
    const min = entity.minimumHousingPrice
      ? `S/ ${entity.minimumHousingPrice.toLocaleString('es-PE')}`
      : 'Sin mínimo';
    const max = entity.maximumHousingPrice
      ? `S/ ${entity.maximumHousingPrice.toLocaleString('es-PE')}`
      : 'Sin máximo';
    return `${min} - ${max}`;
  }

  /**
   * Obtiene el rango de financiamiento
   */
  static getFinanceRange(entity: FinanceEntity): string {
    if (!entity.minimumFinance && !entity.maximumFinance) {
      return 'Sin restricción';
    }
    const min = entity.minimumFinance
      ? `S/ ${entity.minimumFinance.toLocaleString('es-PE')}`
      : 'Sin mínimo';
    const max = entity.maximumFinance
      ? `S/ ${entity.maximumFinance.toLocaleString('es-PE')}`
      : 'Sin máximo';
    return `${min} - ${max}`;
  }

  /**
   * Obtiene el rango de cuota inicial
   */
  static getDownPaymentRange(entity: FinanceEntity): string {
    if (!entity.minimumDownPaymentPercentage && !entity.maximumDownPaymentPercentage) {
      return 'Sin restricción';
    }
    const min = entity.minimumDownPaymentPercentage
      ? `${entity.minimumDownPaymentPercentage}%`
      : 'Sin mínimo';
    const max = entity.maximumDownPaymentPercentage
      ? `${entity.maximumDownPaymentPercentage}%`
      : 'Sin máximo';
    return `${min} - ${max}`;
  }

  /**
   * Obtiene el rango de plazo de pago
   */
  static getPaymentTermRange(entity: FinanceEntity): string {
    if (!entity.minimumMonthPaymentTerm && !entity.maximumMonthPaymentTerm) {
      return 'Sin restricción';
    }
    const min = entity.minimumMonthPaymentTerm
      ? `${entity.minimumMonthPaymentTerm} meses`
      : 'Sin mínimo';
    const max = entity.maximumMonthPaymentTerm
      ? `${entity.maximumMonthPaymentTerm} meses`
      : 'Sin máximo';
    return `${min} - ${max}`;
  }

  /**
   * Obtiene el período de gracia máximo según el tipo de vivienda
   */
  static getMaxGracePeriod(entity: FinanceEntity, isInProject: boolean): number {
    if (isInProject) {
      return entity.inProjectMaxGracePeriodMonths ?? 0;
    }
    return entity.generalMaxGracePeriodMonths ?? 0;
  }

  /**
   * Verifica si la entidad requiere historial crediticio
   */
  static requiresCreditHistory(entity: FinanceEntity): boolean {
    return entity.requiresCreditHistory ?? false;
  }

  /**
   * Verifica si la entidad permite otro financiamiento de vivienda
   */
  static allowsAnotherHousingFinancing(entity: FinanceEntity): boolean {
    return entity.allowsAnotherHousingFinancing ?? false;
  }

  /**
   * Obtiene los años mínimos de antigüedad laboral según el tipo de empleo
   */
  static getMinEmploymentYears(entity: FinanceEntity, isDependent: boolean): number {
    if (isDependent) {
      return entity.minYearsDependentEmploymentTenure ?? 0;
    }
    return entity.minYearsIndependentEmploymentTenure ?? 0;
  }

  /**
   * Formatea el salario mínimo requerido
   */
  static formatMinimumSalary(entity: FinanceEntity): string {
    if (!entity.minimumSalary) {
      return 'Sin restricción';
    }
    return `S/ ${entity.minimumSalary.toLocaleString('es-PE')}`;
  }
}
