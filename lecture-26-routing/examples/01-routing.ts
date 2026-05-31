// app.routes.ts
import { Routes } from '@angular/router';

// Use lazy loading (loadComponent) for better performance
export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    title: 'Home' 
  },
  { 
    path: 'products', 
    loadComponent: () => import('./products/product-list.component').then(m => m.ProductListComponent),
    title: 'Products'
  },
  { 
    // Route parameter :id
    path: 'products/:id', 
    loadComponent: () => import('./products/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Product Details'
  },
  { 
    path: '**', // Catch-all route for 404
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Required for routing in template
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" routerLink="/">MyStore</a>
        <div class="navbar-nav">
          <!-- routerLinkActive applies a CSS class when the route is active -->
          <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
        </div>
      </div>
    </nav>

    <main class="container">
      <!-- The component for the current route is rendered here -->
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}

// Reading route parameters in ProductDetailComponent
/*
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class ProductDetailComponent implements OnInit {
  // Use Angular's inject() function (modern alternative to constructor injection)
  private route = inject(ActivatedRoute);
  productId!: number;

  ngOnInit() {
    // Read the parameter from the URL
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      // Fetch product data based on ID...
    });
  }
}
*/
