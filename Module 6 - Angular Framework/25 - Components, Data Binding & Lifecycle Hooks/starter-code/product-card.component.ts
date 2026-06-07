import { Component, input, output } from '@angular/core';
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
  // TODO: Define a required input for 'product'
  // product = ...

  // TODO: Define an output for 'addedToCart' which emits a Product
  // addedToCart = ...

  addToCartClick(): void {
    // TODO: Emit the addedToCart event with the current product
  }
}
