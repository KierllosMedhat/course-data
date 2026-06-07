import { Routes } from '@angular/router';
import { HomeComponent, AboutComponent, ProductsComponent, DashboardComponent, OverviewComponent, SettingsComponent, CheckoutComponent, LoginComponent, NotFoundComponent } from './pages';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // TODO: 1. Add redirect from empty path to '/home'
  
  // TODO: 2. Add standard component routes for '/home', '/about', '/products'

  // TODO: 3. Add nested dashboard routing
  // path: 'dashboard' -> DashboardComponent
  // children:
  //   '' -> redirect to 'overview'
  //   'overview' -> OverviewComponent
  //   'settings' -> SettingsComponent

  // TODO: 4. Add checkout route protected by authGuard (canActivate)

  // TODO: 5. Add login route

  // TODO: 6. Add wildcard 404 route (NotFoundComponent)
];
