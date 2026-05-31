# Lecture 16 — Bootstrap 5.3: Forms, Tables, Customization & JS Plugins

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Build professional forms with floating labels and validation states
- Style custom form controls (switches, range sliders, file inputs)
- Create responsive data tables
- Use interactive JS components (dropdowns, tabs, accordions, tooltips, toasts)
- Customise Bootstrap's design system using Sass
- Implement a modal-based contact form

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Forms: floating labels, input groups, validation
2. Custom controls: switches, range, file input
3. Tables: striped, bordered, hover, responsive
4. JS Components: modals, dropdowns, tooltips, toasts
5. Customising Bootstrap with Sass

### Part 2 — Practice & Lab (~90–120 min)
1. Build a multi-step form wizard
2. Build a styled data table
3. StartupLaunch Project Part 2: Modals & Forms

---

## 1. Forms & Floating Labels

Bootstrap 5 introduced **floating labels** — the label sits inside the input and floats up when filled.

```html
<div class="form-floating mb-3">
  <!-- MUST have a placeholder for the CSS to work! -->
  <input type="email" class="form-control" id="email" placeholder="name@example.com">
  <label for="email">Email address</label>
</div>
```

### Validation States
Bootstrap provides built-in validation styles that work with HTML5 validation.

```html
<form class="needs-validation" novalidate>
  <div class="mb-3">
    <label for="username" class="form-label">Username</label>
    <input type="text" class="form-control" id="username" required>
    <div class="invalid-feedback">Please choose a username.</div>
    <div class="valid-feedback">Looks good!</div>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

Add the `was-validated` class to the form via JavaScript upon submission.

---

## 2. Custom Form Controls

### Switches
```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="notifications">
  <label class="form-check-label" for="notifications">Enable notifications</label>
</div>
```

### File Input
```html
<div class="mb-3">
  <label for="avatar" class="form-label">Upload avatar</label>
  <input class="form-control" type="file" id="avatar">
</div>
```

---

## 3. Tables

```html
<div class="table-responsive">
  <table class="table table-striped table-hover table-bordered">
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Alice</td>
      </tr>
    </tbody>
  </table>
</div>
```

Always wrap tables in `<div class="table-responsive">` to enable horizontal scrolling on small screens.

---

## 4. JavaScript Components

### Modals
```html
<!-- Button trigger -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
    </div>
  </div>
</div>
```

### Tooltips & Toasts
Some components require manual JavaScript initialisation.

**Tooltip Example:**
```html
<button class="btn btn-secondary" data-bs-toggle="tooltip" title="Tooltip text">
  Hover me
</button>
```
```js
// Initialize tooltips
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
  new bootstrap.Tooltip(el);
});
```

---

## 5. Customising Bootstrap with Sass

If you want to change Bootstrap's default colors (like making `$primary` purple instead of blue), you must use Sass.

1. Install Bootstrap and Sass via npm.
2. Create `custom.scss`.
3. Override variables **BEFORE** importing Bootstrap.

```scss
// custom.scss

// 1. Override variables
$primary: #6f42c1; // Purple
$border-radius: 0.5rem;

// 2. Import Bootstrap
@import "../node_modules/bootstrap/scss/bootstrap";
```

Compile it using: `npx sass custom.scss custom.css`.

---

## 🧪 Practice Labs

### Lab 1: Multi-Step Form Wizard (45 min)
1. Open `labs/lab1-wizard/index.html`.
2. Build a registration form using Bootstrap tabs to simulate steps.
3. Use floating labels for inputs.
4. Add basic validation using the `needs-validation` class.

### Lab 2: Styled Data Table (40 min)
1. Open `labs/lab2-datatable/index.html`.
2. Create a responsive table with 5 rows.
3. Use hover and striped classes.
4. Add a "Status" column that uses Bootstrap Badges (`bg-success`, `bg-warning`).

### Lab 3: Sass Customization (35 min)
1. Open `labs/lab3-sass/index.html`.
2. Initialize an npm project and install `bootstrap` and `sass`.
3. Change the `$primary` color and `$font-family-base`.
4. Compile your CSS and link it in the HTML.

---

## 📝 Assignment: StartupLaunch Project — Part 2

Let's add interaction to our landing page!

### Requirements
1. Open your StartupLaunch folder.
2. Add a **"Contact Us" Modal**. 
   - Trigger it from a button in the Navbar or Hero section.
   - The modal body should contain a Contact Form using floating labels (Name, Email, Message).
3. Add **Client-Side Validation** to the form.
   - Ensure fields are required.
   - On submit, use JS to prevent default submission, apply the `was-validated` class, and display a Success **Toast** notification (e.g. "Message sent successfully!").
4. Add a **Pricing Section** using Cards (`card`, `card-header`, `card-body`) arranged in a responsive grid.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Bootstrap 5 Forms | https://getbootstrap.com/docs/5.3/forms/overview/ |
| Bootstrap 5 Modals | https://getbootstrap.com/docs/5.3/components/modal/ |
| Bootstrap Sass Customization | https://getbootstrap.com/docs/5.3/customize/sass/ |

---

## 📌 Key Takeaways
- **Floating labels** require a `placeholder` to function correctly.
- Use `.table-responsive` around your `.table` to prevent mobile breakage.
- **Modals, Accordions, and Tabs** work out of the box with `data-bs-*` attributes.
- **Tooltips and Toasts** must be initialized manually via JavaScript.
- Customise Bootstrap colors by overriding Sass variables **before** importing the main Bootstrap file.

---

**Next Lecture:** [Lecture 17 — Tailwind CSS: Utility-First Fundamentals](./17%20-%20Tailwind%20CSS%20—%20Utility-First%20Fundamentals.md)