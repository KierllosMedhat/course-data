# Lecture 16 — Bootstrap 5.3: Forms, Tables, Customization & JS Plugins

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Build professional forms with floating labels and validation states
- Style custom form controls (switches, range sliders, file inputs)
- Create responsive, accessible data tables
- Use interactive JS components (dropdowns, tabs, accordions, tooltips, toasts)
- Customise Bootstrap's design system using Sass variables
- Implement a modal-based contact form with validation

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Forms: floating labels, input groups, validation
2. Custom controls: switches, range, file input
3. Tables: striped, bordered, hover, responsive
4. JS Components: modals, dropdowns, tabs, tooltips, toasts
5. Customising Bootstrap with Sass

### Part 2 — Practice & Lab (~90–120 min)
1. Build a multi-step form wizard
2. Build a styled data table
3. StartupLaunch Project Part 2: Modals & Forms

---

## 1. Forms & Floating Labels

### Why Bootstrap Forms? (Plain English)

HTML forms are functional but ugly by default. Bootstrap transforms them into professional-looking interfaces with consistent spacing, clear states (valid, invalid, disabled, focused), and modern patterns like floating labels — all without writing a single line of custom CSS.

### Basic Form Structure

```html
<form>
  <div class="mb-3">
    <!-- 'form-label' adds margin-bottom and proper font styling -->
    <label for="email" class="form-label">Email address</label>

    <!-- 'form-control' adds proper padding, border, focus ring -->
    <input type="email" class="form-control" id="email" placeholder="name@example.com">

    <!-- Help text below the input: -->
    <div class="form-text text-muted">We'll never share your email.</div>
  </div>

  <div class="mb-3">
    <label for="message" class="form-label">Message</label>
    <textarea class="form-control" id="message" rows="4"></textarea>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Floating Labels (Bootstrap 5 Feature)

Floating labels are a modern UX pattern where the label starts *inside* the input (like a placeholder), and floats *above* the input when the user types or focuses the field.

```
BEFORE focusing:           AFTER typing:
─────────────────          ──────────────────
[  Email Address ]         [ Email Address   ] ← Label floated up
                           [ alice@example.com]
```

```html
<div class="form-floating mb-3">
  <!-- IMPORTANT: input MUST come BEFORE label for the CSS to work! -->
  <!-- IMPORTANT: input MUST have a placeholder attribute (even if empty) -->
  <input
    type="email"
    class="form-control"
    id="emailInput"
    placeholder="name@example.com"
  >
  <label for="emailInput">Email address</label>
</div>

<div class="form-floating mb-3">
  <input
    type="password"
    class="form-control"
    id="passwordInput"
    placeholder="Password"
  >
  <label for="passwordInput">Password</label>
</div>

<!-- Floating label with textarea: -->
<div class="form-floating mb-3">
  <textarea class="form-control" id="messageArea" placeholder="Your message" style="height: 150px"></textarea>
  <label for="messageArea">Your message</label>
</div>
```

> [!IMPORTANT]
> Floating labels require both:
> 1. The `<input>` to come **before** the `<label>` in the HTML (CSS sibling selector)
> 2. A `placeholder` attribute on the input (even just `placeholder=" "`) — without it, the label doesn't float

### Input Groups

Prepend or append text, buttons, or icons to inputs for richer context:

```html
<!-- With prefix text: -->
<div class="input-group mb-3">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control" placeholder="Username">
</div>

<!-- With suffix text: -->
<div class="input-group mb-3">
  <input type="number" class="form-control" placeholder="Amount">
  <span class="input-group-text">.00</span>
</div>

<!-- With button: -->
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Search products...">
  <button class="btn btn-primary" type="button">
    <i class="bi bi-search"></i> Search
  </button>
</div>

<!-- Prefix and Suffix: -->
<div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="number" class="form-control" placeholder="Price">
  <span class="input-group-text">.00</span>
