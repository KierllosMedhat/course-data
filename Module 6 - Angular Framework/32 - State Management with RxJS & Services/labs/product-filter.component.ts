import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStore } from './product.store';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-container">
      <h2>Lab 2: Product Catalog with State Filters</h2>
      
      <!-- Filter Inputs -->
      <div class="filter-bar">
        <input 
          type="text" 
          placeholder="Filter by title..." 
          (input)="onSearchInput($event)" 
          class="search-input"
        />

        <div class="sort-actions">
          <span>Sort By:</span>
          <button (click)="store.setSortBy('title')" [class.active]="store.sortBy() === 'title'">Title</button>
          <button (click)="store.setSortBy('price')" [class.active]="store.sortBy() === 'price'">Price</button>
        </div>
      </div>

      <!-- State indicators -->
      @if (store.loading()) {
        <div class="loader">Loading product catalog...</div>
      }

      @if (store.error()) {
        <div class="error-msg">Error: {{ store.error() }}</div>
      }

      <!-- Product Grid -->
      <div class="product-grid">
        @for (product of store.filteredAndSortedProducts(); track product.id) {
          <div class="product-item">
            <img [src]="product.image" alt="Product Image" width="100"/>
            <div class="details">
              <h4>{{ product.title }}</h4>
              <p class="price">{{ product.price | currency }}</p>
            </div>
          </div>
        } @empty {
          @if (!store.loading()) {
            <p class="no-results">No products match your criteria.</p>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .store-container { max-width: 800px; margin: 20px auto; font-family: sans-serif; }
    .filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 20px; }
    .search-input { flex-grow: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    .sort-actions { display: flex; gap: 10px; align-items: center; }
    .sort-actions button { padding: 8px 12px; border: 1px solid #007bff; background: transparent; color: #007bff; border-radius: 4px; cursor: pointer; }
    .sort-actions button.active { background: #007bff; color: white; }
    .loader { text-align: center; font-size: 1.2em; padding: 20px; }
    .error-msg { color: red; margin: 10px 0; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .product-item { border: 1px solid #eee; padding: 15px; border-radius: 8px; text-align: center; background: #fff; }
    .product-item img { max-height: 120px; object-fit: contain; }
    .product-item h4 { font-size: 0.95em; margin: 10px 0 5px; height: 40px; overflow: hidden; }
    .product-item .price { font-weight: bold; color: #28a745; margin: 0; }
    .no-results { text-align: center; width: 100%; color: #888; margin-top: 30px; }
  `]
})
export class ProductFilterComponent implements OnInit {
  store = inject(ProductStore);

  ngOnInit(): void {
    // Load products on load
    this.store.loadProducts();
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.setFilter(query);
  }
}
