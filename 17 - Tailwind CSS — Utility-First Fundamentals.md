# Lecture 17 — Tailwind CSS v4: Utility-First Fundamentals

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Explain the utility-first CSS philosophy and its advantages over component-first frameworks
- Compare Bootstrap 5 vs Tailwind CSS v4 and choose the right tool
- Install and configure Tailwind CSS v4 in a Vite project
- Use core utilities for spacing, colours, typography, and sizing
- Build Flexbox and Grid layouts using Tailwind utility classes
- Apply responsive breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Style interactive states with variants (`hover:`, `focus:`, `active:`)
- Customise the Tailwind v4 theme directly in CSS using the `@theme` directive

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Utility-First Philosophy — what it means and why it works
2. Bootstrap vs Tailwind: a side-by-side comparison
3. Tailwind v4 Architecture — the new CSS-only engine
4. Setting up Tailwind v4 with Vite
5. Core Design Tokens: spacing, colours, typography, sizing
6. Layout with Flexbox and Grid utilities
7. Responsive Breakpoints and mobile-first logic
8. State Variants: hover, focus, active, group-hover
9. Customisation with `@theme`

### Part 2 — Practice & Lab (~90-120 min)
1. Rebuild a Bootstrap card using only Tailwind utilities
2. Build a responsive image gallery
3. StartupLaunch Project Part 3: Tailwind Migration & Pricing

---

## 1. Utility-First Philosophy

### What Does "Utility-First" Mean? (Plain English)

**Traditional CSS (Semantic approach):**
You write `.button-primary`, `.card-header`, `.hero-section` and style them in a separate CSS file. The HTML has short class names; all the styling logic lives elsewhere.

**Utility-First CSS:**
You style elements **directly in the HTML** using small, single-purpose classes. No CSS file growing to thousands of lines. No naming things. Each class does exactly one thing.

```
Traditional CSS:                 Utility-First CSS:
────────────────────             ──────────────────────────────────────
HTML: <div class="card">        HTML: <div class="bg-white rounded-lg
                                            shadow-md p-6 border
CSS:  .card {                               border-gray-200">
        background: white;
        border-radius: 8px;
        box-shadow: ...;
        padding: 1.5rem;
        border: 1px solid #e5e7eb;
      }
```

With utility-first CSS, you read the class names and **immediately know exactly what the element looks like** — no jumping to a CSS file to understand the styles.

### Why Does Utility-First Work?

1. **No naming problems** — You never agonise over ".card-wrapper, .content-box, or .article-container?"
2. **No specificity wars** — All utilities have the same specificity, no weird overrides
3. **No dead CSS** — Tailwind v4 generates ONLY the CSS you actually use
4. **Predictable changes** — Changing a class on one element only affects that element
5. **No context switching** — Style while you write markup, fewer files open

### The One Trade-Off: Verbose HTML

The trade-off is that HTML class attributes get long:

```html
<button class="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg
               hover:bg-blue-700 transition duration-200 focus:outline-none
               focus:ring-2 focus:ring-blue-400">
  Click Me
</button>
```

Solutions: accept it (most teams do), use `@apply` for repeated patterns (Lecture 18), or use component frameworks for reuse.

> [!NOTE]
> The verbosity is actually a **feature** for maintainability. When you delete an element, its styles go with it. With traditional CSS, you accumulate orphaned styles that nobody dares delete.

### 📌 Section Recap
- Utility-first means composing designs from single-purpose classes applied directly in HTML
- Benefits: no naming, no dead code, predictable changes, tiny CSS output
- Trade-off: verbose HTML (mitigated by `@apply` or component frameworks)

---

## 2. Bootstrap vs Tailwind CSS: Side-by-Side Comparison

| Aspect | Bootstrap 5 | Tailwind CSS v4 |
|--------|-------------|-----------------|
| **Approach** | Component-first | Utility-first |
| **What you get** | Ready-made UI components | Low-level building blocks |
| **JS included?** | Yes (modals, dropdowns) | No — bring your own |
| **Design opinion** | High (Bootstrap aesthetic) | Low (blank canvas) |
| **CSS size** | Moderate | Tiny (only used classes) |
| **Learning curve** | Shallow | Moderate |
| **Customisation** | Harder (Sass variables) | Very easy (`@theme`) |
| **Best for** | Admin panels, quick prototypes | Unique designs, marketing sites |

