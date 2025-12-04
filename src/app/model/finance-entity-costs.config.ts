// src/app/credit-simulation/config/finance-entity-costs.config.ts

export interface FinanceEntityCostsConfig {
  id: number;
  name: string;
  defaultCosts: {
    monthlyStatementDelivery: number | null;  // null = input manual
  };
  validations: {
    notaryCost?: { min: number; max: number };
    monthlyStatementDelivery?: { min: number; max: number };
  };
}

export const FINANCE_ENTITY_COSTS: Record<number, FinanceEntityCostsConfig> = {
  1: {
    id: 1,
    name: 'BCP Banco de Crédito del Perú',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  2: {
    id: 2,
    name: 'BBVA Perú',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  3: {
    id: 3,
    name: 'Interbank',
    defaultCosts: {
      monthlyStatementDelivery: 0
    },
    validations: {}
  },
  4: {
    id: 4,
    name: 'Scotiabank',
    defaultCosts: {
      monthlyStatementDelivery: 11
    },
    validations: {}
  },
  5: {
    id: 5,
    name: 'BanBif',
    defaultCosts: {
      monthlyStatementDelivery: 9
    },
    validations: {}
  },
  6: {
    id: 6,
    name: 'Bancom',
    defaultCosts: {
      monthlyStatementDelivery: 2.5
    },
    validations: {}
  },
  7: {
    id: 7,
    name: 'Banco GNB',
    defaultCosts: {
      monthlyStatementDelivery: null  // Input manual
    },
    validations: {}
  },
  8: {
    id: 8,
    name: 'CMAC Huancayo',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  9: {
    id: 9,
    name: 'CMAC Ica',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  10: {
    id: 10,
    name: 'CMAC Cusco',
    defaultCosts: {
      monthlyStatementDelivery: 5
    },
    validations: {}
  },
  11: {
    id: 11,
    name: 'CMAC Trujillo',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  12: {
    id: 12,
    name: 'CMAC Maynas',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  13: {
    id: 13,
    name: 'CMAC Arequipa',
    defaultCosts: {
      monthlyStatementDelivery: 6.4
    },
    validations: {}
  },
  14: {
    id: 14,
    name: 'CMAC Piura',
    defaultCosts: {
      monthlyStatementDelivery: 10
    },
    validations: {}
  },
  15: {
    id: 15,
    name: 'Financiera Efectiva',
    defaultCosts: {
      monthlyStatementDelivery: 0
    },
    validations: {
      notaryCost: { min: 300, max: 700 }
    }
  },
  16: {
    id: 16,
    name: 'Financiera Santander',
    defaultCosts: {
      monthlyStatementDelivery: 9
    },
    validations: {}
  },
  17: {
    id: 17,
    name: 'EC Vivela',
    defaultCosts: {
      monthlyStatementDelivery: null  // Input manual (10-50)
    },
    validations: {
      monthlyStatementDelivery: { min: 10, max: 50 }
    }
  }
};
