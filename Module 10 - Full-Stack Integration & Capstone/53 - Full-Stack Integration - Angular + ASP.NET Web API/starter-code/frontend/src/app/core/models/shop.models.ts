// TODO: Mirror the C# DTOs here to ensure type safety in Angular.

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  stockCount: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

export interface LoginDto {
  // TODO: Add properties required for login request
  email: string;
  password: string;
}

export interface RegisterDto {
  // TODO: Add properties required for register request
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  token: string;
  expiration: string;
  user: User;
}
