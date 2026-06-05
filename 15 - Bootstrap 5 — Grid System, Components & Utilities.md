# Lecture 15 — Bootstrap 5: Grid System, Components & Utilities

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what Bootstrap is and why developers use it
- Install Bootstrap via CDN or npm
- Build responsive layouts using the 12-column grid system
- Understand all six breakpoints and how mobile-first logic works
- Use core components: Navbar, Cards, Buttons, Alerts, Badges, Spinners
- Apply utility classes for spacing, colours, borders, display, and Flexbox
- Implement Bootstrap 5.3+ native Dark Mode with `data-bs-theme`
- Use Bootstrap Icons in your projects

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is Bootstrap? Why use a CSS framework?
2. Installing Bootstrap (CDN and npm)
3. The Grid System: containers, rows, responsive columns
4. All six breakpoints and mobile-first logic
5. Core Components: Navbar, Cards, Buttons, Alerts, Badges, Spinners
6. Utility Classes: spacing, colours, display, Flexbox
7. Bootstrap 5.3+ Color Modes (Dark Mode)
8. Bootstrap Icons

### Part 2 — Practice & Lab (~90–120 min)
1. Build a responsive dashboard layout using the Grid
2. Build a dark/light mode toggle
3. StartupLaunch Project Part 1: Landing Page

---

## 1. What Is Bootstrap?

### What is Bootstrap?

Bootstrap is a collection of pre-written CSS classes and JavaScript that gives you ready-to-use components and a powerful layout system without writing custom CSS.

### Why Use a CSS Framework?

**Without Bootstrap:**
- You write custom CSS for every component
- Every developer on the team writes things differently
- Inconsistent spacing, colors, and behaviors across the app
- You solve the same responsive problems every project

**With Bootstrap:**
- Consistent, tested UI components out of the box
- The 12-column grid solves responsive layouts automatically
- Team members speak the same "language" of class names
- Proven cross-browser compatibility

> [!NOTE]
> Bootstrap is a great tool for quickly building professional-looking interfaces, especially for admin dashboards, internal tools, and landing pages. It's NOT a replacement for custom CSS when you need a highly unique or brand-specific design.

### Adding Bootstrap via CDN (Quickest Method)

**CDN** stands for Content Delivery Network — a global network of servers that deliver files quickly. Using a CDN means you link to Bootstrap's hosted files instead of downloading them.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Bootstrap Page</title>

    <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
  >

    <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
</head>
<body>

  
        <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc4s9bIOgUxi8T/jzmx0xRJ5M9MnEuQ5fGRXkJwqXn6"
    crossorigin="anonymous"
    defer
  ></script>

    <script defer src="app.js"></script>
</body>
</html>
```

> [!IMPORTANT]
> The **viewport meta tag** (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`) is absolutely required. Without it, mobile browsers will zoom out to show the full desktop version, and Bootstrap's responsive breakpoints won't work.

### Installing Bootstrap via npm (For Build Tool Projects)

When using Vite, Webpack, or another bundler, install Bootstrap as a dependency:

```bash
npm install bootstrap
```

Then import it in your main JavaScript or SCSS file:

```js
// main.js — Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // Imports all Bootstrap JS components
```

Or if using Sass (for customisation — covered in Lecture 16):

```scss
// style.scss
@import "bootstrap/scss/bootstrap";
```

### 📌 Section Recap
- Bootstrap is a CSS/JS framework with pre-built components and a responsive grid system
- Two installation options: CDN (simplest) or npm (for build tool projects)
- The viewport meta tag is required for responsive layouts to work
- Always load Bootstrap CSS before your custom CSS; Bootstrap JS before your custom JS

---

## 2. The Bootstrap Grid System

### Why a Grid?

Bootstrap\'s grid system provides a consistent 12-column layout. 12 is flexible because it divides evenly into halves, thirds, quarters, and sixths.

### The Three Required Layers

Every Bootstrap grid layout uses exactly three nested elements:

```
LAYER 1: Container — limits max width and centers content on the page
  LAYER 2: Row — creates a horizontal group (uses negative margins to offset column padding)
    LAYER 3: Columns — the actual content slots (use padding internally)
```

