import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="profile-card">
      <!-- TODO: Bind the 'user.avatarUrl' to the src attribute of this img -->
      <img src="placeholder.jpg" alt="Avatar">
      
      <!-- TODO: Display 'user.name' using interpolation -->
      <h2>User Name</h2>
      
      <!-- TODO: Display 'user.email' using interpolation -->
      <p>user@example.com</p>

      <!-- TODO: Bind a click event to this button that calls 'onFollowClick()' -->
      <button>Follow</button>
    </div>
  `,
  styles: [`
    .profile-card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; text-align: center; }
    img { border-radius: 50%; width: 100px; height: 100px; }
  `]
})
export class UserProfileComponent {
  // TODO: Add an @Input() decorator for 'user' with type { id: number, name: string, email: string, avatarUrl: string }
  // user: any;

  // TODO: Add an @Output() decorator called 'follow' that emits the user's id (number)
  // follow = new EventEmitter<number>();

  // TODO: Create the 'onFollowClick' method that emits the follow event
}
