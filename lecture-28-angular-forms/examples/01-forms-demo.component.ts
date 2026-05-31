import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Needed for json pipe if not imported directly

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  // You must import the forms modules!
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="container p-4">
      
      <!-- ============================================== -->
      <!-- 1. TEMPLATE-DRIVEN FORMS (Simple)              -->
      <!-- ============================================== -->
      <h2>Template-Driven Form</h2>
      <!-- #tdForm="ngForm" creates a local reference to the form directive -->
      <form #tdForm="ngForm" (ngSubmit)="onSubmitTemplate(tdForm.value)">
        <div class="mb-3">
          <label>Name:</label>
          <!-- [(ngModel)] creates two-way data binding -->
          <!-- name attribute is REQUIRED for ngModel to work within a form -->
          <input type="text" class="form-control" name="userName" [(ngModel)]="user.name" required minlength="3" #nameCtrl="ngModel">
          
          <!-- Validation Feedback -->
          @if (nameCtrl.invalid && (nameCtrl.dirty || nameCtrl.touched)) {
            <div class="text-danger mt-1">
              @if (nameCtrl.errors?.['required']) { <span>Name is required.</span> }
              @if (nameCtrl.errors?.['minlength']) { <span>Name must be at least 3 characters.</span> }
            </div>
          }
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="tdForm.invalid">Submit Template Form</button>
      </form>

      <hr class="my-5">

      <!-- ============================================== -->
      <!-- 2. REACTIVE FORMS (Complex, Scalable)          -->
      <!-- ============================================== -->
      <h2>Reactive Form</h2>
      <!-- Bind the FormGroup object to [formGroup] -->
      <form [formGroup]="checkoutForm" (ngSubmit)="onSubmitReactive()">
        
        <div class="mb-3">
          <label>Email:</label>
          <!-- Bind individual controls using formControlName -->
          <input type="email" class="form-control" formControlName="email">
          
          @if (emailCtrl?.invalid && (emailCtrl?.dirty || emailCtrl?.touched)) {
            <div class="text-danger mt-1">
              @if (emailCtrl?.errors?.['required']) { <span>Email is required.</span> }
              @if (emailCtrl?.errors?.['email']) { <span>Please enter a valid email.</span> }
            </div>
          }
        </div>

        <!-- Nested FormGroup -->
        <div formGroupName="address" class="border p-3 mb-3 rounded">
          <h5>Shipping Address</h5>
          <div class="mb-2">
            <label>Street:</label>
            <input type="text" class="form-control" formControlName="street">
          </div>
          <div class="mb-2">
            <label>City:</label>
            <input type="text" class="form-control" formControlName="city">
          </div>
        </div>

        <button type="submit" class="btn btn-success" [disabled]="checkoutForm.invalid">Submit Reactive Form</button>
      </form>
      
      <div class="mt-3 p-3 bg-light rounded">
        <strong>Form Value:</strong> <pre>{{ checkoutForm.value | json }}</pre>
        <strong>Form Valid?</strong> {{ checkoutForm.valid }}
      </div>

    </div>
  `
})
export class FormsDemoComponent {
  // ----- Template-Driven Data -----
  user = { name: '' };

  onSubmitTemplate(value: any) {
    console.log('Template Form Submitted!', value);
  }

  // ----- Reactive Form Setup -----
  checkoutForm: FormGroup;

  // FormBuilder makes creating complex forms easier
  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({ // Nested group
        street: ['', Validators.required],
        city: ['', Validators.required]
      })
    });
  }

  // Getter for easy access in template
  get emailCtrl() { return this.checkoutForm.get('email'); }

  onSubmitReactive() {
    if (this.checkoutForm.valid) {
      console.log('Reactive Form Submitted!', this.checkoutForm.value);
      // this.checkoutForm.reset(); // Clear the form
    }
  }
}
