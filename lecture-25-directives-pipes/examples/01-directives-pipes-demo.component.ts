import { Component } from '@angular/core';
import { DatePipe, CurrencyPipe, UpperCasePipe, LowerCasePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-directives-pipes-demo',
  standalone: true,
  // Make sure to import the pipes you use in standalone components
  imports: [DatePipe, CurrencyPipe, UpperCasePipe, LowerCasePipe, JsonPipe],
  template: `
    <div class="container p-4">
      <h2>Angular Pipes</h2>
      
      <!-- Date Pipe -->
      <p>Raw Date: {{ today }}</p>
      <p>Formatted Date: {{ today | date:'fullDate' }}</p>

      <!-- Currency Pipe -->
      <p>Price: {{ price | currency:'EUR':'symbol':'1.2-2' }}</p>

      <!-- Case Pipes -->
      <p>Uppercase: {{ message | uppercase }}</p>
      
      <!-- JSON Pipe (Great for debugging) -->
      <pre>{{ userObj | json }}</pre>

      <hr class="my-4">

      <h2>Control Flow (Built-in Directives)</h2>
      
      <!-- @if -->
      @if (isAdmin) {
        <div class="alert alert-primary">Welcome, Administrator!</div>
      } @else {
        <div class="alert alert-secondary">Welcome, Guest.</div>
      }

      <button class="btn btn-outline-dark mb-3" (click)="isAdmin = !isAdmin">Toggle Admin</button>

      <!-- @for -->
      <ul class="list-group">
        @for (item of tasks; track item.id) {
          <li class="list-group-item d-flex justify-content-between align-items-center">
            {{ item.name }}
            <span class="badge" [class.bg-success]="item.completed" [class.bg-warning]="!item.completed">
              {{ item.completed ? 'Done' : 'Pending' }}
            </span>
          </li>
        } @empty {
          <li class="list-group-item text-muted">No tasks found.</li>
        }
      </ul>
      
    </div>
  `
})
export class DirectivesPipesDemoComponent {
  today = new Date();
  price = 1234.56;
  message = "Hello Angular v21!";
  userObj = { id: 1, name: "Alice", role: "Admin" };
  
  isAdmin = false;
  
  tasks = [
    { id: 1, name: 'Learn Angular', completed: true },
    { id: 2, name: 'Build a project', completed: false },
    { id: 3, name: 'Deploy to cloud', completed: false }
  ];
}
