# Lecture 28 — Angular Forms: Template-Driven & Reactive

---

**Course:** Fullstack Web Development  
**Instructor:** (Course Instructor)  
**Duration:** ~3.5 hours (including labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [Why Forms Need Special Handling](#why-forms-need-special-handling)
4. [The Three Approaches Overview](#the-three-approaches-overview)
5. [Template-Driven Forms](#template-driven-forms)
6. [Reactive Forms](#reactive-forms)
7. [Form State Properties](#form-state-properties)
8. [Custom Validators](#custom-validators)
9. [FormArray — Dynamic Fields](#formarray--dynamic-fields)
10. [Displaying Validation Error Messages](#displaying-validation-error-messages)
11. [Signal Forms (Experimental Preview)](#signal-forms-experimental-preview)
12. [Lab 1 — Login Form (Template-Driven & Reactive)](#lab-1--login-form-template-driven--reactive)
13. [Lab 2 — Dynamic Survey Builder with FormArray](#lab-2--dynamic-survey-builder-with-formarray)
14. [Assignment — ShopAngular Project Part 6: Checkout Form](#assignment--shopangular-project-part-6-checkout-form)
15. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)
16. [Key Takeaways](#key-takeaways)
17. [Resources](#resources)

---

## Learning Objectives

By the end of this lecture, you will be able to:

- Explain **why** Angular has a dedicated forms system and why plain HTML forms fall short in a modern SPA (Single-Page Application).
- Choose the **right approach** (Template-Driven, Reactive, or Signal Forms) for a given use case.
- Build a fully functional **Template-Driven Form** with two-way binding, built-in HTML validators, and submission handling.
- Build a fully functional **Reactive Form** using `FormControl`, `FormGroup`, and `FormBuilder`.
- Apply **built-in validators** (`required`, `email`, `minLength`, `maxLength`, `pattern`) and understand how to compose multiple validators.
- Write a **custom validator function** from scratch, including a cross-field validator for matching passwords.
- Use **FormArray** to handle dynamic lists of fields (e.g., a survey with a variable number of questions).
- Display **user-friendly validation error messages** at exactly the right time.
- Use key form state properties: `pristine`, `dirty`, `touched`, `untouched`, `valid`, `invalid`.
- Understand the basics of the new **Signal Forms** (experimental) API.

---

## Agenda

| Time Block | Topic |
|---|---|
| 0:00 – 0:15 | Why forms need special handling |
| 0:15 – 0:30 | Three approaches overview + when to use each |
| 0:30 – 1:15 | Template-Driven Forms (theory + live coding) |
| 1:15 – 1:30 | Break |
| 1:30 – 2:30 | Reactive Forms (theory + live coding) |
| 2:30 – 2:50 | Custom Validators + FormArray |
| 2:50 – 3:00 | Signal Forms preview |
| 3:00 – 3:30 | Lab walkthrough Q&A |

---

## Why Forms Need Special Handling

### The Problem with Plain HTML Forms in Angular

Imagine you have a simple login form in plain HTML:

```html
<form action="/login" method="POST">
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <button type="submit">Login</button>
</form>
```

This works in a traditional multi-page app where the browser sends a full HTTP request and gets a new page back. But in an Angular SPA (Single-Page Application), **you never want the page to reload**. You want Angular to:

1. **Read** the form values into JavaScript variables.
2. **Validate** the values (with your own rules, not just browser defaults).
3. **Show** instant, contextual error messages without a page reload.
4. **Submit** the data to your backend API using `HttpClient`, not a native form POST.
5. **React** to every keystroke — maybe showing a "password strength" indicator in real time.

None of that is possible with a plain `<form action="...">` submission.

> [!IMPORTANT]
> In Angular, you **almost always want to prevent the default form submission** (`action="..."` POST) and handle everything in TypeScript. Angular's forms module gives you the tools to do this elegantly.

### The Real-World Analogy

Think of a paper form at a doctor's office vs. a digital tablet form:

- **Paper form** (plain HTML): You fill it out, hand it to the nurse, and they check if you made mistakes. If you did, the paper comes back and you start over.
- **Digital tablet form** (Angular forms): The app validates each field *as you type*, highlights mistakes immediately, grays out the submit button until everything is correct, and sends the data in the background without reloading the page.

Angular's forms system is the "digital tablet" version.

### What Angular's Forms Module Gives You

1. **Two-way data binding** — the form and your TypeScript class stay synchronized automatically.
2. **Built-in validators** — `required`, `email`, `minLength`, `maxLength`, `pattern`.
3. **Custom validators** — write your own validation logic in plain TypeScript.
4. **Form state tracking** — Angular tells you if a field is `valid`, `invalid`, `touched`, `dirty`, etc.
5. **Reactive updates** — subscribe to an Observable of value changes to react in real time.
6. **Programmatic control** — set values, reset forms, enable/disable fields — all from TypeScript.

### Section Recap

- Plain HTML forms cause page reloads — bad for SPAs.
- Angular forms keep the page alive and give you rich validation, binding, and submission control.
- The two main approaches are **Template-Driven** (simpler, less code) and **Reactive** (more powerful, fully programmatic).

---

## The Three Approaches Overview

Angular gives you **three** ways to build forms. Here is a high-level comparison:

| Feature | Template-Driven | Reactive | Signal Forms (Experimental) |
|---|---|---|---|
| **Where logic lives** | Mostly in the HTML template | Mostly in TypeScript class | TypeScript class (signal-based) |
| **Setup complexity** | Low | Medium | Low-Medium |
| **Two-way binding** | `[(ngModel)]` | `formControlName` + `FormGroup` | Signal-based binding |
| **Validation** | HTML attributes + directives | `Validators.*` in TypeScript | `Validators.*` + signal reactivity |
| **Dynamic fields** | Awkward | Easy with `FormArray` | Easy with signal arrays |
| **Unit testability** | Harder (needs DOM) | Excellent (plain TypeScript) | Excellent |
| **Real-time reactivity** | Limited | `valueChanges` Observable | Built-in via signals |
| **Angular version** | All | All | Angular 19+ (experimental) |
| **Best for** | Simple forms, quick prototypes | Complex, dynamic, or tested forms | Future-proof new projects |

> [!NOTE]
> You will see all three in the real world. Older codebases typically use Template-Driven or early Reactive. Modern projects prefer Reactive. Signal Forms are the future but not yet stable.

### When to Use Each Approach

#### Use Template-Driven when:
- The form is **simple** (2–4 fields, basic validation).
- You are **prototyping quickly** and don't need unit tests for the form logic.
- The team is more comfortable with HTML than TypeScript.

#### Use Reactive Forms when:
- The form is **complex** (many fields, conditional validation, dynamic fields).
- You need **unit tests** for validation logic.
- You need to react to **value changes** in real time (e.g., dependent dropdowns).
- You need **programmatic control** (set values, reset, enable/disable fields from code).

#### Use Signal Forms when:
- You are on Angular 19+ and experimenting with the new API.
- You want the reactive power of Reactive Forms with simpler syntax.
- You are starting a **brand-new project** and want the most modern approach.

> [!TIP]
> For this course, **Labs use both Template-Driven and Reactive** so you understand both. In professional Angular projects, **Reactive Forms are the industry standard** for anything beyond a trivial form.

---

## Template-Driven Forms

### What Are Template-Driven Forms?

Template-Driven Forms put most of the logic **in the HTML template**. Angular reads your HTML, sees special directives like `[(ngModel)]`, and automatically creates a form model behind the scenes that you can interact with.

**Analogy:** Think of it like giving instructions to a smart assistant in plain English ("Hey, bind this input to the user's email"). The assistant figures out the details. You don't write detailed instructions — you describe *what* you want and Angular does the wiring.

### Step 1 — Import FormsModule

Before you can use Template-Driven Forms, you must tell Angular about the `FormsModule`. This module contains `NgModel` and other form-related directives.

#### In a Standalone Component (Angular 14+):

```ts
// login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- import the module

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // <-- add it here so this component can use ngModel
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Our form data lives in a plain TypeScript object
  user = {
    email: '',
    password: ''
  };
}
```

> [!WARNING]
> If you forget to import `FormsModule`, Angular will silently ignore `[(ngModel)]` and your form won't work. This is one of the most common beginner mistakes. If your form data isn't updating, check this first!

#### In a Traditional NgModule-Based App:

```ts
// app.module.ts
import { FormsModule } from '@angular/forms'; // <-- import

@NgModule({
  imports: [
    BrowserModule,
    FormsModule  // <-- add to imports array
  ],
  // ...
})
export class AppModule {}
```

### Step 2 — Two-Way Data Binding with `[(ngModel)]`

`[(ngModel)]` is the core directive of Template-Driven Forms. It creates a **two-way binding** between an HTML input and a property in your TypeScript class.

**What does "two-way" mean?**

```
TypeScript property  <-->  HTML input
        user.email   <-->  <input [(ngModel)]="user.email">
```

- When the user types in the input → `user.email` in TypeScript updates automatically.
- When you change `user.email` in TypeScript → the input on screen updates automatically.

**Analogy:** It's like a Google Doc shared between two people. When one person types, the other sees the change instantly — in both directions simultaneously.

```html
<!-- login.component.html -->

<!-- The form element — we'll add more to this shortly -->
<form>
  <label for="email">Email</label>
  
  <!--
    [(ngModel)]="user.email"
    The square brackets [ ] = property binding (TypeScript -> HTML)
    The parentheses ( ) = event binding (HTML -> TypeScript)
    Together [()] = "banana in a box" = two-way binding
    
    name="email" is REQUIRED (explained next)
  -->
  <input
    id="email"
    type="email"
    [(ngModel)]="user.email"
    name="email"
  />

  <label for="password">Password</label>
  <input
    id="password"
    type="password"
    [(ngModel)]="user.password"
    name="password"
  />

  <button type="submit">Login</button>
</form>
```

### Step 3 — The `name` Attribute Is Required

> [!IMPORTANT]
> Every `<input>` that uses `[(ngModel)]` **MUST** have a `name` attribute. If you omit it, Angular throws an error: `If ngModel is used within a form tag, either the name attribute must be set or the form control must be defined as 'standalone' in ngModelOptions.`

**Why?** Angular uses the `name` attribute to register the control in the internal form model. It's how Angular keeps track of each field.

```html
<!-- ❌ WRONG — will throw an error -->
<input type="email" [(ngModel)]="user.email" />

<!-- ✅ CORRECT — name attribute present -->
<input type="email" [(ngModel)]="user.email" name="email" />
```

### Step 4 — Template Reference Variable `#loginForm="ngForm"`

To access the **form's state** (is it valid? has the user touched it?), you need a reference to the form model. You get this with a **template reference variable**:

```html
<!-- 
  #loginForm creates a local variable in the template
  ="ngForm" tells Angular: "assign the NgForm directive instance to this variable"
  Now loginForm gives us access to the entire form's state
-->
<form #loginForm="ngForm">
  <!-- inputs here -->
  
  <!-- 
    loginForm.valid  = true if ALL controls pass validation
    loginForm.invalid = true if ANY control fails validation
    loginForm.value  = object with all field values { email: '...', password: '...' }
  -->
  <p>Form valid: {{ loginForm.valid }}</p>
</form>
```

**ASCII Diagram — What `#loginForm` Gives You:**

```
<form #loginForm="ngForm">
       │
       └── loginForm.valid        (boolean)
       └── loginForm.invalid      (boolean)
       └── loginForm.pristine     (hasn't been touched yet)
       └── loginForm.dirty        (user has typed something)
       └── loginForm.touched      (user focused then left a field)
       └── loginForm.value        ({ email: '...', password: '...' })
       └── loginForm.controls     ({ email: NgModel, password: NgModel })
```

### Step 5 — Handling Submission with `(ngSubmit)`

Instead of `action="..."` on the form, Angular uses the `(ngSubmit)` event:

```html
<!-- 
  (ngSubmit) fires when the user clicks submit OR presses Enter
  It does NOT reload the page (prevents default browser behavior)
  We pass loginForm as an argument so our TypeScript method can inspect it
-->
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <!-- inputs -->
  <button type="submit">Login</button>
</form>
```

```ts
// login.component.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  // NgForm is the type of the form object Angular passes us
  onSubmit(form: NgForm): void {
    // Always check validity before doing anything with the data
    if (form.invalid) {
      console.log('Form is not valid, do not submit');
      return; // stop here
    }

    // form.value contains all the field values as an object
    console.log('Form submitted:', form.value);
    // Expected: { email: 'user@example.com', password: 'secret123' }

    // Here you would call your AuthService to log the user in
    // this.authService.login(form.value.email, form.value.password);
  }
}
```

### Step 6 — Built-In HTML Validation Attributes

Angular Template-Driven Forms work with standard HTML5 validation attributes. When you add them to your inputs, Angular's `NgModel` directive reads them and applies validation automatically.

| HTML Attribute | What It Validates | Example |
|---|---|---|
| `required` | Field must not be empty | `<input required>` |
| `minlength="n"` | Must be at least n characters | `<input minlength="6">` |
| `maxlength="n"` | Must be at most n characters | `<input maxlength="20">` |
| `min="n"` | Number must be >= n | `<input type="number" min="0">` |
| `max="n"` | Number must be <= n | `<input type="number" max="100">` |
| `pattern="regex"` | Must match a regex pattern | `<input pattern="[A-Za-z]+">`|
| `type="email"` | Must look like an email | `<input type="email">` |
| `type="url"` | Must look like a URL | `<input type="url">` |

```html
<!-- login.component.html — full example with validation -->

<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">

  <div class="form-group">
    <label for="email">Email *</label>
    <input
      id="email"
      type="email"           <!-- tells browser AND Angular this must be email format -->
      name="email"           <!-- required for ngModel inside a form -->
      [(ngModel)]="user.email"
      required               <!-- field cannot be empty -->
      #emailField="ngModel"  <!-- reference to THIS specific field's NgModel state -->
    />
    
    <!-- Show error only when: field has been touched AND is invalid -->
    <div *ngIf="emailField.invalid && emailField.touched" class="error">
      <span *ngIf="emailField.errors?.['required']">Email is required.</span>
      <span *ngIf="emailField.errors?.['email']">Please enter a valid email address.</span>
    </div>
  </div>

  <div class="form-group">
    <label for="password">Password *</label>
    <input
      id="password"
      type="password"
      name="password"
      [(ngModel)]="user.password"
      required
      minlength="8"          <!-- password must be at least 8 characters -->
      #passwordField="ngModel"
    />
    
    <div *ngIf="passwordField.invalid && passwordField.touched" class="error">
      <span *ngIf="passwordField.errors?.['required']">Password is required.</span>
      <span *ngIf="passwordField.errors?.['minlength']">
        Password must be at least 8 characters.
        <!-- errors.minlength.requiredLength = the minimum (8) -->
        <!-- errors.minlength.actualLength = what they typed -->
        (You entered {{ passwordField.errors?.['minlength']?.actualLength }} characters.)
      </span>
    </div>
  </div>

  <!--
    [disabled]="loginForm.invalid"
    The square brackets mean: this is a PROPERTY BINDING
    When loginForm.invalid is true, the button's disabled property becomes true
    This grays out the button and prevents clicks until the form is valid
  -->
  <button type="submit" [disabled]="loginForm.invalid">Login</button>

</form>
```

### Step 7 — Accessing Individual Field State with `#fieldRef="ngModel"`

Just like `#loginForm="ngForm"` gives you the whole form's state, you can add a template reference to any individual field:

```html
<input
  name="email"
  [(ngModel)]="user.email"
  required
  #emailField="ngModel"   <!-- gives us access to this field's NgModel -->
/>
```

Now `emailField` has the same state properties as the form, but for just that field:

```
emailField.valid        → true if this field passes all validators
emailField.invalid      → true if this field fails any validator
emailField.touched      → true if user clicked into field and then left
emailField.untouched    → true if user never focused this field
emailField.dirty        → true if user has typed anything
emailField.pristine     → true if user hasn't typed anything yet
emailField.errors       → object with error details, e.g. { required: true } or { minlength: { requiredLength: 8, actualLength: 3 } }
```

### Complete Template-Driven Login Form

Here is the complete, polished Template-Driven login form:

```ts
// login-td.component.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; // needed for *ngIf

@Component({
  selector: 'app-login-td',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-td.component.html',
  styleUrls: ['./login-td.component.css']
})
export class LoginTdComponent {
  // The model object — stores form data
  user = {
    email: '',
    password: ''
  };

  // Set to true after successful submission (to show a success message)
  submitted = false;

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      // Mark all controls as touched so errors become visible
      // (without this, errors only show after the user focuses each field)
      form.form.markAllAsTouched();
      return;
    }

    console.log('Login submitted:', form.value);
    this.submitted = true;

    // Reset the form to its initial state
    form.reset();
  }
}
```

```html
<!-- login-td.component.html -->

<div class="login-container">
  <h2>Login</h2>

  <!-- Success message shown after submit -->
  <div *ngIf="submitted" class="success-message">
    ✅ Logged in successfully!
  </div>

  <!-- #loginForm="ngForm" captures the form model -->
  <!-- (ngSubmit) handles submission without page reload -->
  <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)" *ngIf="!submitted">

    <!-- EMAIL FIELD -->
    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="you@example.com"
        [(ngModel)]="user.email"
        required
        #emailCtrl="ngModel"
        [class.is-invalid]="emailCtrl.invalid && emailCtrl.touched"
      />
      <div class="error-messages" *ngIf="emailCtrl.invalid && emailCtrl.touched">
        <p *ngIf="emailCtrl.errors?.['required']">Email is required.</p>
        <p *ngIf="emailCtrl.errors?.['email']">Must be a valid email address.</p>
      </div>
    </div>

    <!-- PASSWORD FIELD -->
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="At least 8 characters"
        [(ngModel)]="user.password"
        required
        minlength="8"
        #passwordCtrl="ngModel"
        [class.is-invalid]="passwordCtrl.invalid && passwordCtrl.touched"
      />
      <div class="error-messages" *ngIf="passwordCtrl.invalid && passwordCtrl.touched">
        <p *ngIf="passwordCtrl.errors?.['required']">Password is required.</p>
        <p *ngIf="passwordCtrl.errors?.['minlength']">
          Password must be at least {{ passwordCtrl.errors?.['minlength']?.requiredLength }} characters.
        </p>
      </div>
    </div>

    <!-- SUBMIT BUTTON — disabled while form is invalid -->
    <button
      type="submit"
      [disabled]="loginForm.invalid"
      class="btn-primary"
    >
      Login
    </button>

    <!-- Debug info — remove in production -->
    <pre class="debug">Form value: {{ loginForm.value | json }}</pre>
    <pre class="debug">Form valid: {{ loginForm.valid }}</pre>
  </form>
</div>
```

### Template-Driven Forms — Section Recap

- Import `FormsModule` in your component or module.
- Use `[(ngModel)]` for two-way data binding on each input — **always include the `name` attribute**.
- Use `#formRef="ngForm"` on the `<form>` tag to get the form's state.
- Use `(ngSubmit)` instead of a native form `action`.
- Use `#fieldRef="ngModel"` on inputs to access individual field state.
- HTML attributes like `required`, `minlength`, and `type="email"` automatically trigger Angular validators.
- Pattern `[disabled]="form.invalid"` prevents premature submission.
- Pattern `fieldRef.invalid && fieldRef.touched` shows errors only after user interaction.

---

## Reactive Forms

### What Are Reactive Forms?

Reactive Forms flip the approach: instead of defining the form in the template, you define the form **entirely in TypeScript** as an object. The template just binds to that object.

**Analogy:** If Template-Driven is like giving spoken instructions to a contractor ("put a shelf here, a door there"), Reactive Forms are like giving them a **detailed blueprint**. Every dimension, every rule is written down in a document (TypeScript class). The HTML template is just the visual rendering of that blueprint.

**Why this matters:**
- You can **unit test** your form logic without rendering any HTML.
- You get full **programmatic control** — change validators, set values, enable/disable fields, all from code.
- You can **subscribe** to form value changes as an Observable stream.
- It's the preferred approach for **any serious Angular application**.

### Step 1 — Import ReactiveFormsModule

```ts
// app.component.ts (standalone component example)
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // <-- import this

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule], // <-- add it here
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

> [!WARNING]
> `FormsModule` and `ReactiveFormsModule` are **separate modules**. Using `[(ngModel)]` with Reactive Forms (or vice versa) is a common mistake. Pick one approach per form.

### Step 2 — FormControl: The Building Block

A `FormControl` represents **a single form field**. It holds the field's current value, validation state, and more.

```ts
import { FormControl, Validators } from '@angular/forms';

// Create a FormControl for an email field
// First argument: initial value (empty string = blank field)
// Second argument: validators (single or array)
const emailControl = new FormControl('', [
  Validators.required,   // must not be empty
  Validators.email       // must look like an email
]);

// Reading from a FormControl:
emailControl.value;     // current value (string)
emailControl.valid;     // true if all validators pass
emailControl.invalid;   // true if any validator fails
emailControl.errors;    // null or { required: true } or { email: true } etc.
emailControl.touched;   // true if user focused and left the field
emailControl.dirty;     // true if user has changed the value

// Writing to a FormControl:
emailControl.setValue('user@example.com'); // set a new value (replaces entirely)
emailControl.reset();                      // clear value and reset state flags
```

### Step 3 — FormGroup: Grouping Controls Together

A `FormGroup` holds **multiple FormControls** organized as an object. This represents your entire form (or a logical sub-section of it).

```
FormGroup (the whole form)
  ├── FormControl: email
  ├── FormControl: password
  └── FormControl: rememberMe
```

```ts
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Build the form group manually (we'll see a shorthand next)
const loginForm = new FormGroup({
  // Each property becomes a form field
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  rememberMe: new FormControl(false) // checkbox — initial value is false
});

// Reading values:
loginForm.value;                // { email: '...', password: '...', rememberMe: false }
loginForm.get('email')?.value;  // just the email field's value
loginForm.get('email')?.errors; // null or error object
loginForm.valid;                // true if ALL controls are valid
```

### Step 4 — FormBuilder: The Shorthand

Writing `new FormControl(...)` repeatedly is verbose. `FormBuilder` is a service that provides a cleaner syntax:

```ts
// Without FormBuilder (verbose)
this.loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)])
});

// With FormBuilder (clean shorthand)
this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  //      ^     ^
  //      |     |--- array of validators
  //      |--------- initial value
  password: ['', [Validators.required, Validators.minLength(8)]]
});
```

Notice that `fb.group()` accepts the same structure but with a more compact array syntax: `[initialValue, validators]`.

### Step 5 — Setting Up a Reactive Form Component

Let's build the login form using Reactive Forms:

```ts
// login-reactive.component.ts
import { Component, OnInit } from '@angular/core';
import { 
  ReactiveFormsModule,    // module for reactive form directives
  FormBuilder,            // service for building forms
  FormGroup,              // type for the form group
  Validators              // built-in validators
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // for *ngIf, *ngFor

@Component({
  selector: 'app-login-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-reactive.component.html',
  styleUrls: ['./login-reactive.component.css']
})
export class LoginReactiveComponent implements OnInit {
  
  // Declare the type — will be initialized in ngOnInit
  loginForm!: FormGroup;

  // Inject FormBuilder using Angular's dependency injection
  // FormBuilder is a service provided by ReactiveFormsModule
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Create the form structure with initial values and validators
    this.loginForm = this.fb.group({
      // Array syntax: [initialValue, validators] or [initialValue, [validator1, validator2]]
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false] // checkbox — no validators needed
    });
  }

  // Called when the user submits the form
  onSubmit(): void {
    // Always validate before processing
    if (this.loginForm.invalid) {
      // Mark all controls as touched so error messages appear
      this.loginForm.markAllAsTouched();
      return; // stop processing
    }

    // loginForm.value = { email: '...', password: '...', rememberMe: true/false }
    console.log('Form submitted:', this.loginForm.value);

    // Call your service here
    // this.authService.login(this.loginForm.value);

    // Reset after successful submission
    this.loginForm.reset();
  }
}
```

### Step 6 — Binding the Form to the Template

In Reactive Forms, the template is **simpler** because the logic is in TypeScript. You use two directives:

- `[formGroup]="loginForm"` — on the `<form>` tag, connects it to the TypeScript FormGroup.
- `formControlName="email"` — on each input, connects it to the named FormControl in the group.

```html
<!-- login-reactive.component.html -->

<div class="login-container">
  <h2>Login (Reactive)</h2>

  <!--
    [formGroup]="loginForm"
    Square brackets = property binding
    This tells Angular: "wire this <form> element to the loginForm FormGroup"
    
    (ngSubmit)="onSubmit()"
    Note: we DON'T pass the form as an argument — we access it via this.loginForm in TypeScript
  -->
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

    <!-- EMAIL FIELD -->
    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        formControlName="email"
        <!--
          formControlName="email" (no brackets!)
          This is NOT a property binding — it's a directive attribute
          It connects this input to the 'email' FormControl inside loginForm
          Angular will:
          - Read values from loginForm.get('email')
          - Write values back to loginForm.get('email') when user types
        -->
      />
      
      <!-- 
        We check:
        loginForm.get('email')?.invalid — is this field failing validation?
        loginForm.get('email')?.touched — has the user interacted with this field?
        Only show errors when BOTH are true (bad AND user knows about it)
      -->
      <div 
        class="error-messages" 
        *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
      >
        <p *ngIf="loginForm.get('email')?.errors?.['required']">
          Email is required.
        </p>
        <p *ngIf="loginForm.get('email')?.errors?.['email']">
          Please enter a valid email address.
        </p>
      </div>
    </div>

    <!-- PASSWORD FIELD -->
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="At least 8 characters"
        formControlName="password"
      />
      <div 
        class="error-messages"
        *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
      >
        <p *ngIf="loginForm.get('password')?.errors?.['required']">
          Password is required.
        </p>
        <p *ngIf="loginForm.get('password')?.errors?.['minlength']">
          Password must be at least 
          {{ loginForm.get('password')?.errors?.['minlength']?.requiredLength }} 
          characters.
        </p>
      </div>
    </div>

    <!-- REMEMBER ME CHECKBOX -->
    <div class="form-group checkbox-group">
      <label>
        <input type="checkbox" formControlName="rememberMe" />
        Remember me
      </label>
    </div>

    <!-- SUBMIT BUTTON -->
    <button 
      type="submit"
      [disabled]="loginForm.invalid"
      class="btn-primary"
    >
      Login
    </button>

    <!-- Debug panel (remove in production) -->
    <details>
      <summary>Debug info</summary>
      <pre>{{ loginForm.value | json }}</pre>
      <pre>Valid: {{ loginForm.valid }}</pre>
    </details>

  </form>
</div>
```

### Step 7 — Built-In Validators Reference

Here is a complete reference for Angular's built-in `Validators`:

```ts
import { Validators } from '@angular/forms';

this.myForm = this.fb.group({
  // Validators.required — field must not be empty or null
  username: ['', Validators.required],

  // Validators.email — must match email format (x@x.x)
  email: ['', [Validators.required, Validators.email]],

  // Validators.minLength(n) — must be at LEAST n characters
  // Note: it's minLength (capital L), NOT minlength
  password: ['', [Validators.required, Validators.minLength(8)]],

  // Validators.maxLength(n) — must be at MOST n characters
  bio: ['', Validators.maxLength(200)],

  // Validators.min(n) — numeric value must be >= n
  age: [null, [Validators.required, Validators.min(18)]],

  // Validators.max(n) — numeric value must be <= n
  quantity: [1, [Validators.required, Validators.max(99)]],

  // Validators.pattern(regex) — must match a regular expression
  // Example: only letters and numbers
  nickname: ['', Validators.pattern('^[a-zA-Z0-9]+$')],

  // Validators.nullValidator — always valid (useful as a placeholder)
  optionalField: ['', Validators.nullValidator],
});
```

> [!TIP]
> When using multiple validators, always wrap them in an array: `[Validators.required, Validators.email]`. A single validator can be passed directly without an array, but using an array consistently is cleaner.

### Step 8 — Accessing Control Values Programmatically

```ts
// In your component class:

// Get the entire form's value as a plain object
const allValues = this.loginForm.value;
// Result: { email: 'user@example.com', password: 'abc12345', rememberMe: false }

// Get a specific field's value using .get()
const emailValue = this.loginForm.get('email')?.value;
// Result: 'user@example.com'

// Get nested form group value (useful for address sub-forms)
const streetValue = this.loginForm.get('address.street')?.value;
// OR
const streetValue2 = this.loginForm.get(['address', 'street'])?.value;

// Get the raw value including DISABLED controls
// (disabled controls are excluded from .value)
const rawValues = this.loginForm.getRawValue();
```

### Step 9 — setValue() vs patchValue()

These two methods both set form values, but they work differently:

**`setValue()` — sets ALL fields at once (strict)**

```ts
// setValue() REQUIRES you to provide values for ALL controls
// If you miss one, Angular throws an error
this.loginForm.setValue({
  email: 'user@example.com',
  password: 'newPassword123',
  rememberMe: true
  // Must include ALL three fields — no partial updates allowed
});

// ❌ This throws an error because 'rememberMe' is missing:
this.loginForm.setValue({
  email: 'user@example.com',
  password: 'newPassword123'
});
```

**`patchValue()` — sets only specified fields (flexible)**

```ts
// patchValue() only updates the fields you provide
// Fields you omit are left unchanged
this.loginForm.patchValue({
  email: 'newemail@example.com'
  // password and rememberMe stay as they were
});

// Use patchValue when:
// - Loading partial data from an API
// - Updating one field without affecting others
// - Pre-filling only some fields
```

> [!TIP]
> **Rule of thumb**: Use `setValue()` when you have ALL values (e.g., loading a full record from the database). Use `patchValue()` when you only have partial data (e.g., updating just the email from a profile response).

### Step 10 — Resetting the Form

```ts
// Simple reset — clears all values, resets state flags to pristine/untouched
this.loginForm.reset();

// Reset with specific values (pre-fill the form after reset)
this.loginForm.reset({
  email: '',          // empty email field
  password: '',       // empty password field
  rememberMe: false   // uncheck the checkbox
});
```

### Step 11 — valueChanges Observable

One of the most powerful features of Reactive Forms is the ability to **subscribe to changes** in real time. Every `FormControl` and `FormGroup` exposes a `valueChanges` Observable.

```ts
// In ngOnInit:

// Subscribe to the entire form's value changes
this.loginForm.valueChanges.subscribe(value => {
  // This fires every time ANY field changes
  console.log('Form value changed:', value);
  // value = { email: '...', password: '...', rememberMe: false }
});

// Subscribe to a single field's changes
this.loginForm.get('email')?.valueChanges.subscribe(email => {
  // This fires every time the email field changes
  console.log('Email changed to:', email);
});

// Real-world use case: show password strength meter
this.loginForm.get('password')?.valueChanges.subscribe(password => {
  this.passwordStrength = this.calculateStrength(password);
});
```

**Important:** Remember to **unsubscribe** when the component is destroyed to prevent memory leaks:

```ts
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class LoginReactiveComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // emits when component destroys

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$)) // auto-unsubscribe on destroy
      .subscribe(value => {
        console.log('Changed:', value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // trigger unsubscription
    this.destroy$.complete();
  }
}
```

### Step 12 — statusChanges Observable

Similar to `valueChanges`, but tracks the **validity status** of the form:

```ts
// Subscribe to the form's status changes
this.loginForm.statusChanges.subscribe(status => {
  // status is one of: 'VALID', 'INVALID', 'PENDING', 'DISABLED'
  console.log('Form status:', status);

  if (status === 'VALID') {
    // Maybe enable something now that the form is valid
  }
});
```

**ASCII Diagram — Reactive Form Data Flow:**

```
User types in <input formControlName="email">
         │
         ▼
FormControl('email') ──► value updates
         │
         ├──► emailControl.valid / invalid
         ├──► emailControl.errors
         ├──► valueChanges Observable emits
         │
         ▼
FormGroup (loginForm) ──► loginForm.value updates
         │
         ├──► loginForm.valid (ALL controls valid?)
         ├──► loginForm.get('email')?.value
         └──► valueChanges Observable emits
```

### Reactive Forms — Section Recap

- Import `ReactiveFormsModule` (separate from `FormsModule`).
- `FormControl` = one field. `FormGroup` = the whole form. `FormBuilder` = shorthand factory.
- Use `this.fb.group({ field: [initialValue, validators] })` to create forms cleanly.
- Bind in template: `[formGroup]="myForm"` on the `<form>`, `formControlName="field"` on inputs.
- Use `form.get('field')?.value` to read values, `setValue()` for full update, `patchValue()` for partial.
- `valueChanges` and `statusChanges` let you react to changes as Observables — remember to unsubscribe.

---

## Form State Properties

### Understanding the State Machine

Every `FormControl`, `FormGroup`, and `FormArray` in Angular has a set of **boolean state properties** that track the user's interaction with the form. Think of each control as a tiny state machine.

**Why does this matter?** You don't want to show error messages before the user has even interacted with the form. State properties let you show errors at exactly the right time.

### State Properties Reference

| Property | Opposite | Meaning | When it's `true` |
|---|---|---|---|
| `pristine` | `dirty` | Untouched value | User hasn't changed the value yet |
| `dirty` | `pristine` | Value was changed | User has typed/selected something |
| `touched` | `untouched` | Focus was removed | User clicked in and then out of a field |
| `untouched` | `touched` | Never focused | User hasn't clicked on this field yet |
| `valid` | `invalid` | Passes all validators | All validators return null |
| `invalid` | `valid` | Fails a validator | At least one validator returns an error |
| `pending` | — | Async validator running | Async validator hasn't resolved yet |
| `disabled` | `enabled` | Control is inactive | `control.disable()` was called |

### Visual State Timeline

```
User visits page (form just loaded):
  pristine = true   ← hasn't been changed
  untouched = true  ← hasn't been focused
  invalid = true    ← 'required' field is empty

User clicks into the email field (focus):
  pristine = true   ← still hasn't changed value
  untouched = true  ← hasn't LEFT the field yet
  invalid = true

User types 'a' in the email field:
  pristine = false  ← value was changed (now "dirty")
  dirty = true
  untouched = true  ← hasn't LEFT the field yet
  invalid = true    ← 'a' is not a valid email

User clicks out of the email field (blur):
  dirty = true
  touched = true    ← user has now fully interacted with this field
  invalid = true    ← still invalid
  ⟹ THIS IS WHEN YOU SHOULD SHOW THE ERROR MESSAGE

User types a valid email and moves on:
  dirty = true
  touched = true
  valid = true      ← no more errors
  ⟹ Hide error message
```

### The `dirty || touched` Pattern

The most common pattern for showing validation errors:

```html
<!-- Show error when: field is dirty OR touched, AND field is invalid -->
<!-- This covers both: user typed something wrong, OR user clicked and left without filling -->
<div *ngIf="(ctrl.dirty || ctrl.touched) && ctrl.invalid" class="error">
  Something is wrong with this field.
</div>
```

But in most cases, just `touched` is enough:

```html
<!-- Simpler: show errors after user has interacted (focused + unfocused) -->
<div *ngIf="ctrl.touched && ctrl.invalid" class="error">
  Error message here.
</div>
```

### When to Use Each Pattern

| Pattern | When to Use |
|---|---|
| `touched && invalid` | Standard pattern — show errors after user has interacted |
| `dirty && invalid` | Show errors as user types (more aggressive) |
| `(dirty \|\| touched) && invalid` | Most forgiving — show on either interaction |
| Always show (`invalid` only) | Almost never — shows errors before user does anything |

### Programmatically Setting State

```ts
// Force a control to be "touched" (so its errors become visible)
this.loginForm.get('email')?.markAsTouched();

// Mark all controls in the form as touched at once
// Useful when user clicks submit with an incomplete form
this.loginForm.markAllAsTouched();

// Mark a control as pristine (reset its interaction state)
this.loginForm.get('email')?.markAsPristine();

// Mark a control as untouched
this.loginForm.get('email')?.markAsUntouched();
```

### Form State — Section Recap

- Every control has `pristine/dirty`, `touched/untouched`, `valid/invalid` state flags.
- Use `touched && invalid` to show errors only after the user has interacted with a field.
- Call `form.markAllAsTouched()` on submit to reveal all errors at once.
- Use `markAsTouched()`, `markAsPristine()` programmatically to control UI state from TypeScript.

---

## Custom Validators

### Why Custom Validators?

Built-in validators cover the basics, but real applications have business rules that are more specific:

- "Password must contain at least one number and one uppercase letter."
- "Username must not already be taken." (async API check)
- "Confirm password must match the password."
- "Start date must be before end date."
- "Age must be 18 or older based on a selected birthdate."

For these, you write your own **validator functions**.

### Validator Function Signature

A validator is simply a **function** that receives a `FormControl` (or `AbstractControl`) and returns either:
- `null` — if the value is **valid** (no error)
- An object — if the value is **invalid** (the object describes the error)

```ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Signature of a validator function:
// (control: AbstractControl) => ValidationErrors | null

// ValidationErrors is just: { [key: string]: any }
// For example: { required: true } or { minlength: { requiredLength: 8, actualLength: 3 } }
```

**Analogy:** Think of a validator as a referee. When you show the referee your form (control value), they either say "looks good" (return `null`) or they blow the whistle and describe the violation (return an error object).

### Example 1 — Simple Custom Validator

Let's write a validator that ensures a username doesn't contain spaces:

```ts
// validators/no-whitespace.validator.ts

import { AbstractControl, ValidationErrors } from '@angular/forms';

// The validator function — receives the control, returns null or error object
export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  // control.value = whatever the user has typed
  const value: string = control.value || ''; // handle null/undefined
  
  // Check if the value contains any whitespace
  const hasWhitespace = /\s/.test(value);
  
  if (hasWhitespace) {
    // Return an error object — the key 'noWhitespace' is the error name
    // The value (true here) is the error detail (can be any value)
    return { noWhitespace: true };
  }
  
  // No error — return null
  return null;
}
```

Using it in a Reactive Form:

```ts
// In your component:
import { noWhitespaceValidator } from './validators/no-whitespace.validator';

this.form = this.fb.group({
  username: ['', [
    Validators.required,
    Validators.minLength(3),
    noWhitespaceValidator  // add your custom validator just like a built-in one
  ]]
});
```

Displaying the error in the template:

```html
<div *ngIf="form.get('username')?.errors?.['noWhitespace'] && form.get('username')?.touched">
  Username cannot contain spaces.
</div>
```

### Example 2 — Password Strength Validator

```ts
// validators/password-strength.validator.ts

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  if (!value) {
    // If empty, let the 'required' validator handle it
    // Don't return an error from strength validator — that's not our job
    return null;
  }

  // Build an errors object with specific failures
  const errors: ValidationErrors = {};

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(value)) {
    errors['noUppercase'] = true;
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(value)) {
    errors['noLowercase'] = true;
  }

  // Check for at least one digit
  if (!/[0-9]/.test(value)) {
    errors['noNumber'] = true;
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    errors['noSpecialChar'] = true;
  }

  // Return null if no errors, or the errors object if there are any
  return Object.keys(errors).length > 0 ? errors : null;
}
```

```html
<!-- Template — show specific messages -->
<div *ngIf="form.get('password')?.touched">
  <div *ngIf="form.get('password')?.errors?.['required']">Password is required.</div>
  <div *ngIf="form.get('password')?.errors?.['noUppercase']">Must contain an uppercase letter.</div>
  <div *ngIf="form.get('password')?.errors?.['noLowercase']">Must contain a lowercase letter.</div>
  <div *ngIf="form.get('password')?.errors?.['noNumber']">Must contain a number.</div>
  <div *ngIf="form.get('password')?.errors?.['noSpecialChar']">Must contain a special character.</div>
</div>
```

### Example 3 — Cross-Field Validator (Matching Passwords)

A cross-field validator validates **the relationship between two fields** — for example, ensuring "confirm password" matches "password". This type of validator is applied to the **FormGroup** (not individual controls) because it needs to read both fields.

```ts
// validators/password-match.validator.ts

import { AbstractControl, ValidationErrors } from '@angular/forms';

// This validator receives the ENTIRE form group (or sub-group)
// It checks that two specific fields match
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  // We're inside the FormGroup that has both password fields
  // So we use control.get() to access child controls
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If either control doesn't exist, don't validate
  if (!password || !confirmPassword) {
    return null;
  }

  // Compare the values
  if (password.value !== confirmPassword.value) {
    // Set an error on the confirmPassword control so we can target it in the template
    confirmPassword.setErrors({ passwordMismatch: true });
    // Also return an error on the group itself
    return { passwordMismatch: true };
  }

  // Values match — clear any passwordMismatch error from confirmPassword
  // (but keep other errors like 'required')
  const currentErrors = confirmPassword.errors;
  if (currentErrors) {
    delete currentErrors['passwordMismatch'];
    // If no other errors remain, set to null
    confirmPassword.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  }

  return null; // valid
}
```

Applying the cross-field validator to the FormGroup:

```ts
// In your component:
this.registrationForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator]],
  confirmPassword: ['', Validators.required]
}, {
  // Validators applied to the GROUP (second argument to fb.group)
  validators: passwordMatchValidator
});
```

```html
<!-- In template — access the GROUP's error for mismatch -->
<div *ngIf="registrationForm.get('confirmPassword')?.errors?.['passwordMismatch'] 
          && registrationForm.get('confirmPassword')?.touched">
  Passwords do not match.
