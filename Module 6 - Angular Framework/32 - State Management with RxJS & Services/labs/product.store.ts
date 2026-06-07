import { Injectable, computed, signal, inject } from '@angular/core';
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

  // TODO: Define private signals
  private _products = signal<Product[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _filterText = signal<string>('');
  private _sortBy = signal<'title' | 'price'>('title');

  // TODO: Expose readonly signals
  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  filterText = this._filterText.asReadonly();
  sortBy = this._sortBy.asReadonly();

  // TODO: Build computed selector for filtered and sorted products
  // 1. Filter products whose title contains filterText() (case-insensitive)
  // 2. Sort by title or price depending on sortBy()
  filteredAndSortedProducts = computed(() => {
    const rawProducts = this._products();
    const query = this._filterText().toLowerCase().trim();
    const sortField = this._sortBy();

    // Filter
    let result = rawProducts.filter(p => p.title.toLowerCase().includes(query));

    // Sort
    result.sort((a, b) => {
      if (sortField === 'price') {
        return a.price - b.price;
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return result;
  });

  // TODO: Implement loadProducts() to fetch data from FakeStoreAPI
  loadProducts(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Product[]>('https://fakestoreapi.com/products')
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => this._products.set(data),
        error: (err) => this._error.set(err.message || 'Failed to load products.')
      });
  }

  // TODO: Implement state setters
  setFilter(text: string): void {
    this._filterText.set(text);
  }

  setSortBy(field: 'title' | 'price'): void {
    this._sortBy.set(field);
  }
}
