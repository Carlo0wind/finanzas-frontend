import {Component, computed, input, output} from '@angular/core';
import {FinanceEntity} from '../../../../model/financeEntity.model';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-finance-entity-card-component',
  imports: [
    MatIcon
  ],
  templateUrl: './finance-entity-card-component.html',
  styleUrl: './finance-entity-card-component.css',
})
export class FinanceEntityCardComponent {
  entity = input.required<FinanceEntity>();
  selectable = input<boolean>(false);
  isSelected = input<boolean>(false);

  onSelect = output<number>();
  onViewDetails = output<number>();

  logoUrl = computed(() => {
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

    return map[this.entity().name] || 'assets/logos/default-bank.png';
  });

  typeLabel = computed(() => {
    const labels: Record<string, string> = {
      BANCA_MULTIPLE: 'Banca Múltiple',
      CMAC: 'Caja Municipal',
      FINANCIERA: 'Financiera',
      EMPRESA_DE_CREDITO: 'Empresa de Crédito'
    };
    return labels[this.entity().type] || this.entity().type;
  });

  handleCardClick(): void {
    // Solo emite selección si es seleccionable
    if (this.selectable()) {
      this.onSelect.emit(this.entity().id);
    }
  }

  handleViewDetails(event: Event): void {
    // Prevenir que el click se propague al card
    event.stopPropagation();
    this.onViewDetails.emit(this.entity().id);
  }
}
