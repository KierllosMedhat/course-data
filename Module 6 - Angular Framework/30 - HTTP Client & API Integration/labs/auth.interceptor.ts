import { HttpInterceptorFn } from '@angular/common/http';

// TODO: Implement the functional authInterceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Check if the request URL contains 'jsonplaceholder'
  const isTargetUrl = req.url.includes('jsonplaceholder');

  if (isTargetUrl) {
    // TODO: Clone the request and add the Authorization header with value:
    // "Bearer fake-secret-token"
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer fake-secret-token'
      }
    });

    // Pass the cloned request onwards
    return next(clonedReq);
  }

  // Pass the original request onwards if it doesn't match
  return next(req);
};

/*
  How to register this Interceptor:
  Open your app.config.ts and register it inside provideHttpClient:
  
  import { provideHttpClient, withInterceptors } from '@angular/common/http';
  import { authInterceptor } from './labs/auth.interceptor';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideHttpClient(
        withInterceptors([authInterceptor])
      )
    ]
  };
*/