### Same Card, Two Approaches

**Bootstrap:**
```html
<div class="card shadow-sm">
  <div class="card-body">
    <h5 class="card-title">Product</h5>
    <p class="card-text text-muted">Description</p>
    <button class="btn btn-primary">Buy Now</button>
  </div>
</div>
```

**Tailwind:**
```html
<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <h5 class="text-lg font-semibold text-gray-900">Product</h5>
  <p class="text-gray-500 mt-1">Description</p>
  <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg
                 hover:bg-blue-700 transition">
    Buy Now
  </button>
</div>
```

Bootstrap's `.card` gives you a specific look. Tailwind lets you build ANY design.

**Choose Bootstrap when:** Quick prototype, team already knows Bootstrap, need built-in JS components, design originality is not a priority.

**Choose Tailwind when:** Unique design, maximum control, using a JS framework, performance matters.

---

## 3. Tailwind CSS v4 Architecture

### The Revolution: CSS-Only Engine

Tailwind v4 is a complete rewrite. **`tailwind.config.js` is gone entirely.** All configuration moves into CSS:

```
Tailwind v3:                         Tailwind v4:
────────────────────────             ────────────────────────────────────
tailwind.config.js:                  style.css (your CSS file):
  content: ['./src/**/*.html'],        @import "tailwindcss";
  theme: {                             @theme {
    extend: {                            --color-brand-500: #ff0000;
      colors: { brand: '#ff0000' }       --font-display: 'Outfit', sans-serif;
    }                                  }
  }
```

This makes Tailwind feel like "just CSS." You configure it using CSS syntax, not a JavaScript object.

### How Tailwind v4 Generates CSS

```
Your HTML/JS files (scanned as plain text)
              ↓
Tailwind v4 Parser (Rust-based, very fast)
              ↓
Detects every class name used
              ↓
Generates ONLY the CSS for those classes
              ↓
Output: Tiny CSS file (typically < 10kb for a full app!)
```

> [!NOTE]
> Tailwind v4's Rust-based engine is dramatically faster than v3. Full builds that took 3-4 seconds take under 100ms in v4.

---

## 4. Setting Up Tailwind CSS v4 with Vite

### Step-by-Step Installation

```bash
# Step 1: Create a new Vite project
npm create vite@latest my-tailwind-project -- --template vanilla
cd my-tailwind-project

# Step 2: Install Tailwind v4 and the Vite plugin
npm install -D tailwindcss @tailwindcss/vite
```

```js
// Step 3: vite.config.js — Add the Tailwind plugin
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(), // This one line does everything
  ],
});
```

```css
/* Step 4: style.css — One import is all you need */
@import "tailwindcss";
```

```html
<!-- Step 5: index.html — Link your CSS -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tailwind App</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body class="bg-gray-50 text-gray-900">
  <h1 class="text-3xl font-bold text-center mt-12">Hello Tailwind v4!</h1>
</body>
</html>
```

```bash
# Step 6: Start the dev server
npm run dev
```

> [!TIP]
> Install the **Tailwind CSS IntelliSense** extension for VS Code. It gives autocomplete for class names, shows generated CSS on hover, and highlights errors. This dramatically speeds up Tailwind development.

### 📌 Section Recap
- Install: `npm install -D tailwindcss @tailwindcss/vite`
- Configure: add `tailwindcss()` plugin to `vite.config.js`
- Import: `@import "tailwindcss"` in your CSS — no other setup needed
- No `tailwind.config.js` file needed in v4

---

## 5. Core Utilities: Spacing, Colors, Typography, Sizing

### 5.1 The Spacing Scale

Tailwind uses a numeric spacing scale. Each unit = **0.25rem (4px)**.

```
Scale:  0=0px  1=4px  2=8px  3=12px  4=16px  5=20px  6=24px
        8=32px  10=40px  12=48px  16=64px  20=80px  24=96px
```

```html
<!-- PADDING: p-{size}, px-{size}, py-{size}, pt/pb/pl/pr-{size} -->
<div class="p-4">16px padding all sides</div>
<div class="px-6 py-3">24px horizontal, 12px vertical</div>
<div class="pt-8 pb-4">Top 32px, bottom 16px</div>
<div class="ps-6 pe-4">Start/end (RTL-aware)</div>

<!-- MARGIN: m-{size}, mx-{size}, my-{size}, mt/mb/ml/mr-{size} -->
<div class="m-4">16px margin all sides</div>
<div class="mx-auto">Auto horizontal (center a block element)</div>
<div class="mt-8 mb-4">Top 32px, bottom 16px</div>
<div class="-mt-4">Negative margin (-16px top)</div>

<!-- GAP: for flex/grid containers -->
<div class="flex gap-4">16px gap between all items</div>
<div class="grid gap-x-6 gap-y-4">Separate horizontal/vertical gaps</div>
```

