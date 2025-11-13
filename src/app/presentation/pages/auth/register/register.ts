import { Component } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {RealStateCompanyService} from '../../../../services/real-state-company-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SignUpRequest} from '../../../../model/auth.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private realStateService: RealStateCompanyService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      companyName: ['', Validators.required],
      username: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      companyEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const signUpRequest: SignUpRequest = {
        companyName: this.registerForm.value.companyName,
        username: this.registerForm.value.username,
        ruc: this.registerForm.value.ruc,
        companyEmail: this.registerForm.value.companyEmail,
        password: this.registerForm.value.password
      };

      this.realStateService.signUp(signUpRequest).subscribe({
        next: (response) => {
          this.isLoading = false;

          console.log('Registro exitoso:', response);

          this.snackBar.open(
            '¡Registro exitoso! Ahora puedes iniciar sesión',
            'Cerrar',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );

          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);

          let errorMessage = 'Ocurrió un error al registrar la empresa';

          if (error.status === 400) {
            errorMessage = 'Los datos ingresados no son válidos. Verifica e intenta nuevamente.';
          } else if (error.status === 409) {
            errorMessage = 'Ya existe una empresa con este username, email o RUC.';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor';
          }

          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
