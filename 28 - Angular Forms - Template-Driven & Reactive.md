# Lecture 28 — Angular Forms: Template-Driven & Reactive

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain why Angular provides special form handling (vs plain HTML forms)
- Build forms using the Template-Driven approach
- Build forms using the Reactive approach
- Add built-in and custom validators
- Track form state (dirty, touched, valid, pristine)
- Display user-friendly validation error messages
- Use `FormArray` to create dynamic fields (add/remove at runtime)
- Choose between Template-Driven and Reactive forms for a given use case

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Why Forms Need Special Handling
2. Template-Driven Forms
3. Reactive Forms
4. Form State Properties
5. Custom Validators
6. FormArray (Dynamic Fields)
7. Error Message Display Patterns

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: Login Form (Both Approaches)
2. Lab 2: Dynamic Survey Builder with FormArray

---

## 1. Why Forms Need Special Handling

HTML forms submit data and reload the page by default. In a modern SPA (Single Page Application), we need:
- **No page reloads** — handle submission with JavaScript
- **Real-time validation** — show errors as the user types
- **State tracking** — know if a field has been touched, changed, or is valid
- **Dynamic fields** — add or remove form fields at runtime

Angular provides two approaches to handle all of this.

---

## 2. Template-Driven vs Reactive — Quick Comparison

| Feature | Template-Driven | Reactive |
|---------|:--------------:|:--------:|
| Logic location | Template (HTML) | Component (TypeScript) |
| Setup | `FormsModule` | `ReactiveFormsModule` |
| Directives | `ngModel`, `ngForm` | `formGroup`, `formControlName` |
| Validation | HTML attributes | TypeScript validators |
| Dynamic fields | Difficult | Easy with `FormArray` |
| Testability | Hard to test | Easy to unit test |
| Best for | Simple forms (login, contact) | Complex forms (checkout, multi-step) |

---

## 3. Template-Driven Forms

Import `FormsModule` in your component or module, then bind with `ngModel`:

```ts
// app.component.ts (or standalone component imports)
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  // ...
})
```

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  
  <label for="email">Email</label>
  <input 
    id="email"
    type="email" 
    name="email"
    [(ngModel)]="user.email"
    required 
    email
    #emailField="ngModel"
  >
  <div *ngIf="emailField.invalid && emailField.touched" class="error">
    <span *ngIf="emailField.errors?.['required']">Email is required.</span>
    <span *ngIf="emailField.errors?.['email']">Invalid email format.</span>
  </div>

  <label for="password">Password</label>
  <input 
    id="password"
    type="password"
    name="password"
    [(ngModel)]="user.password"
    required
    minlength="8"
    #passwordField="ngModel"
  >
  
  <button type="submit" [disabled]="loginForm.invalid">Log In</button>
</form>
```

```ts
// Component
user = { email: '', password: '' };

onSubmit(form: NgForm): void {
  if (form.valid) {
    console.log('Form data:', form.value);
  }
}
```

### Built-in Template Validators

| Attribute | What it validates |
|-----------|-------------------|
| `required` | Field must not be empty |
| `email` | Must be a valid email format |
| `minlength="8"` | Minimum character count |
| `maxlength="50"` | Maximum character count |
| `pattern="[a-zA-Z]+"` | Must match a regex pattern |

---

## 4. Reactive Forms

Import `ReactiveFormsModule` and define the form in TypeScript:

```ts
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  // ...
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form data:', this.loginForm.value);
      // { email: 'user@example.com', password: 'secret123' }
    }
  }
}
```

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  
  <label for="email">Email</label>
  <input id="email" type="email" formControlName="email">
  <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
    <span *ngIf="loginForm.get('email')?.hasError('required')">Email is required.</span>
    <span *ngIf="loginForm.get('email')?.hasError('email')">Invalid email.</span>
  </div>

  <label for="password">Password</label>
  <input id="password" type="password" formControlName="password">
  
  <button type="submit" [disabled]="loginForm.invalid">Log In</button>
</form>
```

### Built-in Reactive Validators

| Validator | Usage |
|-----------|-------|
| `Validators.required` | Field must not be empty |
| `Validators.email` | Valid email format |
| `Validators.minLength(n)` | Minimum `n` characters |
| `Validators.maxLength(n)` | Maximum `n` characters |
| `Validators.pattern(regex)` | Must match a regex |
| `Validators.min(n)` | Minimum numeric value |
| `Validators.max(n)` | Maximum numeric value |

---

## 5. Form State Properties

Every form control and form group has these state properties:

| Property | Meaning |
|----------|---------|
| `valid` / `invalid` | Do all validators pass? |
| `touched` / `untouched` | Has the user focused and then left the field? |
| `dirty` / `pristine` | Has the user changed the value? |
| `errors` | Object containing current validation errors |

```ts
const emailCtrl = this.loginForm.get('email');

emailCtrl.valid      // true if all validators pass
emailCtrl.touched    // true if user has focused and blurred the field
emailCtrl.dirty      // true if user has typed something
emailCtrl.errors     // { required: true } or { email: true } or null
```

> [!TIP]
> Only show error messages when the field is **both invalid AND touched**. Showing errors immediately (before the user has interacted) is annoying.

