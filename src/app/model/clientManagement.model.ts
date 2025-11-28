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
  currencySymbol: string;  // "S/ " o "$ "
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientModalData {
  client?: ClientResponse;  // Si viene lleno, es EDITAR; si viene null, es CREAR
  mode: 'create' | 'edit';
}

export class Client {
  id: number;
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
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<Client>) {
    this.id = data?.id || 0;
    this.firstname = data?.firstname || '';
    this.lastname = data?.lastname || '';
    this.dni = data?.dni || '';
    this.age = data?.age || 18;
    this.email = data?.email || '';
    this.isWorking = data?.isWorking || false;
    this.dependentsNumber = data?.dependentsNumber || 0;
    this.monthlyIncome = data?.monthlyIncome || 0;
    this.isDependent = data?.isDependent || false;
    this.workingYears = data?.workingYears || 0;
    this.isIntegrator = data?.isIntegrator || false;
    this.currencyId = data?.currencyId || 1;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
  }

  get fullName(): string {
    return `${this.firstname} ${this.lastname}`.trim();
  }

  get employmentStatus(): string {
    if (this.isDependent) return 'Dependiente';
    if (!this.isWorking) return 'Desempleado';
    return 'Independiente';
  }
}
