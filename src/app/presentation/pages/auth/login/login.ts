import {Component} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Router, RouterLink} from '@angular/router';
import {MatInput} from '@angular/material/input';
import {RealStateCompanyService} from '../../../../services/real-state-company-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SignInRequest} from '../../../../model/auth.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    MatIcon,
    MatCard,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatIconButton,
    MatInput,
    RouterLink,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login{
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private realStateService: RealStateCompanyService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const signInRequest: SignInRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.realStateService.signIn(signInRequest).subscribe({
        next: (response) => {
          this.isLoading = false;

          localStorage.setItem('companyId', response.id.toString());
          localStorage.setItem('companyName', response.companyName);
          localStorage.setItem('username', response.username);
          localStorage.setItem('companyEmail', response.companyEmail);
          localStorage.setItem('ruc', response.ruc);
          localStorage.setItem('isAuthenticated', 'true');

          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberedUsername', response.username);
          }

          this.snackBar.open(`¡Bienvenido ${response.companyName}!`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });

          this.router.navigate(['private/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);

          let errorMessage = 'Ocurrió un error al iniciar sesión';

          if (error.status === 400 || error.status === 404) {
            errorMessage = 'Usuario o contraseña incorrectos';
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
      this.loginForm.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
    }
  }
}
