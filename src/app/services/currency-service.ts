import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyResource} from '../model/currency.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/currency`;
  constructor() {}
  getAllCurrencies(): Observable<CurrencyResource[]> {
    return this.httpClient.get<CurrencyResource[]>(`${this.apiUrl}`);
  }
  getCurrencyById(currencyId: number): Observable<CurrencyResource> {
    return this.httpClient.get<CurrencyResource>(`${this.apiUrl}/${currencyId}`);
  }
}
