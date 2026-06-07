import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product.store';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // TODO: Step 2: Replace BehaviorSubject usage with a private writable signal
  private _cartItems = signal<CartItem[]>([]);

  // Expose as read-only signal
  cartItems = this._cartItems.asReadonly();

  // TODO: Step 3: Implement computed selectors
  // - totalItems: sum of all item quantities in the cart
  // - totalPrice: sum of (price * quantity) for all items in the cart
  // - isEmpty: boolean indicating if the cart is empty
  totalItems = computed(() => 
    this._cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this._cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  isEmpty = computed(() => 
    this._cartItems().length === 0
  );

  // TODO: Step 4: Implement mutations using immutable update patterns

  // Add product to cart. If already exists, increment the quantity.
  addToCart(product: Product): void {
    this._cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Map to return a new array with updated quantity (Immutable update)
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new item (Immutable update via spread operator)
      return [...items, { product, quantity: 1 }];
    });
  }

  // Remove a product from the cart by its ID
  removeFromCart(productId: number): void {
    this._cartItems.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  // Update quantity of a product in the cart. If quantity <= 0, remove from cart.
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this._cartItems.update(items => 
      items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  }

  // Clear all items from the cart
  clearCart(): void {
    this._cartItems.set([]);
  }
}