```html
<div class="container">

    <div class="row">

        <div class="col-6">Left Half</div>        <div class="col-6">Right Half</div>   
  </div>

</div>
```

```
12 Columns Visualized:
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  │  10 │  11 │  12 │
│         col-6 (6/12 = 50%)         │         col-6 (6/12 = 50%)         │
│   col-4 (33%)    │   col-4 (33%)    │    col-4 (33%)   │
│      col-3      │      col-3      │      col-3      │      col-3       │
│             col-8 (67%)            │    col-4 (33%)    │
│                    col-12 (100% full width)                              │
```

### Container Types

```html
<div class="container">...</div>

<div class="container-fluid">...</div>

<div class="container-md">...</div>
```

> [!TIP]
> Use `.container` for most content sections. Use `.container-fluid` for full-width elements like a hero banner or navbar. Use `.container-{breakpoint}` when you want content that's full-width on small screens but capped on larger ones.

### Auto-Width Columns

```html
<div class="row">
  <div class="col">Auto 1/3</div>
  <div class="col">Auto 1/3</div>
  <div class="col">Auto 1/3</div>
</div>

<div class="row">
  <div class="col-4">Fixed 4/12</div>      <div class="col">Auto — fills remaining 8/12 = 67%</div>
</div>
```

### Responsive Columns — The Core Pattern

The most powerful feature: columns change size at different screen widths.

```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
  <div class="col">
    <div class="card h-100">Card 1</div>
  </div>
  <div class="col">
    <div class="card h-100">Card 2</div>
  </div>
  <div class="col">
    <div class="card h-100">Card 3</div>
  </div>
</div>
```

> [!NOTE]
> `row-cols-{n}` is a shorthand that sets ALL children to the same width. `row-cols-2` means 2 per row, `row-cols-3` means 3 per row — much simpler than setting each column individually.

### Gutters (Gaps Between Columns)

The `g-*` utility adds gap (spacing) between columns:

```html
<div class="row g-4">

<div class="row gx-4">

<div class="row gy-2">

<div class="row g-0">
```

### Nesting Grids

You can nest a row inside a column to create complex sub-layouts:

```html
<div class="container">
  <div class="row">
        <div class="col-lg-3">
      <nav>Sidebar navigation</nav>
    </div>

        <div class="col-lg-9">
            <div class="row g-3">
        <div class="col-md-4">Widget 1</div>
        <div class="col-md-4">Widget 2</div>
        <div class="col-md-4">Widget 3</div>
      </div>
    </div>
  </div>
</div>
```

### Column Ordering and Offsetting

```html
<div class="row">
  <div class="col order-last">I appear last visually (but first in HTML)</div>
  <div class="col order-first">I appear first visually (but second in HTML)</div>
</div>

<div class="row">
  <div class="col-12 col-md-6 order-2 order-md-1">Content (appears second on mobile)</div>
  <div class="col-12 col-md-6 order-1 order-md-2">Image (appears first on mobile)</div>
</div>

<div class="row">
  <div class="col-md-6 offset-md-3">
        Centered content (3 + 6 + 3 = 12)
  </div>
</div>
```

### Common Mistakes & How to Avoid Them — Grid

**Mistake 1: Forgetting the `.row` wrapper**

```html
<div class="container">
  <div class="col-6">Item</div>
  <div class="col-6">Item</div>
</div>

<div class="container">
  <div class="row">
    <div class="col-6">Item</div>
    <div class="col-6">Item</div>
  </div>
</div>
```

**Mistake 2: Nesting a `.container` inside another `.container`**

```html
<div class="container">
  <div class="row">
    <div class="col">
      <div class="container">Inner container!</div>     </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col">
      <div class="row">Inner row ✅</div>
    </div>
  </div>
</div>
```

### 📌 Section Recap
- The grid has three layers: `.container` → `.row` → `.col-*`
- 12 columns total — numbers must add up to 12 (or less) per row
- `col` with no number = equal-width auto columns
- Column numbers are the minimum width; they can grow to fill space
- Use `g-*` for gutters (gaps), `offset-*` for pushing columns, `order-*` for visual reordering

