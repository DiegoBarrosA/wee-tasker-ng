import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { UtilsService } from '../../services/utils.service';
import { NavbarComponent } from '../common/navbar/navbar.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let utilsService: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent,NavbarComponent,ReactiveFormsModule, RouterTestingModule],
      providers: [UtilsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    utilsService = TestBed.inject(UtilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with email and password controls', () => {
    component.ngOnInit();
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should return the correct error message for required fields', () => {
    component.loginForm.controls['email'].setValue('');
    expect(component.getErrorMessage('email')).toBe('email is required.');

    component.loginForm.controls['password'].setValue('');
    expect(component.getErrorMessage('password')).toBe('password is required.');
  });

  it('should return the correct error message for invalid email format', () => {
    component.loginForm.controls['email'].setValue('invalid-email');
    expect(component.getErrorMessage('email')).toBe('Invalid email format.');
  });

  it('should return the correct error message for password min length', () => {
    component.loginForm.controls['password'].setValue('short');
    expect(component.getErrorMessage('password')).toBe(
      'password must be at least 6 characters long.',
    );
  });
});
