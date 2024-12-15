import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { JsonService } from "../../services/json.service";
import { NavbarComponent } from "../common/navbar/navbar.component";
import { NgForm } from "@angular/forms";
import { PassThrough } from "stream";
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
  imports: [FormsModule, NavbarComponent, HttpClientModule],
  templateUrl: "./update-profile.component.html",
  styleUrl: "./update-profile.component.css",
  providers: [JsonService],
})
export class UpdateProfileComponent implements OnInit {
  constructor(private jsonService: JsonService) {
    this.jsonService.getJsonData("users").subscribe((data: any) => {
      this.users = data["users"] || [];
    });
  }
  user: User = {
    id: 0,
    email: "",
    username: "",
    password: "",
    birthdate: new Date(),
    type: { id: 1, name: "enduser" },
  };
  users: User[] = [];
  ngOnInit() {
    const activeUser = JSON.parse(localStorage.getItem("active_user") || "{}");
    const parsedUser = {
      ...activeUser,
      birthdate: new Date(activeUser.birthdate),
    };
    this.user = parsedUser;
  }
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
