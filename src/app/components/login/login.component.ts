import { Component } from "@angular/core";
import { NavbarComponent } from "../common/navbar/navbar.component";

import { HttpClientModule } from "@angular/common/http";
import { UtilsService } from "../../services/utils.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { JsonService } from "../../services/json.service";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** User's username */
  username: string;
  /** User's date of birth */
  birthdate: Date;
  /** User's type*/
  type: UserType;
}
/**
 * Component that handles user login functionality
 * @description Manages the login form and authentication process
 */
@Component({
  selector: "app-login",
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,
    HttpClientModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",

  providers: [JsonService],
})
export class LoginComponent {
  /** Form group for the login form */
  loginForm!: FormGroup;
  userTypes: any[] = [];
  users: any[] = [];
  /**
   * Creates an instance of LoginComponent
   * @param fb - FormBuilder service for creating reactive forms
   * @param router - Router service for navigation
   * @param utils - Utility service for common functionality
   */
  constructor(
    private jsonService: JsonService,
    private fb: FormBuilder,
    private router: Router,
    private utils: UtilsService,
  ) {}

  /**
   * Lifecycle hook that is called after component initialization
   * Initializes the login form and checks if user should be redirected to kanban only if they user is already authenticated.
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
    this.goToKanban();
    this.jsonService.getJsonData("user_types").subscribe((data) => {
      this.userTypes = data["user_types"];
    });
    this.jsonService.getJsonData("users").subscribe((data) => {
      this.users = data["users"];
      console.log(this.users);
    });
  }

  /**
   * Gets error message for form control validation
   * @param controlName - Name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.errors) {
      if (control.errors["required"]) {
        return `${controlName} is required.`;
      } else if (control.errors["minlength"]) {
        const requiredLength = control.errors["minlength"].requiredLength;
        return `${controlName} must be at least ${requiredLength} characters long.`;
      } else if (control.errors["email"]) {
        return "Invalid email format.";
      }
    }
    return "";
  }

  /**
   * Handles form submission
   * Validates credentials and stores active user in localStorage if valid
   * @returns null
   */
  submitForm() {
    console.log(this.userTypes);
    if (this.loginForm.valid) {
      let email = this.loginForm.get("email")!.value;
      let password = this.loginForm.get("password")!.value;
      let users = this.users;
      const user = users.find(
        (current_user: User) =>
          current_user.email === email && current_user.password === password,
      );
      if (user) {
        localStorage.setItem("active_user", JSON.stringify(user));

        this.goToKanban();
      } else {
        alert("Email or password is invalid");
      }
    } else {
    }
    return null;
  }

  /**
   * Navigates to the kanban board if the user is authenticated
   */
  goToKanban() {
    if (this.utils.getActiveUser() != null) {
      this.router.navigate(["kanban"]);
    }
    console.log("Go to kanban!");
  }
}
