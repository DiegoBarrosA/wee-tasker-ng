import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { NavbarComponent } from "../../common/navbar/navbar.component";
import { HttpClientModule } from "@angular/common/http";

import { JsonService } from "../../../services/json.service";

/**
 * Interface defining user type properties
 */
interface UserType {
  /** Unique identifier for the type of user */
  id: number;
  /** Name for the type of user */
  name: string;
}

/**
 * Interface defining user properties
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
 * Component for managing users in the application
 */
@Component({
  selector: "app-manage-users",
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NavbarComponent],
  templateUrl: "./manage-users.component.html",
  styleUrl: "./manage-users.component.css",
  providers: [JsonService],
})
export class ManageUsersComponent {
  /** Array of all users */
  users: User[] = [];
  /** Available user types */
  userTypes: UserType[] = [
    { id: 0, name: "administrator" },
    { id: 1, name: "enduser" },
  ];
  /** Search term for filtering users */
  searchTerm: string = "";
  /** Controls visibility of user modal */
  showModal: boolean = false;
  /** Determines if component is in edit mode */
  editMode: boolean = false;
  /** Currently selected/edited user */
  currentUser: User = {
    id: 0,
    email: "",
    password: "",
    username: "",
    birthdate: new Date(),
    type: {
      id: 1,
      name: "enduser",
    },
  };

  /**
   * Constructor initializes the component and loads user data
   * @param jsonService Service for handling JSON data operations
   */
  constructor(private jsonService: JsonService) {
    this.jsonService.getJsonData("users").subscribe((data: any) => {
      this.users = data["users"] || [];
    });
  }

  /**
   * Filters users based on search term
   * @returns Filtered array of users
   */
  get filteredUsers(): User[] {
    return this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.type.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  /**
   * Prepares the modal for adding a new user
   */
  addUser() {
    this.editMode = false;
    this.currentUser = {
      id: 0,
      email: "",
      password: "",
      username: "",
      birthdate: new Date(),
      type: {
        id: 1,
        name: "enduser",
      },
    };
    this.showModal = true;
  }

  /**
   * Prepares the modal for editing an existing user
   * @param user The user to be edited
   */
  editUser(user: User) {
    this.editMode = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  /**
   * Deletes a user from the system
   * @param user The user to be deleted
   */
  deleteUser(user: User) {
    this.users = this.users.filter((u) => u.id !== user.id);
    this.jsonService.updateObject("users", this.users);
  }

  /**
   * Saves the current user (creates new or updates existing)
   */
  saveUser() {
    if (this.editMode) {
      const index = this.users.findIndex((u) => u.id === this.currentUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.currentUser };
      }
    } else {
      const newUser = {
        ...this.currentUser,
        id: this.users.length + 1,
      };
      this.users.push(newUser);
    }
    this.jsonService.updateObject("users", this.users);
    this.closeModal();
  }

  /**
   * Closes the user modal and resets the current user
   */
  closeModal() {
    this.showModal = false;
    this.currentUser = {
      id: 0,
      email: "",
      password: "",
      username: "",
      birthdate: new Date(),
      type: {
        id: 1,
        name: "enduser",
      },
    };
  }
}