> [!NOTE]
> Arbitrary values can be specified with square brackets: `p-[14px]`, `m-[1.75rem]`. Use this as an escape hatch for values not in the scale.

### 5.2 Colors

Tailwind has a rich built-in palette. Each color has 11 shades from 50 (lightest) to 950 (darkest).

```
Color families: red, orange, amber, yellow, lime, green, emerald, teal,
                cyan, sky, blue, indigo, violet, purple, fuchsia, pink,
                rose, slate, gray, zinc, neutral, stone

Shade scale: 50  100  200  300  400  500  600  700  800  900  950
              ↑ lightest                                    darkest ↑
```

```html
<!-- Background colors: bg-{color}-{shade} -->
<div class="bg-blue-500">Medium blue</div>
<div class="bg-blue-100">Very light blue (good for hover backgrounds)</div>
<div class="bg-gray-900">Very dark gray (dark mode backgrounds)</div>
<div class="bg-white">White</div>
<div class="bg-transparent">No background</div>

<!-- Text colors: text-{color}-{shade} -->
<p class="text-gray-900">Dark text (for body)</p>
<p class="text-gray-500">Muted/secondary text</p>
<p class="text-blue-600">Blue text (links, emphasis)</p>
<p class="text-white">White text (on dark backgrounds)</p>

<!-- Border colors: border-{color}-{shade} -->
<div class="border border-gray-200">Light gray border</div>
<div class="border-2 border-blue-500">Thicker blue border</div>

<!-- Opacity modifier: {utility}/{opacity} -->
<div class="bg-blue-500/50">Blue at 50% opacity</div>
<p class="text-gray-900/75">Text at 75% opacity</p>
```

**Rule of thumb:**
- Use shade **600+** for text on white backgrounds (enough contrast)
- Use shade **100-200** for subtle backgrounds and hover states
- Use shade **500** for primary buttons and action elements

### 5.3 Typography

```html
<!-- FONT SIZE: text-{size} -->
<p class="text-xs">Extra small (12px)</p>
<p class="text-sm">Small (14px)</p>
<p class="text-base">Base (16px) — default</p>
<p class="text-lg">Large (18px)</p>
<p class="text-xl">XL (20px)</p>
<p class="text-2xl">2XL (24px)</p>
<p class="text-3xl">3XL (30px)</p>
<p class="text-4xl">4XL (36px)</p>
<p class="text-5xl">5XL (48px)</p>
<p class="text-6xl">6XL (60px)</p>

<!-- FONT WEIGHT: font-{weight} -->
<p class="font-thin">Thin (100)</p>
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
<p class="font-extrabold">Extrabold (800)</p>
<p class="font-black">Black (900)</p>

<!-- ALIGNMENT, LINE HEIGHT, TRACKING -->
<p class="text-center leading-relaxed tracking-wide">
  Center aligned, relaxed line height, wide letter spacing
</p>

<!-- FONT FAMILY -->
<p class="font-sans">System sans-serif</p>
<p class="font-serif">Serif</p>
<p class="font-mono">Monospace (code)</p>

<!-- TEXT TRANSFORM -->
<p class="uppercase">ALL CAPS</p>
<p class="capitalize">First Letter Each Word</p>
<p class="lowercase">all lowercase</p>

<!-- OVERFLOW AND TRUNCATION -->
<p class="truncate max-w-xs">Long text that gets cut with ellipsis...</p>
<p class="line-clamp-3">Text clamped to 3 lines with ellipsis...</p>
```

### 5.4 Sizing

