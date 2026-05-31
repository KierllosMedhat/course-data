import { Component } from '@angular/core';
// TODO: Import ReactiveFormsModule, FormBuilder, FormGroup, Validators

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [/* TODO: Add ReactiveFormsModule */],
  template: `
    <div class="checkout-container">
      <h2>Secure Checkout</h2>

      <!-- TODO: Bind [formGroup] to your reactive form object -->
      <form (ngSubmit)="onSubmit()">
        
        <!-- TODO: Full Name (Required, min length 3) -->
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" formControlName="fullName">
          <!-- TODO: Add validation error messages using @if -->
        </div>

        <!-- TODO: Credit Card Number (Required, pattern: 16 digits) -->
        <div class="form-group">
          <label>Card Number</label>
          <input type="text" formControlName="cardNumber">
          <!-- TODO: Add validation error messages -->
        </div>

        <!-- TODO: Expiration (Required) -->
        <div class="form-group">
          <label>Expiration (MM/YY)</label>
          <input type="text" formControlName="expiration">
        </div>

        <!-- TODO: Disable button if form is invalid -->
        <button type="submit">Place Order</button>
      </form>
    </div>
  `
})
export class CheckoutFormComponent {
  // TODO: Declare the FormGroup property
  // orderForm!: FormGroup;

  // TODO: Inject FormBuilder in constructor
  // constructor(private fb: FormBuilder) {}

  // TODO: Initialize the form in ngOnInit()
  // ngOnInit() {
  //   this.orderForm = this.fb.group({ ... });
  // }

  // TODO: Implement the onSubmit method
  // onSubmit() {
  //   if (this.orderForm.valid) { console.log(...) }
  // }
}
