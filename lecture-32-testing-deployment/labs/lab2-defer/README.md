# Lab 2: Deferrable Views

1. Identify a large component in your application.
2. Wrap it in `@defer (on viewport) { <app-heavy></app-heavy> }`.
3. Add a `@placeholder { <div>Loading...</div> }`.
4. Open Chrome DevTools -> Network tab, clear it, scroll down, and watch the JS chunk load!
