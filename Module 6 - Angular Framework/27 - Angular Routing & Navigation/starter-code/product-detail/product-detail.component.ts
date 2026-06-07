import { Component, input, resource } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  // TODO: Use route parameter binding to receive the product 'id' input
  // Because withComponentInputBinding() is enabled in app.config.ts, 
  // Angular automatically sets this.
  // id = input.required<string>();

  // TODO: Implement the resource() API to fetch the product by id from:
  // https://fakestoreapi.com/products/{id}
  // Make sure to set the 'request' parameter to reactively track changes to 'id'.
  //
  // productResource = resource({ ... });
}
