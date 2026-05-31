// ==========================================
// 1. STATE MANAGEMENT SERVICE (RxJS BehaviorSubject)
// ==========================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartStateService {
  // 1. Private BehaviorSubject holds the state (initial value is empty array)
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);

  // 2. Public Observable for components to subscribe to (read-only)
  public cartItems$: Observable<Product[]> = this.cartItemsSubject.asObservable();

  // 3. Derived state using RxJS operators
  public cartTotal$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + item.price, 0))
  );

  public itemCount$: Observable<number> = this.cartItems$.pipe(
    map(items => items.length)
  );

  // 4. Methods to modify state
  addToCart(product: Product) {
    const currentItems = this.cartItemsSubject.getValue();
    // Immutable update
    this.cartItemsSubject.next([...currentItems, product]);
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter(p => p.id !== productId);
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }
}

// ==========================================
// 2. COMPONENT (Using AsyncPipe)
// ==========================================
import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-demo',
  standalone: true,
  // Must import AsyncPipe to use the `| async` syntax in the template
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    <div class="container p-4">
      <h2>Shopping Cart (RxJS State)</h2>
      
      <!-- AsyncPipe automatically subscribes and unsubscribes -->
      <div class="d-flex justify-content-between mb-4 p-3 bg-light rounded">
        <strong>Items in Cart: {{ cart.itemCount$ | async }}</strong>
        <strong>Total: {{ cart.cartTotal$ | async | currency }}</strong>
      </div>

      <div class="row">
        <!-- Product List (Mock) -->
        <div class="col-md-6">
          <h4>Products</h4>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Laptop - $999
              <button class="btn btn-sm btn-primary" (click)="addLaptop()">Add</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Mouse - $49
              <button class="btn btn-sm btn-primary" (click)="addMouse()">Add</button>
            </li>
          </ul>
        </div>

        <!-- Cart Contents -->
        <div class="col-md-6">
          <h4>Your Cart</h4>
          <ul class="list-group">
            <!-- Using @for with AsyncPipe -->
            @for (item of cart.cartItems$ | async; track item.id) {
              <li class="list-group-item d-flex justify-content-between align-items-center">
                {{ item.name }} - {{ item.price | currency }}
                <button class="btn btn-sm btn-danger" (click)="cart.removeFromCart(item.id)">Remove</button>
              </li>
            } @empty {
              <li class="list-group-item text-muted">Cart is empty</li>
            }
          </ul>
          
          <button class="btn btn-warning mt-3 w-100" (click)="cart.clearCart()">Clear Cart</button>
        </div>
      </div>
    </div>
  `
})
export class CartDemoComponent {
  cart = inject(CartStateService);

  addLaptop() {
    this.cart.addToCart({ id: Date.now(), name: 'Laptop', price: 999 });
  }

  addMouse() {
    this.cart.addToCart({ id: Date.now(), name: 'Mouse', price: 49 });
  }
}
