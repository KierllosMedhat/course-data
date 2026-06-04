# Lecture 07 — Responsive Web Design & Media Queries

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain what Responsive Web Design (RWD) is and why it matters
- Use the viewport meta tag correctly
- Write media queries using the Mobile-First strategy
- Choose appropriate breakpoints for real-world projects
- Implement dark mode using `prefers-color-scheme`
- Respect accessibility with `prefers-reduced-motion`
- Use responsive images with `srcset`, `sizes`, and `<picture>`
- Apply fluid typography with `clamp()`
- Use modern viewport units (`dvh`, `svh`, `lvh`)
- Write Container Queries for component-level responsiveness

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is Responsive Web Design?
2. The Viewport Meta Tag
3. Mobile-First vs Desktop-First
4. Media Query Syntax & Breakpoints
5. Dark Mode & Reduced Motion
6. Responsive Images & Art Direction
7. Fluid Typography with `clamp()`
8. Modern Viewport Units & Container Queries

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: Convert Desktop-First to Mobile-First
2. Lab 2: Container Query Responsive Card

---

## 1. What is Responsive Web Design?

Responsive Web Design means building one website that adapts its layout to fit any screen size — from a 4-inch phone to a 32-inch monitor.

**Analogy:** Think of water in a container. Water doesn't have a fixed shape — it takes the shape of whatever cup, bowl, or bottle you pour it into. A responsive website works the same way: the content reshapes itself to fit any screen.

The three pillars of RWD:
1. **Fluid Grids** — Use `%`, `fr`, or `auto-fit` instead of fixed `px` widths
2. **Flexible Images** — Images scale with their container (`max-width: 100%`)
3. **Media Queries** — Apply different CSS rules at different screen sizes

---

## 2. The Viewport Meta Tag

Without this tag, mobile browsers render your page at ~980px wide and zoom out to fit the screen, making everything tiny and unreadable.

```html
<!-- REQUIRED in every HTML page -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

| Attribute | What it does |
|-----------|-------------|
| `width=device-width` | Sets the layout width to the actual device screen width |
| `initial-scale=1.0` | Sets the initial zoom level to 100% (no zoom) |

> [!CAUTION]
> Never add `user-scalable=no` or `maximum-scale=1`. This prevents users from zooming in, which is a serious accessibility violation.

---

## 3. Mobile-First vs Desktop-First

### Mobile-First (Recommended)
Write your base CSS for small screens. Add `min-width` media queries to enhance for larger screens.

```css
/* Base: Mobile (no media query needed) */
.grid { display: block; }

/* Tablet and up */
@media (min-width: 768px) {
  .grid { display: grid; grid-template-columns: 1fr 1fr; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid { grid-template-columns: 1fr 1fr 1fr; }
}
```

### Desktop-First
Write base CSS for large screens. Use `max-width` to scale down. This approach often results in more CSS because you're overriding desktop styles for mobile.

> [!TIP]
> **Always use Mobile-First.** Mobile users are the majority. Start simple, then add complexity for larger screens.

---

## 4. Media Query Syntax

```css
@media (condition) {
  /* CSS rules that apply ONLY when the condition is true */
}
```

### Common Conditions

```css
/* Min-width: applies when viewport is >= 768px */
@media (min-width: 768px) { ... }

/* Max-width: applies when viewport is <= 767px */
@media (max-width: 767px) { ... }

/* Combining conditions with AND */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Orientation */
@media (orientation: landscape) { ... }
```

### Standard Breakpoints

| Name | Min-Width | Typical Devices |
|------|-----------|----------------|
| Small | `576px` | Large phones (landscape) |
| Medium | `768px` | Tablets |
| Large | `1024px` | Laptops |
| X-Large | `1280px` | Desktops |
| XX-Large | `1536px` | Large monitors |

> [!NOTE]
> These are guidelines, not rules. Design your breakpoints around where your content breaks, not around specific device sizes.

---

## 5. Dark Mode with `prefers-color-scheme`

Modern operating systems let users choose light or dark mode. CSS can detect this preference:

```css
/* Base: Light mode */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

/* When user's OS is set to dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --text: #e0e0e0;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### Manual Toggle with JavaScript

```html
<button onclick="document.documentElement.classList.toggle('dark')">🌙</button>
```

```css
/* Manual dark mode override */
.dark {
  --bg: #121212;
  --text: #e0e0e0;
}
```

---

## 6. Accessibility: `prefers-reduced-motion`

Some users experience motion sickness from animations. Respect their preference:

```css
/* Default: animations enabled */
.hero { animation: fadeIn 0.5s ease; }

/* User prefers no motion: disable animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Responsive Images

### Basic Fluid Image

```css
img {
  max-width: 100%;  /* Never wider than its container */
  height: auto;     /* Maintain aspect ratio */
}
```

### `srcset` and `sizes` — Serve Different Resolutions

```html
<img 
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Landscape photo"
>
```

The browser picks the best image based on screen size and pixel density — automatically.

### Art Direction with `<picture>`

Serve completely different images (not just sizes) based on conditions:

```html
<picture>
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg">
  <source media="(max-width: 1024px)" srcset="hero-tablet.jpg">
  <img src="hero-desktop.jpg" alt="Hero banner">