</div>
```

### Custom Validators — Section Recap

- A validator is a function: `(control: AbstractControl) => ValidationErrors | null`.
- Return `null` for valid, return an error object like `{ myErrorKey: true }` for invalid.
- Apply to individual controls like built-in validators.
- Cross-field validators are applied to a **FormGroup**, not individual controls.
- The error key you choose (`noWhitespace`, `passwordMismatch`, etc.) is what you check in the template.

---

## FormArray — Dynamic Fields

### What Is a FormArray?

A `FormArray` is a collection of form controls where the **number of controls can change at runtime**. Unlike `FormGroup` (which has fixed named fields), `FormArray` holds controls in an ordered list, like a JavaScript array.

**When to use it:**
- A survey form where the user can add or remove questions.
- A shopping cart with variable line items.
- A contact form where the user can add multiple phone numbers.
- Any "add another" / "remove" UI pattern.

**Analogy:** Think of `FormGroup` like a fixed hotel room registration form (always: name, email, check-in date). Think of `FormArray` like a party reservation where you can add guests one by one, and remove them if they cancel.

### ASCII Diagram — FormArray Structure

```
FormGroup (surveyForm)
  ├── title: FormControl           ← fixed field
  └── questions: FormArray         ← dynamic array
        ├── [0]: FormGroup         ← question 1
        │     ├── text: FormControl
        │     └── type: FormControl
        ├── [1]: FormGroup         ← question 2
        │     ├── text: FormControl
        │     └── type: FormControl
        └── [2]: FormGroup         ← question 3 (added at runtime)
              ├── text: FormControl
              └── type: FormControl
