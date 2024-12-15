import { Component } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { JsonService } from "../../services/json.service";
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

/**
 * Interface that defines a User object structure
 * @interface User
 */
interface User {
  /** Unique identifier for the user */
  id: number;
  /** Email address of the user */
  email: string;
  /** Password for user authentication */
  password: string;
  /** Username for display */
  username: string;
  /** User's date of birth */
  birthdate: Date;
  /** Type of user account */
  type: UserType;
}

/**
 * Component responsible for user registration functionality
 * @description Handles user registration form, validation, and submission
 */
@Component({
  selector: "app-register",
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
  providers: [JsonService],
})
export class RegisterComponent {
  /** Form group for the registration form */
  registerForm!: FormGroup;
  /** Array to store user data */
  users: any[] = [];
  /** Array to store user types */
  userTypes: any[] = [];

  /**
   * Creates an instance of RegisterComponent
   * @param jsonService Service for handling JSON data operations
   * @param fb FormBuilder service for creating reactive forms
   * @param utils Utility service for common functions
   * @param router Router service for navigation
   */
  constructor(
    private jsonService: JsonService,
    private fb: FormBuilder,
    private utils: UtilsService,
    private router: Router,
  ) {}

  /**
   * Custom validator for password complexity
   * @param control Form control to validate
   * @returns Validation errors or null if valid
   */
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

  /**
   * Custom validator for birthdate
   * @param control Form control to validate
   * @returns Validation errors or null if valid
   */
  birthdateValidator(control: AbstractControl): ValidationErrors | null {
    const birthdate = new Date(control.value);
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);

    if (birthdate > today) {
      return { futureDate: true };
    }
    if (birthdate < hundredYearsAgo) {
      return { tooOld: true };
    }

    return null;
  }

  /**
   * Lifecycle hook that initializes component
   * @description Sets up form controls and fetches initial data
   */
  ngOnInit() {
    this.goToKanban();
    this.jsonService.getJsonData("user_types").subscribe((data) => {
      this.userTypes = data["user_types"];
    });
    this.jsonService.getJsonData("users").subscribe((data) => {
      this.users = data["users"];
      console.log(this.users);
    });
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
        birthdate: ["", [Validators.required, this.birthdateValidator]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  /**
   * Validates that password and repeat password match
   * @param formGroup Form group to validate
   * @returns Validation errors or null if valid
   */
  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get("password");
    const repeatPassword = formGroup.get("repeat_password");

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  /**
   * Handles form submission
   * @description Creates new user if form is valid
   */
  onSubmit() {
    if (this.registerForm.valid) {
      const users = this.users;
      let user: User = {
        id: users.length + 1,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.username,
        birthdate: this.registerForm.value.birthdate,
        type: this.userTypes[1],
      };
      users.push(user);
      console.log("-----------------------------------------------------");
      console.log(users);
      this.jsonService.updateObject("users", users);
      localStorage.setItem("active_user", JSON.stringify(user));
    }

    console.log(this.registerForm.value);
  }

  /**
   * Gets error message for form field
   * @param field Name of the form field
   * @returns Error message string
   */
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
    } else if (control?.hasError("futureDate")) {
      return "Birthdate cannot be in the future";
    } else if (control?.hasError("tooOld")) {
      return "Birthdate cannot be more than 100 years ago";
    }
    return "";
  }

  /**
   * Saves user data to localStorage
   * @param user User object to save
   */
  saveUserToLocalStorage(user: User) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  /** Getter for email form control */
  get email() {
    return this.registerForm.get("email");
  }

  /** Getter for password form control */
  get password() {
    return this.registerForm.get("password");
  }

  /** Getter for repeat password form control */
  get repeat_password() {
    return this.registerForm.get("repeat_password");
  }

  /** Getter for username form control */
  get username() {
    return this.registerForm.get("username");
  }

  /** Getter for birthdate form control */
  get birthdate() {
    return this.registerForm.get("birthdate");
  }

  /**
   * Navigates to kanban board if user is active
   */
  goToKanban() {
    if (this.utils.getActiveUser() != null) {
      this.router.navigate(["kanban"]);
    }
    console.log("Go to kanban!");
  }
}
