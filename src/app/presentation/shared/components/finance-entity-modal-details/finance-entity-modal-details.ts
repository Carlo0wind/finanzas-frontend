import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FinanceEntity} from '../../../../model/financeEntity.model';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-finance-entity-modal-details',
  imports: [
    MatIcon
  ],
  templateUrl: './finance-entity-modal-details.html',
  styleUrl: './finance-entity-modal-details.css',
})
export class FinanceEntityModalDetails {
  dialogRef = inject(MatDialogRef<FinanceEntityModalDetails>);
  data = inject<{ entity: FinanceEntity, selectable: boolean }>(MAT_DIALOG_DATA);

  entity = this.data.entity;
  selectable = this.data.selectable;

  logoUrl(): string {
    const map: Record<string, string> = {
      'BCP Banco de Crédito del Perú': 'assets/logos/bcp.png',
      'BBVA Perú': 'assets/logos/bbva-2.svg',
      'Interbank': 'assets/logos/interbank-2.svg',
      'Scotiabank': 'assets/logos/scotiabank-4.svg',
      'BanBif': 'assets/logos/banbif-1.svg',
      'Bancom': 'assets/logos/bancom.png',
      'Banco GNB': 'assets/logos/banco-gnb-68.jpg',
      'CMAC Huancayo': 'assets/logos/caja-huancayo-1.svg',
      'CMAC Ica': 'assets/logos/caja-municipal-ica-37445.png',
      'CMAC Cusco': 'assets/logos/caja-cusco.png',
      'CMAC Trujillo': 'assets/logos/caja-trujillo.svg',
      'CMAC Maynas': 'assets/logos/maynas.png',
      'CMAC Arequipa': 'assets/logos/caja-arequipa.png',
      'CMAC Piura': 'assets/logos/caja-piura.png',
      'Financiera Efectiva': 'assets/logos/efectiva.png',
      'Financiera Santander': 'assets/logos/banco-santander-logo.svg',
      'EC Vivela': 'assets/logos/vivela.png'
    };
    return map[this.entity.name] || 'assets/logos/default-bank.png';
  }

  typeLabel(): string {
    const labels: Record<string, string> = {
      BANCA_MULTIPLE: 'Banca Múltiple',
      CMAC: 'Caja Municipal',
      FINANCIERA: 'Financiera',
      EMPRESA_DE_CREDITO: 'Empresa de Crédito'
    };
    return labels[this.entity.type] || this.entity.type;
  }

  formatYesNo(value: boolean | null | undefined): string {
    if (value === null || value === undefined) return 'No especificado';
    return value ? 'Sí' : 'No';
  }

  formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'No especificado';
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatPercentage(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'No especificado';
    return `${value.toFixed(2)}%`;
  }

  formatMonths(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'No especificado';
    if (value >= 12) {
      const years = value / 12;
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
    return `${value} ${value === 1 ? 'mes' : 'meses'}`;
  }


  close(): void {
    this.dialogRef.close();
  }

  selectEntity(): void {
    this.dialogRef.close({
      selected: true,
      entityId: this.entity.id
    });
  }

}