```

### Step 1 — Creating a FormArray with FormBuilder

```ts
// survey.component.ts
import { Component, OnInit } from '@angular/core';
import { 
  ReactiveFormsModule,
  FormBuilder, 
  FormGroup, 
  FormArray,   // import FormArray type
  Validators 
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './survey.component.html',
})
export class SurveyComponent implements OnInit {
  surveyForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.surveyForm = this.fb.group({
      // Fixed field: the survey title
      title: ['', Validators.required],

      // Dynamic array: questions
      // fb.array([]) starts with an empty array
      // fb.array([...initialItems]) starts with items
      questions: this.fb.array([
        // Start with one empty question
        this.createQuestion()
      ])
    });
  }

  // Helper method: creates a FormGroup for one question
  // We call this whenever we need to add a new question
  createQuestion(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],    // the question text
      type: ['text', Validators.required] // question type: 'text', 'multiple-choice', etc.
    });
  }

  // Getter to access the questions FormArray conveniently
  // We use a getter so we don't have to type this cast every time
  get questions(): FormArray {
    // cast needed because fb.group returns AbstractControl for nested items
    return this.surveyForm.get('questions') as FormArray;
  }

  // Add a new question to the end of the array
  addQuestion(): void {
    this.questions.push(this.createQuestion());
    // .push() adds a new FormGroup at the end — just like Array.push()
  }

  // Remove a question by its index
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    // .removeAt(index) removes the control at that position
  }

  onSubmit(): void {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }
    console.log('Survey submitted:', this.surveyForm.value);
    // surveyForm.value.questions = array of { text: '...', type: '...' }
  }
}
```

### Step 2 — Template for FormArray

```html
<!-- survey.component.html -->

