import { Component } from '@angular/core';
// import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [/* TODO: Import necessary pipes here */],
  template: `
    <div class="product-list">
      <h2>Products</h2>
      
      <!-- TODO: Use @for to loop through the 'products' array. Track by product.id -->
      
        <div class="product-card">
          <!-- TODO: Display product name. Use the uppercase pipe. -->
          <h3>Product Name</h3>
          
          <!-- TODO: Display product price. Use the currency pipe (USD). -->
          <p class="price">Price</p>

          <!-- TODO: Display product releaseDate. Use the date pipe (e.g. 'mediumDate'). -->
          <p class="date">Released: Date</p>
          
          <!-- TODO: Use @if to conditionally show a "Low Stock!" warning if stock < 10 -->
          <span class="stock-warning">Low Stock!</span>
        </div>

      <!-- TODO: Provide an @empty block if there are no products -->
    </div>
  `,
  styles: [`
    .product-card { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
    .price { font-weight: bold; color: green; }
    .stock-warning { color: red; font-size: 0.8em; }
  `]
})
export class ProductListComponent {
  // TODO: Create a 'products' array with some dummy data.
  // Each product should have: id, name, price, releaseDate (Date object), and stock (number).
}
