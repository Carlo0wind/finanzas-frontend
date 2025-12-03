import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EvaluateFinanceEntityRequest, EvaluateFinanceEntityResponse, FinanceEntity} from '../model/financeEntity.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinanceEntityService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  private apiUrl = `${environment.apiUrl}/finance-entities`;

  getAllFinanceEntities(): Observable<FinanceEntity[]> {
    return this.httpClient.get<FinanceEntity[]>(this.apiUrl);
  }

  getFinanceEntityById(id: number): Observable<FinanceEntity> {
    return this.httpClient.get<FinanceEntity>(`${this.apiUrl}/${id}`);
  }

  evaluateFinanceEntity(
    id: number,
    data: EvaluateFinanceEntityRequest
  ): Observable<EvaluateFinanceEntityResponse> {
    return this.httpClient.post<EvaluateFinanceEntityResponse>(
      `${this.apiUrl}/${id}/evaluate`,
      data
    );
  }
}
