import { Component, input, output, linkedSignal, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from './product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  // --- Lab 1: Component Inputs & Outputs ---
  // TODO: Add a required input for 'product' using input.required<Product>()
  // product = ...

  // --- Lab 2: Output Modification ---
  // TODO: Modify output to emit both Product and quantity. E.g. output<{ product: Product, quantity: number }>()
  addedToCart = output<{ product: Product; quantity: number }>();

  // --- Lab 2: linkedSignal() ---
  // TODO: Implement a linkedSignal named 'quantity' that initializes to 1
  // and resets to 1 whenever the product() input changes.
  // quantity = ...

  constructor() {
    // --- Lab 2: effect() ---
    // TODO: Write an effect() in the constructor that runs whenever quantity()
    // or product() changes and logs: "Quantity for [product name] changed to [quantity]"
  }

  increment(): void {
    // TODO: Increment the quantity signal value
  }

  decrement(): void {
    // TODO: Decrement the quantity signal value (ensure it does not go below 1)
  }

  addToCartClick(): void {
    // TODO: Emit the addedToCart event carrying the product and its quantity
  }
}
