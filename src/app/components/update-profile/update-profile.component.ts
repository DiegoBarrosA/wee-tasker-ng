import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NavbarComponent } from "../common/navbar/navbar.component";
interface UserType {
  id: number;
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
  selector: "app-update-profile",
  imports: [FormsModule, NavbarComponent],
  templateUrl: "./update-profile.component.html",
  styleUrl: "./update-profile.component.css",
})
export class UpdateProfileComponent implements OnInit {
  user: User = {
    id: 0,
    email: "",
    username: "",
    password: "",
    birthdate: new Date(),
    type: { id: 1, name: "Standard" },
  };

  ngOnInit() {
    const activeUser = JSON.parse(localStorage.getItem("active_user") || "{}");
    const parsedUser = {
      ...activeUser,
      birthdate: new Date(activeUser.birthdate),
    };
    this.user = parsedUser;
  }

  onSubmit() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: User) => u.id === this.user.id);

    if (userIndex !== -1) {
      const existingUser = users[userIndex];
      const updatedUser = {
        ...this.user,
        type: existingUser.type,
      };

      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("active_user", JSON.stringify(updatedUser));
    }
  }
}
