import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { NavbarComponent } from '../common/navbar/navbar.component';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent, NavbarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    component.ngOnInit();
    expect(component.registerForm.contains('email')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('repeat_password')).toBeTruthy();
    expect(component.registerForm.contains('username')).toBeTruthy();
    expect(component.registerForm.contains('birthdate')).toBeTruthy();
  });

  it('should return the correct error message for required fields', () => {
    component.registerForm.controls['email'].setValue('');
    expect(component.getErrorMessage('email')).toBe('email is required');

    component.registerForm.controls['password'].setValue('');
    expect(component.getErrorMessage('password')).toBe('password is required');

    component.registerForm.controls['repeat_password'].setValue('');
    expect(component.getErrorMessage('repeat_password')).toBe('repeat_password is required');

    component.registerForm.controls['username'].setValue('');
    expect(component.getErrorMessage('username')).toBe('username is required');

    component.registerForm.controls['birthdate'].setValue('');
    expect(component.getErrorMessage('birthdate')).toBe('birthdate is required');
  });

  it('should return the correct error message for invalid email format', () => {
    component.registerForm.controls['email'].setValue('invalid-email');
    expect(component.getErrorMessage('email')).toBe('Invalid email format');
  });

  it('should return the correct error message for password min length', () => {
    component.registerForm.controls['password'].setValue('short');
    expect(component.getErrorMessage('password')).toBe('password must be at least 6 characters');
  });

  it('should return the correct error message for username min length', () => {
    component.registerForm.controls['username'].setValue('ab');
    expect(component.getErrorMessage('username')).toBe('username must be at least 3 characters');
  });
  it('should not save user to localStorage if form is invalid', () => {
    spyOn(localStorage, 'setItem');

    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['repeat_password'].setValue('');
    component.registerForm.controls['username'].setValue('');
    component.registerForm.controls['birthdate'].setValue('');

    component.onSubmit();

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
