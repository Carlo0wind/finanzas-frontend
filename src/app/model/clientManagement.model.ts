export interface CreateClientRequest {
  realStateCompanyId: number;
  firstname: string;
  lastname: string;
  dni: string;
  age: number;
  email: string;
  isWorking: boolean;
  dependentsNumber: number;
  monthlyIncome: number;
  isDependent: boolean;
  workingYears: number;
  isIntegrator: boolean;
  currencyId: number;
}

export interface UpdateClientRequest {
  firstname: string;
  lastname: string;
  dni: string;
  age: number;
  email: string;
  isWorking: boolean;
  dependentsNumber: number;
  monthlyIncome: number;
  isDependent: boolean;
  workingYears: number;
  isIntegrator: boolean;
  currencyId: number;
}

export interface ClientResponse {
  id: number;
  realStateCompanyId: number;
  firstname: string;
  lastname: string;
  dni: string;
  age: number;
  email: string;
  isWorking: boolean;
  dependentsNumber: number;
  monthlyIncome: number;
  isDependent: boolean;
  workingYears: number;
  isIntegrator: boolean;
  currencyId: number;
  currencySymbol: string;  // "S/ " o "$ "
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientModalData {
  client?: ClientResponse;  // Si viene lleno, es EDITAR; si viene null, es CREAR
  mode: 'create' | 'edit';
}

export class ClientHelper {
  /**
   * Obtiene el nombre completo del cliente
   */
  static getFullName(client: ClientResponse): string {
    return `${client.firstname} ${client.lastname}`.trim();
  }

  /**
   * Obtiene el estado laboral del cliente
   */
  static getEmploymentStatus(client: ClientResponse): string {
    if (client.isDependent) return 'Dependiente';
    if (!client.isWorking) return 'Desempleado';
    return 'Independiente';
  }

  /**
   * Formatea el ingreso mensual con símbolo de moneda
   */
  static formatMonthlyIncome(client: ClientResponse): string {
    return `${client.currencySymbol}${client.monthlyIncome.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * Verifica si el cliente es elegible para crédito
   */
  static isEligibleForCredit(client: ClientResponse): boolean {
    return client.isWorking && client.age >= 18 && client.monthlyIncome > 0;
  }
}
