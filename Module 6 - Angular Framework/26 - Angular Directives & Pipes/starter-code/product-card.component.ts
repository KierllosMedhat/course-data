import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Product } from './product.model';
import { HoverShadowDirective } from './hover-shadow.directive';
import { DiscountPipe } from './discount.pipe';
import { TimeAgoPipe } from './time-ago.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule, 
    CurrencyPipe, 
    DatePipe,
    HoverShadowDirective, 
    DiscountPipe, 
    TimeAgoPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<Product>();
  addedToCart = output<Product>();

  addToCartClick(): void {
    this.addedToCart.emit(this.product());
  }
}
