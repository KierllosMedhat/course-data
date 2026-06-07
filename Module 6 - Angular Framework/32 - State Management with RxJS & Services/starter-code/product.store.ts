import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private http = inject(HttpClient);

  // TODO: Step 1: Define private writable signals for products, loading, and error states
  private _products = signal<Product[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // TODO: Step 2: Expose these signals as read-only signals
  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // TODO: Step 3: Implement loadProducts() to fetch data from https://fakestoreapi.com/products
  // Clean up any loading states in finalize, and handle any network errors.
  loadProducts(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Product[]>('https://fakestoreapi.com/products')
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({
        next: (data) => {
          this._products.set(data);
        },
        error: (err) => {
          this._error.set(err.message || 'An error occurred while fetching catalog products.');
        }
      });
  }
}
