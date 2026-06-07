import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<h2>Home Page</h2><p>Welcome to our site!</p>`
})
export class HomeComponent {}

@Component({
  selector: 'app-about',
  standalone: true,
  template: `<h2>About Page</h2><p>Learn more about us here.</p>`
})
export class AboutComponent {}

@Component({
  selector: 'app-products',
  standalone: true,
  template: `<h2>Products Page</h2><p>Explore our items.</p>`
})
export class ProductsComponent {}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // RouterOutlet is needed to render children!
  template: `
    <div style="display: flex;">
      <aside style="width: 200px; background: #eee; padding: 10px;">
        <h3>Dashboard</h3>
        <ul>
          <!-- TODO: Update these anchor tags to use routerLink instead of href -->
          <li><a routerLink="overview">Overview</a></li>
          <li><a routerLink="settings">Settings</a></li>
        </ul>
      </aside>
      <main style="padding: 10px; flex: 1;">
        <!-- TODO: Add router-outlet for child routes -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardComponent {}

@Component({
  selector: 'app-overview',
  standalone: true,
  template: `<h4>Overview</h4><p>Dashboard main overview.</p>`
})
export class OverviewComponent {}

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `<h4>Settings</h4><p>Manage dashboard settings.</p>`
})
export class SettingsComponent {}

@Component({
  selector: 'app-checkout',
  standalone: true,
  template: `<h2>Checkout</h2><p>Secure payment gate.</p>`
})
export class CheckoutComponent {}

@Component({
  selector: 'app-login',
  standalone: true,
  template: `<h2>Login</h2><p>Please log in.</p>`
})
export class LoginComponent {}

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `<h2>404 - Page Not Found</h2><a routerLink="/home">Back Home</a>`
})
export class NotFoundComponent {}
