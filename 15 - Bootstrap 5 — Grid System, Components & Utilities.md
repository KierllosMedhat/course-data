# Lecture 15 — Bootstrap 5.3: Grid System, Components & Utilities

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand Bootstrap's mobile-first philosophy
- Build responsive layouts using the 12-column grid system
- Implement core components: Navbar, Cards, Buttons, Alerts, Badges
- Apply utility classes for spacing, colours, display, and Flexbox
- Use Bootstrap 5.3+ native Dark Mode features
- Add icons using Bootstrap Icons

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is Bootstrap? (CDN / npm)
2. The Grid System: containers, rows, responsive columns
3. Breakpoints
4. Core Components: Navbar, Cards, Buttons, Alerts
5. Utility Classes: spacing (`m-*`, `p-*`), colour (`bg-*`, `text-*`)
6. Bootstrap 5.3+ Color Modes (Dark Mode)
7. Bootstrap Icons

### Part 2 — Practice & Lab (~90–120 min)
1. Build a responsive dashboard using the Grid
2. Implement a modal-based login flow
3. StartupLaunch Project Part 1: Landing Page

---

## 1. What is Bootstrap?

Bootstrap is the world's most popular front-end framework. It provides pre-built CSS classes for responsive layouts and components.

### Adding Bootstrap to Your Page (CDN)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Bootstrap Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Bootstrap JS Bundle (includes Popper for dropdowns, modals) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
</body>
</html>
```

---

## 2. The Bootstrap Grid System

The grid is Bootstrap's foundation — a **12-column** layout system.

1. **Container** (`.container`): Centers content and provides padding.
2. **Row** (`.row`): Creates a horizontal group of columns.
3. **Column** (`.col`, `.col-{breakpoint}-{span}`): Defines width.

### Example
```html
<div class="container">
  <div class="row">
    <!-- On medium screens, each takes 6 columns (50%). On large, 4 columns (33%) -->
    <div class="col-md-6 col-lg-4">Column 1</div>
    <div class="col-md-6 col-lg-4">Column 2</div>
    <div class="col-md-12 col-lg-4">Column 3</div>
  </div>
</div>
```

---

## 3. Breakpoints

| Breakpoint | Class Infix | Min Width | Example |
|-----------|------------|-----------|---------|
| Extra small | *(none)* | <576px | `.col-12` |
| Small | `sm` | ≥576px | `.col-sm-6` |
| Medium | `md` | ≥768px | `.col-md-4` |
| Large | `lg` | ≥992px | `.col-lg-3` |
| Extra large | `xl` | ≥1200px | `.col-xl-2` |
| Extra extra large | `xxl` | ≥1400px | `.col-xxl-1` |

> [!TIP]
> Bootstrap is **mobile-first**. A class like `.col-md-4` means "4 columns on medium screens **and everything larger**."

---

## 4. Core Components

### Navbar
A responsive navigation header that collapses into a hamburger menu on mobile.
```html
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>
```

### Cards
Flexible content containers.
```html
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Some text.</p>
    <a href="#" class="btn btn-primary">Go</a>
  </div>
</div>
```

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-success">Success Outlined</button>
```

---

## 5. Utility Classes

Eliminates the need to write custom CSS for spacing and basic styling.

### Spacing: `{property}{sides}-{size}`
- **Property:** `m` (margin), `p` (padding)
- **Sides:** `t` (top), `b` (bottom), `s` (start/left), `e` (end/right), `x` (horizontal), `y` (vertical)
- **Size:** `0` to `5`

```html
<div class="mt-3 mb-2 px-4">
  <!-- margin-top: 1rem, margin-bottom: 0.5rem, padding-x: 1.5rem -->
</div>
```

---

## 6. Bootstrap 5.3+ Color Modes (Dark Mode)

Bootstrap 5.3 introduced native support for color modes, specifically Dark Mode!

```html
<!-- Force dark mode on the whole page -->
<html data-bs-theme="dark">

<!-- Or force dark mode on a specific component -->
<div class="card" data-bs-theme="dark">
```
Using the `data-bs-theme` attribute automatically updates text, background, and border colors for the targeted elements!

---

## 7. Bootstrap Icons

Over 2,000 free SVG icons.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

<i class="bi bi-heart-fill text-danger"></i>
```

---

## 🧪 Practice Labs

### Lab 1: Responsive Grid (45 min)
1. Open `labs/lab1-grid/index.html`.
2. Build a layout with 3 rows.
3. Row 1: Full width.
4. Row 2: 2 columns on mobile, 4 on desktop.
5. Row 3: A Sidebar (hidden on mobile) and Main Content area.

### Lab 2: Dark Mode Toggle (40 min)
1. Open `labs/lab2-darkmode/index.html`.
2. Create a basic page with a Navbar and Cards.
3. Add a button that uses JavaScript to toggle the `data-bs-theme` attribute on the `<html>` element between "light" and "dark".

---

## 📝 Assignment: StartupLaunch Project — Part 1

It's time to start our third portfolio project: **StartupLaunch**. This will be a multi-page marketing site for a fictional startup. 

### Requirements
1. Create a new folder `startuplaunch/` and build `index.html`.
2. Include Bootstrap 5 via CDN.
3. Build a **Navbar** that is fixed to the top.
4. Build a **Hero Section** using grid classes and a large background color/image. Include a call-to-action button.
5. Build a **Features Section**. Use the grid to display 3 cards side-by-side on desktop, stacking on mobile. Use Bootstrap Icons in each card.
6. Build a **Footer**.
7. Absolutely **NO custom CSS** is allowed! You must build this entirely using Bootstrap components and utility classes.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Bootstrap 5 Docs | https://getbootstrap.com/docs/5.3/getting-started/introduction/ |
| Bootstrap Icons | https://icons.getbootstrap.com/ |
| Bootstrap Color Modes | https://getbootstrap.com/docs/5.3/customize/color-modes/ |

---

## 📌 Key Takeaways
- Bootstrap uses a **12-column grid** (`.container` -> `.row` -> `.col`).
- Breakpoints are mobile-first (e.g. `.col-md-6` means medium *and up*).
- Use `data-bs-*` attributes for interactive components.
- Bootstrap 5.3+ supports native dark mode via `data-bs-theme="dark"`.

---

**Next Lecture:** [Lecture 16 — Bootstrap 5: Forms, Tables, Customization & JS Plugins](./16%20-%20Bootstrap%205%20—%20Forms,%20Tables,%20Customization%20%26%20JS%20Plugins.md)