---

## 3. Breakpoints (Mobile-First)

### The Mobile-First Philosophy

"Mobile-first" doesn't mean "design for phones first" — it means Bootstrap's CSS is **written for the smallest screens first**, then uses media queries to add rules for larger screens. Each breakpoint class applies at its width **and everything above it**.

```
Mobile-first: Think of rules STACKING UP as screen gets WIDER
──────────────────────────────────────────────────────────────
 xs (<576px):                 col-12 = full width
 sm (≥576px):  adds/overrides col-sm-6 = half width
 md (≥768px):  adds/overrides col-md-4 = one-third
 lg (≥992px):  adds/overrides col-lg-3 = one-quarter
 xl (≥1200px): adds/overrides col-xl-2 = one-sixth
──────────────────────────────────────────────────────────────
```

### All Six Breakpoints

| Breakpoint | Name | Class Infix | Min Width | Default Container Width |
|-----------|------|------------|-----------|------------------------|
| Extra small | Mobile | *(none)* | < 576px | 100% (no max) |
| Small | Large Phones | `sm` | ≥ 576px | 540px |
| Medium | Tablets | `md` | ≥ 768px | 720px |
| Large | Laptops | `lg` | ≥ 992px | 960px |
| Extra large | Desktops | `xl` | ≥ 1200px | 1140px |
| Extra extra large | Wide screens | `xxl` | ≥ 1400px | 1320px |

```html
<div class="row g-3">
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xxl-2">
    <!--
      Mobile (<576px):   col-12 → 100% wide (1 per row)
      Large Phone (576+): col-sm-6 → 50% wide (2 per row)
      Tablet (768+):     col-md-4 → 33% wide (3 per row)
      Laptop (992+):     col-lg-3 → 25% wide (4 per row)
      Wide (1400+):      col-xxl-2 → 16.6% wide (6 per row)
    -->
    <div class="card p-3">Product card</div>
  </div>
</div>
```

### Responsive Display and Visibility

Show or hide elements at specific breakpoints:

```html
<div class="d-block d-sm-none">📱 Mobile only</div>

<div class="d-none d-lg-block">🖥️ Desktop only</div>

<div class="d-none d-md-block">Tablet and desktop</div>

<button class="navbar-toggler d-lg-none" ...>
  <span class="navbar-toggler-icon"></span>
</button>

<div class="d-none d-lg-flex">
  <a href="#" class="nav-link">Home</a>
  <a href="#" class="nav-link">About</a>
</div>
```

### 📌 Section Recap
- Bootstrap has 6 breakpoints: xs, sm, md, lg, xl, xxl
- Mobile-first: each class applies at its breakpoint AND all wider ones
- Use `col-{breakpoint}-{number}` to define layouts per screen size
- Use `d-{breakpoint}-{value}` to show/hide elements at specific widths

---

## 4. Core Components

### 4.1 Navbar

The Navbar is a responsive navigation header. On mobile (below the `navbar-expand-{breakpoint}` threshold), it collapses into a hamburger menu. On larger screens, it expands to show links horizontally.

```html
<nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow-sm">
  <div class="container"> 
        <a class="navbar-brand fw-bold" href="#">
      <i class="bi bi-lightning-charge-fill text-warning me-2"></i>
      AppName
    </a>

        <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"                data-bs-target="#mainNavbar"              aria-controls="mainNavbar"                aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>     </button>

        <div class="collapse navbar-collapse" id="mainNavbar">

            <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            Products
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Product A</a></li>
            <li><a class="dropdown-item" href="#">Product B</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">See All</a></li>
          </ul>
        </li>
      </ul>

            <div class="d-flex gap-2 ms-auto">
        <a href="#" class="btn btn-outline-primary">Log In</a>
        <a href="#" class="btn btn-primary">Sign Up</a>
      </div>
    </div>

  </div>
</nav>
```

