import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { JsonService } from "../../services/json.service";
import { NavbarComponent } from "../common/navbar/navbar.component";
import { NgForm } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";

/**
 * Interface defining the structure of a user type
 */
interface UserType {
  /** Unique identifier for the user type */
  id: number;
  /** Name of the user type */
  name: string;
}

/**
 * Interface defining the structure of a user
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
  /** User's type information */
  type: UserType;
}

/**
 * Component for updating user profile information
 */
@Component({
  selector: "app-update-profile",
  imports: [FormsModule, NavbarComponent, HttpClientModule],
  templateUrl: "./update-profile.component.html",
  styleUrl: "./update-profile.component.css",
  providers: [JsonService, DatePipe],
})
export class UpdateProfileComponent implements OnInit {
  /**
   * Creates an instance of UpdateProfileComponent
   * @param jsonService Service for handling JSON data operations
   */
  constructor(
    private jsonService: JsonService,
    private datePipe: DatePipe,
  ) {
    this.jsonService.getJsonData("users").subscribe((data: any) => {
      this.users = data["users"] || [];
    });
  }

  /**
   * Current user object
   */
  user: User = {
    id: 0,
    email: "",
    username: "",
    password: "",
    birthdate: new Date(),
    type: { id: 1, name: "enduser" },
  };
  /**
   * Array containing all users
   */
  users: User[] = [];
  bd = "";
  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   */
  ngOnInit() {
    const activeUser = JSON.parse(localStorage.getItem("active_user") || "{}");
    const parsedUser = {
      ...activeUser,
      birthdate: new Date(activeUser.birthdate),
    };
    this.user = parsedUser;
    this.bd = this.datePipe.transform(this.user.birthdate, "yyyy-MM-dd") || "";
    console.log("Look" + this.bd);
  }

  /**
   * Handles form submission for updating user profile
   * @param form NgForm object containing form data
   */
  onSubmit(form: NgForm) {
    let password = form.value.password;
    console.log(
      "Pasword: " + password + "  Actual pass: " + this.user.password,
    );
    if (password == this.user.password) {
      const userIndex = this.users.findIndex(
        (u: User) => u.id === this.user.id,
      );
      if (userIndex !== -1) {
        const existingUser = this.users[userIndex];
        const updatedUser = {
          ...this.user,
          type: existingUser.type,
        };
        this.users[userIndex] = updatedUser;
        this.jsonService.updateObject("users", this.users);
        localStorage.setItem("active_user", JSON.stringify(updatedUser));
      }
    } else {
      console.log("Incorrect password");
    }
  }
}