<form [formGroup]="surveyForm" (ngSubmit)="onSubmit()">

  <!-- Fixed field: survey title -->
  <div class="form-group">
    <label for="title">Survey Title</label>
    <input id="title" type="text" formControlName="title" placeholder="My Survey" />
    <div *ngIf="surveyForm.get('title')?.invalid && surveyForm.get('title')?.touched">
      Title is required.
    </div>
  </div>

  <!-- Dynamic array of questions -->
  <!--
    formArrayName="questions"
    This directive connects this section to the 'questions' FormArray
    It must match the key you used in fb.group()
  -->
  <div formArrayName="questions">
    <h3>Questions</h3>

    <!--
      We loop over the FormArray's controls
      questions.controls is a regular JavaScript array of FormGroups
      We use the index to create a unique formGroupName for each
    -->
    <div 
      *ngFor="let question of questions.controls; let i = index"
      [formGroupName]="i"
      class="question-item"
    >
      <!--
        [formGroupName]="i"
        This connects this div to the FormGroup at index i in the FormArray
        Note the square brackets — i is a number variable, not a string
      -->

      <div class="question-header">
        <h4>Question {{ i + 1 }}</h4>
        <!-- Don't allow removing if there's only one question -->
        <button 
          type="button" 
          (click)="removeQuestion(i)"
          [disabled]="questions.length === 1"
          class="btn-remove"
        >
          Remove
        </button>
      </div>

      <!-- Question text -->
      <div class="form-group">
        <label [for]="'question-text-' + i">Question Text</label>
        <input
          [id]="'question-text-' + i"
          type="text"
          formControlName="text"
          placeholder="Enter your question"
        />
        <div *ngIf="question.get('text')?.invalid && question.get('text')?.touched">
          Question text is required.
        </div>
      </div>

      <!-- Question type -->
      <div class="form-group">
        <label [for]="'question-type-' + i">Question Type</label>
        <select [id]="'question-type-' + i" formControlName="type">
          <option value="text">Short Text</option>
          <option value="textarea">Long Text</option>
          <option value="radio">Multiple Choice</option>
          <option value="checkbox">Checkboxes</option>
          <option value="rating">Rating Scale</option>
        </select>
      </div>

    </div><!-- end ngFor -->

  </div><!-- end formArrayName -->

  <!-- Button to add a new question -->
  <button type="button" (click)="addQuestion()" class="btn-add">
    + Add Question
  </button>

  <!-- Submit -->
  <button type="submit" [disabled]="surveyForm.invalid" class="btn-primary">
    Create Survey
  </button>

  <!-- Debug -->
  <pre>{{ surveyForm.value | json }}</pre>

