import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientManagamentService} from '../../../services/client-managament-service';
import {ClientResponse, CreateClientRequest, UpdateClientRequest} from '../../../model/clientManagement.model';
import {ClientModalComponent} from '../../shared/components/client-modal-component/client-modal-component';
import {ClientDetailsComponent} from '../../shared/components/client-details-component/client-details-component';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule
  ],
  templateUrl: './client-management.html',
  styleUrl: './client-management.css',
})
export class ClientManagement implements OnInit{
  private dialog = inject(MatDialog);
  private clientService = inject(ClientManagamentService);
  private snackBar = inject(MatSnackBar);

  clients = signal<ClientResponse[]>([]);
  searchTerm = signal('');
  isLoading = signal(true);

  //filtro de clientes, funcion nueva de signals
  filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      console.log('Sin término de búsqueda, retornando todos:', this.clients());
      return this.clients();
    }

    const filtered = this.clients().filter(client =>
      this.getFullName(client).toLowerCase().includes(term) ||
      client.dni.includes(term) ||
      client.email.toLowerCase().includes(term)
    );

    console.log('Término:', term, 'Resultados:', filtered);
    return filtered;
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      this.snackBar.open('No se encontró información de la empresa', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.clientService.getAllClientsByCompany(+companyId).subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.isLoading.set(false);
        this.snackBar.open('Error al cargar los clientes', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openNewClientModal(): void {
    const dialogRef = this.dialog.open(ClientModalComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createClient(result);
      }
    });
  }

  openEditClientModal(client: ClientResponse): void {
    const dialogRef = this.dialog.open(ClientModalComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { mode: 'edit', client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateClient(client.id, result);
      }
    });
  }

  openClientDetails(clientId: number): void {
    this.dialog.open(ClientDetailsComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { clientId: clientId } 
    });
  }
  createClient(clientData: any): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) return;

    const request: CreateClientRequest = {
      ...clientData,
      realStateCompanyId: +companyId
    };

    this.clientService.createClient(request).subscribe({
      next: (newClient) => {
        this.clients.update(clients => [...clients, newClient]);
        this.snackBar.open('✅ Cliente creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        this.snackBar.open('❌ Error al crear el cliente', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateClient(clientId: number, clientData: any): void {
    const request: UpdateClientRequest = clientData;

    this.clientService.updateClient(clientId, request).subscribe({
      next: (updatedClient) => {
        this.clients.update(clients =>
          clients.map(c => c.id === clientId ? updatedClient : c)
        );
        this.snackBar.open('✅ Cliente actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al actualizar cliente:', error);
        this.snackBar.open('❌ Error al actualizar el cliente', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  confirmDelete(client: ClientResponse): void {
    const confirmed = confirm(
      `¿Estás seguro de que deseas eliminar al cliente ${this.getFullName(client)}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      this.deleteClient(client.id);
    }
  }

  deleteClient(clientId: number): void {
    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.clients.update(clients =>
          clients.filter(c => c.id !== clientId)
        );
        this.snackBar.open('✅ Cliente eliminado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        this.snackBar.open('❌ Error al eliminar el cliente', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getFullName(client: ClientResponse): string {
    return `${client.firstname} ${client.lastname}`.trim();
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  exchangeCurrency(client: ClientResponse): void {
    const currentCurrency = client.currencySymbol === 'S/ ' ? 'Soles' : 'Dólares';
    const newCurrency = client.currencySymbol === 'S/ ' ? 'Dólares' : 'Soles';

    if (confirm(`¿Deseas cambiar el salario de ${currentCurrency} a ${newCurrency}?`)) {
      this.clientService.exchangeSalaryCurrency(client.id).subscribe({
        next: (updatedClient) => {
          this.clients.update(clients =>
            clients.map(c => c.id === client.id ? updatedClient : c)
          );
          this.snackBar.open(
            `✅ Moneda cambiada a ${updatedClient.currencySymbol === 'S/ ' ? 'Soles' : 'Dólares'}`,
            'Cerrar',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );
        },
        error: (error) => {
          console.error('Error al cambiar moneda:', error);
          this.snackBar.open('❌ Error al cambiar la moneda', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getEmploymentStatus(client: ClientResponse): string {
    if (!client.isWorking) {
      return 'Desempleado';
    } else if (client.isDependent) {
      return 'Dependiente';
    } else {
      return 'Independiente';
    }
  }

  getStatusClass(client: ClientResponse): string {
    if (!client.isWorking) {
      return 'unemployed';
    } else if (client.isDependent) {
      return 'dependent';
    } else {
      return 'independent';
    }
  }
}
