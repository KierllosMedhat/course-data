import { Injectable } from '@angular/core';
// TODO: Import BehaviorSubject, Observable, map from 'rxjs'

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  // TODO: Create a private BehaviorSubject for the cart items array (initial value [])
  
  // TODO: Expose the subject as a public Observable 'cartItems$'

  // TODO: Create an Observable 'totalPrice$' derived from cartItems$ using pipe(map(...))

  // TODO: Implement addItem(item: CartItem)
  // Check if item exists. If yes, increase quantity. If no, add it.
  
  // TODO: Implement removeItem(id: number)

  // TODO: Implement updateQuantity(id: number, quantity: number)
}

// ---------------------------------------------------------
import { Component, inject } from '@angular/core';
// TODO: Import AsyncPipe, CurrencyPipe

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [], // TODO: Add pipes
  template: `
    <div class="cart">
      <h2>Your Cart</h2>
      <!-- TODO: Display total price using the async pipe -->
      <h3>Total: <!-- value --></h3>

      <ul>
        <!-- TODO: Loop over cartItems$ using the async pipe -->
        <!-- Provide buttons to increase/decrease quantity and remove -->
      </ul>
    </div>
  `
})
export class ShoppingCartComponent {
  // TODO: Inject the ShoppingCartService
}