</div>
```

### Form Validation

Bootstrap provides built-in visual feedback for HTML5 form validation. Valid fields get a green border with a checkmark; invalid ones get red with an error message.

**How it works:**
1. Add `novalidate` to the `<form>` to prevent browser's default ugly tooltips
2. Add `required`, `minlength`, `type`, etc. to inputs for HTML5 validation rules
3. On form submission, use JavaScript to add the `was-validated` class to the form — this activates Bootstrap's styles

```html
<form id="registration-form" class="needs-validation" novalidate>
  <div class="mb-3">
    <label for="username" class="form-label">Username</label>
    <input
      type="text"
      class="form-control"
      id="username"
      required
      minlength="3"
      maxlength="20"
      pattern="[a-zA-Z0-9_]+"
    >
    <!-- Shows when field is VALID: -->
    <div class="valid-feedback">Looks good!</div>
    <!-- Shows when field is INVALID: -->
    <div class="invalid-feedback">
      Username must be 3-20 characters (letters, numbers, underscores only).
    </div>
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" required>
    <div class="invalid-feedback">Please enter a valid email address.</div>
  </div>

  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" required minlength="8">
    <div class="invalid-feedback">Password must be at least 8 characters.</div>
  </div>

  <button type="submit" class="btn btn-primary w-100">Create Account</button>
</form>
```

```js
// JavaScript to activate validation styles on submit:
const form = document.querySelector('#registration-form');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Always prevent default

  if (!form.checkValidity()) {
    // Form has invalid fields — show validation styles
    form.classList.add('was-validated');
    return; // Stop here — don't submit
  }

  // All fields are valid — proceed with form submission
  form.classList.add('was-validated'); // Shows green valid styles
  console.log("Form submitted!");

  // Reset and hide validation styles after successful submission:
  // form.reset();
  // form.classList.remove('was-validated');
});
```

### 📌 Section Recap
- Use `form-label` + `form-control` for consistent form styling.
- Floating labels need `input` before `label` and a `placeholder` attribute.
- Add `novalidate` to `<form>` and toggle `was-validated` class via JS for validation.

---

## 2. Custom Form Controls

### Form Selects

```html
<label for="country" class="form-label">Country</label>
<select class="form-select" id="country">
  <option selected disabled>Select your country</option>
  <option value="eg">Egypt</option>
  <option value="us">United States</option>
  <option value="gb">United Kingdom</option>
</select>

<!-- Size variants: -->
<select class="form-select form-select-lg">...</select>
<select class="form-select form-select-sm">...</select>
```

### Checkboxes and Radio Buttons

```html
<!-- Checkboxes: -->
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="terms" required>
  <label class="form-check-label" for="terms">
    I agree to the <a href="#">Terms and Conditions</a>
  </label>
</div>

<!-- Inline checkboxes: -->
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="opt1" value="1">
  <label class="form-check-label" for="opt1">Option 1</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="opt2" value="2">
  <label class="form-check-label" for="opt2">Option 2</label>
</div>

<!-- Radio buttons: -->
<div class="form-check">
  <input class="form-check-input" type="radio" name="plan" id="free" value="free">
  <label class="form-check-label" for="free">Free Plan</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="plan" id="pro" value="pro">
  <label class="form-check-label" for="pro">Pro Plan ($9/mo)</label>
</div>
```

### Toggle Switches

Switches are styled checkboxes that look like iOS-style toggle buttons:

```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="notifications" role="switch">
  <label class="form-check-label" for="notifications">Enable notifications</label>
</div>

<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="marketing" role="switch" checked>
  <label class="form-check-label" for="marketing">Marketing emails (on by default)</label>
</div>
```

### Range Slider

```html
<label for="volume" class="form-label">Volume: <span id="volume-value">50</span>%</label>
<input type="range" class="form-range" min="0" max="100" value="50" id="volume">
```

```js
const range = document.querySelector('#volume');
const display = document.querySelector('#volume-value');
range.addEventListener('input', () => {
  display.textContent = range.value;
});
```

### File Input

```html
<div class="mb-3">
  <label for="avatar" class="form-label">Upload Profile Picture</label>
  <input class="form-control" type="file" id="avatar" accept="image/*">
  <div class="form-text">Supported formats: JPG, PNG, GIF (max 5MB)</div>
</div>
```

---

## 3. Tables

### Basic Styled Table

Bootstrap's table classes transform plain `<table>` HTML into polished, styled tables:

```html
<!-- Always wrap in table-responsive for mobile scroll! -->
<div class="table-responsive">
  <table class="table table-striped table-hover table-bordered align-middle">
    <thead class="table-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="avatar.jpg" class="rounded-circle" width="32" height="32" alt="Alice">
            Alice Johnson
          </div>
        </td>
        <td>alice@example.com</td>
        <td>Admin</td>
        <td><span class="badge bg-success">Active</span></td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>Bob Smith</td>
        <td>bob@example.com</td>
        <td>Editor</td>
        <td><span class="badge bg-warning text-dark">Pending</span></td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table Modifier Classes