> [!IMPORTANT]
> The `data-bs-toggle="collapse"` and `data-bs-target="#mainNavbar"` attributes on the toggler button — and the matching `id="mainNavbar"` on the collapsible div — are what make the hamburger menu work. They must match exactly.

### 4.2 Cards

Cards are the most versatile content containers in Bootstrap. Use them for products, blog posts, user profiles, feature highlights, etc.

```html
<div class="card shadow-sm">
    <img src="product.jpg" class="card-img-top" alt="Product image">

  <div class="card-body">
        <span class="badge bg-primary mb-2">Electronics</span>

    <h5 class="card-title">Wireless Headphones</h5>
    <p class="card-text text-muted">
      Premium sound quality with 40-hour battery life.
    </p>

    <div class="d-flex justify-content-between align-items-center">
      <span class="fs-5 fw-bold">$79.99</span>
      <button class="btn btn-primary btn-sm">
        <i class="bi bi-cart-plus me-1"></i>Add to Cart
      </button>
    </div>
  </div>

    <div class="card-footer text-muted">
    <small>Free shipping on orders over $50</small>
  </div>
</div>

<div class="card">
  <div class="row g-0">     <div class="col-md-4">
      <img src="..." class="img-fluid rounded-start h-100 object-fit-cover" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Horizontal Card</h5>
        <p class="card-text">This layout works great for news articles.</p>
      </div>
    </div>
  </div>
</div>
```

### Equal-Height Card Columns

```html
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col">
    <div class="card h-100">       <div class="card-body">
        <h5 class="card-title">Short Card</h5>
        <p>A little text.</p>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">Tall Card</h5>
        <p>This card has much more content, which makes it naturally taller.</p>
        <p>But because all cards have h-100, the shorter ones stretch to match!</p>
      </div>
    </div>
  </div>
</div>
```

### 4.3 Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-dark">Dark</button>
<button class="btn btn-light">Light</button>

<button class="btn btn-outline-primary">Outline Primary</button>
<button class="btn btn-outline-danger">Outline Danger</button>

<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-sm">Small</button>

<button class="btn btn-primary w-100">Full Width</button>

<button class="btn btn-success">
  <i class="bi bi-check-circle me-2"></i>Confirm Order
</button>

<button class="btn btn-primary" disabled>
  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
  Loading...
</button>

<div class="btn-group" role="group">
  <button class="btn btn-outline-secondary">Left</button>
  <button class="btn btn-outline-secondary">Middle</button>
  <button class="btn btn-outline-secondary">Right</button>
</div>
```

### 4.4 Alerts

Alerts show important messages. They can be dismissible:

```html
<div class="alert alert-primary" role="alert">
  <i class="bi bi-info-circle me-2"></i>
  <strong>Info:</strong> This is an informational message.
</div>

<div class="alert alert-success" role="alert">
  <i class="bi bi-check-circle-fill me-2"></i>
  <strong>Success!</strong> Your profile has been updated.
</div>

<div class="alert alert-danger" role="alert">
  <i class="bi bi-exclamation-triangle-fill me-2"></i>
  <strong>Error:</strong> Your session has expired. Please log in again.
</div>

<div class="alert alert-warning" role="alert">
  <i class="bi bi-exclamation-circle me-2"></i>
  <strong>Warning:</strong> Your subscription expires in 3 days.
</div>

<div class="alert alert-info alert-dismissible fade show" role="alert">
  <strong>New feature!</strong> Dark mode is now available.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
```

### 4.5 Badges

Small count or label indicators:

```html
<h4>Messages <span class="badge bg-danger rounded-pill">12</span></h4>
<h4>Notifications <span class="badge bg-primary">New</span></h4>

<span class="badge bg-success">Active</span>
<span class="badge bg-warning text-dark">Pending</span>
<span class="badge bg-secondary">Archived</span>
<span class="badge bg-danger">Overdue</span>

<span class="badge bg-primary rounded-pill">42 items</span>
```

### 4.6 Spinners (Loading Indicators)

```html
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span> </div>

<div class="spinner-grow text-success" role="status">
  <span class="visually-hidden">Loading...</span>
</div>

<div class="spinner-border spinner-border-sm text-primary" role="status"></div>