```html
<!-- WIDTH: w-{value} -->
<div class="w-1/2">50% width</div>
<div class="w-1/3">33.33% width</div>
<div class="w-full">100% width</div>
<div class="w-screen">100vw</div>
<div class="w-auto">Auto (shrink to content)</div>
<div class="w-64">16rem (256px) fixed</div>
<div class="max-w-2xl">Max width: 42rem (672px)</div>
<div class="max-w-7xl">Max width: 80rem (1280px) — common page container</div>

<!-- HEIGHT: h-{value} -->
<div class="h-16">64px fixed</div>
<div class="h-full">100% of parent</div>
<div class="h-screen">100vh</div>
<div class="min-h-screen">min-height: 100vh</div>
<div class="h-[400px]">Arbitrary: exactly 400px</div>
```

### Common Mistakes — Core Utilities

**Mistake 1: Dynamic class name construction**
```js
// Tailwind scans for full class names as text strings
const color = 'blue';

// Bad: Tailwind never sees "bg-blue-500"
el.className = `bg-${color}-500`;

// Good: full class name present in source
const colorMap = { blue: 'bg-blue-500', red: 'bg-red-500' };
el.className = colorMap[color]; // "bg-blue-500" — Tailwind detects it
```

**Mistake 2: Not enough contrast for text**
```html
<!-- Unreadable on white background -->
<p class="text-blue-200">Too light for white bg</p>

<!-- Use 600+ for text on white -->
<p class="text-blue-600">Readable blue</p>
```

### 📌 Section Recap
- Spacing scale: 1 unit = 4px; `p-4` = 16px, `m-8` = 32px, `gap-6` = 24px
- Colors: `{property}-{color}-{shade}` — 600+ for text, 100-200 for backgrounds
- Typography: `text-{size}`, `font-{weight}`, `leading-{value}`, `tracking-{value}`
- Sizing: fractions (`w-1/2`), scale units (`w-64`), screen (`w-screen`), arbitrary (`w-[350px]`)

---

## 6. Layout Utilities: Flexbox and CSS Grid

### 6.1 Flexbox

```html
<!-- ENABLE FLEX -->
<div class="flex">Horizontal (row, default)</div>
<div class="flex flex-col">Vertical (column)</div>

<!-- DIRECTION -->
<div class="flex flex-row">Left to right (default)</div>
<div class="flex flex-col">Top to bottom</div>
<div class="flex flex-row-reverse">Right to left</div>
<div class="flex flex-col-reverse">Bottom to top</div>

<!-- JUSTIFY-CONTENT (main axis) -->
<div class="flex justify-start">Pack to start</div>
<div class="flex justify-end">Pack to end</div>
<div class="flex justify-center">Center items</div>
<div class="flex justify-between">Space between (no edge gaps)</div>
<div class="flex justify-around">Space around (half gaps at edges)</div>
<div class="flex justify-evenly">Equal space everywhere</div>

<!-- ALIGN-ITEMS (cross axis) -->
<div class="flex items-start">Align to top</div>
<div class="flex items-center">Align to center (vertical centering!)</div>
<div class="flex items-end">Align to bottom</div>
<div class="flex items-stretch">Stretch to fill height (default)</div>
<div class="flex items-baseline">Align by text baseline</div>

<!-- FLEX WRAP -->
<div class="flex flex-wrap">Wrap to next line when needed</div>
<div class="flex flex-nowrap">Never wrap</div>

<!-- GAP -->
<div class="flex gap-4">16px between all items</div>
<div class="flex gap-x-6 gap-y-2">Different horizontal/vertical gaps</div>

<!-- FLEX ITEM PROPERTIES -->
<div class="flex">
  <div class="flex-1">Grows to fill space (flex: 1 1 0%)</div>
  <div class="flex-none">Doesn't grow or shrink</div>
  <div class="grow">Grows but doesn't shrink</div>
  <div class="shrink">Shrinks but doesn't grow</div>
</div>

<!-- Push items to opposite ends using ml-auto -->
<div class="flex items-center">
  <span class="font-bold">Logo</span>
  <div class="ml-auto flex gap-4"> <!-- ml-auto pushes to right -->
    <a href="#">Login</a>
    <a href="#">Sign Up</a>
  </div>
</div>

<!-- Perfectly center a child both ways -->
<div class="flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-xl shadow-lg">Centered!</div>
</div>
```

### 6.2 CSS Grid

