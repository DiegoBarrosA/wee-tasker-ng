import { Component } from '@angular/core';

import { NavbarComponent } from '../common/navbar/navbar.component';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  birthdate: Date;
}

@Component({
  selector: 'app-register',
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeat_password: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        birthdate: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value ===
      formGroup.get('repeat_password')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      this.saveUserToLocalStorage({
        id: users.length + 1,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.username,
        birthdate: this.registerForm.value.birthdate
      });
      console.log(this.registerForm.value);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) {
      return `${field} is required`;
    } else if (control?.hasError('email')) {
      return 'Invalid email format';
    } else if (control?.hasError('minlength')) {
      return `${field} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    } else if (control?.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  saveUserToLocalStorage(user: User) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get repeat_password() {
    return this.registerForm.get('repeat_password');
  }
  get username() {
    return this.registerForm.get('username');
  }
  get birthdate() {
    return this.registerForm.get('birthdate');
  }
}
