export interface Rating {
  rate: number;
  count: number;
}

// TODO: Define the strict TypeScript interface for a Product matching the FakeStoreAPI response
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
