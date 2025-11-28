import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyResource} from '../model/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  getAllCurrencies(): Observable<CurrencyResource[]> {
    return this.httpClient.get<CurrencyResource[]>('/api/v1/currency');
  }
  getCurrencyById(currencyId: number): Observable<CurrencyResource> {
    return this.httpClient.get<CurrencyResource>(`/api/v1/currency/${currencyId}`);
  }
}