<div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
```

### 📌 Section Recap
- **Navbar**: Use `navbar-expand-{breakpoint}`, toggler + collapse container, and `data-bs-*` attributes
- **Cards**: `card` + `card-body` + optional `card-img-top`, `card-footer`; use `h-100` for equal heights
- **Buttons**: `btn btn-{color}`; outline variants; size variants; disabled state
- **Alerts**: `alert alert-{color}`; add `alert-dismissible fade show` + `.btn-close` for dismissible ones
- **Badges**: `badge bg-{color}`; use `rounded-pill` for pill shape
- **Spinners**: `spinner-border` or `spinner-grow` for loading indicators

---

## 5. Utility Classes

Utility classes let you apply single CSS properties without writing any custom CSS. This is how you space, color, and position elements with Bootstrap.

### Spacing (`m-*` and `p-*`)

Bootstrap uses a spacer scale from 0 to 5 (and auto). The base unit is `$spacer = 1rem (16px)`.

```
Scale: 0=0px, 1=4px(0.25rem), 2=8px(0.5rem), 3=16px(1rem), 4=24px(1.5rem), 5=48px(3rem)

Sides:
  t = top        mt-3 = margin-top: 1rem
  b = bottom     pb-2 = padding-bottom: 0.5rem
  s = start/left ms-4 = margin-left: 1.5rem
  e = end/right  pe-1 = padding-right: 0.25rem
  x = horizontal px-3 = padding-left: 1rem + padding-right: 1rem
  y = vertical   my-5 = margin-top: 3rem + margin-bottom: 3rem
  (none) = all   p-4  = padding on all 4 sides: 1.5rem
```

```html
<div class="mt-3 mb-4">Margin top + bottom</div>
<div class="px-4 py-3">Horizontal + vertical padding</div>
<div class="m-auto">Horizontally centered (works on block elements with width)</div>
<div class="ms-auto">Push element to the right in flex containers</div>
<div class="p-0">Remove all padding</div>

<div class="p-3 p-md-5">Small padding on mobile, large on tablet+</div>
<section class="mb-4 mb-lg-6">Different bottom margin per breakpoint</section>
```

### Colors and Backgrounds

```html
<div class="bg-primary text-white p-3">Primary blue background</div>
<div class="bg-success text-white p-3">Success green</div>
<div class="bg-danger text-white p-3">Danger red</div>
<div class="bg-warning text-dark p-3">Warning yellow (use text-dark for contrast)</div>
<div class="bg-body-tertiary p-3">Adaptive surface color (light/dark mode)</div>
<div class="bg-transparent p-3">No background color</div>

<p class="text-primary">Primary blue text</p>
<p class="text-muted">Muted/secondary text</p>
<p class="text-danger">Error/warning text</p>
<p class="text-success">Success text</p>
<p class="text-body">Normal body text color (adapts to dark/light mode)</p>
```

### Typography Utilities

```html
<p class="fs-1">Largest (h1 size)</p>
<p class="fs-3">Medium (h3 size)</p>
<p class="fs-6">Smallest (small text)</p>

<p class="fw-bold">Bold text (700)</p>
<p class="fw-semibold">Semi-bold (600)</p>
<p class="fw-normal">Normal (400)</p>
<p class="fw-light">Light (300)</p>

<p class="text-start">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-end">Right aligned</p>

<p class="text-center text-md-start">Centered on mobile, left on tablets+</p>

<p class="text-decoration-none">No underline (useful on links)</p>
<p class="text-uppercase">ALL UPPERCASE</p>
<p class="text-capitalize">Capitalize First Letter</p>

<p class="text-truncate" style="max-width: 200px">
  Very long text that will be cut off with an ellipsis...
</p>
```

### Border Utilities

```html
<div class="border">Border on all sides</div>
<div class="border border-primary">Primary colored border</div>
<div class="border-top border-danger">Top border only, red</div>

<div class="rounded">Default rounded corners</div>
<div class="rounded-circle">Perfect circle (make width = height)</div>
<div class="rounded-pill">Pill/capsule shape</div>
<div class="rounded-0">No rounding (square corners)</div>
<div class="rounded-3">More pronounced rounding</div>