```html
<!-- Individual row colour states: -->
<tr class="table-success">...</tr>   <!-- Green row -->
<tr class="table-danger">...</tr>    <!-- Red row -->
<tr class="table-warning">...</tr>   <!-- Yellow row -->
<tr class="table-info">...</tr>      <!-- Blue row -->

<!-- Column alignment: -->
<td class="text-start">Left</td>
<td class="text-center">Center</td>
<td class="text-end">Right</td>

<!-- Condensed table (less padding): -->
<table class="table table-sm">...</table>

<!-- Borderless: -->
<table class="table table-borderless">...</table>
```

> [!WARNING]
> Always wrap tables in `<div class="table-responsive">`. Without it, tables overflow on mobile and break your layout. This is one of the most common beginner mistakes.

---

## 4. JavaScript Components

### How Bootstrap JS Works

Bootstrap's interactive components (Modals, Dropdowns, Tabs, etc.) work in two ways:

1. **Declarative (no JS code):** Use `data-bs-*` attributes in HTML — Bootstrap handles everything automatically.
2. **Programmatic (JS API):** Instantiate components via JavaScript for more control.

Most components work with approach #1 (just HTML attributes). A few — **Tooltips** and **Toasts** — must be initialized manually.

### Modals

A modal is a dialog box/popup that appears on top of the page content.

```html
<!-- Trigger button: -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#contactModal">
  <i class="bi bi-envelope me-2"></i>Contact Us
</button>

<!-- Modal structure: -->
<div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <!-- modal-dialog-centered: vertically centers the modal -->
    <!-- modal-lg: larger modal; modal-sm: smaller modal -->
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title" id="contactModalLabel">
          <i class="bi bi-envelope me-2"></i>Contact Us
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form id="contact-form">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="contactName" placeholder="Name" required>
            <label for="contactName">Your Name</label>
          </div>
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="contactEmail" placeholder="Email" required>
            <label for="contactEmail">Email Address</label>
          </div>
          <div class="form-floating">
            <textarea class="form-control" id="contactMessage" placeholder="Message" style="height: 120px" required></textarea>
            <label for="contactMessage">Message</label>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="sendMessageBtn">
          <i class="bi bi-send me-2"></i>Send Message
        </button>
      </div>

    </div>
  </div>
</div>
```

**Controlling modals with JavaScript:**

```js
// Get a reference to the modal
const modalEl = document.querySelector('#contactModal');
const modal = new bootstrap.Modal(modalEl);

// Open programmatically:
modal.show();

// Close programmatically:
modal.hide();

// Listen for modal events:
modalEl.addEventListener('shown.bs.modal', () => {
  // Runs after the modal's opening animation completes
  document.querySelector('#contactName').focus();
});

modalEl.addEventListener('hidden.bs.modal', () => {
  // Runs after the modal is fully closed — great for cleanup
  document.querySelector('#contact-form').reset();
});
```

### Tabs

Tabs allow switching between different sections of content:

```html
<!-- Tab navigation: -->
<ul class="nav nav-tabs" id="profileTabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="overview-tab"
      data-bs-toggle="tab" data-bs-target="#overview"
      type="button" role="tab">Overview</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="settings-tab"
      data-bs-toggle="tab" data-bs-target="#settings"
      type="button" role="tab">Settings</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="billing-tab"
      data-bs-toggle="tab" data-bs-target="#billing"
      type="button" role="tab">Billing</button>
  </li>
</ul>

<!-- Tab content panels: -->
<div class="tab-content border border-top-0 p-3" id="profileTabsContent">
  <div class="tab-pane fade show active" id="overview" role="tabpanel">
    <h5>Account Overview</h5>
    <p>Your account is in good standing.</p>
  </div>
  <div class="tab-pane fade" id="settings" role="tabpanel">
    <h5>Settings</h5>
    <p>Manage your preferences here.</p>
  </div>
  <div class="tab-pane fade" id="billing" role="tabpanel">
    <h5>Billing Information</h5>
    <p>Manage your subscription.</p>
  </div>
</div>
```

### Accordion

Collapses and expands content sections:

