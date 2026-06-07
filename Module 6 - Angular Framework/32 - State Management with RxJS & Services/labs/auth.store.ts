import { Injectable, computed, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  // TODO: Define private writable signals:
  // - _user: User | null (initially null)
  // - _loading: boolean (initially false)
  // - _error: string | null (initially null)
  private _user = signal<User | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // TODO: Expose readonly signals
  user = this._user.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // TODO: Implement computed selectors:
  // - isAuthenticated: returns true if user is not null
  // - userName: returns user's name or 'Guest'
  isAuthenticated = computed(() => this._user() !== null);
  userName = computed(() => this._user()?.name ?? 'Guest');

  // TODO: Implement login(email, password)
  // 1. Set _loading to true
  // 2. Set _error to null
  // 3. Use setTimeout to simulate an API delay of 1500ms
  // 4. On timeout, check if email is valid and set a mock user, then set _loading to false
  login(email: string, password: string): void {
    this._loading.set(true);
    this._error.set(null);

    setTimeout(() => {
      if (email.includes('@') && password.length >= 6) {
        // Success
        this._user.set({ name: email.split('@')[0], email });
      } else {
        // Failure
        this._error.set('Invalid email address or password too short (min 6 chars).');
      }
      this._loading.set(false);
    }, 1500);
  }

  // TODO: Implement logout() to clear the user state
  logout(): void {
    this._user.set(null);
    this._error.set(null);
  }
}
