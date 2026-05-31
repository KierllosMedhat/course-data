import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="card p-4 shadow-sm border rounded">
      <!-- Interpolation -->
      <h3>{{ user.name | uppercase }}</h3>
      
      <!-- Property Binding -->
      <img [src]="user.avatarUrl" [alt]="user.name + ' avatar'" class="rounded-circle w-24 h-24 mb-3">
      
      <!-- Event Binding -->
      <button class="btn btn-outline-primary mt-2" (click)="onProfileClick()">
        View Profile
      </button>
    </div>
  `
})
export class UserCardComponent implements OnInit, OnChanges {
  // @Input() allows parent components to pass data in
  @Input({ required: true }) user!: { id: number; name: string; avatarUrl: string };

  // @Output() allows this component to emit events to the parent
  @Output() profileClicked = new EventEmitter<number>();

  // Lifecycle Hook: Called once after inputs are initialized
  ngOnInit() {
    console.log(`UserCard initialized for ${this.user.name}`);
  }

  // Lifecycle Hook: Called whenever an input property changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && !changes['user'].isFirstChange()) {
      console.log('User data updated!', changes['user'].currentValue);
    }
  }

  onProfileClick() {
    // Emit the user ID to the parent component
    this.profileClicked.emit(this.user.id);
  }
}
