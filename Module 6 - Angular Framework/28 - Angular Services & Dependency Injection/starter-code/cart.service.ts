import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Product } from './product.model';
import { CartItem } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // TODO: 1. Define private mutable BehaviorSubject containing CartItem array
  // Initialize with empty array or restore from localStorage (Bonus)
  // private cartSubject = new BehaviorSubject<CartItem[]>([]);

  // TODO: 2. Define public read-only Observable of the cart array
  // cartItems$: Observable<CartItem[]> = this.cartSubject.asObservable();

  // TODO: 3. Define public derived observable totalItemCount$
  // totalItemCount$: Observable<number> = this.cartItems$.pipe(
  //   map(items => ...)
  // );

  // TODO: 4. Define public derived observable cartTotalValue$
  // cartTotalValue$: Observable<number> = this.cartItems$.pipe(
  //   map(items => ...)
  // );

  constructor() {
    // TODO: (Bonus) Load cart items from localStorage on startup
    // TODO: (Bonus) Subscribe to cartItems$ and save change updates to localStorage
  }

  addToCart(product: Product, quantity: number): void {
    // TODO: Append item or update quantity if product already in cart
    // Emit new state using .next()
  }

  removeFromCart(productId: number): void {
    // TODO: Filter out product and emit new state
  }

  updateQuantity(productId: number, quantity: number): void {
    // TODO: Update item quantity and emit new state
  }

  clearCart(): void {
    // TODO: Set cart to empty array and emit
  }
}
