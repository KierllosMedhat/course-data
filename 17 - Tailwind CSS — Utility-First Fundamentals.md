# Lecture 17 — Tailwind CSS v4: Utility-First Fundamentals

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand the utility-first CSS philosophy and compare it with Bootstrap
- Install and configure the modern Tailwind CSS v4 engine
- Use core utilities for spacing, colours, typography, and sizing
- Build Flexbox and Grid layouts with Tailwind utility classes
- Apply responsive breakpoint prefixes (`sm:`, `md:`, `lg:`, etc.)
- Style interactive states with variants (`hover:`, `focus:`)
- Customise the Tailwind v4 theme directly in CSS using the new `@theme` directive

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Utility-First Philosophy
2. Comparison: Bootstrap vs Tailwind CSS
3. Tailwind v4 Setup (Vite + zero-config CSS)
4. Core Design Tokens: spacing, colours, typography
5. Layout Utilities: Flex & Grid
6. Responsive Breakpoints & State Variants
7. Customisation with Tailwind v4 `@theme`

### Part 2 — Practice & Lab (~90–120 min)
1. Rebuild a Bootstrap card with Tailwind
2. Build a responsive image gallery
3. StartupLaunch Project Part 3: Tailwind Migration & Pricing

---

## 1. Utility-First Philosophy

**What is utility-first CSS?** Instead of using pre-built components (like Bootstrap's `.card` or `.btn`), you build designs by combining small, single-purpose utility classes directly in your HTML.

### Why Utility-First?
- **No naming things:** You don't agonise over class names like `.card-wrapper-inner`.
- **No context switching:** You style directly in HTML — no jumping to CSS files.
- **Explicit:** You can see exactly what an element looks like by reading its classes.
- **Performance:** Tailwind v4 generates tiny CSS files dynamically.

---

## 2. Comparison: Bootstrap vs Tailwind CSS

It's important to understand when to use which framework.

| Feature | Bootstrap 5 | Tailwind CSS v4 |
|---------|-------------|-----------------|
| **Philosophy** | Component-First (Ready-made UI) | Utility-First (Build it yourself) |
| **Speed of setup** | Instant. Just add the CDN and use `.card`. | Requires a small learning curve to memorize utilities. |
| **Customisation** | Harder. Requires overriding Sass variables. | Extremely easy. Built to be completely customized. |
| **CSS File Size** | Moderate (if not purged). | Tiny (v4 engine compiles only what you use). |
| **JavaScript** | Includes built-in JS for Modals/Tooltips. | Pure CSS. You bring your own JS (e.g. Alpine.js, React). |
| **Best For** | Admin dashboards, internal tools, quick MVPs. | Customer-facing websites, highly custom designs. |

**Bootstrap card:**
```html
<div class="card p-3">
  <button class="btn btn-primary">Go</button>
</div>
```

**Tailwind equivalent:**
```html
<div class="border rounded-lg shadow-md p-3 bg-white">
  <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Go</button>
</div>
```

---

## 3. Tailwind v4 Setup

Tailwind CSS v4 is a complete rewrite. It is CSS-only, meaning the `tailwind.config.js` file is completely gone!

### Vite Setup
```bash
npm create vite@latest my-project -- --template vanilla
cd my-project
npm install tailwindcss @tailwindcss/vite
```

### Vite Configuration (`vite.config.js`)
```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### Main CSS File (`style.css`)
```css
@import "tailwindcss";
```

That's it! Tailwind v4 handles everything through the Vite plugin.

---

## 4. Core Concepts: Spacing, Colors, Typography

### Spacing Scale
Tailwind uses a numeric scale based on multiples of `0.25rem` (4px).

- `p-0`: 0px padding
- `p-1`: 4px padding
- `m-4`: 16px margin
- `mx-auto`: center horizontally
- `w-64`: 16rem width
- `h-screen`: 100vh height

### Colors
A curated palette from 50 (lightest) to 950 (darkest).

- `bg-blue-500`: Blue background
- `text-red-600`: Red text
- `border-gray-200`: Light gray border

### Typography
- `text-sm`, `text-base`, `text-2xl` (Size)
- `font-bold`, `font-light` (Weight)
- `text-center`, `text-right` (Alignment)

---

## 5. Layout Utilities: Flex & Grid

### Flexbox
```html
<!-- A centered flex container with a gap of 16px -->
<div class="flex justify-center items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid
```html
<!-- 3 equal columns -->
<div class="grid grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

---

## 6. Responsive Breakpoints & State Variants

Tailwind is mobile-first. Apply prefixes to change styles at different screen sizes.

| Prefix | Min Width | Target |
|--------|-----------|--------|
| *(none)* | 0px | Mobile |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

```html
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
```

### State Variants
Style hover and focus states inline.
```html
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
  Click Me
</button>
```

---

## 7. Customisation with Tailwind v4 `@theme`

In Tailwind v4, because `tailwind.config.js` is gone, you customize your theme directly in CSS using the `@theme` directive.

```css
/* style.css */
@import "tailwindcss";

@theme {
  --color-brand-500: #ff4500;
  --font-display: "Oswald", sans-serif;
  --breakpoint-3xl: 1920px;
}
```

Now you can use these custom classes in your HTML:
```html
<div class="bg-brand-500 font-display">Hello World</div>
```

---

## 🧪 Practice Labs

### Lab 1: Rebuilding a Bootstrap Card (45 min)
1. Open `labs/lab1-card/index.html`.
2. Take a standard Bootstrap card with an image, title, text, and button.
3. Recreate it completely from scratch using Tailwind utilities (`rounded-lg`, `shadow-md`, `overflow-hidden`).
4. Add hover effects to the button.

### Lab 2: Responsive Image Gallery (45 min)
1. Open `labs/lab2-gallery/index.html`.
2. Use CSS Grid to display 6 images.
3. On mobile, show 1 column. On tablets, 2 columns. On desktops, 3 columns.
4. Add a `hover:scale-105 transition-transform` effect to the images.

---

## 📝 Assignment: StartupLaunch Project — Part 3

Let's convert our Bootstrap landing page to modern Tailwind CSS!

### Requirements
1. Start a fresh Vite project and install Tailwind CSS v4.
2. Port your `index.html` structure from Part 2 over.
3. Remove all Bootstrap CDN links and Bootstrap classes.
4. Rebuild the **Navbar**, **Hero**, and **Features** sections using Tailwind utilities. 
5. The design should look *better* than the Bootstrap version. Use modern spacing (`gap-8`), rounded corners (`rounded-xl`), and soft shadows (`shadow-lg`).
6. Customise your brand color in your `style.css` using the `@theme` directive and apply it to your buttons and links.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Tailwind CSS v4 Documentation | https://tailwindcss.com/docs |
| Tailwind CSS Color Palette | https://tailwindcss.com/docs/customizing-colors |

---

## 📌 Key Takeaways
- **Utility-first** means composing designs by combining single-purpose classes in HTML.
- **Bootstrap is Component-First**, meaning it's faster to start but harder to customize compared to Tailwind.
- **Tailwind v4 is CSS-only** and eliminates the need for a `tailwind.config.js` file.
- **Responsive design** uses prefix breakpoints: `md:`, `lg:`.
- **State variants** like `hover:` and `focus:` handle interactive states.
- Customize your design tokens using the **`@theme`** directive in CSS.

---

**Next Lecture:** [Lecture 18 — Tailwind CSS: Advanced Patterns, Components & Plugins](./18%20-%20Tailwind%20CSS%20—%20Advanced%20Patterns,%20Components%20%26%20Plugins.md)