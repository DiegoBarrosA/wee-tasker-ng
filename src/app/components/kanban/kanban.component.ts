import { Component } from '@angular/core';
import { NavbarComponent } from '../common/navbar/navbar.component';

import { CommonModule } from '@angular/common';
interface Status {
  id: number;
  name: string;
}

interface Task {
  id: number;
  summary: string;
  description: string;
  status: Status;
}

@Component({
  selector: 'app-kanban',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css',
})

export class KanbanComponent {
  ngOnInit(): void {}
  statuses: Status[] = [
    { id: 0, name: 'To Do' },
    { id: 1, name: 'WIP' },
    { id: 2, name: 'Done' },
  ];
  show_dialog = false; 
  createTask(statuses: Array<Status>): void {
    this.show_dialog =true;
    let tasks = this.getTasks('tasks');
    tasks.push({
      id: 0,
      summary: 'my first task',
      description: 'Do my shores',
      status: statuses[0],
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Your tasks: ' + tasks);
  }
  getTasks(storageKey: string): Array<Task> {
    const storedArray = localStorage.getItem(storageKey);
    let myArray: Task[] = [];
    if (storedArray) {
      myArray = JSON.parse(storedArray);
    }
    return myArray;
  }
}