```html
<div class="accordion" id="faqAccordion">

  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button"
        data-bs-toggle="collapse" data-bs-target="#faq1">
        What is Bootstrap?
      </button>
    </h2>
    <div id="faq1" class="accordion-collapse collapse show"
      data-bs-parent="#faqAccordion">
      <!-- data-bs-parent: closes other items when this opens -->
      <div class="accordion-body">
        Bootstrap is a popular front-end CSS framework...
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button"
        data-bs-toggle="collapse" data-bs-target="#faq2">
        Is Bootstrap free?
      </button>
    </h2>
    <div id="faq2" class="accordion-collapse collapse"
      data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Yes! Bootstrap is open-source and completely free...
      </div>
    </div>
  </div>

</div>
```

### Tooltips ⚠️ Requires Manual Initialization

Unlike most Bootstrap components, **Tooltips must be initialized with JavaScript**. This is because initializing all possible tooltips on page load is expensive — Bootstrap lets you control when they're set up.

```html
<!-- Add to any element: -->
<button class="btn btn-secondary" data-bs-toggle="tooltip"
  title="This is a helpful tooltip!" data-bs-placement="top">
  Hover over me
</button>

<button class="btn btn-info" data-bs-toggle="tooltip"
  title="Logged in as admin" data-bs-placement="bottom">
  <i class="bi bi-person"></i> Profile
</button>
```

```js
// Initialize ALL tooltips on the page:
document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggers.forEach(el => {
    new bootstrap.Tooltip(el, {
      // Options:
      delay: { show: 200, hide: 100 }, // Delay before showing/hiding
      html: true,                       // Allow HTML in tooltip content
    });
  });
});
```

### Toasts ⚠️ Requires Manual Initialization

Toasts are temporary notification messages (like "Saved!" or "Error!"):

```html
<!-- Toast container (fixed position, shown top-right): -->
<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">

  <div id="successToast" class="toast align-items-center text-bg-success border-0" role="alert">
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi bi-check-circle me-2"></i> Changes saved successfully!
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"></button>
    </div>
  </div>

  <div id="errorToast" class="toast align-items-center text-bg-danger border-0" role="alert">
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi bi-exclamation-circle me-2"></i> Something went wrong!
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"></button>
    </div>
  </div>

</div>
```

```js
// Helper function to show a specific toast:
function showToast(toastId, options = {}) {
  const toastEl = document.querySelector(toastId);
  const toast = new bootstrap.Toast(toastEl, {
    delay: 4000,    // Auto-hide after 4 seconds
    autohide: true,
    ...options
  });
  toast.show();
}

// Usage:
document.querySelector('#save-btn').addEventListener('click', async () => {
  try {
    await saveData();
    showToast('#successToast');
  } catch (error) {
    showToast('#errorToast');
  }
});
```

---

## 5. Customising Bootstrap with Sass

### Why Customise? (Plain English)

Bootstrap's default blue primary colour, `#0d6efd`, is fine for generic projects. But if your brand is purple, green, or orange — you need to change it. You can't simply override Bootstrap's CSS with a `.css` file efficiently because Bootstrap uses CSS custom properties internally.

The proper way to customise Bootstrap is through its **Sass source files**: you override Sass variables *before* Bootstrap's code runs, and Bootstrap uses your values throughout.

### Setup

```bash
# Install dependencies:
npm install bootstrap sass

# Your project structure:
src/
├── scss/
│   └── custom.scss    ← Your Sass file
└── main.js
```

### `custom.scss` — The Correct Override Order

This is the critical pattern — override variables BEFORE importing Bootstrap:

