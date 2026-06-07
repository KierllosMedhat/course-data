import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card.component';
import { Product } from './product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div style="padding: 20px;">
      <h1>Shop Products</h1>
      <div class="product-grid" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <!-- TODO: Use @for to loop through products() and bind [product] to <app-product-card> -->
        <!-- Bind (addedToCart) to a handler, e.g., onAddToCart($event) -->
      </div>
    </div>
  `
})
export class AppComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', price: 99.99, imageUrl: 'https://via.placeholder.com/150', onSale: true },
    { id: 2, name: 'Smart Watch', price: 199.99, imageUrl: 'https://via.placeholder.com/150', onSale: false },
    { id: 3, name: 'Bluetooth Speaker', price: 49.99, imageUrl: 'https://via.placeholder.com/150', onSale: true }
  ]);

  onAddToCart(event: { product: Product; quantity: number }): void {
    // TODO: Handle the cart event, log or add to a cart state
    console.log(`Parent received event: Added ${event.quantity} of ${event.product.name} to cart.`);
  }
}
