import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FinanceEntity} from '../model/financeEntity.model';

@Injectable({
  providedIn: 'root',
})
export class FinanceEntityService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  private apiUrl = '/api/v1/finance-entities';

  getAllFinanceEntities(): Observable<FinanceEntity[]> {
    return this.httpClient.get<FinanceEntity[]>(this.apiUrl);
  }

  getFinanceEntityById(id: number): Observable<FinanceEntity> {
    return this.httpClient.get<FinanceEntity>(`${this.apiUrl}/${id}`);
  }

  evaluateFinanceEntity(
    id: number,
    data: any
  ): Observable<{ accepted: boolean; reason: string }> {
    return this.httpClient.post<{ accepted: boolean; reason: string }>(
      `${this.apiUrl}/${id}/evaluate`,
      data
    );
  }
}
