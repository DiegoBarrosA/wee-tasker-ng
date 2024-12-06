import { Component } from "@angular/core";

import { Router } from "@angular/router";
import { NavbarComponent } from "../common/navbar/navbar.component";
import { UtilsService } from "../../services/utils.service";
import { CommonModule } from "@angular/common";

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

/**
 * Interface that defines a UserType object structure
 * @interface UserType
 */
interface UserType {
  /** Unique identifier for the type of user */
  id: number;
  /** Name for the type of user */
  name: string;
}
interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  birthdate: Date;
  type: UserType;
}

@Component({
  selector: "app-register",
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private router: Router,
  ) {}

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasNumber && hasSpecialChar;

    if (!valid) {
      return {
        passwordComplexity: true,
        requirements: {
          upperCase: !hasUpperCase,
          number: !hasNumber,
          specialChar: !hasSpecialChar,
        },
      };
    }

    return null;
  }

  ngOnInit() {
    this.goToKanban();
    this.registerForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidator,
          ],
        ],
        repeat_password: ["", [Validators.required]],
        username: ["", [Validators.required, Validators.minLength(3)]],
        birthdate: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  userTypes: UserType[] = [
    { id: 0, name: "administrator" },
    { id: 1, name: "enduser" },
  ];

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get("password");
    const repeatPassword = formGroup.get("repeat_password");

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      let user: User = {
        id: users.length + 1,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.username,
        birthdate: this.registerForm.value.birthdate,
        type: this.userTypes[1],
      };
      this.saveUserToLocalStorage(user);
      localStorage.setItem("active_user", JSON.stringify(user));

      window.location.reload();
    }

    console.log(this.registerForm.value);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError("required")) {
      return `${field} is required`;
    } else if (control?.hasError("email")) {
      return "Invalid email format";
    } else if (control?.hasError("minlength")) {
      return `${field} must be at least ${control.errors?.["minlength"].requiredLength} characters`;
    } else if (control?.hasError("mismatch")) {
      return "Passwords do not match";
    } else if (control?.hasError("passwordComplexity")) {
      const reqs = control.errors?.["requirements"];
      let message = "Password must contain ";
      if (reqs.upperCase) message += "an uppercase letter, ";
      if (reqs.number) message += "a number, ";
      if (reqs.specialChar) message += "a special character, ";
      return message.slice(0, -2);
    }
    return "";
  }

  saveUserToLocalStorage(user: User) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  get email() {
    return this.registerForm.get("email");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get repeat_password() {
    return this.registerForm.get("repeat_password");
  }
  get username() {
    return this.registerForm.get("username");
  }
  get birthdate() {
    return this.registerForm.get("birthdate");
  }
  goToKanban() {
    if (this.utils.getActiveUser() != null) {
      this.router.navigate(["kanban"]);
    }
    console.log("Go to kanban!");
  }
}
