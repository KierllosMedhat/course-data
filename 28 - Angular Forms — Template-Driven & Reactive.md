# Lecture 28 — Angular Forms: Template-Driven & Reactive

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Build template-driven forms with `ngModel` and `ngForm`
- Build reactive forms with `FormControl`, `FormGroup`, and `FormBuilder`
- Apply built-in validators and write custom validator functions
- Use `FormArray` for dynamic, variable-length form sections
- React to form changes with `valueChanges`
- Understand Signal Forms (experimental preview)

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Three form approaches: Template-Driven, Reactive, Signal Forms
2. Template-driven forms: `ngModel`
3. Reactive forms: `FormBuilder`, `FormGroup`, `FormControl`
4. Built-in and Custom Validators
5. Form State (pristine, dirty, touched, valid)
6. Dynamic forms with `FormArray`
7. Signal Forms preview

### Part 2 — Practice / Lab (~90–120 min)
1. Build a login form both ways
2. Create a dynamic survey builder with `FormArray`
3. ShopAngular Project Part 6: Checkout Form

---

## 1. Three Form Approaches

| Feature | Template-Driven | Reactive | Signal Forms (Exp.) |
|---------|----------------|----------|-------------------|
| Source of truth | Template (implicit) | Component class (explicit) | Writable signal |
| Setup | `FormsModule` | `ReactiveFormsModule` | `@angular/forms/signals` |
| Best for | Simple forms (login) | Complex, large forms | Signal-based apps |

> [!NOTE]
> **Reactive Forms** are the industry standard for any form more complex than a basic login. 

---

## 2. Template-Driven Forms

Template-driven forms use directives in the template.

```ts
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  // ...
})
export class LoginComponent {
  model = { email: '', password: '' };
}
```

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <input type="email" name="email" [(ngModel)]="model.email" required>
  <button type="submit" [disabled]="loginForm.invalid">Log In</button>
</form>
```

---

## 3. Reactive Forms

Reactive forms build the form model **programmatically** in the component class:

```ts
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  // ...
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Submitting:', this.form.value);
    }
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input type="email" formControlName="email">
  <input type="password" formControlName="password">
  <button type="submit" [disabled]="form.invalid">Log In</button>
</form>
```

---

## 4. Built-in and Custom Validators

| Validator | Purpose | Example |
|-----------|---------|---------|
| `Validators.required` | Non-empty value | `['', Validators.required]` |
| `Validators.email` | Valid email pattern | `['', Validators.email]` |
| `Validators.minLength(n)` | Minimum string length | `['', Validators.minLength(8)]` |

### Custom Validator
A validator is a function that returns `null` if valid, or an error object if invalid:

```ts
export function forbiddenNameValidator(nameRe: RegExp) {
  return (control: AbstractControl) => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}
```

---

## 5. Form State

Every control tracks its interaction state:

| State | Meaning |
|-------|---------|
| `pristine` | Value hasn't been changed |
| `dirty` | Value has been changed |
| `touched` | User has focused then blurred |
| `untouched` | User hasn't blurred yet |

> [!TIP]
> Always check `dirty || touched` before showing errors to the user:
> `@if (form.get('email')?.invalid && form.get('email')?.touched) { ... }`

---

## 6. Dynamic Forms with `FormArray`

`FormArray` manages a **variable-length** list of controls (e.g. multiple phone numbers).

```ts
form = this.fb.group({
  phones: this.fb.array([ this.fb.control('') ])
});

get phones(): FormArray {
  return this.form.get('phones') as FormArray;
}

addPhone() {
  this.phones.push(this.fb.control(''));
}
```

```html
<div formArrayName="phones">
  @for (phone of phones.controls; track $index; let i = $index) {
    <input [formControlName]="i">
    <button (click)="removePhone(i)">Remove</button>
  }
</div>
```

---

## 7. Signal Forms Preview (Experimental)

Signal Forms reimagine forms through Angular signals:

```ts
import { form, required, FormField } from '@angular/forms/signals';

export class LoginComponent {
  loginModel = signal({ email: '' });

  loginForm = form(this.loginModel, (path) => {
    required(path.email, { message: 'Email is required' });
  });
}
```
> [!WARNING]
> Signal Forms are **experimental**. Use Reactive Forms for production code today!

---

## 🧪 Practice Labs

### Lab 1 — Login Form Both Ways (45 min)
1. **Template-driven:** Build with `[(ngModel)]`, `required`.
2. **Reactive:** Build the same form with `FormBuilder` and `Validators`.

### Lab 2 — Dynamic Survey Builder with FormArray (40 min)
1. Build a `FormGroup` with a `questions` `FormArray`.
2. Add a button that pushes new questions into the array.

---

## 📝 Assignment: ShopAngular Project — Part 6

Let's build a Checkout Form for our e-commerce app using Reactive Forms!

### Requirements
1. In your `CheckoutComponent`, inject `FormBuilder`.
2. Create a form with the following fields:
   - `fullName` (required)
   - `email` (required, valid email)
   - `address` (required, min length 10)
   - `creditCard` (required, exact length 16 digits using a custom or Regex pattern validator)
3. Build the HTML template using `[formGroup]` and `formControlName`.
4. Show error messages under each input, but ONLY if the input is `touched` and `invalid`.
5. Disable the Submit button if the form is invalid.
6. When the form is submitted, log the order to the console and clear the Cart!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Reactive Forms | https://angular.dev/guide/forms/reactive-forms |
| Angular Form Validation | https://angular.dev/guide/forms/form-validation |

---

## 📌 Key Takeaways
- **Template-driven forms** are quick for simple scenarios.
- **Reactive forms** (`FormBuilder`) are the standard for complex forms.
- Built-in validators cover most needs; write **custom validators** as pure functions.
- Check **`dirty || touched`** before showing errors for good UX.
- **`FormArray`** enables dynamic add/remove of form sections at runtime.

---

**Next Lecture:** [Lecture 29 — HTTP Client & API Integration](./29%20-%20HTTP%20Client%20%26%20API%20Integration.md)