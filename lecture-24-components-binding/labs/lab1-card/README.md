# Lab 1: Product Card

1. Run `ng g c product-card`.
2. In `product-card.component.ts`, add:
   ```ts
   name = input.required<string>();
   price = input.required<number>();
   addToCart = output<string>();
   ```
3. In the template, add a button that calls `this.addToCart.emit(this.name())`.
4. Render `<app-product-card>` in `app.component.html` and listen for the event!
