import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateHousingRequest, HousingResponse, UpdateHousingRequest} from '../model/housing.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  private apiUrl = `${environment.apiUrl}/housing`;

  createHousing(request: CreateHousingRequest): Observable<HousingResponse> {
    return this.httpClient.post<HousingResponse>(
      `${this.apiUrl}/housing`,
      request
    );
  }

  getHousingById(housingId: number): Observable<HousingResponse> {
    return this.httpClient.get<HousingResponse>(
      `${this.apiUrl}/${housingId}`
    );
  }

  getAllHousingsByCompany(realStateCompanyId: number): Observable<HousingResponse[]> {
    return this.httpClient.get<HousingResponse[]>(
      `${this.apiUrl}/${realStateCompanyId}/housing`
    );
  }

  updateHousing(housingId: number, request: UpdateHousingRequest): Observable<HousingResponse> {
    return this.httpClient.put<HousingResponse>(
      `${this.apiUrl}/${housingId}`,
      request
    );
  }

  deleteHousing(housingId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${housingId}`);
  }

  exchangeSalePriceCurrency(housingId: number): Observable<HousingResponse> {
    return this.httpClient.patch<HousingResponse>(
      `${this.apiUrl}/${housingId}`,
      {}
    );
  }
}
