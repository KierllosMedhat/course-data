import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStore } from './auth.store';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-box">
      <h3>Sign In</h3>
      
      @if (auth.error()) {
        <div class="error-banner">{{ auth.error() }}</div>
      }

      @if (auth.isAuthenticated()) {
        <div class="success-banner">
          <p>Welcome, {{ auth.userName() }}! You are successfully signed in.</p>
          <button (click)="auth.logout()">Sign Out</button>
        </div>
      } @else {
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" [(ngModel)]="email" [disabled]="auth.loading()" class="form-control" />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" [(ngModel)]="password" [disabled]="auth.loading()" class="form-control" />
        </div>

        <button (click)="onSubmit()" [disabled]="auth.loading()" class="btn-submit">
          {{ auth.loading() ? 'Signing In...' : 'Sign In' }}
        </button>
      }
    </div>
  `,
  styles: [`
    .login-box { max-width: 300px; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif; margin: 10px auto; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; margin-bottom: 4px; }
    .form-control { width: 100%; padding: 8px; box-sizing: border-box; }
    .btn-submit { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-submit:disabled { background-color: #ccc; }
    .error-banner { background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-bottom: 12px; font-size: 0.9em; }
    .success-banner { text-align: center; }
  `]
})
export class LoginFormComponent {
  auth = inject(AuthStore);
  
  email = '';
  password = '';

  onSubmit(): void {
    if (this.email && this.password) {
      this.auth.login(this.email, this.password);
    }
  }
}
