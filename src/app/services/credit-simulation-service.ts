import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  CreateCreditApplicationRequest, CreditApplication,
  UpdateCreditApplicationRequest,
} from '../model/creditApplication.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreditSimulationService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/credit-applications`;
  constructor() {}
  createCreditApplication(request: CreateCreditApplicationRequest): Observable<number> {
    return this.httpClient.post<number>(this.apiUrl, request);
  }

  getCreditApplicationById(id: number): Observable<CreditApplication> {
    return this.httpClient.get<CreditApplication>(`${this.apiUrl}/${id}`);
  }

  getAllCreditApplicationsByCompany(realStateCompanyId: number): Observable<CreditApplication[]> {
    return this.httpClient.get<CreditApplication[]>(
      `${this.apiUrl}/${realStateCompanyId}/creditApplications`
    );
  }

  updateCreditApplication(id: number, request: UpdateCreditApplicationRequest): Observable<CreditApplication> {
    return this.httpClient.put<CreditApplication>(`${this.apiUrl}/${id}`, request);
  }

  deleteCreditApplication(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