</picture>
```

---

## 8. Fluid Typography with `clamp()`

`clamp(min, preferred, max)` creates text that scales smoothly between a minimum and maximum size without any media queries:

```css
h1 {
  /* Minimum 1.5rem, scales with viewport, caps at 3.5rem */
  font-size: clamp(1.5rem, 4vw, 3.5rem);
}

p {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
}
```

> [!TIP]
> `clamp()` works for any CSS property, not just font-size! Use it for `padding`, `gap`, `margin`, etc.

---

## 9. Modern Viewport Units

The classic `vh` unit has a notorious problem on mobile: it includes the space behind the browser's address bar, causing content to be hidden behind it.

| Unit | Meaning |
|------|---------|
| `dvh` | **Dynamic** viewport height — adjusts as the browser bar shows/hides |
| `svh` | **Small** viewport height — the smallest possible viewport (bar visible) |
| `lvh` | **Large** viewport height — the largest possible viewport (bar hidden) |

```css
.hero {
  min-height: 100dvh; /* Fills the screen correctly on mobile */
}
```

---

## 10. Container Queries

Media queries respond to the **viewport** width. Container queries respond to the **parent element's** width. This makes components truly reusable — they adapt based on where they're placed, not the screen size.

```css
/* 1. Define a containment context */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* 2. Query the container's width */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}

@container card (max-width: 399px) {
  .card {
    display: block; /* Stack vertically in narrow containers */
  }
}
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgetting the viewport meta tag | Always include `<meta name="viewport" ...>` in `<head>` |
| Using Desktop-First with `max-width` queries | Use Mobile-First with `min-width` — less CSS, cleaner override chain |
| Setting breakpoints based on specific devices | Set breakpoints where your content actually breaks |
| Using `100vh` for full-height sections on mobile | Use `100dvh` to account for the browser address bar |
| Disabling zoom with `user-scalable=no` | Never do this — it's an accessibility violation |
| Ignoring `prefers-reduced-motion` | Wrap animations in a motion-safe check |

---

## 🧪 Practice Labs

### Lab 1 — Convert Desktop-First to Mobile-First (45 min)
1. Open `labs/lab1-convert/index.html` — it contains a 3-column desktop layout using `max-width` media queries
2. Rewrite all the CSS using Mobile-First (`min-width` queries)
3. The layout should be: 1 column on mobile → 2 columns at 768px → 3 columns at 1024px
4. Add `prefers-color-scheme: dark` support with CSS custom properties

### Lab 2 — Container Query Card (45 min)
1. Create `labs/lab2-container/index.html` with a `.card` component
2. Place the same card inside a full-width container AND a narrow sidebar
3. Use `@container` queries so the card is vertical (stacked) in the sidebar and horizontal (image left, text right) in the wide container
4. No media queries allowed — the card must adapt purely based on its container

---

## 📝 Assignment: Portfolio Project — Part 7

Make your portfolio fully responsive.

### Requirements
1. Add the viewport meta tag if missing
2. Convert all CSS to Mobile-First using `min-width` breakpoints at 768px and 1024px
3. All images must use `max-width: 100%; height: auto`
4. Implement `prefers-color-scheme: dark` dark mode using CSS custom properties
5. Use `clamp()` for at least the `h1` and body `font-size`
6. Hero section must use `min-height: 100dvh`
7. Add `prefers-reduced-motion: reduce` to disable all animations for users who prefer it

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN: Responsive Design | https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design |
| MDN: Media Queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries |
| MDN: Container Queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries |
| Modern Fluid Typography | https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ |

---

## 📌 Key Takeaways
- **Responsive Web Design** makes one site work on every screen size
- Always include the **viewport meta tag** — without it, mobile browsers zoom out
- **Mobile-First** is the standard — write base CSS for small screens, use `min-width` to add complexity
- **`prefers-color-scheme`** detects dark mode; **`prefers-reduced-motion`** respects users who get motion sick
- **`srcset`/`sizes`** let the browser pick the best image; **`<picture>`** lets you art-direct completely different images
- **`clamp()`** creates fluid sizing without media queries
- **`100dvh`** fixes the mobile viewport height bug
- **Container Queries** make components respond to their parent's width, not the viewport — the future of responsive design

---

**Next Lecture:** [Lecture 08 — CSS Animations, Transitions & Advanced Effects](./08%20-%20CSS%20Animations,%20Transitions%20%26%20Advanced%20Effects.md)
