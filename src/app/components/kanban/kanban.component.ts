import { Component } from "@angular/core";
import { NavbarComponent } from "../common/navbar/navbar.component";
import { HttpClientModule } from "@angular/common/http";
import { JsonService } from "../../services/json.service";
import { UtilsService } from "../../services/utils.service";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";

/**
 * Interface representing a task status
 */
interface Status {
  /** Unique identifier for the status */
  id: number;
  /** Name of the status */
  name: string;
  /** Tailwind CSS class for styling */
  tailwind_class: string;
}

/**
 * Interface representing a task
 */
interface Task {
  /** Unique identifier for the task */
  id: number;
  /** Brief summary of the task */
  summary: string;
  /** Detailed description of the task */
  description: string;
  /** Current status of the task */
  status: Status;
}

/**
 * Component for managing a Kanban board
 */
@Component({
  selector: "app-kanban",
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: "./kanban.component.html",
  styleUrl: "./kanban.component.css",
  providers: [JsonService],
})
export class KanbanComponent {
  /** Array of tasks on the board */
  tasks: any[] = [];
  /** Array of possible task statuses */
  statuses: any[] = [];
  /** Form for creating new tasks */
  taskCreationForm!: FormGroup;

  /**
   * Creates an instance of KanbanComponent
   */
  constructor(
    private fb: FormBuilder,
    private jsonService: JsonService,
    private router: Router,
    private utils: UtilsService,
  ) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.goToLogin();
    this.taskCreationForm = this.fb.group({
      summary: ["", [Validators.required, Validators.maxLength(250)]],
      description: ["", [Validators.required]],
    });
    this.jsonService.getJsonData("tasks").subscribe((data) => {
      this.tasks = data["tasks"];
      console.log(this.tasks);
    });
    this.jsonService.getJsonData("statuses").subscribe((data) => {
      this.statuses = data["statuses"];
      console.log(this.statuses);
    });
  }

  /**
   * Gets error message for form control
   * @param controlName Name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string): string {
    const control = this.taskCreationForm.get(controlName);
    if (control && control.errors) {
      if (control.errors["required"]) {
        return `${controlName} is required.`;
      } else if (control.errors["minlength"]) {
        const requiredLength = control.errors["minlength"].requiredLength;
        return `${controlName} must be at least ${requiredLength} characters long.`;
      } else if (control.errors["email"]) {
        return "Invalid email format.";
      } else if (control.errors["maxlength"]) {
        const requiredLength = control.errors["maxlength"].requiredLength;
        return `${controlName} can't be more thant ${requiredLength} characters long.`;
      }
    }
    return "";
  }

  /** Controls visibility of task creation dialog */
  show_dialog = false;

  /**
   * Submits a new task
   * @param statuses Array of possible task statuses
   */
  submitTask(statuses: Status[]) {
    if (this.taskCreationForm.valid) {
      console.log("Valis!!");
      let summary = this.taskCreationForm.get("summary")?.value;
      let description = this.taskCreationForm.get("description")?.value;

      let tasks = this.tasks;
      tasks.push({
        id: tasks.length + 1,
        summary: summary,
        description: description,
        status: this.statuses[0],
      });
      console.log("Look ", tasks);
      this.jsonService.updateObject("tasks", tasks);
      this.show_dialog = false;
    }
  }

  /**
   * Handles status change for a task
   * @param task Task to update
   * @param event Change event
   */
  onStatusChange(task: Task, event: any) {
    const selectedStatusId = parseInt(event.target.value, 10);
    const selectedStatus = this.statuses.find(
      (status) => status.id === selectedStatusId,
    );
    if (selectedStatus) {
      task.status = selectedStatus;
      const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = task;
        this.jsonService.updateObject("tasks", this.tasks);
      }
    }
  }

  /**
   * Gets count of tasks for a specific status
   * @param status Status to count tasks for
   * @returns Number of tasks with given status
   */
  getTaskCountByStatus(status: Status): number {
    if (!this.tasks || this.tasks.length === 0) {
      return 0;
    } else {
      return this.tasks.filter((task) => task.status.id === status.id).length;
    }
  }

  /**
   * Redirects to login if user is not authenticated
   */
  goToLogin() {
    if (this.utils.getActiveUser() == null) {
      this.router.navigate(["login"]);
    }
    console.log("Please login");
  }
}
