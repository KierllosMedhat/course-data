import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-angular',
  standalone: true, // v21 default
  template: `
    <div class="p-4 border rounded shadow-sm bg-light">
      <h2>Hello, {{ framework }}!</h2>
      <p>This is a standalone Angular v21 component.</p>
      
      <!-- New Control Flow (@if) -->
      @if (isVisible) {
        <div class="alert alert-success mt-3">
          The secret message is revealed!
        </div>
      }

      <button class="btn btn-primary mt-2" (click)="toggleVisibility()">
        {{ isVisible ? 'Hide' : 'Show' }} Message
      </button>
    </div>
  `,
  styles: [`
    h2 { color: #0f52ba; }
  `]
})
export class HelloAngularComponent {
  framework = 'Angular 21';
  isVisible = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
