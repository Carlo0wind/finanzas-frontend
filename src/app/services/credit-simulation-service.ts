import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  BonusResource,
  CreateBonusRequest,
  CreateCreditApplicationRequest,
  CreateGracePeriodRequest,
  CreateInterestRateRequest,
  CreditApplicationResource, GracePeriodResource,
  InterestRateResource,
  UpdateCreditApplicationRequest,
} from '../model/creditApplication.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditSimulationService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  // ==================== CREDIT APPLICATION ENDPOINTS ====================

  createCreditApplication(request: CreateCreditApplicationRequest): Observable<CreditApplicationResource> {
    return this.httpClient.post<CreditApplicationResource>(
      '/api/v1/credit-applications',
      request
    );
  }

  getCreditApplicationById(creditApplicationId: number): Observable<CreditApplicationResource> {
    return this.httpClient.get<CreditApplicationResource>(
      `/api/v1/credit-applications/${creditApplicationId}`
    );
  }

  getAllCreditApplicationsByCompany(realStateCompanyId: number): Observable<CreditApplicationResource[]> {
    return this.httpClient.get<CreditApplicationResource[]>(
      `/api/v1/credit-applications/${realStateCompanyId}/creditApplications`
    );
  }

  updateCreditApplication(
    creditApplicationId: number,
    request: UpdateCreditApplicationRequest
  ): Observable<CreditApplicationResource> {
    return this.httpClient.put<CreditApplicationResource>(
      `/api/v1/credit-applications/${creditApplicationId}`,
      request
    );
  }

  deleteCreditApplication(creditApplicationId: number): Observable<CreditApplicationResource> {
    return this.httpClient.delete<CreditApplicationResource>(
      `/api/v1/credit-applications/${creditApplicationId}`
    );
  }

  // ==================== BONUS ENDPOINTS ====================

  createBonus(request: CreateBonusRequest): Observable<BonusResource> {
    return this.httpClient.post<BonusResource>(
      '/api/v1/bonuses/bonuses',
      request
    );
  }

  getBonusById(bonusId: number): Observable<BonusResource> {
    return this.httpClient.get<BonusResource>(
      `/api/v1/bonuses/${bonusId}`
    );
  }

  // ==================== INTEREST RATE ENDPOINTS ====================

  createInterestRate(request: CreateInterestRateRequest): Observable<InterestRateResource> {
    return this.httpClient.post<InterestRateResource>(
      '/api/v1/interest-rates/interest-rates',
      request
    );
  }

  getInterestRateById(interestRateId: number): Observable<InterestRateResource> {
    return this.httpClient.get<InterestRateResource>(
      `/api/v1/interest-rates/${interestRateId}`
    );
  }

  // ==================== GRACE PERIOD ENDPOINTS ====================

  createGracePeriod(request: CreateGracePeriodRequest): Observable<GracePeriodResource> {
    return this.httpClient.post<GracePeriodResource>(
      '/api/v1/grace-periods/grace-periods',
      request
    );
  }

  getGracePeriodById(gracePeriodId: number): Observable<GracePeriodResource> {
    return this.httpClient.get<GracePeriodResource>(
      `/api/v1/grace-periods/${gracePeriodId}`
    );
  }
}
