import {Component, computed, Inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  HousingCategory,
  HousingCategoryLabels, HousingModalData,
  HousingState,
  HousingStateLabels,
  Province,
  ProvinceLabels
} from "../../../../model/housing.model";
import {CurrencyResource} from '../../../../model/currency.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CurrencyService} from '../../../../services/currency-service';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-housing-modal-component',
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './housing-modal-component.html',
  styleUrl: './housing-modal-component.css',
})
export class HousingModalComponent {
  housingForm: FormGroup;
  isLoading = signal(false);
  currencies = signal<CurrencyResource[]>([]);
  previousCurrencyId: number | null = null;

  // Listas para los selects
  provinces = Object.keys(Province).map(key => ({
    value: key,
    label: ProvinceLabels[key as Province]
  }));

  housingStates = Object.keys(HousingState).map(key => ({
    value: key,
    label: HousingStateLabels[key as HousingState]
  }));

  housingCategories = Object.keys(HousingCategory).map(key => ({
    value: key,
    label: HousingCategoryLabels[key as HousingCategory]
  }));

  // Computed para símbolo de moneda
  currencySymbol = computed(() => {
    const currencyId = this.housingForm?.get('currencyId')?.value;
    const currency = this.currencies().find(c => c.id === currencyId);
    return currency?.symbol || '';
  });

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    public dialogRef: MatDialogRef<HousingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HousingModalData
  ) {
    this.housingForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      address: ['', [Validators.required]],
      department: [''], // Opcional
      area: [0, [Validators.required, Validators.min(1)]],
      roomQuantity: [1, [Validators.required, Validators.min(1)]],
      currencyId: ['', [Validators.required]],
      salePrice: [{value: '', disabled: true}, [Validators.required, Validators.min(1)]],
      housingState: ['', [Validators.required]],
      housingCategory: ['', [Validators.required]]
    });

    // Suscribirse a cambios en currencyId
    this.housingForm.get('currencyId')?.valueChanges.subscribe(newCurrencyId => {
      this.onCurrencyChange(newCurrencyId, this.previousCurrencyId);
      this.previousCurrencyId = newCurrencyId;
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();

    if (this.data.mode === 'edit' && this.data.housing) {
      this.currencyService.getAllCurrencies().subscribe({
        next: (currencies) => {
          this.currencies.set(currencies);
          this.loadHousingData();
        }
      });
    }
  }

  loadCurrencies(): void {
    if (this.data.mode === 'create') {
      this.currencyService.getAllCurrencies().subscribe({
        next: (currencies) => {
          this.currencies.set(currencies);
        },
        error: (error) => {
          console.error('Error al cargar monedas:', error);
        }
      });
    }
  }

  loadHousingData(): void {
    const housing = this.data.housing!;
    const currency = this.currencies().find(c => c.symbol === housing.currencySymbol);
    const currencyId = currency?.id || 1;

    this.previousCurrencyId = currencyId;

    this.housingForm.patchValue({
      title: housing.title,
      description: housing.description,
      province: housing.province,
      district: housing.district,
      address: housing.address,
      department: housing.department,
      area: housing.area,
      roomQuantity: housing.roomQuantity,
      currencyId: currencyId,
      salePrice: housing.salePrice,
      housingState: housing.housingState,
      housingCategory: housing.housingCategory
    });

    if (currencyId) {
      this.housingForm.get('salePrice')?.enable();
    }
  }

  onCurrencyChange(newCurrencyId: number, previousCurrencyId: number | null): void {
    if (newCurrencyId) {
      this.housingForm.get('salePrice')?.enable();
    } else {
      this.housingForm.get('salePrice')?.disable();
      this.housingForm.patchValue({ salePrice: '' });
    }
  }

  /* ✨ VERSIÓN CON CONVERSIÓN AUTOMÁTICA (comentada por si acaso)
  onCurrencyChange(newCurrencyId: number, previousCurrencyId: number | null): void {
    const EXCHANGE_RATE = 3.39;

    if (newCurrencyId) {
      const currentPrice = parseFloat(this.housingForm.get('salePrice')?.value) || 0;

      if (currentPrice > 0 && previousCurrencyId && previousCurrencyId !== newCurrencyId) {
        const previousCurrency = this.currencies().find(c => c.id === previousCurrencyId);
        const newCurrency = this.currencies().find(c => c.id === newCurrencyId);

        let convertedPrice = currentPrice;

        if (previousCurrency?.code === 'PEN' && newCurrency?.code === 'USD') {
          convertedPrice = currentPrice / EXCHANGE_RATE;
        }
        else if (previousCurrency?.code === 'USD' && newCurrency?.code === 'PEN') {
          convertedPrice = currentPrice * EXCHANGE_RATE;
        }

        this.housingForm.patchValue({
          salePrice: convertedPrice.toFixed(2)
        }, { emitEvent: false });
      }

      this.housingForm.get('salePrice')?.enable();
    } else {
      this.housingForm.get('salePrice')?.disable();
      this.housingForm.patchValue({ salePrice: '' });
    }
  }
  */

  getCurrencyDisplayName(currency: CurrencyResource): string {
    const translations: { [key: string]: string } = {
      'Dollars': 'Dólares',
      'dollars': 'Dólares',
      'Soles': 'Soles',
      'soles': 'Soles'
    };
    return translations[currency.name] || currency.name;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.housingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCurrencySymbolForLabel(): string {
    return this.currencySymbol();
  }

  onSubmit(): void {
    if (this.housingForm.invalid) {
      this.housingForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formData = {
      title: this.housingForm.value.title,
      description: this.housingForm.value.description,
      province: this.housingForm.value.province,
      district: this.housingForm.value.district,
      address: this.housingForm.value.address,
      department: this.housingForm.value.department || '',
      area: parseFloat(this.housingForm.value.area),
      roomQuantity: parseInt(this.housingForm.value.roomQuantity),
      salePrice: parseFloat(this.housingForm.get('salePrice')?.value),
      housingState: this.housingForm.value.housingState,
      housingCategory: this.housingForm.value.housingCategory,
      currencyId: this.housingForm.value.currencyId
    };

    this.dialogRef.close(formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
