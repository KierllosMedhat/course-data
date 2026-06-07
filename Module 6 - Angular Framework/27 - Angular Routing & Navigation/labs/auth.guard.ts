import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // TODO: Check if a simulated authentication token exists in localStorage (e.g. 'auth-token')
  const isLoggedIn = false; // Replace this with actual localStorage check

  if (isLoggedIn) {
    return true;
  }

  // TODO: Redirect to the login page (or parseUrl to /login)
  // Hint: return router.parseUrl('/login');
  return false;
};
