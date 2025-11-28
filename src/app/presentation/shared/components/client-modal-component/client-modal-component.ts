import {Component, computed, effect, Inject, OnInit, signal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientModalData, ClientResponse} from '../../../../model/clientManagement.model';
import {ClientManagamentService} from '../../../../services/client-managament-service';
import {CurrencyResource} from '../../../../model/currency.model';
import {CurrencyService} from '../../../../services/currency-service';

@Component({
  selector: 'app-client-modal-component',
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './client-modal-component.html',
  styleUrl: './client-modal-component.css',
})
export class ClientModalComponent implements OnInit {
  clientForm: FormGroup;
  isLoading = signal(false);
  currencies = signal<CurrencyResource[]>([]);
  previousCurrencyId: number | null = null;
  readonly MAX_INCOME_FOR_INTEGRATOR = 46746;
  readonly EXCHANGE_RATE = 3.39;

  canBeIntegrator = computed(() => {
    const currencyId = this.clientForm?.get('currencyId')?.value;
    const income = parseFloat(this.clientForm?.get('monthlyIncome')?.value) || 0;

    if (!currencyId || !income) return true;

    const selectedCurrency = this.currencies().find(c => c.id === currencyId);

    const incomeInSoles = selectedCurrency?.code === 'USD'
      ? income * this.EXCHANGE_RATE
      : income;

    return incomeInSoles <= this.MAX_INCOME_FOR_INTEGRATOR;
  });

  showIntegratorWarning = computed(() => {
    return !this.canBeIntegrator() && this.clientForm?.get('monthlyIncome')?.value > 0;
  });

  currencySymbol = computed(() => {
    const currencyId = this.clientForm?.get('currencyId')?.value;
    const currency = this.currencies().find(c => c.id === currencyId);
    return currency?.symbol || '';
  });

