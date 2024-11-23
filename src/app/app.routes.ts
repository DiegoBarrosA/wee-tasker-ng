import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { KanbanComponent } from './components/kanban/kanban.component';

export const routes: Routes = [
  { path: 'kanban', component: KanbanComponent },

  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
