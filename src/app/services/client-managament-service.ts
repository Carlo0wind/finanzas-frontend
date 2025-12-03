import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClientResponse, CreateClientRequest, UpdateClientRequest} from '../model/clientManagement.model';
import {CurrencyResource} from '../model/currency.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientManagamentService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor() {}
  createClient(request: CreateClientRequest): Observable<ClientResponse> {
    return this.httpClient.post<ClientResponse>(`${this.apiUrl}/clients`, request);
  }
  getClientById(clientId: number): Observable<ClientResponse> {
    return this.httpClient.get<ClientResponse>(
      `${this.apiUrl}/${clientId}`
    );
  }
  getAllClientsByCompany(realStateCompanyId: number): Observable<ClientResponse[]> {
    return this.httpClient.get<ClientResponse[]>(
      `${this.apiUrl}/${realStateCompanyId}/clients`
    );
  }
  updateClient(clientId: number, request: UpdateClientRequest): Observable<ClientResponse> {
    return this.httpClient.put<ClientResponse>(
      `${this.apiUrl}/${clientId}`,
      request
    );
  }
  deleteClient(clientId: number): Observable<ClientResponse> {
    return this.httpClient.delete<ClientResponse>(
      `${this.apiUrl}/${clientId}`
    );
  }
  exchangeSalaryCurrency(clientId: number): Observable<ClientResponse> {
    return this.httpClient.patch<ClientResponse>(
      `${this.apiUrl}/${clientId}`,
      {}
    );
  }

}
