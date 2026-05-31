# Lab 2: Nested Components

Inside your `angular-basics` app:

1. Run `ng g c navbar`
2. Run `ng g c footer`
3. Add a simple navigation layout in `navbar.component.html` and a footer in `footer.component.html`.
4. Open `app.component.ts`. Ensure `NavbarComponent` and `FooterComponent` are in the `imports` array.
5. In `app.component.html`, delete everything and add:
   ```html
   <app-navbar></app-navbar>
   <main>
     <h1>Welcome to my Angular App!</h1>
   </main>
   <app-footer></app-footer>
   ```
