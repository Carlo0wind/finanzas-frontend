export interface CurrencyResource {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export class CurrencyHelper {
  /**
   * Formatea un monto con el símbolo de la moneda
   */
  static formatAmount(amount: number, currency: CurrencyResource): string {
    return `${currency.symbol}${amount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * Obtiene el nombre completo con código
   */
  static getFullName(currency: CurrencyResource): string {
    return `${currency.name} (${currency.code})`;
  }

  /**
   * Verifica si es Soles
   */
  static isPEN(currency: CurrencyResource): boolean {
    return currency.code === 'PEN';
  }

  /**
   * Verifica si es Dólares
   */
  static isUSD(currency: CurrencyResource): boolean {
    return currency.code === 'USD';
  }
}

// ==================== CONSTANTES ====================

export const CURRENCY_IDS = {
  PEN: 1,
  USD: 2
} as const;

export const CURRENCY_CODES = {
  PEN: 'PEN',
  USD: 'USD'
} as const;
