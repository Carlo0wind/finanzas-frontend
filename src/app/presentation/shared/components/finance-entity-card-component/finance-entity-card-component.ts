import {Component, computed, input, output} from '@angular/core';
import {FinanceEntity} from '../../../../model/financeEntity.model';

@Component({
  selector: 'app-finance-entity-card-component',
  imports: [],
  templateUrl: './finance-entity-card-component.html',
  styleUrl: './finance-entity-card-component.css',
})
export class FinanceEntityCardComponent {
  entity = input.required<FinanceEntity>();

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

  housingPriceRange = computed(() => {
    const min = this.entity().minimumHousingPrice;
    const max = this.entity().maximumHousingPrice;
    if (!min && !max) return 'No disponible';
    if (min && max) return `S/ ${min.toLocaleString()} - S/ ${max.toLocaleString()}`;
    if (min) return `Desde S/ ${min.toLocaleString()}`;
    if (max) return `Hasta S/ ${max.toLocaleString()}`;
    return 'No disponible';
  });

  downPaymentRange = computed(() => {
    const min = this.entity().minimumDownPaymentPercentage;
    const max = this.entity().maximumDownPaymentPercentage;
    if (!min && !max) return 'No disponible';
    if (min && max) return `${(min * 100).toFixed(1)}% - ${(max * 100).toFixed(1)}%`;
    if (min) return `Mínimo ${(min * 100).toFixed(1)}%`;
    if (max) return `Máximo ${(max * 100).toFixed(1)}%`;
    return 'No disponible';
  });

  termRange = computed(() => {
    const min = this.entity().minimumMonthPaymentTerm;
    const max = this.entity().maximumMonthPaymentTerm;
    if (!min && !max) return 'No disponible';
    const toYears = (m: number) => m >= 12 ? `${m/12} años` : `${m} meses`;
    if (min && max) return `${toYears(min)} - ${toYears(max)}`;
    if (min) return `Mínimo ${toYears(min)}`;
    if (max) return `Máximo ${toYears(max)}`;
    return 'No disponible';
  });

  minimumSalary = computed(() => {
    const salary = this.entity().minimumSalary;
    return salary ? `S/ ${salary.toLocaleString()}` : 'No disponible';
  });
}
