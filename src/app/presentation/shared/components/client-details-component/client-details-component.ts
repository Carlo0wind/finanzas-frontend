import {Component, Inject, inject, OnInit, signal} from '@angular/core';
import {ClientManagamentService} from '../../../../services/client-managament-service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientResponse} from '../../../../model/clientManagement.model';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-client-details-component',
  imports: [
    MatIconButton,
    MatIcon,
    MatProgressSpinner
  ],
  templateUrl: './client-details-component.html',
  styleUrl: './client-details-component.css',
})
export class ClientDetailsComponent implements OnInit{
  private clientService = inject(ClientManagamentService);
  public dialogRef = inject(MatDialogRef<ClientDetailsComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { clientId: number }) {}

  client = signal<ClientResponse | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {
    this.loadClientDetails();
  }

  loadClientDetails(): void {
    this.isLoading.set(true);
    this.clientService.getClientById(this.data.clientId).subscribe({
      next: (data) => {
        this.client.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando detalles', err);
        this.error.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatCurrency(amount: number, symbol: string): string {
    return `${symbol}${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  }

  getStatusLabel(isWorking: boolean): string {
    return isWorking ? 'Activo Laboralmente' : 'Desempleado / Sin Actividad';
  }

  getEmploymentType(isDependent: boolean): string {
    return isDependent ? 'Dependiente' : 'Independiente';
  }
}
