import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// --- CUSTOM VALIDATORS ---

// TODO: Implement creditCardValidator (Sync)
// Ensure the card number is exactly 16 digits, ignoring any spaces or dashes.
export function creditCardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    // Remove spaces and dashes
    const cleaned = control.value.replace(/[\s-]/g, '');
    const isValid = /^\d{16}$/.test(cleaned);
    
    return isValid ? null : { invalidCard: true };
  };
}

// TODO: Implement zipCodeValidator (Cross-field shipping validator)
// Applied to the Address FormGroup.
// If country is 'USA', zip must be 5 digits (e.g. 12345).
// If country is 'Canada', zip must match Canadian postal code format (e.g. K1A 0B1 or K1A0B1).
export const zipCodeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const country = control.get('country')?.value;
  const zip = control.get('zip')?.value;

  if (!country || !zip) return null;

  let isValid = true;
  if (country === 'USA') {
    isValid = /^\d{5}$/.test(zip);
  } else if (country === 'Canada') {
    // Basic Canadian Postal Code regex: A1A 1A1 (case insensitive)
    isValid = /^[a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d$/.test(zip);
  }

  return isValid ? null : { zipCountryMismatch: true };
};

@Component({
  selector: 'app-checkout-flow',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-flow.component.html',
  styleUrls: ['./checkout-flow.component.css']
})
export class CheckoutFlowComponent implements OnInit {
  checkoutForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // TODO: Create a strictly typed reactive checkout form
    // The form should have three main FormGroups:
    // 1. customerInfo: firstName (req), lastName (req), email (req, email), phone (req)
    // 2. shippingAddress: street (req), city (req), state (req), zip (req), country (req) -> Add zipCodeValidator as a group-level validator
    // 3. paymentInfo: cardNumber (req, creditCardValidator), expiry (req, pattern MM/YY), cvv (req, 3 digits)
    
    this.checkoutForm = this.fb.group({
      customerInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      }),
      shippingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        country: ['USA', Validators.required] // default value USA
      }, { validators: zipCodeValidator }),
      paymentInfo: this.fb.group({
        cardNumber: ['', [Validators.required, creditCardValidator()]],
        expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
      })
    });
  }

  // Getters for convenience
  get customerInfo(): FormGroup {
    return this.checkoutForm.get('customerInfo') as FormGroup;
  }

  get shippingAddress(): FormGroup {
    return this.checkoutForm.get('shippingAddress') as FormGroup;
  }

  get paymentInfo(): FormGroup {
    return this.checkoutForm.get('paymentInfo') as FormGroup;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Use getRawValue() to get all values, including disabled controls if any exist
      console.log('Order Submitted successfully!', this.checkoutForm.getRawValue());
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