<img src="avatar.jpg" class="rounded-circle" width="48" height="48" alt="User avatar">
```

### Flexbox Utilities

Bootstrap provides full Flexbox control through utility classes:

```html
<div class="d-flex">...</div>

<div class="d-flex flex-row">Horizontal (default)</div>
<div class="d-flex flex-column">Vertical</div>
<div class="d-flex flex-row-reverse">Horizontal, reversed</div>

<div class="d-flex justify-content-start">Pack items to start</div>
<div class="d-flex justify-content-end">Pack items to end</div>
<div class="d-flex justify-content-center">Center items</div>
<div class="d-flex justify-content-between">Space between items</div>
<div class="d-flex justify-content-around">Space around items</div>
<div class="d-flex justify-content-evenly">Equal space between and around</div>

<div class="d-flex align-items-start">Align to top</div>
<div class="d-flex align-items-center">Align to center (vertical centering!)</div>
<div class="d-flex align-items-end">Align to bottom</div>
<div class="d-flex align-items-stretch">Stretch to fill height (default)</div>

<div class="d-flex gap-3">16px gap between items</div>
<div class="d-flex gap-2">8px gap</div>

<div class="d-flex flex-wrap">Items wrap to next line when they don't fit</div>
<div class="d-flex flex-nowrap">Items never wrap (may overflow)</div>

<div class="d-flex">
  <span>Logo</span>
  <span class="ms-auto">This pushes to the RIGHT end</span>
</div>

<div class="d-flex justify-content-center align-items-center vh-100">
  <div class="card p-4">Perfectly centered card</div>
</div>
```

### Display Utilities

```html
<div class="d-none">Hidden (display: none)</div>
<div class="d-block">Block element</div>
<div class="d-inline">Inline element</div>
<div class="d-inline-block">Inline-block</div>
<div class="d-flex">Flex container</div>
<div class="d-grid">Grid container</div>

<div class="d-block d-md-none">Mobile only</div>

<div class="d-none d-md-block">Desktop only</div>
```

### Shadow and Width/Height Utilities

```html
<div class="shadow-none">No shadow</div>
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>

<div class="w-25">25% width</div>
<div class="w-50">50% width</div>
<div class="w-75">75% width</div>
<div class="w-100">100% width</div>
<div class="mw-100">max-width: 100%</div>

<div class="h-100">100% height of parent</div>
<div class="vh-100">100% viewport height</div>
<div class="min-vh-100">min-height: 100vh (full-page sections)</div>

<div class="position-relative">For positioning child elements</div>
<div class="position-absolute top-0 start-0">Top-left corner</div>
<div class="position-absolute top-50 start-50 translate-middle">Exact center</div>
<div class="position-fixed bottom-0 end-0 p-3">Fixed bottom-right</div>
```

### Common Mistakes & How to Avoid Them — Utilities

**Mistake 1: Using `text-danger` for success messages**

```html
<p class="text-danger">Your purchase was successful!</p>

<p class="text-success">Your purchase was successful!</p>
```

**Mistake 2: Using `ms-5` for large gaps when structure is the issue**

```html
<div class="d-flex">
  <div class="ms-5">This shouldn't need a hack</div>
</div>

<div class="d-flex justify-content-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

### 📌 Section Recap
- Spacing: `m-*` (margin) and `p-*` (padding) with side suffix + size 0-5
- Colors: `bg-{color}` for backgrounds, `text-{color}` for text
- Flexbox: `d-flex`, `justify-content-*`, `align-items-*`, `gap-*`, `ms-auto`
- Display: `d-{value}` and `d-{breakpoint}-{value}` for responsive visibility
- Always use semantic color names (e.g., `text-success` for success, not `text-green`)

---

## 6. Bootstrap 5.3+ Dark Mode

### What Changed in 5.3?

Bootstrap 5.3 introduced native dark mode support using the `data-bs-theme` attribute. You no longer need complex CSS overrides or JavaScript hacks — Bootstrap's entire design system (colors, shadows, borders) automatically adapts.