</form>
```

### FormArray Methods Reference

```ts
const arr = this.surveyForm.get('questions') as FormArray;

// Length
arr.length;            // number of controls

// Access by index
arr.at(0);             // FormGroup/FormControl at index 0
arr.controls[0];       // same as .at(0)

// Add
arr.push(newControl);  // add to the end
arr.insert(2, control);// insert at index 2

// Remove
arr.removeAt(1);       // remove control at index 1
arr.clear();           // remove all controls

// Update value
arr.setValue([...]);   // set all values (strict — must match length)
arr.patchValue([...]);  // patch values (flexible)

// Reset
arr.reset();           // reset all controls to initial values
```

### FormArray — Section Recap

- `FormArray` is an ordered list of controls — ideal for dynamic "add/remove" patterns.
- Create with `fb.array([])` or `fb.array([initialControl])`.
- Add controls with `.push()`, remove with `.removeAt()`.
- In the template: use `formArrayName` on the container, and `[formGroupName]="i"` inside the loop.
- A getter (`get questions(): FormArray`) makes accessing it convenient and type-safe.

---

## Displaying Validation Error Messages

### The Three Rules of Error Display

1. **Never show errors on a pristine, untouched field** — wait until the user has interacted.
2. **Show errors as soon as the user has finished interacting** — when `touched` becomes true.
3. **Show specific, helpful messages** — don't just say "invalid", say "Email must be a valid email address."

### Pattern: Creating a Reusable Error Component

For large forms, repeating the error-display logic in every template is tedious. A better approach is a reusable component:

```ts
// form-error.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Only show if control is invalid AND touched -->
    <div class="error-container" *ngIf="control && control.invalid && control.touched">
      <p *ngIf="control.errors?.['required']" class="error-msg">This field is required.</p>
      <p *ngIf="control.errors?.['email']" class="error-msg">Must be a valid email address.</p>
      <p *ngIf="control.errors?.['minlength']" class="error-msg">
        Must be at least {{ control.errors?.['minlength']?.requiredLength }} characters long.
      </p>
      <p *ngIf="control.errors?.['maxlength']" class="error-msg">
        Must be at most {{ control.errors?.['maxlength']?.requiredLength }} characters long.
      </p>
      <p *ngIf="control.errors?.['pattern']" class="error-msg">Invalid format.</p>
      <p *ngIf="control.errors?.['min']" class="error-msg">
        Must be at least {{ control.errors?.['min']?.min }}.
      </p>
      <p *ngIf="control.errors?.['max']" class="error-msg">
        Must be at most {{ control.errors?.['max']?.max }}.
      </p>
      <!-- Custom validators -->
      <p *ngIf="control.errors?.['noWhitespace']" class="error-msg">Cannot contain spaces.</p>
      <p *ngIf="control.errors?.['passwordMismatch']" class="error-msg">Passwords do not match.</p>
    </div>
  `
})
export class FormErrorComponent {
  // Accepts any AbstractControl: FormControl, FormGroup, or FormArray
  @Input() control!: AbstractControl | null;
}
```