```html
<!-- BASIC GRID: grid-cols-{n} for equal columns -->
<div class="grid grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4 — auto wraps to next row</div>
</div>

<!-- RESPONSIVE GRID: change columns at breakpoints -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- 1 col mobile, 2 tablet, 3 laptop, 4 desktop -->
</div>

<!-- COLUMN SPAN: item spans multiple columns -->
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2">Spans 2 columns</div>
  <div>1 column</div>
  <div class="col-span-3">Full width (all 3)</div>
</div>

<!-- ROW SPAN: item spans multiple rows -->
<div class="grid grid-cols-3 grid-rows-3 gap-4">
  <div class="row-span-2">Tall sidebar item</div>
  <div>Normal</div>
  <div>Normal</div>
  <div>Normal</div>
  <div>Normal</div>
</div>

<!-- Real-world: Blog/product grid -->
<section class="max-w-7xl mx-auto px-4 py-12">
  <h2 class="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <img src="thumbnail.jpg" alt="Article" class="w-full h-48 object-cover">
      <div class="p-6">
        <span class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Technology</span>
        <h3 class="text-xl font-bold text-gray-900 mt-2 mb-3">Article Title</h3>
        <p class="text-gray-500 text-sm leading-relaxed">Brief description...</p>
        <div class="mt-6 flex items-center gap-3">
          <img src="avatar.jpg" alt="Author" class="w-8 h-8 rounded-full object-cover">
          <div>
            <p class="text-sm font-medium text-gray-900">Author Name</p>
            <p class="text-xs text-gray-400">June 1, 2025 · 5 min read</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</section>
```

### 📌 Section Recap
- `flex`, `flex-col`, `justify-{value}`, `items-{value}`, `gap-{size}`
- `ml-auto` pushes a flex item to the right end
- `flex items-center justify-center min-h-screen` = full-screen centering
- `grid grid-cols-{n}` = equal columns; `col-span-{n}` = span multiple columns
- Responsive grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 7. Responsive Breakpoints

### Mobile-First Approach

Tailwind is **mobile-first**. Without any prefix, a class applies to ALL screen sizes. Prefixes apply at that breakpoint and wider.

```
No prefix → All sizes (including mobile)
sm:       → >= 640px and up
md:       → >= 768px and up
lg:       → >= 1024px and up
xl:       → >= 1280px and up
2xl:      → >= 1536px and up
```

```html
<!-- Reading responsive classes: mobile → tablet → desktop -->
<div class="
  text-sm md:text-base lg:text-lg
  p-4 md:p-8 lg:p-12
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
<!-- Text: small → base → large -->
<!-- Padding: 16px → 32px → 48px -->
<!-- Columns: 1 → 2 → 3 -->
```

### Page Layout Example

```html
<!-- Mobile: stacked (flex-col); Desktop: side-by-side (flex-row) -->
<div class="flex flex-col lg:flex-row min-h-screen">
  <!-- Sidebar: full-width on mobile, 256px fixed on desktop -->
  <aside class="w-full lg:w-64 bg-gray-900 text-white p-6">
    <nav>Sidebar items</nav>
  </aside>
  <!-- Main: takes remaining space -->
  <main class="flex-1 p-6 lg:p-12">
    <h1 class="text-2xl lg:text-4xl font-bold">Page Title</h1>
  </main>
</div>
```

### Responsive Visibility

```html
<!-- Visible on mobile, hidden on md+ -->
<div class="block md:hidden">Mobile only</div>

<!-- Hidden on mobile, visible on md+ -->
<div class="hidden md:block">Desktop only</div>

<!-- Mobile hamburger, desktop full nav -->
<button class="block md:hidden">☰</button>
<nav class="hidden md:flex gap-6">
  <a href="#">Home</a>
  <a href="#">About</a>
</nav>
```

> [!IMPORTANT]
> Mobile-first mental model: "Start with mobile styles, then ADD styles for larger screens." Never write `hidden` and then immediately try to add `block` — the correct approach is to make something hidden by default (`hidden`) and reveal at a breakpoint (`md:block`).

### 📌 Section Recap
- Unprefixed classes apply to ALL sizes (mobile and up)
- `sm:`, `md:`, `lg:`, `xl:`, `2xl:` apply at breakpoint and wider
- `hidden md:block` = hidden on mobile, visible on tablet+
- `block md:hidden` = visible on mobile, hidden on tablet+

---

## 8. State Variants

State variants apply a utility only in a specific interactive state: `{variant}:{utility}`.

### Hover, Focus, Active

