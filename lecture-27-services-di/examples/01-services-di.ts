import { Injectable, signal } from '@angular/core';

// @Injectable({ providedIn: 'root' }) makes the service available app-wide (singleton).
// This is the recommended way to provide services in Angular.
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

export interface Task {
  id: number;
  title: string;
  isDone: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Using Angular Signals for reactive state management (v16+)
  private tasksSignal = signal<Task[]>([
    { id: 1, title: 'Learn DI', isDone: false },
    { id: 2, title: 'Build Services', isDone: false }
  ]);

  // Expose the signal as readonly so components can read it but not directly modify it
  readonly tasks = this.tasksSignal.asReadonly();

  // Injecting another service into this service
  constructor(private logger: LoggerService) {}

  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      isDone: false
    };
    
    // Update the signal
    this.tasksSignal.update(tasks => [...tasks, newTask]);
    this.logger.log(`Task added: ${title}`);
  }

  toggleTask(id: number) {
    this.tasksSignal.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, isDone: !t.isDone } : t)
    );
    this.logger.log(`Task ${id} toggled`);
  }
}

// ---------------------------------------------------------
// COMPONENT USING THE SERVICE
// ---------------------------------------------------------
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  template: `
    <div class="p-4 border rounded shadow-sm">
      <h3>Task Manager (Service Demo)</h3>
      
      <div class="mb-3">
        <input #taskInput type="text" class="form-control" placeholder="New task...">
        <button class="btn btn-primary mt-2" (click)="onAddTask(taskInput.value); taskInput.value=''">Add</button>
      </div>

      <ul class="list-group">
        <!-- Call the signal as a function to read its value: taskService.tasks() -->
        @for (task of taskService.tasks(); track task.id) {
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span [class.text-decoration-line-through]="task.isDone">{{ task.title }}</span>
            <button class="btn btn-sm btn-outline-secondary" (click)="taskService.toggleTask(task.id)">Toggle</button>
          </li>
        }
      </ul>
    </div>
  `
})
export class TaskManagerComponent {
  // Modern way to inject services (Angular v14+)
  taskService = inject(TaskService);

  onAddTask(title: string) {
    if (title.trim()) {
      this.taskService.addTask(title);
    }
  }
}
