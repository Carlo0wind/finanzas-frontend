export interface SignUpRequest {
  companyName: string;
  username: string;
  ruc: string;
  companyEmail: string;
  password: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface AuthenticatedResponse {
  id: number;
  companyName: string;
  username: string;
  ruc: string;
  companyEmail: string;
}

export interface RealStateCompanyResponse {
  id: number;
  companyName: string;
  username: string;
  ruc: string;
  companyEmail: string;
  password: string;
}

export interface UpdateRealStateCompanyRequest {
  companyName: string;
  username: string;
  ruc: string;
  companyEmail: string;
  password?: string;
}