```html
<!-- HOVER -->
<button class="bg-blue-600 hover:bg-blue-700 transition">
  Darkens on hover
</button>

<a class="text-blue-600 hover:text-blue-800 hover:underline">
  Link changes on hover
</a>

<!-- FOCUS (keyboard navigation, accessibility) -->
<input class="border border-gray-300
              focus:border-blue-500
              focus:outline-none
              focus:ring-2 focus:ring-blue-200">

<!-- ACTIVE (while pressing/clicking) -->
<button class="bg-blue-600 active:bg-blue-800 active:scale-95 transition">
  Scales down while pressed
</button>

<!-- DISABLED -->
<button class="bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
  Disabled state
</button>

<!-- PLACEHOLDER TEXT -->
<input class="placeholder:text-gray-400 placeholder:italic" placeholder="Search...">

<!-- Complete button with all states -->
<button class="
  bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg
  hover:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
  transition duration-200
">
  Submit
</button>
```

### Group Hover (Parent Controls Child)

```html
<!-- Parent has 'group' class; children use 'group-hover:' -->
<div class="group bg-white rounded-xl p-6 border hover:border-blue-500 transition">
  <!-- Changes when PARENT is hovered (not this element directly) -->
  <h3 class="text-gray-900 group-hover:text-blue-600 transition">Title</h3>
  <p class="text-gray-500 group-hover:text-gray-700 transition">Description</p>

  <!-- Hidden by default, revealed on parent hover! (no JS needed) -->
  <button class="mt-4 opacity-0 group-hover:opacity-100 transition">
    Read More →
  </button>
</div>
```

> [!TIP]
> `group-hover:` enables complex hover effects (like revealing a button when a card is hovered) entirely in CSS — no JavaScript needed!

### Focus-Within

```html
<!-- Container reacts when any CHILD inside is focused -->
<div class="border border-gray-300 rounded-lg
            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
  <input class="border-none outline-none w-full p-3" placeholder="Search...">
  <button class="p-3 text-gray-400">Search</button>
</div>
<!-- When the input is focused, the CONTAINER gets the blue ring -->
```

### 📌 Section Recap
- `hover:`, `focus:`, `active:`, `disabled:`, `placeholder:` — single element states
- `group` on parent + `group-hover:` on child = child responds to parent hover
- `focus-within:` on parent = parent responds when any child is focused
- Combine multiple variants freely: `hover:bg-blue-700 focus:ring-2 active:scale-95`

---

## 9. Customising with `@theme`

### Why Customise?

Every project has unique brand colors, fonts, and spacing. Tailwind v4's `@theme` directive lets you extend or override design tokens in CSS — no JavaScript config file.

### Custom Colors

```css
/* style.css */
@import "tailwindcss";

@theme {
  /* Add brand colors — immediately available as Tailwind utilities */
  --color-brand-50:  #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-500: #6f42c1;   /* Main brand color */
  --color-brand-600: #5a2d91;   /* Hover state */
  --color-brand-900: #1e1b4b;
}
```

```html
<!-- Use just like built-in colors -->
<div class="bg-brand-500 text-white">Brand background</div>
<h1 class="text-brand-600">Brand text</h1>
<button class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded">
  Brand Button
</button>
```

### Custom Fonts

```css
@theme {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

```html
<!-- Link fonts from Google Fonts in HTML head: -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">

<!-- Use in HTML -->
<h1 class="font-display text-5xl font-bold">Beautiful Heading</h1>
<p class="font-body text-lg">Clean body text</p>
```

### Custom Breakpoints and Spacing

```css
@theme {
  /* New breakpoint for ultra-wide screens */
  --breakpoint-3xl: 1920px;

  /* Custom spacing values */
  --spacing-18: 4.5rem;   /* 72px */
  --spacing-128: 32rem;   /* 512px */
}
```

```html
<div class="grid grid-cols-3 3xl:grid-cols-6">
  <!-- 3 columns normally, 6 on ultra-wide -->
</div>
<section class="py-18">Custom 72px vertical padding</section>
```

### Complete Brand Theme Example

```css
/* style.css — Full brand setup */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap');

