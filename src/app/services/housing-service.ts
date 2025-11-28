import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateHousingRequest, HousingResponse, UpdateHousingRequest} from '../model/housing.model';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  createHousing(request: CreateHousingRequest): Observable<HousingResponse> {
    return this.httpClient.post<HousingResponse>(
      '/api/v1/housing/housing',
      request
    );
  }

  getHousingById(housingId: number): Observable<HousingResponse> {
    return this.httpClient.get<HousingResponse>(
      `/api/v1/housing/${housingId}`
    );
  }

  getAllHousingsByCompany(realStateCompanyId: number): Observable<HousingResponse[]> {
    return this.httpClient.get<HousingResponse[]>(
      `/api/v1/housing/${realStateCompanyId}/housing`
    );
  }

  updateHousing(housingId: number, request: UpdateHousingRequest): Observable<HousingResponse> {
    return this.httpClient.put<HousingResponse>(
      `/api/v1/housing/${housingId}`,
      request
    );
  }

  deleteHousing(housingId: number): Observable<HousingResponse> {
    return this.httpClient.delete<HousingResponse>(
      `/api/v1/housing/${housingId}`
    );
  }

  exchangeSalePriceCurrency(housingId: number): Observable<HousingResponse> {
    return this.httpClient.patch<HousingResponse>(
      `/api/v1/housing/${housingId}`,
      {}
    );
  }
}
