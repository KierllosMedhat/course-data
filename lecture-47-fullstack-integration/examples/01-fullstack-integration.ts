// FULL-STACK INTEGRATION — Lecture 47
// Cross-Stack Example: Connecting Angular to ASP.NET Core

// ==========================================
// 1. ASP.NET CORE: CORS Configuration (Program.cs)
// ==========================================
/*
var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // Angular's default port
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Use CORS before Authorization!
app.UseCors("AllowAngularDev");

// ...
*/

// ==========================================
// 2. ANGULAR: API Service (product.service.ts)
// ==========================================
/*
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  
  // Base URL is typically configured in environment files
  // e.g., environment.apiUrl = 'https://localhost:5001/api'
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
*/

// ==========================================
// 3. ANGULAR: Development Proxy (proxy.conf.json)
// ==========================================
// An alternative to configuring CORS on the backend during development is to use the Angular CLI proxy.
/*
{
  "/api": {
    "target": "https://localhost:5001",
    "secure": false,
    "changeOrigin": true
  }
}
// To use: ng serve --proxy-config proxy.conf.json
*/