Usage in forms:

```html
<!-- In your form template -->
<div class="form-group">
  <label for="email">Email</label>
  <input id="email" type="email" formControlName="email" />
  
  <!-- One clean line instead of many *ngIf blocks -->
  <app-form-error [control]="loginForm.get('email')" />
</div>
```

### Adding CSS Classes Based on Validity

```html
<!-- Add 'is-invalid' class when field is touched and invalid -->
<input
  type="email"
  formControlName="email"
  [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
  [class.is-valid]="loginForm.get('email')?.valid && loginForm.get('email')?.touched"
/>
```

```css
/* styles.css */
input.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

input.is-valid {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.error-msg {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
}
```

### Validation Display — Section Recap

- Show errors only when `touched && invalid` (or `dirty && invalid`).
- Provide specific error messages by checking `control.errors?.['errorKey']`.
- Extract error display into a reusable `FormErrorComponent` to avoid repetition.
- Use `[class.is-invalid]` and `[class.is-valid]` for visual feedback on the input itself.

---

## Signal Forms (Experimental Preview)

> [!WARNING]
> Signal Forms are **experimental** as of Angular 19. The API may change before becoming stable. Do not use in production applications yet. This section is for awareness only.

### What Are Signal Forms?

Signal Forms are a new approach to building forms in Angular that uses the **Signals** primitive (introduced in Angular 16) as the reactivity mechanism, instead of RxJS Observables.

