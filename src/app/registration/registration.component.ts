// Complete implementation for QE-4527 - User Registration and Email Confirmation
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isSubmitting = false;
  registrationSuccess = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submit(): void {
    if (this.registrationForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const { email, password } = this.registrationForm.value;

    this.registrationService.register({ email, password }).subscribe({
      next: () => {
        this.registrationSuccess = true;
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'Registration failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
