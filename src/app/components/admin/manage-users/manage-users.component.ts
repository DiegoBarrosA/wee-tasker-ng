import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { HttpClientModule } from "@angular/common/http";

import { JsonService } from "../../../services/json.service";
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
  selector: "app-manage-users",
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: "./manage-users.component.html",
  styleUrl: "./manage-users.component.css",
  providers: [JsonService],
})
export class ManageUsersComponent {
  constructor(private jsonService: JsonService) {
    this.jsonService.getJsonData("users").subscribe((data: any) => {
      this.users = data["users"] || [];
    });
  }
  users: User[] = [];
  userTypes: UserType[] = [
    { id: 0, name: "administrator" },
    { id: 1, name: "enduser" },
  ];
  searchTerm: string = "";
  showModal: boolean = false;
  editMode: boolean = false;
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

  editUser(user: User) {
    this.editMode = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  deleteUser(user: User) {
    this.users = this.users.filter((u) => u.id !== user.id);
    this.jsonService.updateObject("users", this.users);
  }

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