### How to Enable Dark Mode

```html
<html lang="en" data-bs-theme="dark">
  </html>

<html lang="en" data-bs-theme="light">
</html>

<div class="card" data-bs-theme="dark">
  <div class="card-body">This card is dark, even if the page is light</div>
</div>
```

### JavaScript Toggle (Most Useful)

Save the user's preference and apply it on load:

```js
// Get the saved theme from localStorage, or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply it immediately (before content paints to avoid flash)
document.documentElement.setAttribute('data-bs-theme', savedTheme);

// Toggle button:
const toggleBtn = document.querySelector('#theme-toggle');
toggleBtn.addEventListener('click', () => {
  // Read current theme from HTML element
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Apply the new theme
  document.documentElement.setAttribute('data-bs-theme', newTheme);

  // Save preference for next visit
  localStorage.setItem('theme', newTheme);

  // Update button icon/text
  toggleBtn.innerHTML = newTheme === 'dark'
    ? '<i class="bi bi-sun-fill"></i> Light Mode'
    : '<i class="bi bi-moon-stars-fill"></i> Dark Mode';
});
```

```html
<button id="theme-toggle" class="btn btn-outline-secondary">
  <i class="bi bi-moon-stars-fill"></i> Dark Mode
</button>
```

> [!TIP]
> Apply the `data-bs-theme` attribute in a `<script>` tag **in the `<head>`** (before `<body>` renders) to prevent a "flash of light mode" on page load for users with dark mode saved.

### Using Adaptive Colors

These Bootstrap colors automatically adapt to the current theme:

```html
<div class="bg-body">Adaptive background</div>

<div class="bg-body-secondary">Subtle surface</div>

<p class="text-body">Adaptive text</p>

<p class="text-body-secondary">Secondary text</p>

<div class="border border-body">Adaptive border</div>
```

### 📌 Section Recap
- Bootstrap 5.3+ dark mode is activated with `data-bs-theme="dark"` on any element
- Can be applied to `<html>` (whole page) or individual components
- Use `localStorage` to persist the user's preference across visits
- Use `bg-body`, `text-body`, `bg-body-secondary` for colors that adapt automatically

---

## 7. Bootstrap Icons

Bootstrap Icons is a free, open-source icon library with 2,000+ SVG icons, designed specifically to work with Bootstrap.

### Adding Bootstrap Icons

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

```

### Using Icons

Icons render as `<i>` tags with `bi bi-{icon-name}` classes:

```html
<i class="bi bi-heart"></i>          <i class="bi bi-heart-fill"></i>     <i class="bi bi-star-fill"></i>      <i class="bi bi-trash"></i>          <i class="bi bi-pencil"></i>         <i class="bi bi-person-circle"></i>  
<i class="bi bi-check-circle-fill text-success fs-4"></i>   <i class="bi bi-exclamation-triangle text-warning"></i>      <i class="bi bi-x-circle-fill text-danger"></i>              
<button class="btn btn-primary">
  <i class="bi bi-save me-2"></i>Save Changes
</button>

<button class="btn btn-outline-danger">
  <i class="bi bi-trash me-2"></i>Delete
</button>

<button class="btn btn-outline-secondary" aria-label="Edit item">
  <i class="bi bi-pencil"></i>
</button>

<div class="input-group mb-3">
  <span class="input-group-text">
    <i class="bi bi-search"></i>
  </span>
  <input type="text" class="form-control" placeholder="Search...">
</div>

<ul class="list-unstyled">
  <li class="mb-2">
    <i class="bi bi-check2-circle text-success me-2"></i>Free forever plan
  </li>
  <li class="mb-2">
    <i class="bi bi-check2-circle text-success me-2"></i>No credit card required
  </li>
  <li class="mb-2">
    <i class="bi bi-check2-circle text-success me-2"></i>Cancel anytime
  </li>