@theme {
  /* ── Brand Colors ─────────────────────── */
  --color-primary-50:  #f0f9ff;
  --color-primary-500: #0ea5e9;   /* Sky blue */
  --color-primary-600: #0284c7;   /* Hover */
  --color-primary-900: #0c4a6e;   /* Dark text */
  --color-accent-500:  #8b5cf6;   /* Purple accent */
  --color-accent-600:  #7c3aed;

  /* ── Typography ───────────────────────── */
  --font-display: 'Outfit', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* ── Custom Spacing ───────────────────── */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
}
```

### 📌 Section Recap
- `@theme { --color-{name}-{shade}: value; }` → use as `bg-{name}-{shade}`
- `@theme { --font-{name}: ...; }` → use as `font-{name}`
- `@theme { --breakpoint-{name}: value; }` → use as `{name}:` prefix
- All custom tokens are immediately available as Tailwind utilities

---

## Common Mistakes & How to Avoid Them (Summary)

**Mistake 1: Dynamic class names**
```js
// Tailwind scans for full strings — fragments won't be compiled!
const bg = `bg-${color}-500`; // Never found by Tailwind

// Fix: Map to complete names
const map = { blue: 'bg-blue-500', red: 'bg-red-500' };
const bg = map[color]; // "bg-blue-500" — found!
```

**Mistake 2: Wrong mobile-first order**
```html
<!-- Confusing to read (though functionally fine) -->
<div class="md:text-xl text-sm">

<!-- Convention: small to large for readability -->
<div class="text-sm md:text-xl">
```

**Mistake 3: Not enough color contrast**
```html
<p class="text-blue-200">Too light on white</p>     <!-- Bad -->
<p class="text-blue-700">Good contrast on white</p>  <!-- Good -->
```

---

## Practice Labs

### Lab 1: Rebuild a Bootstrap Card (45 min)

Take a Bootstrap card and rebuild it using only Tailwind utilities:
1. White background, rounded corners, subtle shadow, border
2. Image with `object-cover` and fixed height
3. Category badge, title, description, author with avatar
4. Add `hover:shadow-lg hover:-translate-y-1 transition duration-300`
5. Make it look BETTER than the Bootstrap version

### Lab 2: Responsive Image Gallery (45 min)

1. Grid of 6 images using `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
2. Each image: `aspect-square object-cover rounded-xl overflow-hidden`
3. Add `group` to each cell, `group-hover:scale-105 transition` to the image
4. Add a caption that appears on group hover with `opacity-0 group-hover:opacity-100`

---

## Assignment: StartupLaunch Project — Part 3

Convert your Bootstrap landing page to Tailwind CSS v4.

### Requirements
1. New Vite project with Tailwind v4
2. Port HTML structure from Part 1 (remove ALL Bootstrap classes)
3. Rebuild in Tailwind: **Navbar**, **Hero**, **Features**, **Pricing**, **Footer**
4. Define brand colors and fonts in `@theme`
5. All buttons need `hover:` and `active:` states
6. All cards need `hover:shadow-lg transition` effects
7. Design must be more polished than the Bootstrap version

---

## Resources

| Resource | Link |
|----------|------|
| Tailwind CSS v4 Docs | https://tailwindcss.com/docs |
| Tailwind Playground | https://play.tailwindcss.com/ |
| Heroicons | https://heroicons.com/ |
| Google Fonts | https://fonts.google.com/ |

---

## Final Lecture Recap

- **Utility-first**: style directly in HTML with single-purpose classes
- **v3 → v4**: `tailwind.config.js` is gone; configure with `@theme` in CSS
- **Setup**: `npm install -D tailwindcss @tailwindcss/vite` + plugin in `vite.config.js` + `@import "tailwindcss"` in CSS
- **Spacing**: 1 unit = 4px; `p-4`=16px, `m-8`=32px, `gap-6`=24px
- **Colors**: `{bg|text|border}-{color}-{shade}` — use 600+ for text, 100-200 for backgrounds
- **Flexbox**: `flex justify-{v} items-{v} gap-{n}`; `ml-auto` pushes items right
- **Grid**: `grid grid-cols-{n} gap-{n}`; `col-span-{n}` spans columns
- **Responsive**: mobile-first; `sm:`, `md:`, `lg:`, `xl:` apply at breakpoint and wider
- **States**: `hover:`, `focus:`, `active:`, `group-hover:`, `focus-within:`
- **Theme**: `@theme { --color-brand-500: #ff0000; }` → `bg-brand-500`

---

**Next Lecture:** [Lecture 18 — Tailwind CSS v4: Advanced Patterns, Components & Plugins](./18%20-%20Tailwind%20CSS%20%E2%80%94%20Advanced%20Patterns,%20Components%20%26%20Plugins.md)