import { Component } from '@angular/core';
import { NavbarComponent } from '../common/navbar/navbar.component';

import { UtilsService } from '../../services/utils.service';
import { NavigationExtras, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
/**
 * @description
 * Componente principal del login
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private utils: UtilsService,
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.goToKanban();
  }
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return `${controlName} is required.`;
      } else if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${controlName} must be at least ${requiredLength} characters long.`;
      } else if (control.errors['email']) {
        return 'Invalid email format.';
      }
    }
    return '';
  }
  submitForm() {
    if (this.loginForm.valid) {
      let email = this.loginForm.get('email')!.value;
      localStorage.setItem('active_user', JSON.stringify({ email: email }));
    } else {
      console.log('Nope');
    }
    return null;
  }
  goToKanban() {
    if (this.utils.getActiveUser() != null) {
      this.router.navigate(['kanban']);
    }
    console.log('Go to kanban!');
  }
 

}
