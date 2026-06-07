import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Functional HTTP Interceptor to automatically attach a JWT token
 * from localStorage to outgoing API requests.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Retrieve the JWT token from storage (e.g., localStorage or an injected AuthService)
  const token = localStorage.getItem('jwt_token');

  // TODO: Check if a token exists. If it does:
  // 1. Clone the incoming request object using req.clone() (HTTP requests are immutable!)
  // 2. Set the Authorization header with the format: `Bearer {token}`
  // 3. Pass the cloned request to the next handler by calling next(clonedRequest)
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // TODO: If no token exists, forward the original request untouched
  return next(req);
};
