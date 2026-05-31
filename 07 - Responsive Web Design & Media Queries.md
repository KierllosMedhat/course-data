# Lecture 07 — Responsive Web Design & Media Queries

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand the viewport meta tag and why it's essential
- Write media queries using `min-width` and `max-width` to adapt layouts
- Build mobile-first responsive designs (the modern best practice)
- Serve optimised images using `srcset`, `sizes`, and `<picture>`
- Create fluid typography and spacing with `clamp()`
- Master modern dynamic viewport units (`dvh`, `svh`, `lvh`)
- Use container queries (`@container`) for component-level responsiveness

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. The viewport meta tag & device vs CSS pixels
2. Mobile-first vs desktop-first strategy
3. Media queries: syntax and modern range syntax
4. Responsive images: `srcset`, `sizes`, `<picture>`
5. Fluid typography with `clamp()`
6. Modern viewport units (`dvh`, `svh`, `lvh`)
7. Container queries: `@container`

### Part 2 — Practice & Lab (~90–120 min)
1. Convert desktop-only to mobile-first responsive
2. Responsive Card with Container Queries
3. Portfolio Project Part 7: Making it Responsive

---

## 1. The Viewport Meta Tag

Without the viewport meta tag, mobile browsers render your page as if it were a desktop screen (about 980px wide) and shrink it down, making text microscopic.

**Always add this to every HTML page's `<head>`:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 2. Mobile-First Strategy

**Mobile-First (modern, recommended ✅)**
Start with a simple single-column layout, then use `min-width` queries to add complexity for larger screens.

```css
/* Mobile (default — no media query needed!) */
.column { width: 100%; }

/* Tablet */
@media (min-width: 600px) { .column { width: 50%; } }

/* Desktop */
@media (min-width: 900px) { .column { width: 25%; } }
```

Why? It forces you to prioritise content, writes less code, and downloads less CSS on slow mobile connections.

---

## 3. Media Queries

Media queries apply different CSS based on viewport size or device features.

```css
/* Modern Range Syntax (supported in all modern browsers!) */
@media (width >= 600px) {
  body {
    font-size: 16px;
  }
}
```
Other features: `orientation: portrait`, `prefers-color-scheme: dark`.

---

## 4. Responsive Images — `srcset` and `<picture>`

Sending a 4000px-wide hero image to a phone wastes bandwidth.

### Resolution Switching (`srcset`)
```html
<img src="small.jpg"
     srcset="small.jpg 400w,
             medium.jpg 800w,
             large.jpg 1200w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Landscape">
```
The browser picks the best size!

### Art Direction (`<picture>`)
When you need **different image crops**:
```html
<picture>
  <!-- Mobile: cropped close-up -->
  <source media="(max-width: 799px)" srcset="hero-mobile.jpg">
  <!-- Desktop: wide landscape -->
  <img src="hero-desktop.jpg" alt="Mountain">
</picture>
```

---

## 5. Fluid Typography — `clamp()`

`clamp()` defines a value that scales smoothly between a minimum and maximum:
```css
clamp(minimum, preferred, maximum)
```
```css
h1 {
  /* Min 1.5rem, scales at 4vw, Max 3rem */
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```
`clamp()` is supported in all modern browsers and dramatically reduces the number of media queries you need.

---

## 6. Modern Viewport Units (`dvh`, `svh`, `lvh`)

Historically, `100vh` on mobile phones was broken because it didn't account for the browser's address bar expanding and collapsing as the user scrolls.

Modern CSS fixed this with new units:
- **`svh` (Small Viewport Height):** Height when the address bar is fully expanded.
- **`lvh` (Large Viewport Height):** Height when the address bar is hidden.
- **`dvh` (Dynamic Viewport Height):** Automatically adjusts between `svh` and `lvh` as the user scrolls!

```css
.hero-section {
  /* Perfect full-screen section on mobile */
  min-height: 100dvh; 
}
```

---

## 7. Container Queries — `@container`

**The problem with media queries:** They look at the **viewport** width. But a reusable component (like a card) might be in a wide main area or a narrow sidebar.

**Container queries** look at the **parent container's** width:

```css
.card-wrapper {
  container-type: inline-size;
}

/* When the container is narrower than 400px */
@container (max-width: 399px) {
  .card {
    display: block; /* Stacked layout */
  }
}
```

---

## 🧪 Practice Labs

### Lab 1: Convert to Mobile-First (40 min)
1. Open `labs/lab1-mobile-first/index.html`.
2. Delete the desktop-first media queries in the CSS.
3. Rewrite the CSS to be mobile-first (default styles are mobile, `min-width` for desktop).

### Lab 2: Container Query Cards (30 min)
1. Open `labs/lab2-container-queries/index.html`.
2. Define `container-type: inline-size` on the card wrapper.
3. Write an `@container` query to change the card from a stacked layout to a side-by-side flex layout when the container is wider than 500px.

---

## 📝 Assignment: Portfolio Project — Part 7

Make your portfolio responsive!

### Requirements
1. Open your portfolio from Lecture 06.
2. Ensure you have the viewport meta tag in your `<head>`.
3. Update your Hero section to use `min-height: 100dvh` instead of `vh`.
4. Apply `clamp()` to your `h1` and `h2` headings for fluid typography.
5. In your `<nav>`, use a media query to stack the links vertically on mobile (`max-width: 600px`), or keep them horizontal but use `wrap`.
6. Ensure your Grid and Flexbox layouts are wrapping gracefully. 

### Optional Bonus
Add a dark mode using the `prefers-color-scheme: dark` media query and swap your CSS Variables!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — Responsive Images | https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images |
| MDN — Container Queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries |

---

## 📌 Key Takeaways
- **Always include** the viewport meta tag.
- Build **mobile-first** — base styles for small screens, enhance with `min-width` queries.
- Use `100dvh` instead of `100vh` to fix the mobile address bar jumping issue.
- `clamp()` gives you **fluid typography** without media queries.
- **Container queries** enable truly reusable, context-aware components.

---

**Next Lecture:** [Lecture 08 — CSS Animations, Transitions & Advanced Effects →](./08%20-%20CSS%20Animations,%20Transitions%20%26%20Advanced%20Effects.md)
