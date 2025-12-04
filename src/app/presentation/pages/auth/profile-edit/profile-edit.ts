import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Router} from '@angular/router';
import {RealStateCompanyService} from '../../../../services/real-state-company-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UpdateRealStateCompanyRequest} from '../../../../model/auth.model';

@Component({
  selector: 'app-profile-edit',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatProgressSpinner
  ],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css',
})
export class ProfileEdit implements OnInit{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private realStateService = inject(RealStateCompanyService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  profileForm: FormGroup;
  companyId: number | null = null;

  // Computed para la inicial del avatar
  userInitial = computed(() => {
    const companyName = localStorage.getItem('companyName');
    const username = localStorage.getItem('username');
    const name = companyName || username || 'U';
    return name.charAt(0).toUpperCase();
  });

  constructor() {
    this.profileForm = this.fb.group({
      companyName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      companyEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.required]] // Opcional
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  /**
   * Cargar datos del usuario desde localStorage
   */
  loadUserData(): void {
    const companyId = localStorage.getItem('companyId');
    const companyName = localStorage.getItem('companyName');
    const username = localStorage.getItem('username');
    const companyEmail = localStorage.getItem('companyEmail');
    const ruc = localStorage.getItem('ruc');

    if (!companyId) {
      this.snackBar.open('No se encontró información del usuario', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/dashboard']);
      return;
    }

    this.companyId = +companyId;

    // Rellenar el formulario con los datos actuales
    this.profileForm.patchValue({
      companyName: companyName || '',
      username: username || '',
      ruc: ruc || '',
      companyEmail: companyEmail || '',
      password: '' // Dejar vacío por seguridad
    });

    // Opcional: para el backend obtener el get
    // this.getRealStateCompanyData();
  }

  /**
   por si acaso
   */
  getRealStateCompanyData(): void {
    if (!this.companyId) return;

    this.isLoading.set(true);
    this.realStateService.getRealStateCompanyById(this.companyId).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.profileForm.patchValue({
          companyName: response.companyName,
          username: response.username,
          companyEmail: response.companyEmail,
          password: response.password
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error al cargar datos:', error);
      }
    });
  }

  /**
   * Enviar formulario actualizado
   */
  onSubmit(): void {
    if (this.profileForm.invalid || !this.companyId) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const updateRequest: UpdateRealStateCompanyRequest = {
      companyName: this.profileForm.value.companyName,
      username: this.profileForm.value.username,
      ruc: this.profileForm.value.ruc,
      companyEmail: this.profileForm.value.companyEmail,
      password: this.profileForm.value.password // Placeholder si no cambia
    };

    this.realStateService.updateRealStateCompany(this.companyId, updateRequest).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        // Actualizar localStorage con los nuevos datos
        localStorage.setItem('companyName', response.companyName);
        localStorage.setItem('username', response.username);
        localStorage.setItem('companyEmail', response.companyEmail);
        this.snackBar.open('¡Perfil actualizado exitosamente!', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/private/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error al actualizar perfil:', error);

        let errorMessage = 'Ocurrió un error al actualizar el perfil';

        // Manejo específico de errores
        if (error.status === 400) {
          // Error de validación
          const errorDetail = error.error?.message || error.error || '';

          if (errorDetail.toLowerCase().includes('ruc')) {
            errorMessage = 'El RUC ingresado ya está registrado por otra empresa';
          } else if (errorDetail.toLowerCase().includes('email')) {
            errorMessage = 'El correo electrónico ya está en uso por otra cuenta';
          } else if (errorDetail.toLowerCase().includes('username')) {
            errorMessage = 'El nombre de usuario ya está en uso';
          } else {
            errorMessage = 'Los datos ingresados no son válidos. Verifica e intenta nuevamente.';
          }
        } else if (error.status === 409) {
          // Conflicto - datos duplicados
          errorMessage = 'Ya existe otra empresa con el mismo RUC, email o nombre de usuario';
        } else if (error.status === 404) {
          errorMessage = 'No se encontró la empresa. Por favor, inicia sesión nuevamente.';
          setTimeout(() => {
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        }

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Cancelar y volver al dashboard
   */
  onCancel(): void {
    this.router.navigate(['/private/dashboard']);
  }
}
