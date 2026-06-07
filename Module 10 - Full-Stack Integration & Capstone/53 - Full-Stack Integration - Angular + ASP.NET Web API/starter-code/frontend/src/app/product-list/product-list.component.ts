import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/services/product.service';
import { Product, Category } from '../core/models/shop.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId?: number;
  searchTerm: string = '';
  loading: boolean = false;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    // TODO: Use productService to fetch all categories and assign them to the categories array
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadProducts(): void {
    this.loading = true;
    // TODO: Use productService to fetch products, applying the active searchTerm and selectedCategoryId
    this.productService.getProducts(this.searchTerm, this.selectedCategoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onCategoryChange(categoryId?: number): void {
    this.selectedCategoryId = categoryId;
    this.loadProducts();
  }
}
