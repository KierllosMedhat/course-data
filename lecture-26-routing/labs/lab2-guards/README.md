# Lab 2: Functional Guards

1. Open `auth.guard.ts` (generate one with `ng g guard auth`).
2. Implement the `CanActivateFn` to return `false` if `localStorage.getItem('token')` is null. If it is null, use `router.parseUrl('/login')` to redirect.
3. Protect your `/checkout` route using this guard in `app.routes.ts`.
