import { Component } from '@angular/core';
import { NavbarComponent } from '../common/navbar/navbar.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
interface Status {
  id: number;
  name: string;
  tailwind_class: string;
}

interface Task {
  id: number;
  summary: string;
  description: string;
  status: Status;
}

@Component({
  selector: 'app-kanban',
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css',
})
export class KanbanComponent {
  taskCreationForm!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.taskCreationForm = this.fb.group({
      summary: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.required]],
    });
  }
  getErrorMessage(controlName: string): string {
    const control = this.taskCreationForm.get(controlName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return `${controlName} is required.`;
      } else if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${controlName} must be at least ${requiredLength} characters long.`;
      } else if (control.errors['email']) {
        return 'Invalid email format.';
      } else if (control.errors['maxlength']) {
        const requiredLength = control.errors['maxlength'].requiredLength;
        return `${controlName} can't be more thant ${requiredLength} characters long.`;
      }
    }
    return '';
  }
  statuses: Status[] = [
    {
      id: 0,
      name: 'To Do',
      tailwind_class: 'bg-red-100 text-xs w-max p-1 rounded mr-2 text-gray-700',
    },
    {
      id: 1,
      name: 'WIP',
      tailwind_class:
        'bg-yellow-100 text-xs w-max p-1 rounded mr-2 text-gray-700',
    },
    {
      id: 2,
      name: 'Done',
      tailwind_class:
        'bg-green-100 text-xs w-max p-1 rounded mr-2 text-gray-700',
    },
  ];

  tasks = this.getTasks('tasks');

  show_dialog = false;
  submitTask(statuses: Array<Status>) {
    if (this.taskCreationForm.valid) {
      let summary = this.taskCreationForm.get('summary')?.value;
      let description = this.taskCreationForm.get('description')?.value;

      let tasks = this.getTasks('tasks');
      tasks.push({
        id: 0,
        summary: summary,
        description: description,
        status: statuses[0],
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.show_dialog = false;

      window.location.reload();
    }
  }

  getTasks(storageKey: string): Array<Task> {
    const storedArray = localStorage.getItem(storageKey);
    let myArray: Task[] = [];
    if (storedArray) {
      myArray = JSON.parse(storedArray);
    }
    return myArray;
  }

  onStatusChange(task: Task, event: any) {
    const selectedStatusId = parseInt(event.target.value, 10);
    const selectedStatus = this.statuses.find(
      (status) => status.id === selectedStatusId,
    );
    if (selectedStatus) {
      task.status = selectedStatus;
      this.saveTasksToLocalStorage();
    }
  }
  private saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getTaskCountByStatus(status: Status): number {
    return this.tasks.filter((task) => task.status.id === status.id).length;
  }
}
