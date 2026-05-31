# Lab 2: linkedSignal and effect

1. In `ProductCardComponent`, add `quantity = linkedSignal(() => 1);`
2. In the template, add `<button (click)="quantity.set(quantity() - 1)">-</button>` and `<button (click)="quantity.set(quantity() + 1)">+</button>`.
3. Display `{{ quantity() }}` in the template.
4. In the constructor, add:
   ```ts
   effect(() => {
     console.log('Quantity changed to:', this.quantity());
   });
   ```
5. Click the buttons and watch the console!
