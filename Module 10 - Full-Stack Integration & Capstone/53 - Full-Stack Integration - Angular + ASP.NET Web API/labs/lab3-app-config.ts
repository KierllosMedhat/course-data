import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './lab3-auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO: Configure the HTTP Client to use our custom functional interceptor
    // 1. Call provideHttpClient()
    // 2. Chain withInterceptors([...]) and register authInterceptor inside the array
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    )
  ]
};