```scss
// custom.scss

// ─────────────────────────────────────────────────────────
// STEP 1: Override Bootstrap Sass variables BEFORE importing
// ─────────────────────────────────────────────────────────

// Core colour overrides:
$primary:   #6f42c1;    // Purple (instead of Bootstrap's blue)
$secondary: #6c757d;
$success:   #198754;
$danger:    #dc3545;
$warning:   #ffc107;

// Typography:
$font-family-base:    'Inter', system-ui, sans-serif;
$font-size-base:      1rem;
$line-height-base:    1.6;

// Spacing (base unit — all spacers are multiples of this):
$spacer: 1.25rem;  // Increase the default spacing slightly

// Border radius:
$border-radius:    0.5rem;
$border-radius-lg: 1rem;
$border-radius-sm: 0.25rem;

// Components:
$card-border-radius: $border-radius-lg; // Cards get larger radius
$navbar-padding-y:   0.75rem;

// Buttons:
$btn-font-weight:    600;
$btn-border-radius:  $border-radius-lg;  // Rounded buttons

// ─────────────────────────────────────────────────────────
// STEP 2: Import Bootstrap AFTER your overrides
// ─────────────────────────────────────────────────────────

// Option A: Import everything:
@import "bootstrap/scss/bootstrap";

// Option B: Import only what you need (smaller CSS output):
// @import "bootstrap/scss/functions";
// @import "bootstrap/scss/variables";
// @import "bootstrap/scss/variables-dark";
// @import "bootstrap/scss/maps";
// @import "bootstrap/scss/mixins";
// @import "bootstrap/scss/utilities";
// @import "bootstrap/scss/root";
// @import "bootstrap/scss/grid";
// @import "bootstrap/scss/buttons";
// @import "bootstrap/scss/forms";
// ... add only what you use

// ─────────────────────────────────────────────────────────
// STEP 3: Your custom styles AFTER Bootstrap (override specific things)
// ─────────────────────────────────────────────────────────

// Custom component extensions:
.btn-gradient {
  background: linear-gradient(135deg, $primary, darken($primary, 15%));
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(135deg, darken($primary, 5%), darken($primary, 20%));
    color: white;
  }
}
```

### Integrating Sass with Vite

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // If needed, add global sass variables available in all files:
        // additionalData: `@import "src/scss/variables";`
      }
    }
  }
});
```

```js
// main.js — Import your custom Sass instead of Bootstrap's CSS:
import './scss/custom.scss'; // ← Your Sass file compiles everything
// import 'bootstrap/dist/css/bootstrap.min.css'; // ← Remove this!

import 'bootstrap'; // Bootstrap JS still works
```

### Compiling Sass Without Vite

If you're not using Vite:

```bash
# Compile Sass manually:
npx sass src/scss/custom.scss dist/css/style.css

# Watch for changes (auto-recompile):
npx sass --watch src/scss/custom.scss dist/css/style.css
```

---

## ⚠️ Common Mistakes & How to Avoid Them

### Mistake 1: Floating Labels Without a `placeholder` Attribute

```html
<!-- ❌ The floating label animation won't work! -->
<div class="form-floating">
  <input type="email" class="form-control" id="email">
  <label for="email">Email</label>
</div>

<!-- ✅ A placeholder is REQUIRED (even empty): -->
<div class="form-floating">
  <input type="email" class="form-control" id="email" placeholder=" ">
  <label for="email">Email</label>
</div>
```

### Mistake 2: Label Comes Before Input in Floating Labels

```html
<!-- ❌ Wrong order — label must come AFTER the input -->
<div class="form-floating">
  <label for="email">Email</label>  <!-- ← Wrong! -->
  <input type="email" class="form-control" id="email" placeholder=" ">
</div>

<!-- ✅ Input THEN label: -->
<div class="form-floating">
  <input type="email" class="form-control" id="email" placeholder=" ">
  <label for="email">Email</label>  <!-- ← Correct: comes after input -->
</div>
```

### Mistake 3: Not Wrapping Tables in `.table-responsive`

```html
<!-- ❌ Table overflows on mobile and breaks layout -->
<table class="table">...</table>

<!-- ✅ Always wrap for horizontal scroll on small screens -->
<div class="table-responsive">
  <table class="table">...</table>
</div>
```

### Mistake 4: Forgetting to Initialize Tooltips and Toasts

```js
// ❌ Tooltips do NOT work without this — they just show the native browser tooltip!
// (Just adding data-bs-toggle="tooltip" is NOT enough)

// ✅ Initialize all tooltips when the DOM is ready:
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(el => new bootstrap.Tooltip(el));
});
```

### Mistake 5: Overriding Sass Variables AFTER Importing Bootstrap

```scss
// ❌ WRONG! Bootstrap's variables are already compiled — this does nothing!
@import "bootstrap/scss/bootstrap";
$primary: #ff0000; // Too late! Bootstrap already used the old $primary