  constructor(
    private fb: FormBuilder,
    private clientService: ClientManagamentService,
    private currencyService: CurrencyService,
    public dialogRef: MatDialogRef<ClientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientModalData
  ) {
    this.clientForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      age: [18, [Validators.required, Validators.min(18), Validators.max(100)]],
      dependentsNumber: [0, [Validators.min(0)]], // ✨ Ahora siempre habilitado
      isWorking: ['', [Validators.required]],
      currencyId: [''],
      monthlyIncome: [{value: '', disabled: true}],
      isDependent: [''],
      workingYears: [0],
      email: ['', [Validators.required, Validators.email]],
      isIntegrator: [false]
    });

    effect(() => {
      if (!this.canBeIntegrator() && this.clientForm) {
        this.clientForm.patchValue({ isIntegrator: false }, { emitEvent: false });
      }
    }, { allowSignalWrites: true });

    this.clientForm.get('isWorking')?.valueChanges.subscribe(value => {
      this.onWorkingChange(value);
    });

    this.clientForm.get('currencyId')?.valueChanges.subscribe(newCurrencyId => {
      this.onCurrencyChange(newCurrencyId, this.previousCurrencyId);
      this.previousCurrencyId = newCurrencyId;
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();

    if (this.data.mode === 'edit' && this.data.client) {
      this.currencyService.getAllCurrencies().subscribe({
        next: (currencies) => {
          this.currencies.set(currencies);
          this.loadClientData();
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

  loadClientData(): void {
    const client = this.data.client!;
    const currency = this.currencies().find(c => c.symbol === client.currencySymbol);
    const currencyId = currency?.id || 1;

    this.previousCurrencyId = currencyId;

    this.clientForm.patchValue({
      firstname: client.firstname,
      lastname: client.lastname,
      dni: client.dni,
      age: client.age,
      dependentsNumber: client.dependentsNumber, // ✨ Siempre se carga
      isWorking: client.isWorking.toString(),
      currencyId: currencyId,
      monthlyIncome: client.monthlyIncome,
      isDependent: client.isDependent.toString(),
      workingYears: client.workingYears,
      email: client.email,
      isIntegrator: client.isIntegrator
    });

    if (currencyId) {
      this.clientForm.get('monthlyIncome')?.enable();
    }
  }

  onWorkingChange(value: string): void {
    if (value === 'false') {
      this.clientForm.patchValue({
        currencyId: '',
        monthlyIncome: '',
        // dependentsNumber NO se resetea
        isDependent: '',
        workingYears: 0
      });

      this.clientForm.get('currencyId')?.disable();
      this.clientForm.get('monthlyIncome')?.disable();
      // dependentsNumber se mantiene habilitado
      this.clientForm.get('isDependent')?.disable();
      this.clientForm.get('workingYears')?.disable();

      this.clientForm.get('currencyId')?.clearValidators();
      this.clientForm.get('monthlyIncome')?.clearValidators();
      this.clientForm.get('isDependent')?.clearValidators();

    } else if (value === 'true') {
      this.clientForm.get('currencyId')?.enable();
      // dependentsNumber ya está habilitado
      this.clientForm.get('isDependent')?.enable();
      this.clientForm.get('workingYears')?.enable();

      this.clientForm.get('currencyId')?.setValidators([Validators.required]);
      this.clientForm.get('monthlyIncome')?.setValidators([Validators.required, Validators.min(0)]);
      this.clientForm.get('isDependent')?.setValidators([Validators.required]);
    }

    this.clientForm.get('currencyId')?.updateValueAndValidity();
    this.clientForm.get('monthlyIncome')?.updateValueAndValidity();
    this.clientForm.get('isDependent')?.updateValueAndValidity();
  }

  // ✨ VERSIÓN SIN CONVERSIÓN (mantiene el mismo monto)
  onCurrencyChange(newCurrencyId: number, previousCurrencyId: number | null): void {
    if (newCurrencyId && this.clientForm.get('isWorking')?.value === 'true') {
      // Simplemente habilitar el campo sin conversión
      this.clientForm.get('monthlyIncome')?.enable();
    } else {
      this.clientForm.get('monthlyIncome')?.disable();
      if (!newCurrencyId) {
        this.clientForm.patchValue({ monthlyIncome: '' });
      }
    }
  }

  /* ✨ VERSIÓN CON CONVERSIÓN AUTOMÁTICA (comentada)
  onCurrencyChange(newCurrencyId: number, previousCurrencyId: number | null): void {
    if (newCurrencyId && this.clientForm.get('isWorking')?.value === 'true') {
      const currentIncome = parseFloat(this.clientForm.get('monthlyIncome')?.value) || 0;

      if (currentIncome > 0 && previousCurrencyId && previousCurrencyId !== newCurrencyId) {
        const previousCurrency = this.currencies().find(c => c.id === previousCurrencyId);
        const newCurrency = this.currencies().find(c => c.id === newCurrencyId);

        let convertedIncome = currentIncome;

        if (previousCurrency?.code === 'PEN' && newCurrency?.code === 'USD') {
          convertedIncome = currentIncome / this.EXCHANGE_RATE;
        }
        else if (previousCurrency?.code === 'USD' && newCurrency?.code === 'PEN') {
          convertedIncome = currentIncome * this.EXCHANGE_RATE;
        }

        this.clientForm.patchValue({
          monthlyIncome: convertedIncome.toFixed(2)
        }, { emitEvent: false });
      }

      this.clientForm.get('monthlyIncome')?.enable();
    } else {
      this.clientForm.get('monthlyIncome')?.disable();
      if (!newCurrencyId) {
        this.clientForm.patchValue({ monthlyIncome: '' });
      }
    }
  }
  */

  getCurrencyName(currencyId: number): string {
    const currency = this.currencies().find(c => c.id === currencyId);
    return currency ? `${currency.name} (${currency.symbol})` : '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCurrencySymbolForLabel(): string {
    return this.currencySymbol();
  }

  getMaxIncomeFormatted(): string {
    return this.MAX_INCOME_FOR_INTEGRATOR.toLocaleString('es-PE');
  }

  getCurrencyDisplayName(currency: CurrencyResource): string {
    const translations: { [key: string]: string } = {
      'Dollars': 'Dólares',
      'dollars': 'Dólares',
      'Soles': 'Soles',
      'soles': 'Soles'
    };
    return translations[currency.name] || currency.name;
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const isWorking = this.clientForm.get('isWorking')?.value === 'true';

    const formData = {
      firstname: this.clientForm.value.firstname,
      lastname: this.clientForm.value.lastname,
      dni: this.clientForm.value.dni,
      age: this.clientForm.value.age,
      email: this.clientForm.value.email,
      dependentsNumber: this.clientForm.value.dependentsNumber, // ✨ Siempre se envía
      isWorking: isWorking,
      monthlyIncome: isWorking ? parseFloat(this.clientForm.get('monthlyIncome')?.value) || 0 : 0,
      isDependent: isWorking ? this.clientForm.get('isDependent')?.value === 'true' : false,
      workingYears: isWorking ? parseFloat(this.clientForm.value.workingYears) || 0 : 0,
      isIntegrator: this.clientForm.value.isIntegrator,
      currencyId: isWorking ? this.clientForm.value.currencyId : 1
    };

    this.dialogRef.close(formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