The goal is to combine the **simplicity of Template-Driven Forms** with the **programmatic power of Reactive Forms**, while using the newer Signals API for reactivity.

### How They Differ from Reactive Forms

```ts
// Reactive Forms (current standard)
this.form = this.fb.group({
  email: ['', Validators.required]
});
// Access: this.form.get('email')?.value
// React: this.form.valueChanges.subscribe(...)

// Signal Forms (experimental Angular 19+)
import { formGroup, formControl } from '@angular/forms'; // different import

this.form = formGroup({
  email: formControl('', { validators: [Validators.required] })
});
// Access: this.form.value().email  ← signal — read with ()
// React: effect(() => { console.log(this.form.value()); })  ← no subscription needed
```

### Key Differences

| Feature | Reactive Forms | Signal Forms |
|---|---|---|
| Reactivity | RxJS Observables | Angular Signals |
| Read value | `form.value` | `form.value()` |
| React to changes | `.subscribe()` | `effect(() => {...})` |
| Unsubscribe needed | Yes | No (signals auto-track) |
| API stability | Stable | Experimental |

> [!NOTE]
> Watch the official Angular blog for Signal Forms updates. When they become stable (likely Angular 20+), they will likely become the recommended approach for new projects.

---

## Lab 1 — Login Form (Template-Driven & Reactive)

**Duration:** 45 minutes  
**Difficulty:** Beginner-Intermediate

### Objective

Build the same login form twice — once using Template-Driven Forms and once using Reactive Forms — to directly compare the two approaches.

### Setup

```bash
# If you don't have a project yet:
ng new angular-forms-lab --routing=false --style=css
cd angular-forms-lab

# Generate two components
ng generate component login-template-driven
ng generate component login-reactive
```

### Part A — Template-Driven Login (20 min)

**Requirements:**
1. A form with: Email (required, email format), Password (required, minlength 8).
2. Show specific error messages (required vs. format) for each field.
3. Error messages appear only after the user has touched the field.
4. Submit button is disabled when the form is invalid.
5. On submit, log the form value to the console and show a success message.
6. After successful submit, reset the form.

**Steps:**
1. Add `FormsModule` to the component's `imports`.
2. Add a `user` object to the component class: `user = { email: '', password: '' }`.
3. Add `#loginForm="ngForm"` and `(ngSubmit)="onSubmit(loginForm)"` to the `<form>`.
4. Add `[(ngModel)]`, `name`, and validation attributes to each input.
5. Add `#fieldRef="ngModel"` to each input for field-level state.
6. Add `*ngIf` blocks for each error condition.
7. Implement `onSubmit(form: NgForm)` in the class.

**Expected Form Value on Submit:**
```json
{ "email": "user@example.com", "password": "securePass1" }
```

### Part B — Reactive Login (25 min)

**Requirements:**
Same as Part A, but implemented using Reactive Forms.

**Steps:**
1. Add `ReactiveFormsModule` to imports.
2. Inject `FormBuilder` in the constructor.
3. Create `loginForm` using `this.fb.group()` in `ngOnInit()`.
4. Add `[formGroup]="loginForm"` to the `<form>`.
5. Add `formControlName="email"` and `formControlName="password"` to inputs.
6. Use `loginForm.get('field')?.invalid && loginForm.get('field')?.touched` for errors.
7. Implement `onSubmit()` that checks `loginForm.valid` and logs `loginForm.value`.

### Bonus Challenges

- Add a "Remember Me" checkbox to the Reactive form.
- Subscribe to `loginForm.get('email')?.valueChanges` and log every change.
- Add a password strength indicator (Weak / Medium / Strong) that updates as the user types.

---

## Lab 2 — Dynamic Survey Builder with FormArray

**Duration:** 40 minutes  
**Difficulty:** Intermediate

### Objective

Build a survey creation form where users can add and remove questions dynamically using `FormArray`.

### Setup

```bash
ng generate component survey-builder
```

### Requirements

1. A form with a **Survey Title** field (required).
2. A dynamic **Questions** section (powered by `FormArray`):
   - Each question has: Question Text (required) and Question Type (dropdown: text/radio/checkbox).
   - Start with 1 empty question.
   - **"+ Add Question"** button adds a new empty question at the bottom.
   - **"Remove"** button on each question removes it (disabled when only 1 remains).
3. Show validation errors for each question's text field.
4. Submit button disabled when form is invalid.
5. On submit, log the full survey data to the console.

### Implementation Steps

1. **Setup FormGroup:**
```ts
this.surveyForm = this.fb.group({
  title: ['', Validators.required],
  questions: this.fb.array([this.createQuestion()])
});
```

2. **Getter for questions:**
```ts
get questions(): FormArray {
  return this.surveyForm.get('questions') as FormArray;
}
```

3. **createQuestion helper:**
```ts
createQuestion(): FormGroup {
  return this.fb.group({
    text: ['', Validators.required],
    type: ['text']
  });
}
```

4. **Add/Remove methods:**
```ts
addQuestion(): void { this.questions.push(this.createQuestion()); }
removeQuestion(i: number): void { this.questions.removeAt(i); }
```

5. **Template:** Use `formArrayName="questions"` and `[formGroupName]="i"` inside `*ngFor`.

### Expected Output on Submit

```json
{
  "title": "Customer Feedback",
  "questions": [
    { "text": "How satisfied are you?", "type": "radio" },
    { "text": "Any additional comments?", "type": "textarea" }
  ]
}
```

### Bonus Challenges

- Add a "question count" display: "3 of 10 questions added".
- Disable the "+ Add Question" button when there are already 10 questions.
- Add a "Preview Survey" section below the form that renders the questions as they would appear to survey respondents.
- Add `Validators.maxLength(200)` to the question text and show a character counter.

---

## Assignment — ShopAngular Project Part 6: Checkout Form

**Project:** ShopAngular  
**Part:** 6 of 8  
**Topic:** Checkout Form with Reactive Forms  
**Due:** Before next lecture  
**Estimated Time:** 3–5 hours

### Overview

Add a **checkout form** to the ShopAngular project. When a user proceeds to checkout from the cart, they fill in their shipping details and payment information using a multi-section Reactive Form.

### Project Context

By now, ShopAngular has:
- Product listing page with filtering (Part 1–2)
- Product detail page (Part 3)
- Shopping cart with add/remove (Part 4–5)

In this part, you add the **checkout flow**: Cart → Checkout Form → Order Confirmation.

### Requirements

#### Requirement 1 — Generate the Checkout Component

```bash
ng generate component checkout
```

Add a route in `app.routes.ts`:

```ts
{ path: 'checkout', component: CheckoutComponent }
```

Add a "Proceed to Checkout" button in the Cart component that navigates to `/checkout`.

#### Requirement 2 — Shipping Information Section

The checkout form must have a **Shipping** section with these fields and validators:

| Field | Control Name | Validators | Error Messages |
|---|---|---|---|
| Full Name | `fullName` | required, minLength(2) | "Name is required" / "Name too short" |
| Email | `email` | required, email | "Email is required" / "Invalid email" |
| Phone | `phone` | required, pattern(`^\d{10,15}$`) | "Phone is required" / "Invalid phone number" |
| Address Line 1 | `address1` | required | "Address is required" |
| Address Line 2 | `address2` | none | (optional field) |
| City | `city` | required | "City is required" |
| Postal Code | `postalCode` | required, pattern(`^\d{4,10}$`) | "Postal code is required" / "Invalid postal code" |
| Country | `country` | required | "Please select a country" |

Implement as a **nested FormGroup** called `shipping`:

```ts
this.checkoutForm = this.fb.group({
  shipping: this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    // ... etc
  }),
  payment: this.fb.group({ /* Requirement 3 */ }),
});
```

#### Requirement 3 — Payment Information Section

A **Payment** section with:

| Field | Control Name | Validators | Notes |
|---|---|---|---|
| Name on Card | `nameOnCard` | required | |
| Card Number | `cardNumber` | required, pattern(`^\d{16}$`) | Show last 4 only after entry |
| Expiry Month | `expiryMonth` | required, min(1), max(12) | Dropdown 1–12 |
| Expiry Year | `expiryYear` | required, min(currentYear) | Dropdown current year + 10 |
| CVV | `cvv` | required, pattern(`^\d{3,4}$`) | Don't log this to console |

> [!CAUTION]
> In a real application, **NEVER** send raw card numbers to your backend over a plain HTTP connection. Always use a payment provider like Stripe or PayPal. For this assignment, we simulate the process — no real card data is collected.

#### Requirement 4 — Order Summary Sidebar

Display a **read-only order summary** next to the form:
- List each cart item: name, quantity, price.
- Show subtotal, shipping cost (free over $50, else $5.99), and total.
- This panel is read-only — no form controls here, just display.

#### Requirement 5 — Form Submission Logic

When the user clicks **"Place Order"**:

1. If form is invalid: call `this.checkoutForm.markAllAsTouched()` to show all errors.
2. If form is valid:
   - Log the shipping info (not the full payment info — don't log CVV).
   - Create an `Order` object:
     ```ts
     interface Order {
       orderId: string;       // generate a random ID: 'ORD-' + Date.now()
       items: CartItem[];     // from CartService
       shipping: ShippingInfo;
       total: number;
       date: Date;
     }
     ```
   - Clear the cart using `CartService`.
   - Navigate to `/order-confirmation` and pass the Order object via state or a service.

#### Requirement 6 — Order Confirmation Page

Create an `OrderConfirmationComponent`:

```bash
ng generate component order-confirmation
```

Add route: `{ path: 'order-confirmation', component: OrderConfirmationComponent }`

Display:
- "Order Placed Successfully! 🎉" heading.
- The order ID.
- A summary of the items ordered.
- The shipping address.
- A "Continue Shopping" button that navigates back to `/products`.

### Grading Criteria

| Criteria | Points |
|---|---|
| Checkout form uses `ReactiveFormsModule` with `FormBuilder` | 10 |
| Shipping section has all required fields with correct validators | 20 |
| Payment section has all fields with correct validators | 15 |
| Error messages show correctly (touched + invalid pattern) | 15 |
| Submit button disabled when form invalid | 5 |
| Order summary sidebar displays cart contents correctly | 10 |
| Form submission creates Order and clears cart | 15 |
| Order confirmation page shows correct data | 10 |
| **Total** | **100** |

### Submission

Push your code to GitHub and submit the repository link along with a short Loom video (max 3 minutes) demonstrating the full checkout flow.

---

## Common Mistakes & How to Avoid Them

| # | Mistake | Why It Happens | How to Avoid It |
|---|---|---|---|
| 1 | Forgetting to import `FormsModule` | It's not imported by default | Always check imports first when ngModel doesn't work |
| 2 | Using `[(ngModel)]` without a `name` attribute | Seems optional but Angular requires it inside a `<form>` | Add `name="fieldName"` to every ngModel input |
| 3 | Importing `FormsModule` instead of `ReactiveFormsModule` for Reactive Forms | Both sound similar | Remember: Template-Driven → `FormsModule`, Reactive → `ReactiveFormsModule` |
| 4 | Using `formControlName` with brackets: `[formControlName]="'email'"` | Confusing property binding vs directive syntax | `formControlName` is a directive attribute, NOT a property binding — no brackets |
| 5 | Forgetting `[formGroup]="myForm"` on the `<form>` tag | Easy to miss when copying examples | Always pair `[formGroup]` on `<form>` with `formControlName` on inputs |
| 6 | Showing errors before user interaction | Not checking `touched` or `dirty` | Always use `control.invalid && control.touched` pattern |
| 7 | Accessing `form.value` before form initialization | Accessing in template before `ngOnInit` runs | Use the `!` non-null assertion operator in class declaration: `form!: FormGroup` and initialize in `ngOnInit` |
| 8 | Forgetting to cast `FormArray` in the getter | `fb.group()` returns `AbstractControl` for all nested items | Always cast: `return this.form.get('items') as FormArray;` |
| 9 | Using `setValue()` when data is partial | `setValue()` is strict and throws if fields are missing | Use `patchValue()` for partial updates |
| 10 | Not unsubscribing from `valueChanges` | Memory leak in long-lived components | Use `takeUntil(this.destroy$)` or Angular's `takeUntilDestroyed()` |
| 11 | Using `minlength` (lowercase) in Reactive validators | HTML attribute is lowercase, TypeScript validator is camelCase | In TypeScript: `Validators.minLength(8)` (capital L) |
| 12 | Applying cross-field validators to individual controls | Cross-field validators need access to siblings | Apply to the `FormGroup`, not individual `FormControl` |
| 13 | Forgetting `markAllAsTouched()` on failed submit | Errors don't show if controls aren't touched | Always call `markAllAsTouched()` when the form is submitted and invalid |
| 14 | Mutating `FormArray` controls directly | Bypasses Angular's change detection | Always use `.push()`, `.removeAt()`, `.insert()`, etc. |
| 15 | Not using `FormBuilder` | Writing `new FormControl(...)` everywhere is error-prone | Use `FormBuilder` service — it's provided by `ReactiveFormsModule` |

---

## Key Takeaways

1. **Angular forms prevent page reloads** and give you rich validation, binding, and submission control — essential for SPAs.

2. **Template-Driven Forms** put logic in the template using `[(ngModel)]`, `#ref="ngForm"`, and HTML validation attributes. Best for simple forms.

3. **Reactive Forms** define the form structure in TypeScript using `FormBuilder`, `FormGroup`, and `FormControl`. Best for complex, dynamic, or testable forms.

4. **`FormsModule`** = Template-Driven. **`ReactiveFormsModule`** = Reactive. They are separate and not interchangeable.

5. **`name` attribute is required** on every `[(ngModel)]` input inside a `<form>` tag.

6. **Validators**: built-in ones (`Validators.required`, `Validators.email`, etc.) cover common cases. Write your own for business rules.

7. **Form state properties** — `pristine/dirty`, `touched/untouched`, `valid/invalid` — tell you exactly how the user has interacted with the form.

8. **Show errors only after `touched` or `dirty`** to avoid showing errors before the user has a chance to fill in the form.

9. **`FormArray`** is for dynamic lists — use `.push()` to add and `.removeAt()` to remove controls at runtime.

10. **`valueChanges`** and **`statusChanges`** Observables let you react to form changes in real time — remember to unsubscribe to prevent memory leaks.

11. **`setValue()`** is strict (requires all fields). **`patchValue()`** is flexible (partial updates).

12. **Signal Forms** are coming — they will combine the best of Reactive Forms with the simplicity of Signals, but are experimental in Angular 19.

---

## Resources

### Official Documentation
- [Angular Forms Overview](https://angular.dev/guide/forms) — official Angular guide
- [Template-Driven Forms Guide](https://angular.dev/guide/forms/template-driven-forms)
- [Reactive Forms Guide](https://angular.dev/guide/forms/reactive-forms)
- [Built-in Validators Reference](https://angular.dev/api/forms/Validators)
- [FormArray API Reference](https://angular.dev/api/forms/FormArray)

### Articles & Tutorials
- [Angular Forms — The Complete Guide (Ultimate Courses)](https://ultimatecourses.com/blog/angular-2-forms-reactive)
- [Custom Form Validators in Angular (blog.angular-university.io)](https://blog.angular-university.io/angular-custom-validators/)
- [Reactive Forms Deep Dive (netbasal.com)](https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a)

### Tools
- [Angular DevTools (Chrome Extension)](https://angular.dev/tools/devtools) — inspect form state in the browser
- [JSON Formatter Chrome Extension](https://chrome.google.com/webstore/detail/json-formatter) — makes `| json` pipe output readable

### Video Resources
- [Angular Forms Crash Course (Academind)](https://www.youtube.com/watch?v=fNMfMkI4S6M)
- [Reactive Forms Full Course (Decoded Frontend)](https://www.youtube.com/watch?v=JeeUY6WaXiA)

---

*End of Lecture 28 — Angular Forms: Template-Driven & Reactive*

*Next: Lecture 29 — Angular HTTP Client & RxJS: Connecting to a Backend API*