</ul>
```

> [!NOTE]
> Find all icon names at [icons.getbootstrap.com](https://icons.getbootstrap.com/). You can search by category (arrows, media, people, etc.) or use the search box.

### Sizing Icons

Bootstrap icons inherit `font-size`. Use Bootstrap's `fs-*` utilities to control size:

```html
<i class="bi bi-star fs-1"></i>  <i class="bi bi-star fs-3"></i>  <i class="bi bi-star fs-6"></i>  
<i class="bi bi-github" style="font-size: 2rem;"></i>
```

---

## ⚠️ Common Mistakes & How to Avoid Them (Summary)

### Mistake 1: Using px Sizing
Use Bootstrap's column classes instead of mixing grid with manual pixel widths.

### Mistake 2: Missing Bootstrap JS
Modals, dropdowns, and navbars won't work without the JS bundle.

### Mistake 3: Columns > 12
Ensure column numbers per row add up to 12 or less.

### Mistake 4: <br> for Spacing
Use margin utilities (mt-4) instead of fragile <br> tags.

## 🧪 Practice Labs

### Lab 1: Responsive Grid Dashboard (45 min)

**Goal:** Build a responsive admin dashboard layout.

**Steps:**
1. Create a page with a sticky navbar
2. Below the navbar, use the grid to create:
   - Row 1: 4 stats cards (`col-6 col-md-3`) — each shows a number and label
   - Row 2: A main chart area (`col-lg-8`) + a sidebar (`col-lg-4`)
   - Row 3: A full-width data table section
3. All cards should have equal height (`h-100`)
4. Use appropriate spacing utilities (`g-4`, `mb-4`, etc.)

### Lab 2: Dark Mode Toggle (30 min)

**Goal:** Implement a persistent dark/light mode toggle.

**Steps:**
1. Build a page with a navbar containing a theme toggle button
2. Add 3 cards with text and images
3. Toggle `data-bs-theme` on `<html>` using JavaScript
4. Save the preference in `localStorage`
5. Load the saved preference on page load

---

## 📝 Assignment: StartupLaunch Project — Part 1

Build the landing page for **StartupLaunch**, a fictional SaaS product.

### Requirements

1. Create `startuplaunch/index.html` and include Bootstrap 5.3 and Bootstrap Icons via CDN
2. **Navbar** (sticky, with logo, links, and a "Get Started" CTA button)
3. **Hero Section** (full-viewport-height, centered text, two CTA buttons, gradient background)
4. **Features Section** (3 cards with icons, using `row-cols-1 row-cols-md-3 g-4`)
5. **Testimonials Section** (3 quotes in cards)
6. **Footer** (multi-column with links using the grid)
7. **Dark Mode Toggle** in the navbar
8. NO custom CSS — use Bootstrap utilities only

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Bootstrap 5.3 Documentation | https://getbootstrap.com/docs/5.3/ |
| Bootstrap Icons | https://icons.getbootstrap.com/ |
| Bootstrap Grid Examples | https://getbootstrap.com/docs/5.3/examples/ |
| Bootstrap Color Modes | https://getbootstrap.com/docs/5.3/customize/color-modes/ |

---

## 📌 Final Lecture Recap

- Bootstrap's **12-column grid** solves responsive layouts: `.container` → `.row` → `.col-*`
- **Mobile-first**: each breakpoint class applies at that width and all wider ones
- Six breakpoints: xs (default), sm (576+), md (768+), lg (992+), xl (1200+), xxl (1400+)
- **Navbar**: requires `navbar-expand-{bp}`, toggler, and collapsible `div` with matching `id`
- **Cards**: most flexible component; use `h-100` for equal heights in a row
- **Utility classes** handle spacing (`m-*`, `p-*`), color (`bg-*`, `text-*`), flexbox, display
- **Dark mode** (5.3+): toggle `data-bs-theme="dark"` on `<html>`; use adaptive colors (`bg-body`, `text-body`)
- **Bootstrap Icons**: `bi bi-{name}` class on `<i>` tags; size with `fs-*`

---

**Next Lecture:** [Lecture 16 — Bootstrap 5: Forms, Tables, Customization & JS Plugins](./16%20-%20Bootstrap%205%20—%20Forms,%20Tables,%20Customization%20%26%20JS%20Plugins.md)