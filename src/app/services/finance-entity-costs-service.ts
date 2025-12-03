import { Injectable } from '@angular/core';
import {FINANCE_ENTITY_COSTS, FinanceEntityCostsConfig} from '../model/finance-entity-costs.config';

@Injectable({
  providedIn: 'root',
})
export class FinanceEntityCostsService {
  /**
   * Obtiene la configuración completa de una entidad financiera
   */
  getConfig(financeEntityId: number): FinanceEntityCostsConfig | null {
    return FINANCE_ENTITY_COSTS[financeEntityId] || null;
  }

  /**
   * Obtiene el valor por defecto de envío de estado de cuenta mensual
   */
  getDefaultMonthlyStatementDelivery(financeEntityId: number): number | null {
    const config = this.getConfig(financeEntityId);
    return config?.defaultCosts.monthlyStatementDelivery ?? null;
  }

  /**
   * Verifica si la entidad tiene validación para gastos notariales
   */
  hasNotaryCostValidation(financeEntityId: number): boolean {
    const config = this.getConfig(financeEntityId);
    return !!config?.validations.notaryCost;
  }

  /**
   * Obtiene la validación de gastos notariales (min/max)
   */
  getNotaryCostValidation(financeEntityId: number): { min: number; max: number } | null {
    const config = this.getConfig(financeEntityId);
    return config?.validations.notaryCost ?? null;
  }

  /**
   * Verifica si la entidad tiene validación para envío de estado de cuenta
   */
  hasMonthlyStatementValidation(financeEntityId: number): boolean {
    const config = this.getConfig(financeEntityId);
    return !!config?.validations.monthlyStatementDelivery;
  }

  /**
   * Obtiene la validación de envío de estado de cuenta (min/max)
   */
  getMonthlyStatementValidation(financeEntityId: number): { min: number; max: number } | null {
    const config = this.getConfig(financeEntityId);
    return config?.validations.monthlyStatementDelivery ?? null;
  }

  /**
   * Verifica si el envío de estado de cuenta es manual (null)
   */
  isMonthlyStatementManual(financeEntityId: number): boolean {
    const config = this.getConfig(financeEntityId);
    return config?.defaultCosts.monthlyStatementDelivery === null;
  }

  /**
   * Obtiene el nombre de la entidad financiera
   */
  getFinanceEntityName(financeEntityId: number): string {
    const config = this.getConfig(financeEntityId);
    return config?.name || 'Entidad Financiera';
  }
}
