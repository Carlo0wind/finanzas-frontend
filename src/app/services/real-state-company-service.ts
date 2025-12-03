import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {
  AuthenticatedResponse,
  RealStateCompanyResponse,
  SignInRequest,
  SignUpRequest,
  UpdateRealStateCompanyRequest
} from '../model/auth.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealStateCompanyService {
  private apiUrl = `${environment.apiUrl}/real-state-company`;
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  signUp(request: SignUpRequest): Observable<RealStateCompanyResponse> {
    return this.httpClient.post<RealStateCompanyResponse>(
      `${this.apiUrl}/sign-up`,
      request
    );
  }
  signIn(request: SignInRequest): Observable<AuthenticatedResponse> {
    return this.httpClient.post<AuthenticatedResponse>(
      `${this.apiUrl}/sign-in`,
      request
    );
  }
  //kkk funciona shrek
  getRealStateCompanyById(id: number): Observable<RealStateCompanyResponse> {
    return this.httpClient.get<RealStateCompanyResponse>(
      `${this.apiUrl}/${id}`
    );
  }
  updateRealStateCompany(
    id: number,
    request: UpdateRealStateCompanyRequest
  ): Observable<RealStateCompanyResponse> {
    return this.httpClient.put<RealStateCompanyResponse>(
      `${this.apiUrl}/${id}`,
      request
    );
  }
}
