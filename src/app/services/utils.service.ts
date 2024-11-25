import { Injectable } from "@angular/core";
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

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor() {}
  getActiveUser(): User | null {
    const storedUser = localStorage.getItem("active_user");
    if (!storedUser) return null;

    let data: any = JSON.parse(storedUser);
    if (data) {
      let user: User = {
        id: data.id,
        email: data.email,
        password: data.password,
        username: data.username,
        birthdate: data.birthdate,
        type: data.type,
      };
      console.log("Name " + user.username);
      return user;
    } else {
      return null;
    }
  }
}