---

## 6. Custom Validators

### Sync Validator

```ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

function noWhitespace(control: AbstractControl): ValidationErrors | null {
  const hasWhitespace = control.value?.includes(' ');
  return hasWhitespace ? { noWhitespace: true } : null;
}

// Usage
this.fb.group({
  username: ['', [Validators.required, noWhitespace]]
});
```

### Cross-Field Validator (Password Match)

```ts
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

// Apply to the FormGroup, not individual controls
this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, { validators: passwordsMatch });
```

### Async Validator (e.g., Check Username Availability)

```ts
function checkUsernameAvailable(http: HttpClient) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return http.get<boolean>(`/api/check-username/${control.value}`).pipe(
      map(available => available ? null : { usernameTaken: true }),
      catchError(() => of(null))
    );
  };
}
```

---

## 7. FormArray — Dynamic Fields

`FormArray` manages a dynamic list of controls that can be added or removed at runtime:

```ts
export class SurveyComponent {
  private fb = inject(FormBuilder);

  surveyForm = this.fb.group({
    title: ['', Validators.required],
    questions: this.fb.array([]) // Start empty
  });

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(this.fb.group({
      text: ['', Validators.required],
      type: ['text', Validators.required]
    }));
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }
}
```

```html
<form [formGroup]="surveyForm">
  <input formControlName="title" placeholder="Survey Title">

  <div formArrayName="questions">
    <div *ngFor="let q of questions.controls; let i = index" [formGroupName]="i">
      <input formControlName="text" placeholder="Question text">
      <select formControlName="type">
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="boolean">Yes/No</option>
      </select>
      <button type="button" (click)="removeQuestion(i)">Remove</button>
    </div>
  </div>
  
  <button type="button" (click)="addQuestion()">+ Add Question</button>
</form>
```

---

## 8. Error Message Display Pattern

Create a reusable helper to keep templates clean:

```ts
// In the component
getError(controlName: string): string {
  const control = this.form.get(controlName);
  if (!control?.invalid || !control?.touched) return '';
  
  if (control.hasError('required'))    return `${controlName} is required`;
  if (control.hasError('email'))       return 'Invalid email format';
  if (control.hasError('minlength'))   return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
  return '';
}
```

```html
<input formControlName="email">
<span class="error">{{ getError('email') }}</span>
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Importing `FormsModule` for reactive forms | Reactive forms need `ReactiveFormsModule` |
| Mixing `ngModel` with `formControlName` | Use one approach per form — don't mix them |
| Showing errors before the user interacts | Check `control.touched` before displaying errors |
| Forgetting `name` attribute in template-driven forms | Every `ngModel` input needs a `name` attribute |
| Applying cross-field validators to individual controls | Apply them to the `FormGroup` using the `validators` option |
| Not cleaning up async validators | Use `debounceTime` and `distinctUntilChanged` to avoid excessive API calls |

---

## 🧪 Practice Labs

### Lab 1 — Login Form (Both Approaches) (40 min)
1. Build a login form with email and password fields
2. Implement it first as Template-Driven, then rebuild it as Reactive
3. Add validation: email required + valid format, password required + 8 char minimum
4. Show error messages only after the field is touched
5. Disable the submit button when the form is invalid

### Lab 2 — Dynamic Survey Builder with FormArray (50 min)
1. Create a survey form with a title and dynamic questions
2. Each question has: text (string), type (dropdown: text/number/boolean), required (checkbox)
3. Add "Add Question" and "Remove" buttons
4. The form must be valid before submission (title required, at least 1 question)
5. Display the form value as JSON below the form for debugging

---

## 📝 Assignment: ShopAngular Project — Part 6: Checkout Form

### Requirements
1. Create a multi-section checkout form using Reactive Forms:
   - **Shipping**: Full name, address, city, zip code, country (dropdown)
   - **Payment**: Card number, expiry, CVV
   - **Review**: Display all entered data as a summary
2. All fields required with appropriate validators (email, minLength, pattern for card number)
3. Add a custom cross-field validator: if country is "US", zip code must be 5 digits
4. Show inline validation errors (only after touch)
5. Disable the "Place Order" button until all sections are valid
6. On submit, log the entire form value and show a success message

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Forms Guide | https://angular.dev/guide/forms |
| Angular Reactive Forms | https://angular.dev/guide/forms/reactive-forms |
| Angular Validation | https://angular.dev/guide/forms/form-validation |

---

## 📌 Key Takeaways
- **Template-Driven Forms** are quick for simple forms — logic lives in the template with `ngModel`
- **Reactive Forms** are better for complex forms — logic lives in TypeScript with `FormGroup`, `FormControl`, `FormArray`
- Always check **`touched && invalid`** before showing error messages
- **Custom validators** are just functions that return `null` (valid) or an error object (invalid)
- **`FormArray`** enables dynamic fields — add/remove controls at runtime
- **Cross-field validators** (like password match) are applied to the `FormGroup`, not individual controls
- In most professional Angular projects, **Reactive Forms are the standard**

---

**Next Lecture:** [Lecture 29 — HTTP Client & API Integration](./29%20-%20HTTP%20Client%20%26%20API%20Integration.md)
