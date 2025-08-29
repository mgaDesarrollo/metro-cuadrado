import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'weak';
    if (strength < 70) return 'medium';
    return 'strong';
  }

  getPasswordStrength(): number {
    const password = this.form.get('password')?.value || '';
    let score = 0;
    if (password.length >= 8) score += 30;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    return Math.min(score, 100);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'Débil';
    if (strength < 70) return 'Media';
    return 'Fuerte';
  }
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.noNumbersValidator]],
    phone: ['', [Validators.required, this.phoneValidator]],
    company: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), this.passwordValidator]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]],
    newsletter: [false]
  }, { validators: this.passwordMatchValidator });

  // Validadores personalizados
  noNumbersValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value && /\d/.test(value)) {
      return { 'hasNumbers': true };
    }
    return null;
  }

  phoneValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return { 'invalidPhone': true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { 'weakPassword': true };
    }
    return null;
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    
    this.loading = true;
    try {
      const { confirmPassword, acceptTerms, ...userData } = this.form.value;
      const success = await this.auth.register(userData);
      
      if (success) {
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        this.router.navigateByUrl('/auth/login');
      } else {
        alert('Error: El correo electrónico ya está registrado.');
      }
    } catch (error) {
      alert('Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      this.loading = false;
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field?.hasError('email')) {
      return 'Ingresa un correo electrónico válido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  get passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch') && 
           (this.form.get('confirmPassword')?.touched || false);
  }
}
