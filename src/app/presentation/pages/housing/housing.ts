import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';
import {HousingService} from '../../../services/housing-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  CreateHousingRequest, HousingCategoryLabels,
  HousingResponse,
  HousingStateLabels, ProvinceLabels,
  UpdateHousingRequest
} from '../../../model/housing.model';
import {HousingModalComponent} from '../../shared/components/housing-modal-component/housing-modal-component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-housing',
  imports: [
    FormsModule,
    MatIcon,
  ],
  templateUrl: './housing.html',
  styleUrl: './housing.css',
})
export class Housing {
  private dialog = inject(MatDialog);
  private housingService = inject(HousingService);
  private snackBar = inject(MatSnackBar);

  housings = signal<HousingResponse[]>([]);
  searchTerm = signal('');
  isLoading = signal(true);

  // Filtro de viviendas
  filteredHousings = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.housings();
    }

    return this.housings().filter(housing =>
      housing.title.toLowerCase().includes(term) ||
      housing.district.toLowerCase().includes(term) ||
      this.getProvinceLabel(housing.province).toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadHousings();
  }

  loadHousings(): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      this.snackBar.open('No se encontró información de la empresa', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.housingService.getAllHousingsByCompany(+companyId).subscribe({
      next: (housings) => {
        this.housings.set(housings);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar viviendas:', error);
        this.isLoading.set(false);
        this.snackBar.open('Error al cargar las ofertas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openNewHousingModal(): void {
    const dialogRef = this.dialog.open(HousingModalComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createHousing(result);
      }
    });
  }

  openEditHousingModal(housing: HousingResponse): void {
    const dialogRef = this.dialog.open(HousingModalComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { mode: 'edit', housing }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateHousing(housing.id, result);
      }
    });
  }

  createHousing(housingData: any): void {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) return;

    const request: CreateHousingRequest = {
      ...housingData,
      realStateCompanyId: +companyId
    };

    this.housingService.createHousing(request).subscribe({
      next: (newHousing) => {
        this.housings.update(housings => [...housings, newHousing]);
        this.snackBar.open('✅ Oferta creada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al crear oferta:', error);
        this.snackBar.open('❌ Error al crear la oferta', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateHousing(housingId: number, housingData: any): void {
    const request: UpdateHousingRequest = housingData;

    this.housingService.updateHousing(housingId, request).subscribe({
      next: (updatedHousing) => {
        this.housings.update(housings =>
          housings.map(h => h.id === housingId ? updatedHousing : h)
        );
        this.snackBar.open('✅ Oferta actualizada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al actualizar oferta:', error);
        this.snackBar.open('❌ Error al actualizar la oferta', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  confirmDelete(housing: HousingResponse): void {
    const confirmed = confirm(
      `¿Estás seguro de que deseas eliminar la oferta "${housing.title}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      this.deleteHousing(housing.id);
    }
  }

  deleteHousing(housingId: number): void {
    this.housingService.deleteHousing(housingId).subscribe({
      next: () => {
        this.housings.update(housings =>
          housings.filter(h => h.id !== housingId)
        );
        this.snackBar.open('✅ Oferta eliminada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error al eliminar oferta:', error);
        this.snackBar.open('❌ Error al eliminar la oferta', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  exchangeCurrency(housing: HousingResponse): void {
    const currentCurrency = housing.currencySymbol === 'S/ ' ? 'Soles' : 'Dólares';
    const newCurrency = housing.currencySymbol === 'S/ ' ? 'Dólares' : 'Soles';

    if (confirm(`¿Deseas cambiar el precio de ${currentCurrency} a ${newCurrency}?`)) {
      this.housingService.exchangeSalePriceCurrency(housing.id).subscribe({
        next: (updatedHousing) => {
          this.housings.update(housings =>
            housings.map(h => h.id === housing.id ? updatedHousing : h)
          );
          this.snackBar.open(
            `✅ Moneda cambiada a ${updatedHousing.currencySymbol === 'S/ ' ? 'Soles' : 'Dólares'}`,
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

  formatAmount(amount: number): string {
    return amount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getStateLabel(state: string): string {
    return HousingStateLabels[state as keyof typeof HousingStateLabels] || state;
  }

  getCategoryLabel(category: string): string {
    return HousingCategoryLabels[category as keyof typeof HousingCategoryLabels] || category;
  }

  getProvinceLabel(province: string): string {
    return ProvinceLabels[province as keyof typeof ProvinceLabels] || province;
  }

  getStateClass(state: string): string {
    switch (state) {
      case 'EN_PROYECTO': return 'state-proyecto';
      case 'EN_CONSTRUCCION': return 'state-construccion';
      case 'NUEVO': return 'state-nuevo';
      case 'SEGUNDA': return 'state-segunda';
      default: return '';
    }
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'SOSTENIBLE': return 'category-sostenible';
      case 'TRADICIONAL': return 'category-tradicional';
      default: return '';
    }
  }
}
