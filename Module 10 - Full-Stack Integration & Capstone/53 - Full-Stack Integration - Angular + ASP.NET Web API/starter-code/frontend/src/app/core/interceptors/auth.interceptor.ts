import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional Interceptor that checks for a JWT token inside the AuthService.
 * If found, clones the request and appends it to the Authorization header as a Bearer token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // TODO: Implement the functional authentication interceptor logic:
  // 1. If a token is retrieved from authService, clone the request
  // 2. Set the Authorization header as: `Bearer ${token}`
  // 3. Return next(clonedRequest)
  // 4. Otherwise, return next(req) unmodified
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
