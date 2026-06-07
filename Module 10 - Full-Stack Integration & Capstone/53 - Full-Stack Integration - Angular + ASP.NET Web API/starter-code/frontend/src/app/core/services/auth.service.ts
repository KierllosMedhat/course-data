import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginDto, RegisterDto, AuthResponseDto, User } from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = '/api/auth'; // Dev proxy redirects this to backend API

  // BehaviorSubject to track the current logged-in user state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if token/user already exists on app initialization
    const savedUser = localStorage.getItem('shop_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  /**
   * Performs user login
   */
  login(loginData: LoginDto): Observable<AuthResponseDto> {
    // TODO: Send a POST request to '/api/auth/login' with the loginData
    // Use pipe(map(...)) to store the token and user info in localStorage upon success,
    // and push the user state into the currentUserSubject.
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, loginData)
      .pipe(
        map(response => {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('shop_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          return response;
        })
      );
  }

  /**
   * Performs user registration
   */
  register(registerData: RegisterDto): Observable<void> {
    // TODO: Send a POST request to '/api/auth/register' with the registerData
    return this.http.post<void>(`${this.baseUrl}/register`, registerData);
  }

  /**
   * Log out the current user by clearing localStorage and resetting state
   */
  logout(): void {
    // TODO: Clear local storage values and push null to current user subject
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('shop_user');
    this.currentUserSubject.next(null);
  }

  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  /**
   * Get JWT Token
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
