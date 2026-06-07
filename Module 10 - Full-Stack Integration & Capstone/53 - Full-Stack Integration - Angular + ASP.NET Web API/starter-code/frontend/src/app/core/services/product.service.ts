import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = '/api/products';

  /**
   * Retrieves products with optional search query, category filtering, and pagination
   */
  getProducts(searchTerm?: string, categoryId?: number, page: number = 1): Observable<Product[]> {
    let params = new HttpParams().set('pageNumber', page);
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    // TODO: Send GET request to /api/products with params, strongly-typing response as Product[]
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  /**
   * Get a product by ID
   */
  getProductById(id: number): Observable<Product> {
    // TODO: Send GET request to get a single product
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new product (requires Admin authentication)
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    // TODO: Send POST request to create product. Notice that the authInterceptor will attach the JWT automatically!
    return this.http.post<Product>(this.baseUrl, product);
  }

  /**
   * Update an existing product (requires Admin authentication)
   */
  updateProduct(id: number, product: Partial<Product>): Observable<void> {
    // TODO: Send PUT request to edit product
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  /**
   * Delete a product (requires Admin authentication)
   */
  deleteProduct(id: number): Observable<void> {
    // TODO: Send DELETE request to remove product
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Fetch categories from the category api endpoint
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }
}
