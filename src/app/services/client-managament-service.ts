import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClientResponse, CreateClientRequest, UpdateClientRequest} from '../model/clientManagement.model';
import {CurrencyResource} from '../model/currency.model';

@Injectable({
  providedIn: 'root',
})
export class ClientManagamentService {
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}
  createClient(request: CreateClientRequest): Observable<ClientResponse> {
    return this.httpClient.post<ClientResponse>(
      '/api/v1/clients/clients',
      request
    );
  }
  getClientById(clientId: number): Observable<ClientResponse> {
    return this.httpClient.get<ClientResponse>(
      `/api/v1/clients/${clientId}`
    );
  }
  getAllClientsByCompany(realStateCompanyId: number): Observable<ClientResponse[]> {
    return this.httpClient.get<ClientResponse[]>(
      `/api/v1/clients/${realStateCompanyId}/clients`
    );
  }
  updateClient(clientId: number, request: UpdateClientRequest): Observable<ClientResponse> {
    return this.httpClient.put<ClientResponse>(
      `/api/v1/clients/${clientId}`,
      request
    );
  }
  deleteClient(clientId: number): Observable<ClientResponse> {
    return this.httpClient.delete<ClientResponse>(
      `/api/v1/clients/${clientId}`
    );
  }
  exchangeSalaryCurrency(clientId: number): Observable<ClientResponse> {
    return this.httpClient.patch<ClientResponse>(
      `/api/v1/clients/${clientId}`,
      {}
    );
  }

}
