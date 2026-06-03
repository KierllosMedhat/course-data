# 07 - Responsive Web Design & Media Queries

---
**Course:** Fullstack Web Development  
**Instructor:** [Instructor Name]  
**Duration:** ~3.5 hours (lecture + labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [What is Responsive Web Design?](#what-is-responsive-web-design)
4. [The Viewport Meta Tag](#the-viewport-meta-tag)
5. [Device Pixels vs CSS Pixels](#device-pixels-vs-css-pixels)
6. [Mobile-First vs Desktop-First Strategy](#mobile-first-vs-desktop-first-strategy)
7. [Media Query Syntax](#media-query-syntax)
8. [Common Breakpoints](#common-breakpoints)
9. [Orientation Media Query](#orientation-media-query)
10. [Dark Mode with prefers-color-scheme](#dark-mode-with-prefers-color-scheme)
11. [Accessibility with prefers-reduced-motion](#accessibility-with-prefers-reduced-motion)
12. [Responsive Images](#responsive-images)
13. [Art Direction with the Picture Element](#art-direction-with-the-picture-element)
14. [Fluid Typography with clamp()](#fluid-typography-with-clamp)
15. [Modern Viewport Units](#modern-viewport-units)
16. [Container Queries](#container-queries)
17. [Lab 1: Convert Desktop-First to Mobile-First](#lab-1-convert-desktop-first-to-mobile-first)
18. [Lab 2: Container Query Responsive Card](#lab-2-container-query-responsive-card)
19. [Assignment: Portfolio Project Part 7](#assignment-portfolio-project-part-7)
20. [Resources](#resources)
21. [Key Takeaways](#key-takeaways)
22. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this lecture, you will be able to:

- [ ] Explain what responsive web design is and why it is essential in modern development
- [ ] Understand the role of the viewport meta tag and what happens without it
- [ ] Distinguish between device pixels and CSS pixels, including high-DPI (Retina) displays
- [ ] Choose between mobile-first and desktop-first strategies and defend your choice
- [ ] Write media queries using both classic and modern range syntax
- [ ] Apply common industry breakpoints (sm / md / lg / xl)
- [ ] Use orientation, `prefers-color-scheme`, and `prefers-reduced-motion` media features
- [ ] Implement responsive images using `srcset`, `sizes`, and the `<picture>` element
- [ ] Build fluid typography using CSS `clamp()`
- [ ] Explain the difference between `svh`, `lvh`, and `dvh` and when to use each
- [ ] Write container queries with `@container` and understand when they solve problems media queries cannot

---

## Agenda

| Time        | Topic                                         |
|-------------|-----------------------------------------------|
| 0:00–0:20   | What is RWD? History & why it matters         |
| 0:20–0:35   | Viewport meta tag & pixel concepts            |
| 0:35–0:55   | Mobile-First vs Desktop-First                 |
| 0:55–1:30   | Media query syntax & breakpoints              |
| 1:30–1:50   | User-preference media features                |
| 1:50–2:20   | Responsive images & `<picture>`               |
| 2:20–2:40   | Fluid typography & modern viewport units      |
| 2:40–3:10   | Container queries                             |
| 3:10–3:30   | Lab 1 & Lab 2 intro                           |

---

## What is Responsive Web Design?

### Starting From Scratch — The Problem

Imagine you build a beautiful website on your laptop. The design looks perfect: three columns of articles, a big navigation bar, a wide hero image. You show it to your friend on their iPhone. They see tiny, unreadable text and have to pinch-and-zoom just to tap a button.

That is the problem **Responsive Web Design (RWD)** solves.

**Responsive Web Design** is the practice of building websites that automatically adapt their layout, typography, and images to look great on *any* screen — whether that's a smartwatch, a phone, a tablet, a laptop, or a 4K monitor.

### Why Does This Matter?

The numbers tell the whole story:

- **Over 60%** of all global website traffic now comes from mobile devices (Statista, 2024).
- In some regions (South Asia, Sub-Saharan Africa), mobile internet usage exceeds **80%** of all traffic.
- Google uses **mobile-first indexing** — it crawls and ranks the *mobile* version of your site first. A poor mobile experience directly hurts your SEO rank.
- Poor mobile UX leads to **high bounce rates**: users leave within seconds when a site is hard to use on their phone.

> [!IMPORTANT]
> Building a website that only works on desktop is like building a restaurant with a door that only 40% of customers can open. Responsive design is not optional — it is a professional baseline requirement.

### A Brief History

- **Early 2000s**: Most websites were fixed-width (usually 800px or 960px) because nearly everyone browsed on a desktop.
- **2007**: iPhone launches, introducing a real web browser on a small screen. Developers start noticing mobile users.
- **2010**: Ethan Marcotte coins the term **"Responsive Web Design"** in his landmark A List Apart article. He describes three core ingredients:
  1. Fluid grid layouts (percentages, not fixed pixels)
  2. Flexible images (images that scale with their container)
  3. CSS Media Queries (rules that apply only at certain screen sizes)
- **2011–2015**: The mobile internet boom forces RWD into mainstream practice.
- **2020s**: RWD evolves beyond media queries into container queries, intrinsic layout, and fluid typography.

### The Three Pillars of RWD

Think of RWD as a three-legged stool — remove any leg and it falls over:

```
┌─────────────────────────────────────────────────┐
│              RESPONSIVE WEB DESIGN               │
│                                                 │
│  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │   Fluid    │  │  Flexible  │  │   Media   │  │
│  │   Grids    │  │   Images   │  │  Queries  │  │
│  └────────────┘  └────────────┘  └───────────┘  │
│  Use % or fr    max-width:100%   @media rules    │
│  not px         scales with      apply styles    │
│  for layout     container        at breakpoints  │
└─────────────────────────────────────────────────┘
```

### Section Recap

- RWD makes websites adapt automatically to any screen size
- Mobile traffic is over 60% globally — ignoring it is commercial suicide
- Google's mobile-first indexing ties RWD directly to SEO
- RWD was formalized in 2010 and is built on three pillars: fluid grids, flexible images, and media queries

---

## The Viewport Meta Tag

### What is the "Viewport"?

The **viewport** is the visible area of a web page in the browser window. On a desktop, it's the browser's content area. On a phone, it's the screen.

### The 980px Shrink Problem

Here is something that surprises most beginners: when a smartphone browser loads a web page, it does **not** use the actual screen width by default. Instead, it pretends the screen is about **980 pixels wide** and then shrinks the entire page down to fit on the physical screen.

Why? Because early mobile browsers were designed to display *desktop* websites that were built at fixed widths like 960px. To show the full page without horizontal scrolling, the browser zoomed out. The result: everything looks tiny.

Let's visualize this:

```
WITHOUT viewport meta tag:
┌──────────────────────────────────────────┐
│  Browser pretends viewport = 980px       │
│  ┌──────────────────────────────────┐    │
│  │  Your 960px wide page            │    │
│  │  [tiny nav][tiny content]        │    │
│  │  shrunk to fit on 375px screen   │    │
│  └──────────────────────────────────┘    │
│  Text is unreadable. User must pinch.    │
└──────────────────────────────────────────┘

WITH viewport meta tag:
┌──────────────────────────────────────────┐
│  Browser knows viewport = 375px (real)   │
│  ┌────────────────────────────┐          │
│  │  Your responsive page      │          │
│  │  [full-size nav]           │          │
│  │  [full-size content]       │          │
│  └────────────────────────────┘          │
│  Text is readable at normal size.        │
└──────────────────────────────────────────┘
```

### The Fix: The Viewport Meta Tag

Add this single line inside the `<head>` of every HTML page you ever build:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <!-- THE MOST IMPORTANT RESPONSIVE META TAG -->
    <!-- Tell the browser: use the REAL device width, not 980px -->
    <!-- initial-scale=1.0 means: don't zoom in or out by default -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>My Responsive Page</title>
  </head>
  <body>
    <!-- content here -->
  </body>
</html>
```

### Breaking Down the Attributes

| Attribute | Value | Meaning |
|---|---|---|
| `width` | `device-width` | Set the viewport width to the actual screen width in CSS pixels |
| `initial-scale` | `1.0` | No zoom — 1 CSS pixel = 1 device-independent pixel |

> [!WARNING]
> Never add `user-scalable=no` or `maximum-scale=1` to the viewport tag. These prevent users from zooming in, which is a serious **accessibility violation**. Users with low vision rely on pinch-to-zoom. Many browsers now ignore these attributes, and they can fail WCAG accessibility audits.

> [!TIP]
> If you use a framework like Vite, Create React App, or Next.js, this meta tag is usually included in the default template. Always double-check that it's there.

### Section Recap

- Without the viewport meta tag, mobile browsers zoom out to fit 980px of fake width
- The meta tag tells browsers to use the real device width
- `width=device-width, initial-scale=1.0` is the correct value — memorize it
- Never disable user zooming — it harms accessibility

---

## Device Pixels vs CSS Pixels

### Why This Matters

When you write `width: 375px` in CSS, what does "375px" actually mean? The answer is more interesting than you might think, and understanding it helps you write better responsive code — especially when dealing with sharp, high-resolution screens.

### Physical Pixels (Device Pixels)

A **physical pixel** (also called a device pixel or hardware pixel) is an actual, physical dot of light on the screen. Your screen has a fixed number of them in a grid.

### CSS Pixels (Logical Pixels)

A **CSS pixel** is an abstract unit that CSS uses. It does not always correspond 1:1 to a physical pixel. The browser uses a ratio called the **Device Pixel Ratio (DPR)** to translate between CSS pixels and physical pixels.

```
Device Pixel Ratio (DPR) = Physical pixels / CSS pixels
```

### The Retina Display Example

Apple's Retina displays (and Android's equivalent high-DPI screens) pack **2× or 3× more physical pixels** into the same physical space as older screens.

```
Standard (1x) screen — iPhone 3G era:
┌────────────────────┐
│  320 CSS pixels    │
│  320 phys pixels   │
│  DPR = 1.0         │
│  1 CSS px = 1 dot  │
└────────────────────┘

Retina (2x) screen — iPhone 4 and later:
┌────────────────────┐
│  375 CSS pixels    │
│  750 phys pixels   │
│  DPR = 2.0         │
│  1 CSS px = 4 dots │  (2×2 grid of physical pixels)
└────────────────────┘

Super Retina (3x) screen — iPhone Pro:
┌────────────────────┐
│  393 CSS pixels    │
│  1179 phys pixels  │
│  DPR = 3.0         │
│  1 CSS px = 9 dots │  (3×3 grid of physical pixels)
└────────────────────┘
```

### What This Means For Your Code

**Good news:** For layout and text, CSS pixels handle everything automatically. When you write `font-size: 16px`, the browser ensures those 16 CSS pixels look the same physical size on all screens, regardless of DPR.

**The challenge:** Raster images (JPEGs, PNGs). If you place a 100×100px image in a 100×100 CSS pixel box on a 2x screen, the browser has to stretch 100 physical pixels to fill 200 physical pixels. The result: a **blurry image**.

The fix is to serve a **2x image** (200×200px) and tell the browser to display it at 100 CSS pixels:

```html
<!-- A 100px wide image box, but we serve a 200px image for Retina screens -->
<!-- The browser automatically picks the right one using the `srcset` attribute -->
<!-- We'll cover srcset in detail in the Responsive Images section -->
<img
  src="logo-100.png"
  srcset="logo-100.png 1x, logo-200.png 2x, logo-300.png 3x"
  alt="Company logo"
  width="100"
  height="100"
/>
```

> [!NOTE]
> You can check any device's DPR in the browser console with `window.devicePixelRatio`. Try it on your phone and your laptop — you'll likely see different numbers.

### CSS and SVG Are DPR-Immune

SVG (Scalable Vector Graphics) and CSS-drawn elements (borders, box shadows, gradients) are **vector-based** — they are mathematically drawn at whatever resolution the screen demands. They always look crisp on any screen. This is one reason why logos and icons are often better as SVGs.

### Section Recap

- Physical pixels are actual hardware dots; CSS pixels are abstract browser units
- DPR (Device Pixel Ratio) connects them: a 2x screen uses 4 physical pixels per CSS pixel
- Layout and text are handled automatically — you don't need to think about DPR for those
- Raster images (JPG/PNG) need higher-resolution versions for Retina screens
- SVGs are always crisp because they're vector-based

---

## Mobile-First vs Desktop-First Strategy

### The Core Concept

When you write responsive CSS, you are writing a *base* set of styles plus a set of *overrides* that activate at certain screen sizes. The question is: which screen size do you start with as your base?

- **Mobile-First**: Write styles for the smallest screen first, then *add* complexity as screens get larger.
- **Desktop-First**: Write styles for the largest screen first, then *remove* or *override* as screens get smaller.

### The Analogy

Think of building a house:

- **Mobile-First** = Build the smallest studio apartment first. It must be fully functional. Then, as you have more space, you add a dining room, a garage, a garden. Every addition makes life better, but the core is always working.
- **Desktop-First** = Build a 10-room mansion first. Then try to figure out how to cram it into a studio apartment. You're constantly removing things and wondering what to cut.

Which approach sounds more sustainable? Mobile-First.

### Mobile-First in CSS

In mobile-first, you use `min-width` in your media queries. The *base* styles (no media query) apply to the smallest screens. As the viewport grows wider, media queries *enhance* the layout.

```css
/* ─────────────────────────────────────────────────
   MOBILE-FIRST APPROACH
   Base styles: mobile (no media query)
   ───────────────────────────────────────────────── */

/* Base layout: single column for mobile */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* one full-width column on mobile */
  gap: 1rem;
}

/* When the screen is at least 768px wide (tablet), go to 2 columns */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr); /* two equal columns */
  }
}

/* When the screen is at least 1024px wide (desktop), go to 3 columns */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr); /* three equal columns */
  }
}
```

### Desktop-First in CSS

In desktop-first, you use `max-width` in your media queries. The *base* styles apply to the largest screens. As the viewport shrinks, media queries *reduce* the layout.

```css
/* ─────────────────────────────────────────────────
   DESKTOP-FIRST APPROACH
   Base styles: desktop (no media query)
   ───────────────────────────────────────────────── */

/* Base layout: three columns for desktop */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* three columns on desktop */
  gap: 1rem;
}

/* When the screen is at most 1024px (tablet), go to 2 columns */
@media (max-width: 1023px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* When the screen is at most 767px (mobile), go to 1 column */
@media (max-width: 767px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

### Side-by-Side Comparison

```
MOBILE-FIRST                    DESKTOP-FIRST
─────────────────────────────────────────────────
Base = mobile styles            Base = desktop styles
Use min-width queries           Use max-width queries
Add as screen grows ↗           Remove as screen shrinks ↙
Simpler mobile CSS              Simpler desktop CSS
Less CSS overall (usually)      More CSS overall (usually)
Aligns with Google indexing     Can lead to bloated mobile load
Great for content-first sites   Useful for retrofitting old sites
```

### Pros and Cons

**Mobile-First Pros:**
- Forces you to think about content priority — what's essential on small screens?
- Results in leaner CSS loaded by mobile devices
- Aligns with Google's mobile-first indexing
- Progressive enhancement mindset — start simple, enhance with capability

**Mobile-First Cons:**
- Can feel counter-intuitive if you're used to designing on a big screen
- Some complex desktop layouts are harder to express as additions to a mobile base

**Desktop-First Pros:**
- Natural if you're retrofitting an existing desktop site
- Easier to start from complex designs and simplify

**Desktop-First Cons:**
- Mobile devices download and parse styles intended for desktop, then override them — wasteful
- Easy to forget to handle a screen size, leaving mobile broken
- Contradicts Google's mobile-first indexing priorities

> [!IMPORTANT]
> **Industry standard: Mobile-First.** Most professional teams use mobile-first as the default approach. When joining a new project, check which approach is in use before writing any media queries — mixing the two creates chaos.

### Section Recap

- Mobile-First = base styles are mobile; use `min-width` to scale up
- Desktop-First = base styles are desktop; use `max-width` to scale down
- Mobile-First is the industry standard because mobile traffic dominates and it produces leaner code
- Consistency within a project is critical — never mix approaches

---

## Media Query Syntax

### What is a Media Query?

A **media query** is a CSS conditional that says: *"Only apply these styles if the following condition is true."*

Think of it like an if-statement in JavaScript, but for CSS:

```
JavaScript:  if (window.innerWidth >= 768) { /* do something */ }
CSS:         @media (min-width: 768px)    { /* apply styles */ }
```

### Basic Syntax

```css
/* The @media keyword starts the query */
/* Inside the parentheses is the condition (called a "media feature") */
/* Inside the curly braces are the CSS rules to apply when the condition is true */

@media (min-width: 768px) {
  /* These styles ONLY apply when the viewport is 768px or wider */
  body {
    font-size: 18px; /* slightly larger text on bigger screens */
  }
}
```

### The Media Type (Optional)

You can specify a media *type* before the condition. Common types:

- `screen` — for digital screens (monitors, phones, tablets)
- `print` — for when the user prints the page
- `all` — applies everywhere (default when no type is specified)

```css
/* Only apply these styles when printing */
@media print {
  .sidebar {
    display: none; /* hide the sidebar when printing — save ink! */
  }
  body {
    font-size: 12pt; /* use points (not pixels) for print sizes */
    color: black;    /* ensure black text on white paper */
  }
}

/* Screen only — explicit media type */
@media screen and (min-width: 1024px) {
  .hero {
    min-height: 100vh; /* full viewport height on wide screens */
  }
}
```

### Logical Operators: `and`, `not`, `,` (or)

You can combine conditions:

```css
/* AND — both conditions must be true */
/* Applies when: screen is at least 600px AND at most 1024px */
@media (min-width: 600px) and (max-width: 1024px) {
  .layout {
    grid-template-columns: repeat(2, 1fr); /* 2 columns in the "tablet" range */
  }
}

/* OR — using a comma (,) — either condition triggers the styles */
/* Applies when: screen is very narrow OR the user is printing */
@media (max-width: 400px), print {
  .advertisement {
    display: none; /* hide ads on tiny screens AND when printing */
  }
}

/* NOT — negates the condition */
/* Applies when: the screen is NOT a color screen */
@media not (color) {
  body {
    background: white; /* force white background on monochrome displays */
  }
}
```

### Classic Syntax vs Modern Range Syntax

CSS Media Queries Level 4 introduced a more readable **range syntax** using comparison operators. Both work — know both:

```css
/* ─── CLASSIC SYNTAX (works everywhere) ─────────────────── */

/* "at least 768px wide" */
@media (min-width: 768px) { }

/* "at most 1023px wide" */
@media (max-width: 1023px) { }

/* "between 768px and 1023px" */
@media (min-width: 768px) and (max-width: 1023px) { }


/* ─── MODERN RANGE SYNTAX (CSS Level 4, broadly supported) ── */

/* "at least 768px wide" */
@media (width >= 768px) { }

/* "at most 1023px wide" */
@media (width <= 1023px) { }

/* "between 768px and 1023px" (much cleaner!) */
@media (768px <= width <= 1023px) { }
```

> [!NOTE]
> Modern range syntax is supported in all major modern browsers (Chrome 113+, Firefox 110+, Safari 16.4+). As of 2024, it's safe to use in most projects. Check caniuse.com for your specific target audience.

### Nesting Media Queries (CSS Nesting)

Modern CSS supports nesting, which allows media queries inside rules:

```css
/* Traditional — media query wraps the selector */
.card {
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}


/* Modern CSS Nesting — media query inside the selector */
.card {
  padding: 1rem;          /* mobile base */

  @media (min-width: 768px) {
    padding: 2rem;        /* tablet override, nested inside .card */
  }

  @media (min-width: 1024px) {
    padding: 3rem;        /* desktop override, still inside .card */
  }
}
```

> [!TIP]
> CSS nesting is a game-changer for code organization. It's now supported natively in all modern browsers. If you use Sass or PostCSS, you've been using nesting for years — now it's built into plain CSS.

### Complete Example: A Responsive Navigation Bar

```html
<!-- HTML structure for a navigation bar -->
<nav class="navbar">
  <a href="/" class="navbar__logo">MySite</a>

  <!-- Hamburger button — only visible on mobile -->
  <button class="navbar__toggle" aria-label="Toggle menu">☰</button>

  <!-- Navigation links -->
  <ul class="navbar__links">
    <li><a href="/about">About</a></li>
    <li><a href="/work">Work</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

```css
/* ─────────────────────────────────────────────────────────
   MOBILE-FIRST NAVIGATION BAR
   Base: mobile styles (hamburger menu visible, links hidden)
   ───────────────────────────────────────────────────────── */

/* Mobile base: flex row, spread logo and hamburger apart */
.navbar {
  display: flex;
  justify-content: space-between;  /* logo on left, toggle on right */
  align-items: center;
  padding: 1rem;
  background-color: #1a1a2e;       /* dark navy background */
}

.navbar__logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e94560;                  /* accent color */
  text-decoration: none;
}

/* On mobile, the links are hidden by default (hamburger pattern) */
.navbar__links {
  display: none;                   /* hidden until toggle is clicked */
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Hamburger button is visible on mobile */
.navbar__toggle {
  display: block;                  /* visible on mobile */
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

/* ─────────────────────────────────────────────────────────
   TABLET AND ABOVE (min-width: 768px)
   Show all links in a row, hide hamburger button
   ───────────────────────────────────────────────────────── */
@media (min-width: 768px) {
  /* Show the links as a horizontal row */
  .navbar__links {
    display: flex;                 /* override display:none from mobile */
    gap: 2rem;                     /* space between each link */
  }

  /* Show each link */
  .navbar__links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .navbar__links a:hover {
    color: #e94560;                /* highlight on hover */
  }

  /* Hide the hamburger — we don't need it anymore */
  .navbar__toggle {
    display: none;                 /* hidden on tablet/desktop */
  }
}
```

### Section Recap

- `@media (condition) { }` is the basic syntax
- Use `min-width` for mobile-first, `max-width` for desktop-first
- Combine conditions with `and`, `,` (or), `not`
- Modern range syntax `(width >= 768px)` is cleaner and increasingly used
- CSS nesting lets you write media queries inside selectors for better organization

---

## Common Breakpoints

### What is a Breakpoint?

A **breakpoint** is a specific screen width where your layout changes. Think of it as a "snap point" — below this width, the layout looks one way; at or above it, the layout looks another.

### Don't Design for Devices — Design for Content

A common mistake is to look up the pixel width of popular devices (iPhone: 375px, iPad: 768px, etc.) and set breakpoints to match them. This is fragile — new devices come out constantly, and your breakpoints quickly become outdated.

**The right approach**: Let your *content* dictate breakpoints. Resize your browser and watch where the layout starts to break or look awkward. That's where you add a breakpoint.

> [!TIP]
> The best breakpoints are discovered, not prescribed. Drag your browser window and add a media query when things start to look bad.

### Common Industry Breakpoints

That said, there are widely-used conventional breakpoints inspired by frameworks like Bootstrap, Tailwind CSS, and Material UI. These are a reasonable *starting point*:

```
BREAKPOINT NAME   WIDTH        TYPICAL DEVICE
─────────────────────────────────────────────────
(none / xs)       < 640px      Small phones
sm                640px        Large phones, small phones landscape
md                768px        Tablets portrait
lg                1024px       Tablets landscape, small laptops
xl                1280px       Laptops, desktops
2xl               1536px       Large desktops, wide monitors
```

Visualized:

```
0px                640px     768px    1024px   1280px  1536px
|─────── xs ────────|─── sm ──|── md ──|── lg ──|── xl ─|── 2xl ─→
  Phones             Lg phone  Tablet   Laptop   Desktop  Wide
```

### Implementing Breakpoints as CSS Custom Properties

A professional technique is to document your breakpoints as comments or even use a preprocessor/custom property strategy:

```css
/* ─────────────────────────────────────────────────────────
   BREAKPOINT SYSTEM
   Defined once, referenced everywhere for consistency
   ───────────────────────────────────────────────────────── */

/* 
  We define breakpoints as comments at the top of our CSS file.
  CSS doesn't support custom properties inside @media queries yet,
  so we use comments to document them.

  sm:  640px
  md:  768px  
  lg:  1024px
  xl:  1280px
  2xl: 1536px
*/

/* ── TYPOGRAPHY: scales up as screen gets larger ── */
body {
  font-size: 1rem;       /* 16px on mobile */
}

@media (min-width: 768px) {   /* md and above */
  body {
    font-size: 1.0625rem;    /* 17px on tablet */
  }
}

@media (min-width: 1280px) {  /* xl and above */
  body {
    font-size: 1.125rem;     /* 18px on desktop */
  }
}

/* ── CONTAINER: max-width grows with screen ── */
.container {
  width: 100%;             /* full width on mobile */
  padding-inline: 1rem;    /* horizontal padding */
  margin-inline: auto;     /* center the container */
}

@media (min-width: 640px) {   /* sm */
  .container {
    max-width: 640px;          /* cap width at sm breakpoint */
  }
}

@media (min-width: 768px) {   /* md */
  .container {
    max-width: 768px;
    padding-inline: 1.5rem;    /* more padding on wider screens */
  }
}

@media (min-width: 1024px) {  /* lg */
  .container {
    max-width: 1024px;
    padding-inline: 2rem;
  }
}

@media (min-width: 1280px) {  /* xl */
  .container {
    max-width: 1280px;
  }
}
```

### Section Recap

- Breakpoints are screen widths where your layout transitions to a different design
- Common breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Don't target specific device sizes — let your content drive breakpoint choices
- Document your breakpoints at the top of your CSS for consistency

---

## Orientation Media Query

### What is Orientation?

Devices can be held in two orientations:
- **Portrait**: Taller than wide (like a book — most common for phones)
- **Landscape**: Wider than tall (like a movie screen — common when rotating the phone or using tablets)

```
Portrait:           Landscape:
┌──────┐           ┌────────────────┐
│      │           │                │
│      │           │                │
│      │           └────────────────┘
│      │
└──────┘
width < height      width > height
```

### Using the Orientation Feature

```css
/* Default (portrait): stack items vertically */
.photo-gallery {
  display: grid;
  grid-template-columns: 1fr;   /* single column in portrait */
  gap: 1rem;
}

/* When the device is in landscape orientation, use 2 columns */
@media (orientation: landscape) {
  .photo-gallery {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns in landscape */
  }
}

/* Portrait-specific styles — keep sidebar hidden in portrait */
@media (orientation: portrait) {
  .sidebar {
    display: none;  /* hide sidebar when in portrait mode */
  }
}
```

### Combining Orientation with Width

```css
/* Only apply to phones held sideways (narrow screen, landscape) */
/* This avoids affecting landscape desktops, which are always landscape */
@media (max-width: 900px) and (orientation: landscape) {
  .hero {
    /* On phone landscape, the viewport is short — reduce tall elements */
    min-height: 50vh;    /* don't take the full height in this mode */
    padding-block: 1rem; /* reduce top/bottom padding */
  }
}
```

> [!NOTE]
> The orientation media feature is simply comparing width vs height. `portrait` means height >= width, `landscape` means width > height. It's not detecting the actual physical position of the device — a very wide tablet held in landscape might still be technically "portrait" if it's taller than wide.

### Section Recap

- `@media (orientation: portrait)` — height >= width
- `@media (orientation: landscape)` — width > height
- Combine with width queries to target phones specifically in landscape

---

## Dark Mode with prefers-color-scheme

### What is `prefers-color-scheme`?

Modern operating systems (Windows, macOS, iOS, Android) let users choose between a light and dark system theme. The CSS media feature `prefers-color-scheme` lets your website automatically match that preference.

### Why Does This Matter?

- Dark mode reduces eye strain, especially in low-light environments
- Many users **strongly** prefer dark mode — they feel annoyed when websites ignore their system preference
- OLED screens use less power displaying dark content, extending battery life on phones
- It's a sign of a polished, professional product when your site respects system preferences

### Basic Implementation

```css
/* ─────────────────────────────────────────────────────────
   LIGHT MODE (default)
   These styles apply when the user prefers light mode
   OR when no preference is detected
   ───────────────────────────────────────────────────────── */

:root {
  /* Define colors as custom properties for easy switching */
  --color-bg: #ffffff;          /* white background */
  --color-text: #1a1a1a;        /* near-black text */
  --color-card-bg: #f5f5f5;     /* light gray card background */
  --color-border: #e0e0e0;      /* light border */
  --color-accent: #6c63ff;      /* purple accent */
}

/* ─────────────────────────────────────────────────────────
   DARK MODE
   Activates when the user's OS is set to dark mode
   ───────────────────────────────────────────────────────── */

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #121212;         /* very dark background */
    --color-text: #e8e8e8;       /* off-white text (not pure white — easier on eyes) */
    --color-card-bg: #1e1e1e;    /* slightly lighter dark for cards */
    --color-border: #333333;     /* dark border */
    --color-accent: #a89cff;     /* lighter purple — easier to see on dark bg */
  }
}

/* ─────────────────────────────────────────────────────────
   COMPONENT STYLES — use variables, not hardcoded colors
   These automatically switch between light and dark mode
   ───────────────────────────────────────────────────────── */

body {
  background-color: var(--color-bg);    /* switches automatically */
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease; /* smooth transition */
}

.card {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
```

### Adding a Manual Toggle (Best Practice)

Respecting the OS preference is a good start, but the best practice is to *also* let users toggle dark mode manually on your site. This requires a little JavaScript:

```html
<!-- Toggle button in your HTML -->
<button id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
```

```css
/* Support manual override by reading a data attribute on <html> */

/* When the user manually sets light mode, override the media query */
[data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-card-bg: #f5f5f5;
  --color-border: #e0e0e0;
  --color-accent: #6c63ff;
}

/* When the user manually sets dark mode */
[data-theme="dark"] {
  --color-bg: #121212;
  --color-text: #e8e8e8;
  --color-card-bg: #1e1e1e;
  --color-border: #333333;
  --color-accent: #a89cff;
}
```

```js
// JavaScript to handle the toggle button
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement; // the <html> element

// Check if a preference was previously saved in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme); // restore saved preference
}

toggle.addEventListener('click', () => {
  // Read current theme (or default to 'light' if none is set)
  const currentTheme = html.getAttribute('data-theme') || 'light';

  // Flip to the opposite theme
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // Apply new theme to <html>
  html.setAttribute('data-theme', newTheme);

  // Save preference so it persists on next visit
  localStorage.setItem('theme', newTheme);

  // Update button icon
  toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
```

> [!TIP]
> Always define your color palette as CSS custom properties (variables). This makes theming trivial — you just redefine the variables in the dark mode block, and every component that uses them updates automatically.

### Section Recap

- `@media (prefers-color-scheme: dark)` detects the user's OS dark mode setting
- Define colors as CSS custom properties, then redefine them in the dark mode block
- Add a manual toggle button as a best-practice enhancement
- Save the user's manual preference to `localStorage` so it persists

---

## Accessibility with prefers-reduced-motion

### What is `prefers-reduced-motion`?

Some users experience dizziness, nausea, or disorientation from animations and motion on screens. This can be caused by conditions like **vestibular disorders** (inner ear problems), epilepsy, or motion sensitivity. macOS, Windows, iOS, and Android all let users signal that they prefer less motion.

The `prefers-reduced-motion` media feature detects this preference so you can disable or reduce your animations.

### Why This Matters

- This is an **accessibility** (a11y) issue, not just a preference
- Ignoring this can literally cause physical discomfort or seizures in some users
- WCAG 2.1 guidelines include provisions against triggering motion sensitivity
- Respecting this preference is a sign of an inclusive, thoughtful developer

### Implementation

```css
/* ─────────────────────────────────────────────────────────
   BASE ANIMATIONS — defined for most users
   ───────────────────────────────────────────────────────── */

/* A spinning loader animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;  /* spin continuously */
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #6c63ff;
  border-radius: 50%;
}

/* A slide-in animation for page elements */
.hero-text {
  animation: slideIn 0.6s ease-out forwards; /* slides in on page load */
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px); /* starts 30px below */
  }
  to {
    opacity: 1;
    transform: translateY(0);    /* ends at normal position */
  }
}

/* ─────────────────────────────────────────────────────────
   REDUCED MOTION OVERRIDE
   When the user prefers reduced motion, disable or simplify animations
   ───────────────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  /* Option 1: Remove all animations site-wide (nuclear option) */
  *, *::before, *::after {
    animation-duration: 0.01ms !important; /* effectively instant */
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;      /* disable smooth scrolling */
  }

  /* Option 2: Replace specific animations with simpler alternatives */
  .hero-text {
    animation: none;    /* no slide-in animation */
    opacity: 1;         /* just show it immediately */
  }

  /* Keep the spinner but make it a simple pulse instead of spinning */
  .spinner {
    animation: pulse 1s ease-in-out infinite; /* subtle pulse instead of spin */
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }   /* just fades in/out — no rotational motion */
  }
}
```

> [!WARNING]
> The "nuclear option" (disabling all animations) is easy to implement but can make your UI feel broken because some animations are **functional** (like a loading spinner). Prefer targeted overrides that replace motion-heavy animations with simpler alternatives.

### The `prefers-reduced-motion: no-preference` Value

You can also use this to *only* apply animations when the user has explicitly said they're fine with them:

```css
/* Only add animation if the user has NOT requested reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .hero-text {
    animation: slideIn 0.6s ease-out forwards;
  }
}
```

This is sometimes considered the safer approach — animations are opt-in rather than opt-out.

### Section Recap

- `prefers-reduced-motion` detects users who need less animation
- This is an accessibility requirement, not just a nicety
- Replace spinning/sliding animations with simple fades or instant appearance
- Consider using `no-preference` to make animations opt-in for safety

---

## Responsive Images

### The Problem

A standard `<img>` tag loads one image at one size. On a phone with a 375px screen, you might be loading an image that's 1600px wide — just to display it at 375px. That wastes bandwidth, slows down the page, and drains mobile data plans.

The solution: serve **different image files** to devices based on their needs. CSS handles layout — HTML handles image source selection.

### The `srcset` Attribute — Width Descriptors

The `srcset` attribute lets you provide multiple image sources. The browser picks the best one.

```html
<!--
  srcset provides a list of image options.
  Format: filename Xw  (where X is the image's actual width in pixels)
  The browser picks the best option based on viewport width and device DPR.
-->
<img
  src="photo-800.jpg"                   <!-- fallback for old browsers -->
  srcset="
    photo-400.jpg  400w,                <!-- 400px wide version -->
    photo-800.jpg  800w,                <!-- 800px wide version -->
    photo-1200.jpg 1200w,               <!-- 1200px wide version -->
    photo-1600.jpg 1600w                <!-- 1600px wide version -->
  "
  alt="A landscape photo of mountains"
/>
```

> [!NOTE]
> The `w` in `400w` stands for "width in pixels of the actual image file" — it is a **width descriptor**, not a CSS unit. It tells the browser how wide the actual file is, not how wide to display it.

### The `sizes` Attribute — How Big Will This Image Be Displayed?

The `srcset` attribute tells the browser *what options are available*. The `sizes` attribute tells the browser *how big the image will be on screen*. Together, the browser can calculate the optimal image to download.

```html
<!--
  sizes: a media-query-style list that describes the image's display width
  The browser reads this top-to-bottom and uses the FIRST matching condition.
  The last value is the default (no media query needed).
-->
<img
  src="photo-800.jpg"
  srcset="
    photo-400.jpg  400w,
    photo-800.jpg  800w,
    photo-1200.jpg 1200w,
    photo-1600.jpg 1600w
  "
  sizes="
    (max-width: 600px) 100vw,    /* on small screens, image is 100% viewport width */
    (max-width: 1024px) 50vw,    /* on medium screens, image is ~50% viewport width */
    33vw                          /* on large screens, image is ~33% viewport width */
  "
  alt="A landscape photo of mountains"
/>
```

### How the Browser Picks an Image

Step by step, when the browser encounters an `<img>` with `srcset` and `sizes`:

1. **Read `sizes`**: Evaluate each media condition top-to-bottom. Use the value from the first match. This gives a display width in CSS pixels (e.g., `100vw` = full viewport width = 375px on an iPhone).
2. **Multiply by DPR**: If the device has a 2x DPR, the browser needs a 750px image to display crisply at 375px CSS pixels.
3. **Scan `srcset`**: Find the image with the smallest width that is still large enough (at or above 750px). In our example, that would be `photo-800.jpg`.
4. **Download that image**.

```
Example: iPhone 12 (375px wide, 3x DPR, screen width matches sizes condition "(max-width: 600px) 100vw")

Step 1: Display width = 100vw = 375 CSS pixels
Step 2: Needed pixels = 375 × 3 (DPR) = 1125 physical pixels
Step 3: Scan srcset: 400 too small, 800 too small, 1200 >= 1125 ✓
Step 4: Download photo-1200.jpg
```

> [!TIP]
> You don't have to calculate these yourself! Tools like [Responsivebreakpoints.com](https://www.responsivebreakpoints.com/) or `sharp` (npm) can auto-generate multiple sizes and the correct `srcset` string.

### Using Modern Image Formats

Pair your responsive images with modern formats for maximum performance:

```html
<!-- Use <picture> to offer modern formats with a JPEG fallback -->
<picture>
  <!-- First: try AVIF (best compression, newer browsers) -->
  <source
    type="image/avif"
    srcset="photo-400.avif 400w, photo-800.avif 800w, photo-1200.avif 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
  />

  <!-- Second: try WebP (great compression, widely supported) -->
  <source
    type="image/webp"
    srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
  />

  <!-- Fallback: JPEG for old browsers that don't support AVIF or WebP -->
  <img
    src="photo-800.jpg"
    srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
    alt="A landscape photo of mountains"
    loading="lazy"     <!-- defer loading until near viewport (browser native lazy loading) -->
    decoding="async"   <!-- decode image asynchronously — doesn't block rendering -->
    width="1200"       <!-- always specify width/height to prevent layout shift -->
    height="800"
  />
</picture>
```

### Section Recap

- `srcset` provides a list of image file options with their real widths (`400w`)
- `sizes` tells the browser how wide the image will be displayed in different contexts
- The browser uses both to calculate and download the optimal image (considering DPR)
- Use `<picture>` with `<source type="image/avif">` and `<source type="image/webp">` for format negotiation
- Always add `loading="lazy"` for below-the-fold images and always specify `width`/`height`

---

## Art Direction with the Picture Element

### What is Art Direction?

**Art direction** is the practice of showing a *different image* (not just a different size) on different screen sizes. This is about composition and subject matter, not just resolution.

### The Problem

Imagine you have a panoramic landscape photo: wide open fields with a tiny farmhouse in the center. It looks beautiful on a large monitor. On a phone in portrait mode, the image is so narrow that the farmhouse becomes a 10-pixel speck — the key subject is lost.

Art direction says: *"On small screens, show a tight crop of just the farmhouse. On large screens, show the full panorama."*

```
Desktop:                          Mobile:
┌────────────────────────────┐    ┌──────────┐
│ ~~~~~~~~~~~~~~~~           │    │  ┌──┐    │
│ ~~~ fields ~~~ [farmhouse] │    │  │  │    │
│ ~~~~~~~~~~~~~~~~           │    │  └──┘    │
│ full panorama landscape    │    │  crop of │
└────────────────────────────┘    │  farmhouse│
                                  └──────────┘
```

### Using `<picture>` for Art Direction

```html
<!--
  <picture> element: lets you specify completely different images
  based on media conditions.
  The browser uses the FIRST <source> whose media condition is true.
  The <img> is the required fallback — it must always be present.
-->
<picture>
  <!--
    Large screens (min-width: 1024px):
    Show the wide panorama (landscape crop — 16:9 aspect ratio)
  -->
  <source
    media="(min-width: 1024px)"
    srcset="farmhouse-panorama-1600.jpg 1600w, farmhouse-panorama-800.jpg 800w"
    sizes="100vw"
  />

  <!--
    Medium screens (min-width: 600px):
    Show a medium crop — wider than square, but not full panorama
  -->
  <source
    media="(min-width: 600px)"
    srcset="farmhouse-medium-800.jpg 800w, farmhouse-medium-400.jpg 400w"
    sizes="100vw"
  />

  <!--
    Default / Small screens:
    Show the tight crop — just the farmhouse, square-ish
    This is the <img> fallback, always required.
  -->
  <img
    src="farmhouse-crop-400.jpg"
    srcset="farmhouse-crop-400.jpg 400w, farmhouse-crop-800.jpg 800w"
    sizes="100vw"
    alt="A red farmhouse surrounded by golden fields"
    width="800"
    height="800"
  />
</picture>
```

### Art Direction for Responsive Logos

```html
<!-- Show a full horizontal logo on desktop, abbreviated logo on mobile -->
<picture>
  <!-- Desktop: full horizontal logo with text -->
  <source
    media="(min-width: 768px)"
    srcset="logo-horizontal.svg"
  />
  <!-- Mobile: icon-only version of the logo -->
  <img
    src="logo-icon.svg"
    alt="Company logo"
    width="40"
    height="40"
  />
</picture>
```

> [!NOTE]
> For `srcset` with `w` descriptors, the browser may choose *any* size from the list based on network conditions and its own optimization logic. With `<picture>` and `media` attributes, the browser **must** use the source whose media condition is true — art direction decisions are guaranteed.

### Section Recap

- Art direction = showing a fundamentally different image (different crop, subject) on different screens
- Use `<picture>` with `media` attributes on `<source>` elements for art direction
- The browser uses the first `<source>` whose `media` condition is true
- The `<img>` inside `<picture>` is mandatory — it's the fallback and also provides `alt` text

---

## Fluid Typography with clamp()

### The Problem with Fixed and Media Query Typography

There are two traditional approaches to responsive typography:

1. **Fixed size**: `font-size: 1rem` everywhere — same size on a phone and a 4K monitor
2. **Step jumps**: Change font-size at each breakpoint — abrupt size changes at each breakpoint

Both are suboptimal. What we really want is font sizes that **smoothly scale** with the viewport — larger on big screens, smaller on small screens, with minimum and maximum bounds.

### Enter `clamp()`

`clamp()` is a CSS function that takes three values:

```
clamp(MINIMUM, PREFERRED, MAXIMUM)
```

- **MINIMUM**: The smallest the value can ever be
- **PREFERRED**: The ideal value — usually a viewport-relative unit like `vw`
- **MAXIMUM**: The largest the value can ever be

```css
/* ─────────────────────────────────────────────────────────
   clamp() EXPLAINED STEP BY STEP
   ───────────────────────────────────────────────────────── */

h1 {
  /*
    clamp(1.5rem, 5vw, 3rem)
    
    - MINIMUM = 1.5rem (24px at default browser size)
      → The font will NEVER go smaller than 1.5rem, no matter how narrow the screen
    
    - PREFERRED = 5vw (5% of viewport width)
      → On a 600px wide screen: 5% of 600 = 30px ≈ 1.875rem (between min and max, so this applies)
      → On a 400px wide screen: 5% of 400 = 20px < 24px minimum → clamp kicks in, uses 1.5rem
      → On a 1200px wide screen: 5% of 1200 = 60px > 48px maximum → clamp kicks in, uses 3rem
    
    - MAXIMUM = 3rem (48px at default browser size)  
      → The font will NEVER go larger than 3rem, no matter how wide the screen
  */
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

Visualized as a graph:

```
Font Size
3rem  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┌────────────────
      │                          ╱
      │                        ╱  ← grows with viewport (5vw)
      │                      ╱
1.5rem├──────────────────────
      │  ← clamped at 1.5rem (too narrow for 5vw to exceed minimum)
      │
      └──────────────────────────────────────────→ Viewport Width
         320px              ~480px     ~960px
         (minimum          (5vw =      (5vw =
          kicks in)         1.5rem)    3rem, max
                                       kicks in)
```

### Calculating `clamp()` Values

The preferred value can be made more precise by combining `vw` with a `rem` adjustment. This creates a true "fluid scale" that works across your full range:

```css
/*
  The formula for a perfectly fluid scale:
  clamp(MIN, IDEAL_VW + OFFSET_REM, MAX)

  Where:
  - IDEAL_VW scales the font with the viewport
  - OFFSET_REM adjusts the baseline

  Example: scale from 1rem at 320px to 2rem at 1280px

  Slope = (2 - 1) / (1280 - 320) = 1 / 960 ≈ 0.00104167
  As vw: 0.00104167 × 100 ≈ 0.1042vw per rem... complex math!

  In practice, use a clamp() generator tool or just test visually.
  A good rule of thumb: preferred value ≈ 2-5vw depending on element
*/

/* Headings: scale more aggressively */
h1 { font-size: clamp(2rem, 5vw + 1rem, 4rem); }    /* Hero heading */
h2 { font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem); } /* Section heading */
h3 { font-size: clamp(1.25rem, 3vw, 2rem); }          /* Subsection heading */

/* Body: scale gently */
p {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem); /* subtle scaling */
  line-height: 1.6; /* always a good ratio for readability */
}
```

> [!TIP]
> Use [clamp.font-size.app](https://clamp.font-size.app/) or [min-max-calculator.9elements.com](https://min-max-calculator.9elements.com/) to generate precise clamp values by entering your minimum and maximum font sizes and screen widths. It does all the math for you.

### Fluid Spacing with clamp()

`clamp()` works on any numeric CSS property — not just font-size:

```css
/* Section padding that scales with viewport */
.section {
  padding-block: clamp(2rem, 8vw, 6rem); /* padding-top and padding-bottom together */
}

/* Gap in a grid that scales */
.card-grid {
  gap: clamp(1rem, 3vw, 2.5rem);
}

/* Container max-width that transitions smoothly */
.container {
  max-width: clamp(320px, 90%, 1280px); /* always 90% of viewport, bounded */
  margin-inline: auto;
}
```

### Section Recap

- `clamp(min, preferred, max)` creates fluid values that scale between a minimum and maximum
- The preferred value is usually `vw`-based (e.g., `5vw`) so it scales with viewport width
- Use for font-size, padding, margin, gap — any property that should scale smoothly
- Eliminates the need for multiple breakpoint-based font-size overrides

---

## Modern Viewport Units

### Why `100vh` Was Broken on Mobile

The classic `100vh` (100 viewport height) was supposed to mean "the full height of the visible screen." On desktop, this works perfectly.

On mobile, there's a complication: the browser's **address bar**. On mobile browsers (especially Chrome and Safari on iOS), the address bar appears when you first load a page and then hides as you scroll down. The address bar takes up vertical space.

The problem: `100vh` is calculated *including* the space that the address bar will eventually give up — even when the address bar is currently visible and taking up space.

```
Initial load (address bar visible):
┌────────────────────┐  ┐
│ ← Address Bar →   │  │ 60px (address bar)
├────────────────────┤  │
│                    │  │
│   YOUR CONTENT     │  │ actual visible space
│   (100vh = full    │  │ = 100vh - 60px
│    height incl.    │  │
│    addr. bar area) │  │
│  ↕ overflows!     │  │
└────────────────────┘  ┘ ← content is cut off!

After scrolling (address bar hidden):
┌────────────────────┐
│                    │
│   YOUR CONTENT     │
│   100vh = this     │
│   full height      │
│   ✓ fits now       │
└────────────────────┘
```

The result: on first load, `height: 100vh` content overflows the visible area and gets cut off — often hiding important content or buttons behind the address bar.

### The New Viewport Units (CSS Level 4)

CSS now provides three new viewport height (and width) units that handle this properly:

```
svh  — Small Viewport Height  — the viewport when the browser UI is FULLY VISIBLE (smallest)
lvh  — Large Viewport Height  — the viewport when the browser UI is HIDDEN (largest)
dvh  — Dynamic Viewport Height — TRACKS the browser UI in real-time (changes as you scroll)
```

And their width counterparts: `svw`, `lvw`, `dvw`.

```
┌─────────────────────────────────────────────┐
│   100svh = Small Viewport                   │
│   (address bar + any toolbars visible)      │
│   Safe for "must always be visible" content │
├─────────────────────────────────────────────┤
│                                             │
│   100dvh = Dynamic (changes with scroll)    │
│   Best for "take up current visible space"  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   Extra space: browser UI will hide here    │
│   when user scrolls                         │
│   100lvh = Large Viewport                   │
│   (all browser UI hidden — maximum space)   │
└─────────────────────────────────────────────┘
```

### When to Use Each

```css
/* ─────────────────────────────────────────────────────────
   PRACTICAL USAGE OF MODERN VIEWPORT UNITS
   ───────────────────────────────────────────────────────── */

/* Hero section: use svh for a safe "always visible" hero */
/* Content within 100svh is guaranteed to be visible even with browser UI showing */
.hero {
  min-height: 100svh;        /* takes at least the small viewport height */
  display: grid;
  place-items: center;
}

/* Full-screen overlay/modal: use dvh to track current available space */
.modal-overlay {
  height: 100dvh;            /* always fills exactly the currently visible space */
  width: 100dvw;             /* full dynamic width too */
  position: fixed;
  top: 0;
  left: 0;
}

/* Mobile menu drawer: svh is safest — guaranteed space */
.mobile-menu {
  height: 100svh;
  overflow-y: auto;          /* allow scrolling within menu if content is tall */
}

/* Avoid 100lvh for anything that must always show fully — */
/* it assumes browser UI is hidden, which may not be true on initial load */

/* Progressive enhancement: fallback for older browsers */
.full-height-section {
  height: 100vh;             /* fallback for browsers that don't support dvh */
  height: 100dvh;            /* modern browsers use this (overrides the line above) */
}
```

### The Container-Relative Units: `cqi`, `cqb`

Related to container queries (covered next), you can use container-relative units:

```css
/* cqi = container query inline size (width in horizontal writing modes) */
/* cqb = container query block size (height in horizontal writing modes) */
/* cqmin = min(cqi, cqb) */
/* cqmax = max(cqi, cqb) */

.card-title {
  /* Scale the title font based on the CARD's width, not the viewport width */
  font-size: clamp(1rem, 3cqi + 0.5rem, 1.75rem);
}
```

### Section Recap

- `100vh` is broken on mobile because it doesn't account for the browser address bar
- `svh` = small viewport (address bar fully visible) — always safe, always fully visible
- `lvh` = large viewport (all browser UI hidden) — maximum space, risky for initial load
- `dvh` = dynamic — tracks real-time visible area as browser UI shows/hides
- Use `svh` for hero sections and overlays; `dvh` for modals that need to fill current space
- Always provide a `vh` fallback before the `dvh`/`svh` value for older browsers

---

## Container Queries

### The Problem with Media Queries for Reusable Components

Media queries answer the question: *"How wide is the viewport?"*

But that's often the wrong question for reusable components.

Imagine you have a `.card` component. You want it to display a horizontal layout when it has enough space, and a vertical layout when it's cramped. If you use a media query:

```css
/* This breaks the component's encapsulation! */
/* It says "switch layout at 768px viewport width" */
/* But what if the card is in a sidebar that's only 300px wide on a 1200px screen? */
@media (min-width: 768px) {
  .card {
    flex-direction: row; /* ← WRONG: the viewport is wide, but this card's CONTAINER might be narrow */
  }
}
```

The card in the sidebar will get a horizontal layout even though it only has 300px of space. It breaks because the component's layout depends on the container's width, not the viewport's width.

```
Viewport: 1200px wide
┌─────────────────────────────────────────┐
│  Sidebar (300px)  │   Main (900px)      │
│  ┌────────────┐   │   ┌──────────────┐  │
│  │ [img][text]│   │   │ [img]        │  │
│  │ horizontal │   │   │ [text]       │  │
│  │ layout ← ✗│   │   │ horizontal ✓ │  │
│  │ too narrow!│   │   └──────────────┘  │
│  └────────────┘   │                     │
└─────────────────────────────────────────┘

The media query fires for BOTH cards because the VIEWPORT is wide enough.
But the sidebar card doesn't have enough space for horizontal layout!
```

### The Solution: Container Queries

Container queries let you ask: *"How wide is this element's **container**?"*

```css
/* Step 1: Declare the containing element as a query container */
.card-wrapper {
  container-type: inline-size;  /* "I am a container. Query my inline (horizontal) size." */
  container-name: card;         /* optional: give it a name for targeted queries */
}

/* Step 2: Write rules that respond to the CONTAINER's width, not the viewport's */
/* @container replaces @media for component-level queries */
@container (min-width: 500px) {
  .card {
    display: flex;
    flex-direction: row;  /* horizontal when the CONTAINER is at least 500px wide */
    gap: 1.5rem;
  }
}
```

Now the sidebar card and the main content card respond independently to *their own* container width!

### `container-type` Values

```css
/* container-type: inline-size */
/* Responds to the container's inline dimension (width in horizontal writing mode) */
/* This is the most common type */
.wrapper {
  container-type: inline-size;  /* enables @container queries for width */
}

/* container-type: size */
/* Responds to both inline AND block dimensions (width AND height) */
/* Less common — you need explicit height on the container for this to work */
.wrapper {
  container-type: size;
  height: 400px;  /* block size must be defined for block/size queries to work */
}

/* container-type: normal */
/* Default — no size queries, but can be used for style queries (future feature) */
.wrapper {
  container-type: normal; /* not useful for @container size queries */
}
```

> [!WARNING]
> Setting `container-type: inline-size` or `size` on an element prevents it from using its own children's sizes to determine its own size. This is called "size containment". If you see collapsing containers or unexpected layouts, check if you've applied container-type to the wrong element.

### Named Container Queries

When you have nested containers, you might want to query a specific ancestor — not just the nearest container. Use `container-name` for this:

```css
/* Declare named containers */
.page-layout {
  container-type: inline-size;
  container-name: page;         /* named "page" */
}

.card-grid {
  container-type: inline-size;
  container-name: card-section; /* named "card-section" */
}

.card-wrapper {
  container-type: inline-size;
  container-name: card;         /* named "card" */
}

/* Query a specific named container */
/* This targets the container named "page", not the nearest container */
@container page (min-width: 1200px) {
  .hero-title {
    font-size: 4rem;  /* large font only when the PAGE container is wide */
  }
}

/* This targets the nearest "card" container */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

### Complete Container Query Example

```html
<!-- HTML structure -->
<main class="page-layout">

  <aside class="sidebar">
    <div class="card-wrapper">         <!-- container -->
      <article class="card">
        <img class="card__image" src="photo.jpg" alt="Article thumbnail" />
        <div class="card__content">
          <h2 class="card__title">Article Title</h2>
          <p class="card__excerpt">Short description of the article content here.</p>
          <a class="card__link" href="#">Read more</a>
        </div>
      </article>
    </div>
  </aside>

  <section class="main-content">
    <div class="card-wrapper">         <!-- same card, different container size -->
      <article class="card">
        <img class="card__image" src="photo.jpg" alt="Article thumbnail" />
        <div class="card__content">
          <h2 class="card__title">Article Title</h2>
          <p class="card__excerpt">Short description of the article content here.</p>
          <a class="card__link" href="#">Read more</a>
        </div>
      </article>
    </div>
  </section>

</main>
```

```css
/* ─────────────────────────────────────────────────────────
   PAGE LAYOUT — media query for overall layout
   ───────────────────────────────────────────────────────── */

.page-layout {
  display: grid;
  grid-template-columns: 1fr;          /* single column on mobile */
  gap: 2rem;
}

@media (min-width: 1024px) {
  .page-layout {
    grid-template-columns: 300px 1fr;  /* sidebar + main on desktop */
  }
}

/* ─────────────────────────────────────────────────────────
   CONTAINER SETUP
   ───────────────────────────────────────────────────────── */

.card-wrapper {
  container-type: inline-size;   /* this element is a query container */
  container-name: card;          /* named for targeted queries */
}

/* ─────────────────────────────────────────────────────────
   CARD BASE STYLES — vertical (mobile / narrow containers)
   ───────────────────────────────────────────────────────── */

.card {
  display: flex;
  flex-direction: column;         /* vertical layout by default */
  border-radius: 0.75rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card__image {
  width: 100%;                    /* full width in vertical layout */
  height: 200px;
  object-fit: cover;              /* crop image to fit without distortion */
}

.card__content {
  padding: 1.25rem;
}

.card__title {
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
}

.card__excerpt {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card__link {
  display: inline-block;
  margin-top: 1rem;
  color: #6c63ff;
  font-weight: 600;
  text-decoration: none;
}

/* ─────────────────────────────────────────────────────────
   CONTAINER QUERY — switch to horizontal layout
   when the CONTAINER (not viewport) is wide enough
   ───────────────────────────────────────────────────────── */

@container card (min-width: 400px) {
  .card {
    flex-direction: row;           /* horizontal when container >= 400px */
  }

  .card__image {
    width: 200px;                  /* fixed width in horizontal layout */
    height: auto;                  /* auto height to match content */
    flex-shrink: 0;                /* prevent image from shrinking */
  }

  .card__content {
    padding: 1.5rem;
  }
}

/* ─────────────────────────────────────────────────────────
   Larger container gets bigger title
   ───────────────────────────────────────────────────────── */

@container card (min-width: 600px) {
  .card__title {
    font-size: 1.75rem;             /* bigger title in wider containers */
  }

  .card__image {
    width: 280px;                   /* wider image in large containers */
  }
}
```

### Container Queries vs Media Queries — Which to Use?

```
USE MEDIA QUERIES for:              USE CONTAINER QUERIES for:
─────────────────────────────────────────────────────────────
Overall page layout                 Reusable UI components
Number of columns in main grid      Card layouts within a grid
Navigation bar behavior             Sidebar widget layouts
Global font-size scaling            Component-specific typography
Print styles                        Any component used in multiple contexts
Body/page-level decisions           "Does this specific box have space?"
```

> [!TIP]
> A good mental model: **Media queries are for pages. Container queries are for components.** Use them together — media queries handle the macro layout, container queries handle the micro component layouts within it.

### Section Recap

- Media queries check viewport width — wrong tool for components used in different layout positions
- Container queries (`@container`) check the *container's* width — perfect for reusable components
- `container-type: inline-size` enables width-based container queries on an element
- `container-name` lets you query specific named ancestors, not just the nearest container
- `@container name (condition) { }` — identical syntax to `@media`, just with `@container`
- Use both: media queries for page layout, container queries for component layout

---

## Lab 1: Convert Desktop-First to Mobile-First

### Overview

**Duration:** 40 minutes  
**Goal:** Take an existing desktop-first stylesheet and convert it to a mobile-first approach.

### Starter Files

Create a new folder `lab-01-mobile-first/` and the following files:

```html
<!-- lab-01-mobile-first/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mobile-First Conversion Lab</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header class="header">
      <div class="container">
        <div class="header__inner">
          <a href="/" class="logo">DevBlog</a>
          <nav class="nav">
            <ul class="nav__list">
              <li><a href="#" class="nav__link">Home</a></li>
              <li><a href="#" class="nav__link">Articles</a></li>
              <li><a href="#" class="nav__link">About</a></li>
              <li><a href="#" class="nav__link">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <section class="hero">
          <h1 class="hero__title">Responsive Design Mastery</h1>
          <p class="hero__subtitle">Learn to build websites that look great on any device.</p>
          <a href="#" class="btn">Start Learning</a>
        </section>

        <section class="posts">
          <h2 class="section-title">Latest Articles</h2>
          <div class="posts__grid">
            <article class="post-card">
              <div class="post-card__image"></div>
              <div class="post-card__body">
                <span class="post-card__tag">CSS</span>
                <h3 class="post-card__title">Understanding Flexbox</h3>
                <p class="post-card__excerpt">A deep dive into CSS Flexbox layout module and how to use it effectively.</p>
                <a href="#" class="post-card__link">Read more →</a>
              </div>
            </article>

            <article class="post-card">
              <div class="post-card__image"></div>
              <div class="post-card__body">
                <span class="post-card__tag">JavaScript</span>
                <h3 class="post-card__title">Async/Await Explained</h3>
                <p class="post-card__excerpt">Master asynchronous JavaScript with practical async/await examples.</p>
                <a href="#" class="post-card__link">Read more →</a>
              </div>
            </article>

            <article class="post-card">
              <div class="post-card__image"></div>
              <div class="post-card__body">
                <span class="post-card__tag">React</span>
                <h3 class="post-card__title">React Hooks Deep Dive</h3>
                <p class="post-card__excerpt">Everything you need to know about React Hooks in 2024.</p>
                <a href="#" class="post-card__link">Read more →</a>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a href="/" class="logo">DevBlog</a>
            <p>Quality web development content.</p>
          </div>
          <div class="footer__links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Articles</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>
          <div class="footer__newsletter">
            <h4>Newsletter</h4>
            <p>Get articles delivered to your inbox.</p>
            <input type="email" placeholder="your@email.com" />
            <button>Subscribe</button>
          </div>
        </div>
        <p class="footer__copy">&copy; 2024 DevBlog. All rights reserved.</p>
      </div>
    </footer>
  </body>
</html>
```

```css
/* lab-01-mobile-first/style-desktop-first.css — BEFORE (desktop-first) */
/* YOUR JOB: Convert this to mobile-first in a new file called style.css */

/* === GLOBAL RESET === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f8f9fa;
  color: #212529;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* === HEADER — desktop base === */
.header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
  text-decoration: none;
}

.nav__list {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav__link {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
}

/* Hide nav on tablet */
@media (max-width: 768px) {
  .nav {
    display: none; /* hide nav on tablet and below */
  }
}

/* === HERO — desktop base === */
.hero {
  text-align: center;
  padding: 6rem 0;
}

.hero__title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-size: 1.25rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

/* Shrink hero on mobile */
@media (max-width: 768px) {
  .hero {
    padding: 3rem 0;
  }

  .hero__title {
    font-size: 2rem;
  }

  .hero__subtitle {
    font-size: 1rem;
  }
}

.btn {
  display: inline-block;
  background: #4f46e5;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.btn:hover {
  background: #4338ca;
}

/* === POSTS GRID — desktop: 3 columns === */
.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.posts__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns on desktop */
  gap: 1.5rem;
  margin-bottom: 4rem;
}

/* Collapse to 2 columns on tablet */
@media (max-width: 1024px) {
  .posts__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Collapse to 1 column on mobile */
@media (max-width: 768px) {
  .posts__grid {
    grid-template-columns: 1fr;
  }
}

/* === POST CARD === */
.post-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.post-card__image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.post-card__body {
  padding: 1.5rem;
}

.post-card__tag {
  display: inline-block;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.post-card__title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.post-card__excerpt {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-card__link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

/* === FOOTER — desktop: 3 columns === */
.footer {
  background: #1a1a2e;
  color: #adb5bd;
  padding: 3rem 0 1rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr; /* desktop: asymmetric 3-col */
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Collapse to 1 column on mobile */
@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}

.footer__brand .logo {
  color: #6c63ff;
  font-size: 1.25rem;
}

.footer__links h4,
.footer__newsletter h4 {
  color: white;
  margin-bottom: 1rem;
}

.footer__links ul {
  list-style: none;
}

.footer__links a {
  color: #adb5bd;
  text-decoration: none;
}

.footer__newsletter input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 0.25rem;
  background: #2a2a3e;
  color: white;
  margin-bottom: 0.5rem;
}

.footer__newsletter button {
  background: #6c63ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.footer__copy {
  border-top: 1px solid #333;
  padding-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}
```

### Lab Instructions — Step by Step

**Step 1: Create your new `style.css` file**

Copy the CSS above to `style-desktop-first.css` for reference. Create a new empty `style.css` that your HTML file links to.

**Step 2: Write the global reset and base styles** (same in both approaches)

Copy the reset, body, and container styles as-is — these don't change between approaches.

**Step 3: Identify the base styles**

In the desktop-first file, find each component's base styles (the ones outside any `@media` block). These are currently the *desktop* styles. In mobile-first, these become your *mobile* styles.

For each component, ask: *"What does this look like on a small phone?"*
- Nav: hidden (hamburger pattern)
- Hero: smaller padding, smaller font
- Posts grid: 1 column
- Footer grid: 1 column

**Step 4: Write the mobile base, then add `min-width` queries**

For each component:
1. Write the mobile version as the base (no media query)
2. Add `@media (min-width: 768px)` for tablet changes
3. Add `@media (min-width: 1024px)` for desktop changes

**Step 5: Verify**

Open your page in Chrome. Open DevTools (F12). Click the "Toggle device toolbar" icon (Ctrl+Shift+M). Test at 375px, 768px, and 1280px. Both versions should look identical.

### Hints

> [!TIP]
> The easiest way to convert: for every `@media (max-width: X)` block you see, that block's content becomes the *base styles* (no media query) in mobile-first. Then the content *outside* the old media query block becomes an `@media (min-width: X+1)` block.

**Checking your work:**
- At 375px: nav hidden, hero has 3rem padding and 2rem title, 1-column grid, 1-column footer
- At 768px: nav visible as flex row, hero has 6rem padding and 3.5rem title, 2-column grid
- At 1024px: 3-column post grid, 3-column footer

---

## Lab 2: Container Query Responsive Card

### Overview

**Duration:** 30 minutes  
**Goal:** Build a single card component that adapts its layout based on the width of its *container*, not the viewport. Then place it in two different layout contexts to see the difference.

### What You'll Build

```
SIDEBAR CONTEXT (container = 280px):
┌──────────────────────┐
│  [image - full width]│
│  ─────────────────── │
│  [Tag]               │
│  Card Title Here     │
│  Short description   │
│  Read more →         │
└──────────────────────┘

MAIN CONTENT CONTEXT (container = 700px):
┌──────────────────────────────────────────────┐
│  [image 240px]  │  [Tag]                      │
│                 │  Card Title Here             │
│                 │  Short description goes here │
│                 │  Read more →                │
└──────────────────────────────────────────────┘
```

### Starter HTML

```html
<!-- lab-02-container-query/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Container Query Card Lab</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>

    <div class="page">

      <!-- SIDEBAR: narrow context for the card -->
      <aside class="sidebar">
        <h2 class="section-label">Sidebar (narrow container)</h2>
        <div class="card-container">  <!-- This is the @container element -->
          <article class="card">
            <div class="card__image"></div>
            <div class="card__body">
              <span class="card__tag">Featured</span>
              <h3 class="card__title">Container Queries in CSS</h3>
              <p class="card__excerpt">Learn how container queries make components truly reusable across any layout context.</p>
              <a href="#" class="card__link">Read more →</a>
            </div>
          </article>
        </div>
      </aside>

      <!-- MAIN CONTENT: wide context for the same card -->
      <main class="main-content">
        <h2 class="section-label">Main Content (wide container)</h2>
        <div class="card-container">  <!-- Same container class, different available width -->
          <article class="card">
            <div class="card__image"></div>
            <div class="card__body">
              <span class="card__tag">Featured</span>
              <h3 class="card__title">Container Queries in CSS</h3>
              <p class="card__excerpt">Learn how container queries make components truly reusable across any layout context.</p>
              <a href="#" class="card__link">Read more →</a>
            </div>
          </article>
        </div>
      </main>

    </div>

  </body>
</html>
```

### Your Task: Write the CSS

Create `style.css` and implement the following step by step:

**Step 1: Page layout CSS**

```css
/* style.css */

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f0f2f5;
  color: #212529;
  min-height: 100vh;
  padding: 2rem;
}

/* Two-column page layout: sidebar + main */
.page {
  display: grid;
  grid-template-columns: 280px 1fr;  /* fixed sidebar, flexible main */
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}
```

**Step 2: Declare the container**

```css
/* IMPORTANT: This is what enables container queries for the .card inside */
.card-container {
  container-type: inline-size;  /* respond to this element's width */
  container-name: card;         /* named so we can target it specifically */
}
```

**Step 3: Card base styles (vertical / narrow layout)**

```css
/* Vertical layout — default for narrow containers */
.card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.card__image {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.card__body {
  padding: 1.25rem;
}

.card__tag {
  display: inline-block;
  background: #f0eeff;
  color: #6c63ff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card__excerpt {
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card__link {
  color: #6c63ff;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
}

.card__link:hover {
  text-decoration: underline;
}
```

**Step 4: Container query — horizontal layout at 350px+**

```css
/* When the card-container is at least 350px wide, switch to horizontal layout */
@container card (min-width: 350px) {

  .card {
    display: flex;          /* switch from block to flex row */
    flex-direction: row;
    align-items: stretch;
  }

  .card__image {
    width: 200px;           /* fixed width sidebar image */
    height: auto;           /* height fills the flex container */
    flex-shrink: 0;         /* never compress the image */
  }

  .card__body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center; /* vertically center the content */
  }

  .card__title {
    font-size: 1.25rem;
  }
}
```

**Step 5: Container query — larger at 550px+**

```css
@container card (min-width: 550px) {
  .card__image {
    width: 260px;            /* wider image for wider containers */
  }

  .card__body {
    padding: 2rem;
  }

  .card__title {
    font-size: 1.5rem;       /* bigger title in wide containers */
  }

  .card__excerpt {
    font-size: 1rem;         /* slightly larger excerpt text */
  }
}
```

### Testing Your Work

1. Open the page in Chrome
2. The sidebar card should be **vertical** (narrow container = 280px)
3. The main content card should be **horizontal** (wide container ≈ 700px+)
4. Now resize the browser window — notice both cards respond to their *container's* width, not the viewport

**Bonus Challenge:** Add a button to the page that toggles the `.sidebar` between `280px` and `500px` width. Watch the sidebar card switch from vertical to horizontal layout as its container grows.

---

## Assignment: Portfolio Project Part 7

### Overview

**Assignment:** Make your portfolio website fully responsive using all the techniques from this lecture.

**Due:** End of next week  
**Submission:** GitHub repository link + deployed URL (Netlify or GitHub Pages)

---

### Requirements Checklist

#### ✅ Requirement 1: Viewport Meta Tag

**What to do:** Verify the viewport meta tag is in every HTML file.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Hint:** If you're using a build tool or framework, check the `index.html` at the root. Some tools add this automatically; others don't. Test without it in DevTools to see what happens — it's educational!

---

#### ✅ Requirement 2: Mobile-First CSS

**What to do:** All stylesheets must be written mobile-first. Review every component — if you find `max-width` media queries, convert them.

**Hint:** Open DevTools, set to 375px width, and screenshot your site. It should look great at this size without any media queries firing. That's your baseline.

**Minimum breakpoints to implement:**
- Mobile base: no query
- Tablet: `@media (min-width: 768px)`
- Desktop: `@media (min-width: 1024px)`

---

#### ✅ Requirement 3: Responsive Navigation

**What to do:** Implement a hamburger menu for mobile with a full navigation bar for tablet and above.

**Requirements:**
- Hamburger button visible on mobile, hidden on desktop
- Nav links hidden on mobile (displayed when hamburger is clicked), shown as a row on desktop
- The toggle must use JavaScript and `aria-expanded` for accessibility

**Hint:**
```js
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open'); // toggle class
  toggle.setAttribute('aria-expanded', isOpen);    // update ARIA for screen readers
});
```

---

#### ✅ Requirement 4: Responsive Hero Section

**What to do:** Your hero section must scale smoothly using `clamp()` for typography and `svh` for height.

**Requirements:**
- Main headline must use `clamp()` with at least 3rem minimum and 5rem maximum
- Hero section height uses `min-height: 100svh` (with `100vh` fallback)
- Sub-headline also uses `clamp()`

**Hint:**
```css
.hero {
  min-height: 100vh;     /* fallback */
  min-height: 100svh;    /* modern browsers */
}

.hero__title {
  font-size: clamp(2.5rem, 5vw + 1rem, 5rem);
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
}
```

---

#### ✅ Requirement 5: Responsive Projects Grid

**What to do:** Your projects/portfolio grid must respond to the screen size.

**Requirements:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Cards must use container queries — not just media queries — to handle their internal layout

**Hint for container queries:**
```css
.project-wrapper {
  container-type: inline-size;
  container-name: project-card;
}

@container project-card (min-width: 400px) {
  /* Horizontal card layout */
}
```

---

#### ✅ Requirement 6: Responsive Images

**What to do:** Your profile photo and at least one project screenshot must use `srcset` and `sizes`.

**Requirements:**
- Provide at least 2 sizes (e.g., `400w` and `800w`)
- Include appropriate `sizes` attribute
- Add `loading="lazy"` to below-the-fold images
- Add `width` and `height` attributes to all images to prevent layout shift

**Hint — generating multiple sizes:**
If you don't have image editing software, use [Squoosh](https://squoosh.app/) (free, browser-based) to export your images at multiple sizes.

```html
<img
  src="profile-400.jpg"
  srcset="profile-400.jpg 400w, profile-800.jpg 800w"
  sizes="(max-width: 768px) 100vw, 400px"
  alt="Your Name — Web Developer"
  width="400"
  height="400"
/>
```

---

#### ✅ Requirement 7: Dark Mode Support

**What to do:** Implement dark mode that responds to the system preference AND includes a manual toggle button.

**Requirements:**
- All colors must be defined as CSS custom properties
- `@media (prefers-color-scheme: dark)` must redefine the color palette
- A dark mode toggle button must be visible in the header
- The toggle preference must be saved to `localStorage`

---

#### ✅ Requirement 8: Reduced Motion Support

**What to do:** Any animations you have must respect `prefers-reduced-motion`.

**Requirements:**
- At minimum, wrap all `animation` and complex `transition` declarations in a `@media (prefers-reduced-motion: no-preference)` block, OR
- Add a `@media (prefers-reduced-motion: reduce)` block that disables/simplifies animations

---

#### ✅ Requirement 9: Print Stylesheet

**What to do:** Add a print stylesheet that makes your portfolio look professional when printed or saved as PDF (great for employers).

**Requirements:**
- Hide navigation, hero section, and footer from print
- Set font-size to 12pt for print
- Ensure text is black on white
- Show full URLs for links

**Hint:**
```css
@media print {
  .header, .footer, .hero__cta, .hamburger {
    display: none; /* remove interactive/decorative elements */
  }

  body {
    font-size: 12pt;
    color: black;
    background: white;
  }

  /* Show URLs next to links in print */
  a::after {
    content: " (" attr(href) ")"; /* prints the href after the link text */
    font-size: 0.8em;
    color: #555;
  }
}
```

---

#### ✅ Requirement 10: Testing and Documentation

**What to do:** Test your portfolio and document your responsive strategy.

**Testing requirements:**
- Screenshot at 375px, 768px, 1280px (include screenshots in your README)
- Test in at least 2 browsers (Chrome + Firefox or Safari)
- Test with the browser DevTools device emulator

**Documentation:** Add a `RESPONSIVE.md` file to your repo with:
1. Your chosen breakpoints and why
2. Which components use container queries vs media queries
3. Screenshot gallery at different sizes

---

## Resources

### Official Documentation
- [MDN: Responsive Web Design Basics](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [MDN: clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [CSS Tricks: Complete Guide to CSS Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)

### Tools
- [Clamp Calculator (font-size.app)](https://clamp.font-size.app/) — Generate precise `clamp()` values
- [Responsivebreakpoints.com](https://www.responsivebreakpoints.com/) — Generate responsive image breakpoints
- [Squoosh](https://squoosh.app/) — Free browser-based image optimization and resizing
- [Can I Use](https://caniuse.com/) — Check browser support for any CSS/HTML feature

### Further Reading
- Ethan Marcotte's original [Responsive Web Design article (2010)](https://alistapart.com/article/responsive-web-design/) — still worth reading
- [Every Layout](https://every-layout.dev/) — Intrinsic responsive layout patterns
- [Ahmad Shadeed's Container Queries Deep Dive](https://ishadeed.com/article/container-queries-are-finally-here/)
- [The Large, Small, and Dynamic Viewports (web.dev)](https://web.dev/blog/viewport-units)
- [prefers-reduced-motion: Taking a No-Motion-First Approach](https://www.tatianamac.com/posts/prefers-reduced-motion/)

---

## Key Takeaways

1. **The viewport meta tag** is mandatory. Every HTML file needs `<meta name="viewport" content="width=device-width, initial-scale=1.0">`. Without it, mobile browsers zoom out to 980px and make your responsive CSS useless.

2. **Mobile-First is standard**. Write base styles for mobile (smallest screen), then enhance with `min-width` media queries for larger screens. This approach produces leaner code and aligns with Google's indexing.

3. **CSS pixels ≠ physical pixels** on high-DPI screens. Raster images need 2x/3x versions for Retina; SVG and CSS are always crisp. Use `srcset` with width descriptors to serve the right image file.

4. **Media queries are for pages; container queries are for components**. Use `@media` for macro layout decisions (sidebar vs. main, number of grid columns). Use `@container` for reusable components that appear in different layout contexts.

5. **`clamp()` is the modern way to do fluid typography**. No more multiple breakpoints just to change font-size — one `clamp()` declaration scales smoothly across all screen widths.

6. **`100vh` is broken on mobile**. Use `100svh` (with `100vh` fallback) for elements that must always be fully visible. Use `100dvh` for modals/overlays that should fill the current visible space.

7. **Respect user preferences**. `prefers-color-scheme` for dark mode and `prefers-reduced-motion` for animation sensitivity are accessibility features, not optional extras.

8. **Always test on real devices (or DevTools emulation)** at 375px, 768px, and 1280px minimum. What looks fine in your code often surprises you in the browser.

---

## Common Mistakes & How to Avoid Them

| # | Mistake | Why It's a Problem | How to Fix It |
|---|---|---|---|
| 1 | **Missing viewport meta tag** | Mobile browsers render at 980px fake width; responsive CSS is ignored | Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to every HTML `<head>` |
| 2 | **Using `user-scalable=no`** | Prevents visually impaired users from zooming; WCAG violation | Remove it entirely — browsers largely ignore it anyway |
| 3 | **Mixing mobile-first and desktop-first** | `min-width` and `max-width` queries conflict, creating unpredictable behavior | Pick one approach per project and stick to it |
| 4 | **Hardcoded pixel widths in layout** | `width: 960px` breaks on devices narrower than 960px | Use `max-width` with `width: 100%`, or use `%`, `fr`, or `clamp()` |
| 5 | **`height: 100vh` on mobile** | Address bar causes overflow and content cutoff on first load | Use `min-height: 100svh` (with `100vh` fallback) |
| 6 | **Serving huge images to mobile** | Wastes user bandwidth; slows page load on cellular connections | Use `srcset` and `sizes` to serve appropriately sized images |
| 7 | **No `alt` text on images** | Screen readers can't describe the image; SEO impact; WCAG failure | Every `<img>` needs descriptive `alt` text (empty `alt=""` for decorative images) |
| 8 | **Forgetting `width`/`height` on `<img>`** | Browser can't reserve space → layout shift (bad CLS score) | Always add `width` and `height` attributes matching the image's natural dimensions |
| 9 | **Using container queries without a container declaration** | `@container` queries silently do nothing if no ancestor has `container-type` set | Add `container-type: inline-size` to the direct parent or an appropriate ancestor |
| 10 | **Setting `container-type` on the wrong element** | Setting it on the card itself instead of its wrapper causes size containment issues | Set `container-type` on the *wrapper/parent* of the component you're querying |
| 11 | **Ignoring `prefers-reduced-motion`** | Can cause physical discomfort or seizures in users with vestibular disorders | Wrap all animations in `@media (prefers-reduced-motion: no-preference)` or add a `reduce` override block |
| 12 | **Designing dark mode with inverted colors only** | Pure white on pure black causes eye strain; colors that look good in light can become harsh in dark | Design dark mode explicitly — use `#e8e8e8` not `#ffffff` for text; tweak all accent colors for dark backgrounds |
| 13 | **Testing only in desktop Chrome** | Your site may look broken in Firefox, Safari, or on actual phones | Test in multiple browsers AND use Chrome DevTools device emulation at 375px width |
| 14 | **Only using breakpoints for layout; forgetting font and spacing** | Text stays the same size on phone and 4K monitor — poor reading experience | Apply `clamp()` to font-size, padding, gap, and other spacing properties |
| 15 | **Not providing `sizes` attribute with `srcset`** | Browser assumes the image is 100vw wide → may download images much larger than needed | Always pair `srcset` with a `sizes` attribute describing the display width at each breakpoint |
