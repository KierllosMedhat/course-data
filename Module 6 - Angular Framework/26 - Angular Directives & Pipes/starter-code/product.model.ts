export interface Product {
  id: number;
  name: string;
  price: number;
  discountPercent?: number; // Optional discount percentage
  imageUrl: string;
  onSale: boolean;
  createdAt: Date;
}
