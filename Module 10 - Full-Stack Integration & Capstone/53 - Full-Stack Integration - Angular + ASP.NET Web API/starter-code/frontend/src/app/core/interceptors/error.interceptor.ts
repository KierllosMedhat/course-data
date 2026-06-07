import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Global HTTP Error Interceptor. Intercepts incoming responses and handles
 * errors (such as 400 validation, 401 unauthorized, 403 forbidden, 404 not found, 500 server crash) globally.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        // TODO: Handle different HTTP response codes using a switch-case statement
        // For 400 errors: Extract validation messages if available.
        // For 401 errors: Clear local session state (logout) and redirect to login.
        // For 403 errors: Alert the user they do not have permissions (e.g. attempting admin actions).
        // For 404 errors: Navigate to a Not Found page.
        // For 500 errors: Log error details and redirect to a Server Error page.
        
        console.error('API Error Captured by Interceptor:', error);
        
        switch (error.status) {
          case 400:
            if (error.error && error.error.errors) {
              const validationErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  validationErrors.push(error.error.errors[key]);
                }
              }
              alert(`Validation Errors:\n${validationErrors.flat().join('\n')}`);
              throw validationErrors.flat();
            } else {
              alert(error.error?.title || 'Bad Request');
            }
            break;

          case 401:
            alert('Your session has expired or is invalid. Please log in again.');
            authService.logout();
            router.navigate(['/login']);
            break;

          case 403:
            alert('Forbidden: You do not have permission to access this resource or perform this action.');
            break;

          case 404:
            router.navigate(['/not-found']);
            break;

          case 500:
            alert('A critical server error occurred. Please try again later.');
            router.navigate(['/server-error']);
            break;

          default:
            alert('An unexpected network error occurred.');
            break;
        }
      }
      return throwError(() => error);
    })
  );
};
