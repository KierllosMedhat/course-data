import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from './auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav-bar">
      <span class="logo">ShopAngular</span>
      <div class="user-status">
        @if (auth.isAuthenticated()) {
          <span>Hello, <strong>{{ auth.userName() }}</strong></span>
          <button class="btn-logout" (click)="auth.logout()">Logout</button>
        } @else {
          <span>Guest Mode</span>
        }
      </div>
    </nav>
  `,
  styles: [`
    .nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background-color: #333; color: white; font-family: sans-serif; }
    .logo { font-size: 1.25em; font-weight: bold; }
    .user-status { display: flex; align-items: center; gap: 15px; }
    .btn-logout { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthStore);
}
