import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card.component';
import { Product } from './product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Minimalist Backpack', price: 79.99, imageUrl: 'https://via.placeholder.com/150', onSale: true },
    { id: 2, name: 'Leather Wallet', price: 39.99, imageUrl: 'https://via.placeholder.com/150', onSale: false },
    { id: 3, name: 'Mechanical Keyboard', price: 129.99, imageUrl: 'https://via.placeholder.com/150', onSale: true },
    { id: 4, name: 'Wireless Mouse', price: 29.99, imageUrl: 'https://via.placeholder.com/150', onSale: false }
  ]);

  // TODO: Add cart state signal containing Product array
  // cart = signal<Product[]>([]);

  // TODO: Add message signal to notify user if duplicate item is added (Bonus)
  message = signal<string>('');

  constructor() {
    // TODO: Implement an effect() that saves the cart signal to localStorage
    // whenever it updates.
    // Example: localStorage.setItem('cart-items', JSON.stringify(this.cart()))
    //
    // Also, try to load the initial cart state from localStorage in this constructor or ngOnInit.
  }

  onAddToCart(product: Product): void {
    // TODO: Add the product to the cart signal
    // Bonus: Check if the product already exists in the cart before adding.
    // If it exists, set the message signal (e.g. "Item already in cart!") and do not add it again.
    // Otherwise, append the product to the cart signal array and clear the message.
  }

  clearCart(): void {
    // TODO: Clear the cart signal array
  }
}
