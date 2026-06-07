import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true,
  pure: true
})
export class DiscountPipe implements PipeTransform {
  // TODO: Implement transform method
  // Arguments:
  // - originalPrice: number
  // - discountPercent: number (optional, default: 0)
  // - currencyCode: string (optional, default: 'USD')
  //
  // Return the formatted discounted price (e.g. using a currency logic or custom string formatting)
  transform(originalPrice: number, discountPercent: number = 0, currencyCode: string = 'USD'): string {
    // TODO: Calculate discounted price: originalPrice * (1 - discountPercent / 100)
    // Formulate and return as string (e.g., "$80.00")
    return '';
  }
}
