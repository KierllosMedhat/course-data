import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lab1-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lab1-login.component.html',
  styleUrls: ['./lab1-login.component.css']
})
export class Lab1LoginComponent implements OnInit, OnDestroy {
  // --- TEMPLATE-DRIVEN MODEL STUB ---
  // TODO: Define the user data model for the template-driven approach:
  // user = { email: '', password: '', rememberMe: false };

  // --- REACTIVE FORM GROUP ---
  // TODO: Define a typed FormGroup for the reactive forms approach
  loginForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // TODO: Step 1: Implement the template-driven submission handler first.
    // TODO: Step 2: Initialize the Reactive FormGroup using FormBuilder
    // The form should have:
    // - email: required, must be a valid email
    // - password: required, minimum length of 8 characters
    // - rememberMe: boolean (defaults to false)
    
    this.initReactiveForm();
    this.setupEmailValueChangesSubscription();
  }

  private initReactiveForm(): void {
    // TODO: Instantiate this.loginForm using FormBuilder
  }

  private setupEmailValueChangesSubscription(): void {
    // TODO: Subscribe to valueChanges of the email control.
    // If the value ends with '@gmail.com', show a console log or alert message:
    // "Ah, a Google user!"
    // Make sure to pipe through takeUntil(this.destroy$) to avoid memory leaks.
  }

  // TODO: Handle Template-Driven submit
  onTemplateSubmit(form: any): void {
    // Log form values and verify validation
    console.log('Template submit:', form.value);
  }

  // TODO: Handle Reactive submit
  onReactiveSubmit(): void {
    // Verify validity and log values
    if (this.loginForm.valid) {
      console.log('Reactive submit:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