// ✅ CORRECT! Override BEFORE importing:
$primary: #ff0000;
@import "bootstrap/scss/bootstrap";
```

---

## 🧪 Practice Labs

### Lab 1: Multi-Step Form Wizard (45 min)

**Goal:** Use Bootstrap Tabs to simulate a multi-step registration flow.

1. Open `labs/lab1-wizard/index.html`.
2. Build a registration form with 3 "steps" using Bootstrap Nav Tabs:
   - **Step 1 — Personal Info:** Name (floating), Email (floating), Date of Birth
   - **Step 2 — Account:** Username (with `@` input group), Password, Confirm Password
   - **Step 3 — Review:** A summary of inputs (rendered via JavaScript)
3. Add "Next" / "Back" buttons that programmatically switch tabs via the Bootstrap JS API.
4. On Step 3, validate all fields using `needs-validation` before showing a success Toast.

### Lab 2: Styled Data Table (40 min)

**Goal:** Build a professional data table with interactive features.

1. Open `labs/lab2-datatable/index.html`.
2. Create a responsive table with 8 rows of user data.
3. Use `table-striped table-hover table-bordered`.
4. Add a "Status" column with Bootstrap Badges (`bg-success`, `bg-warning`, `bg-danger`).
5. Add "Edit" / "Delete" buttons in each row using a button group.
6. Add JavaScript: clicking "Delete" shows a confirmation Modal. On confirm, removes the table row with animation.

### Lab 3: Sass Customization (35 min)

**Goal:** Create a custom Bootstrap theme.

1. Open `labs/lab3-sass/`.
2. Install `bootstrap` and `sass` via npm.
3. Create `src/scss/custom.scss` with:
   - `$primary` changed to your favourite colour
   - `$border-radius` increased to `0.75rem`
   - Custom `$font-family-base` (use a Google Font)
4. After Bootstrap import, add a custom `.hero-gradient` class using Sass.
5. Compile and link the output CSS. Verify colours changed.

---

## 📝 Assignment: StartupLaunch Project — Part 2

Add interaction and polish to the StartupLaunch landing page.

### Requirements

**1. Contact Modal:**
- Trigger: A "Contact Us" button in the Navbar and Hero section
- Form: Floating labels for Name, Email, Message (textarea)
- All fields required with Bootstrap validation (`needs-validation`)
- On submit: prevents default, validates, shows success Toast ("Message sent!")

```js
const form = document.querySelector('#contact-form');
const modal = bootstrap.Modal.getInstance(document.querySelector('#contactModal'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.classList.add('was-validated');

  if (form.checkValidity()) {
    modal.hide();
    showToast('#successToast');
    form.reset();
    form.classList.remove('was-validated');
  }
});
```

**2. Pricing Section:**
- Three pricing cards in a responsive grid
- Free, Pro, Enterprise plans
- Use `card-header` for plan name, `card-body` for features list
- Highlight the "Pro" card with `border-primary border-2 shadow`
- Include a "Most Popular" Badge in the Pro card header

**3. FAQ Accordion:**
- At least 5 FAQ items
- First item open by default (`show` class)
- All others closed (`collapsed` class on button)

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Bootstrap 5 Forms | https://getbootstrap.com/docs/5.3/forms/overview/ |
| Bootstrap 5 Modals | https://getbootstrap.com/docs/5.3/components/modal/ |
| Bootstrap Tooltips | https://getbootstrap.com/docs/5.3/components/tooltips/ |
| Bootstrap Toasts | https://getbootstrap.com/docs/5.3/components/toasts/ |
| Bootstrap Sass Customization | https://getbootstrap.com/docs/5.3/customize/sass/ |

---

## 📌 Key Takeaways

- **Floating labels** require `<input>` **before** `<label>` and a `placeholder` attribute.
- Form validation: add `novalidate` to `<form>`, use `was-validated` class via JS to show feedback.
- Always wrap `.table` inside `<div class="table-responsive">` for mobile safety.
- Most Bootstrap components work with `data-bs-*` attributes alone — no JS code needed.
- **Tooltips and Toasts** are exceptions — they MUST be initialized manually with `new bootstrap.Tooltip(el)` and `new bootstrap.Toast(el)`.
- Customise Bootstrap colors by overriding Sass variables **BEFORE** the `@import "bootstrap/scss/bootstrap"` line.

---

**Next Lecture:** [Lecture 17 — Tailwind CSS: Utility-First Fundamentals](./17%20-%20Tailwind%20CSS%20—%20Utility-First%20Fundamentals.md)