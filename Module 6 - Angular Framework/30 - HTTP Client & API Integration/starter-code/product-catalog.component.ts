import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent {
  private productService = inject(ProductService);

  // Selected category state signal
  selectedCategory = signal<string>('');

  // TODO: Use the rxResource API to load categories
  categoriesResource = rxResource({
    loader: () => this.productService.getCategories()
  });

  // TODO: Use the rxResource API with a reactive parameter to load products.
  // Whenever selectedCategory() updates, the loader should fetch the appropriate list of products.
  productsResource = rxResource({
    request: () => this.selectedCategory(),
    loader: ({ request: category }) => {
      if (category) {
        return this.productService.getProductsByCategory(category);
      }
      return this.productService.getAllProducts();
    }
  });

  // TODO: Implement a method to handle category selection changes
  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(value);
  }
}
