import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { KanbanComponent } from "./components/kanban/kanban.component";
import { RegisterComponent } from "./components/register/register.component";

import { UpdateProfileComponent } from "./components/update-profile/update-profile.component";
import { ManageUsersComponent } from "./components/admin/manage-users/manage-users.component";
export const routes: Routes = [
  { path: "kanban", component: KanbanComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "admin/manage-users", component: ManageUsersComponent },

  { path: "profile", component: UpdateProfileComponent },
  { path: "**", redirectTo: "login" },
];
