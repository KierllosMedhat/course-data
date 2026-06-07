import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  private cartService = inject(CartService);

  // TODO: Bind cartItems signal using toSignal()
  // items = toSignal(this.cartService.cartItems$, { initialValue: [] });

  // TODO: Bind cartTotalValue signal using toSignal()
  // totalValue = toSignal(this.cartService.cartTotalValue$, { initialValue: 0 });

  updateQty(productId: number, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clear(): void {
    this.cartService.clearCart();
  }
}
