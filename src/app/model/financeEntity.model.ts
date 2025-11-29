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
