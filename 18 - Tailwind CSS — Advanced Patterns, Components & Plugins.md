# 18 - Tailwind CSS — Advanced Patterns, Components & Plugins

---

**Course:** Full-Stack Web Development  
**Instructor:** [Instructor Name]  
**Duration:** ~3 hours (lecture + labs)  
**Prerequisites:** Lecture 17 — Tailwind CSS Fundamentals

---

## 📚 Learning Objectives

By the end of this lecture, you will be able to:

- Decide **when to extract** utility classes into a component using `@apply` and when to leave them inline
- Write custom CSS components inside Tailwind's `@layer components` directive
- Integrate **component libraries** (Headless UI, DaisyUI) into a Tailwind project
- Use the **Tailwind v4 `@plugin` directive** to add plugins directly from CSS
- Apply the `@tailwindcss/typography` plugin to render rich text with the `.prose` class
- Use the `@tailwindcss/forms` plugin to style form elements consistently across browsers
- Implement **dark mode** using both OS-based detection and a manual toggle with `localStorage`
- Use **CSS variables** inside dark mode themes
- Build **transitions and transforms** using Tailwind utilities
- Apply **built-in animations** and write **custom keyframe animations** with `@theme`
- Understand Tailwind v4's **automatic content detection** and the **dynamic class name problem**
- Use the **safelist** to protect dynamically generated class names
- Master **responsive design breakpoints** and **state variants** like `hover`, `focus`, `group-hover`, and `peer`

---

## 🗂 Agenda

1. The Component Extraction Dilemma — `@apply` vs. inline utilities
2. `@apply` syntax deep dive — what it does and where it must live
3. Component Libraries overview — Headless UI and DaisyUI
4. Tailwind v4 `@plugin` directive
5. `@tailwindcss/typography` — the `.prose` class
6. `@tailwindcss/forms` plugin
7. Dark mode in Tailwind v4 — OS-based vs. manual toggle
8. Implementing a dark mode toggle with `localStorage` persistence
9. CSS variables in dark mode
10. Transitions — `transition`, `duration`, `ease`, `delay`
11. Transform utilities — `scale`, `translate`, `rotate`, `skew`
12. Built-in animations — `spin`, `ping`, `pulse`, `bounce`
13. Custom keyframe animations with `@theme` in Tailwind v4
14. Tailwind v4 content detection — zero-config and automatic
15. The dynamic class name problem and the safelist
16. Responsive design breakpoints revisited
17. State variants — `hover`, `focus`, `active`, `disabled`, `group-hover`, `peer`
18. **Lab 1:** Dark Mode Toggle with `localStorage`
19. **Lab 2:** Custom Accessible Modal with Animations
20. Assignment — StartupLaunch Project Part 4

---

## 1. The Component Extraction Dilemma — `@apply` vs. Inline Utilities

### Why does this matter?

One of the first frustrations developers hit with Tailwind is seeing long strings of utility classes on a single element:

```html
<button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
  Click me
</button>
```

This raises a natural question: **Should I extract this into a reusable CSS class?** This section gives you a principled way to answer that question every time.

---

### Real-World Analogy

Think of your utility classes like cooking spices. When you're making one dish, you sprinkle spices directly onto the pan — fast, direct, no setup. But if you're making the same dish 50 times a week in a restaurant kitchen, you pre-mix the spice blend into a jar and label it. That jar is `@apply` — a named, reusable mixture of individual ingredients.

The question is: **how often are you making this dish?**

---

### The Decision Framework

Ask yourself these three questions:

1. **Is this pattern used in more than 2–3 places?**  
   If yes → consider extraction. If no → keep it inline.

2. **Does this element have a clear semantic identity?** (e.g., it is conceptually a "card", a "badge", a "primary button")  
   If yes → extraction makes naming easy and meaningful. If no → leave inline.

3. **Is this a JavaScript component already?** (e.g., a React/Vue component)  
   If yes → keep utilities inline inside the component file — the component *is* already the reusable unit.

---

### When to Keep Utilities Inline ✅

```html
<!-- One-off hero section — inline is perfectly fine -->
<section class="relative bg-gradient-to-br from-indigo-900 to-purple-900 py-24 px-6 text-center text-white">
  <h1 class="text-5xl font-bold leading-tight mb-4">Welcome to the Future</h1>
  <p class="text-lg text-indigo-200 max-w-xl mx-auto">
    Build faster. Ship smarter. Design better.
  </p>
</section>
```

This hero section exists once on one page. Extracting it into a `.hero-section` class would add complexity without benefit.

---

### When to Extract with `@apply` ✅

```html
<!-- Used on 15 different pages — extraction makes sense -->
<button class="btn-primary">Save Changes</button>
<button class="btn-primary">Create Account</button>
<button class="btn-primary">Subscribe Now</button>
```

Here, `btn-primary` is a genuine semantic concept used everywhere. If the brand color changes, you update one place.

---

### Section Recap 📝

- Keep utilities **inline** for one-off layouts and one-of-a-kind elements
- Extract with `@apply` when a pattern **repeats across many places** and has a **semantic name**
- JavaScript components (React, Vue) are **already reusable** — keep utilities inside them and avoid extracting to CSS
- The goal is to avoid both extremes: don't extract everything (premature abstraction) and don't never extract (duplicated chaos)

---

## 2. `@apply` Syntax Deep Dive

### What does `@apply` actually do?

`@apply` is a **CSS directive** that lets you use Tailwind utility class names inside your own CSS rules. When Tailwind processes your CSS, it replaces the `@apply` line with the actual CSS declarations that the named utilities produce.

Think of it like a **macro**: you write a short name, and Tailwind expands it into full CSS at build time.

---

### Step-by-Step: Writing a Component with `@apply`

**Step 1:** Open (or create) your main CSS file — typically `src/index.css` or `src/app.css`.

**Step 2:** You must place component styles inside `@layer components`. This is not optional — Tailwind uses layers to control specificity and ordering. If you write `@apply` outside a layer, specificity problems will occur.

**Step 3:** Write your CSS rule using `@apply` followed by the utility class names you want to combine.

```css
/* src/index.css */

/* Tailwind's base import (v4 syntax) */
@import "tailwindcss";

/* ============================================================
   @layer components — where your custom components live
   ============================================================
   Think of layers like shelves in a library.
   'base'       → bottom shelf (resets, defaults)
   'components' → middle shelf (reusable patterns)
   'utilities'  → top shelf (single-purpose overrides)
   
   Putting custom styles in 'components' means utility classes
   can always override them — which is the expected behavior.
   ============================================================ */
@layer components {

  /* Primary button component */
  .btn-primary {
    /* @apply takes a list of Tailwind utility class names */
    @apply bg-blue-600          /* background color */
           hover:bg-blue-700    /* darken on hover */
           active:bg-blue-800   /* even darker when clicked */
           text-white           /* white text */
           font-semibold        /* semi-bold weight */
           py-2                 /* vertical padding (top & bottom) */
           px-4                 /* horizontal padding (left & right) */
           rounded-lg           /* rounded corners */
           shadow-md            /* medium drop shadow */
           transition           /* enable smooth transitions */
           duration-200         /* transition speed: 200ms */
           focus:outline-none   /* remove default browser outline */
           focus:ring-2         /* show a focus ring for accessibility */
           focus:ring-blue-400  /* ring color */
           focus:ring-offset-2; /* space between element and ring */
  }

  /* Secondary (outline) button */
  .btn-secondary {
    @apply border-2
           border-blue-600
           text-blue-600
           hover:bg-blue-600
           hover:text-white
           font-semibold
           py-2
           px-4
           rounded-lg
           transition
           duration-200
           focus:outline-none
           focus:ring-2
           focus:ring-blue-400
           focus:ring-offset-2;
  }

  /* Card container component */
  .card {
    @apply bg-white              /* white background */
           rounded-xl            /* heavily rounded corners */
           shadow-lg             /* large drop shadow */
           p-6                   /* padding all around */
           border                /* thin border */
           border-gray-100;      /* very light gray border */
  }

  /* Badge / pill component */
  .badge {
    @apply inline-flex           /* inline flex container */
           items-center          /* vertically center content */
           px-2.5                /* horizontal padding */
           py-0.5                /* thin vertical padding */
           rounded-full          /* fully circular ends */
           text-xs               /* small text */
           font-medium;          /* medium weight */
  }

  /* Badge color variants */
  .badge-green {
    @apply badge                 /* inherit base badge styles */
           bg-green-100
           text-green-800;
  }

  .badge-red {
    @apply badge
           bg-red-100
           text-red-800;
  }
}
```

**Step 4:** Use your components in HTML:

```html
<!-- Clean, semantic HTML — no long class strings -->
<button class="btn-primary">Save Changes</button>
<button class="btn-secondary">Cancel</button>

<div class="card">
  <h2 class="text-xl font-bold mb-2">Article Title</h2>
  <p class="text-gray-600">Article excerpt goes here...</p>
  <span class="badge-green">Published</span>
</div>
```

---

### What `@apply` Cannot Do

> [!WARNING]
> **`@apply` cannot use arbitrary values**. You cannot write `@apply text-[#ff3300]` — arbitrary values only work on HTML elements, not inside `@apply`. Use CSS custom properties (variables) instead for dynamic values.

> [!WARNING]
> **`@apply` does not work with variant prefixes like `hover:` by default in all contexts.** Some plugins and configurations may handle this differently. When in doubt, write vanilla CSS for hover states inside your component rule.

```css
/* ❌ This may cause issues in some setups */
.my-btn {
  @apply hover:bg-blue-700; /* variant in @apply — can be problematic */
}

/* ✅ Preferred approach for complex variants */
.my-btn {
  @apply bg-blue-600 text-white py-2 px-4 rounded;
}

/* Write hover state as plain CSS */
.my-btn:hover {
  @apply bg-blue-700; /* or just: background-color: theme('colors.blue.700'); */
}
```

---

### Section Recap 📝

- `@apply` expands Tailwind utility names into their underlying CSS declarations
- It **must** live inside `@layer components` (or `@layer utilities`) to avoid specificity issues
- Think of it as a CSS macro — great for patterns that repeat with a clear semantic name
- Arbitrary values (bracket notation) **cannot** be used with `@apply`
- For complex state logic, mix `@apply` with regular CSS

---

## 3. Component Libraries — Headless UI and DaisyUI

### Why does this matter?

Building a dropdown menu, modal dialog, or combobox from scratch involves solving hard problems: keyboard navigation, ARIA attributes, focus trapping, screen reader announcements. These are **accessibility requirements**, not optional extras. Component libraries let you skip the hard parts.

---

### 3a. Headless UI — Accessibility-First, Unstyled

#### What problem does it solve?

Headless UI provides the **behavior and accessibility** of complex UI components without any visual styling whatsoever. It gives you functional, keyboard-navigable, ARIA-compliant components — and you style them yourself with Tailwind.

**The name "headless" means: brains but no face.**

#### Real-World Analogy

Imagine buying a high-end car engine (the behavior — gear shifts, fuel injection, safety systems) without a body. You then custom-build the car body (the styling) exactly how you want it. Headless UI is the engine; your Tailwind classes are the body.

#### Installing Headless UI (React)

```bash
# Install the React version of Headless UI
npm install @headlessui/react
```

#### Example: Accessible Dropdown Menu

```jsx
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

function UserMenu() {
  return (
    /*
      Menu is the root component — manages open/close state,
      keyboard navigation, and ARIA attributes automatically
    */
    <Menu as="div" className="relative inline-block text-left">

      {/*
        MenuButton is the trigger element.
        Headless UI automatically adds:
        - aria-haspopup="menu"
        - aria-expanded (true/false based on state)
        - Keyboard support (Enter, Space to open)
      */}
      <MenuButton className="
        inline-flex items-center gap-2
        bg-white border border-gray-300
        rounded-lg px-4 py-2
        text-sm font-medium text-gray-700
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      ">
        My Account
        {/* Chevron icon */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </MenuButton>

      {/*
        MenuItems is the dropdown panel.
        Automatically handles:
        - focus trapping when open
        - Escape key to close
        - Arrow key navigation
        - role="menu" and aria-orientation
      */}
      <MenuItems className="
        absolute right-0 mt-2 w-48
        bg-white rounded-xl shadow-lg
        border border-gray-100
        focus:outline-none
        z-50
      ">
        <div className="py-1">
          {/* Each MenuItem handles role="menuitem" and keyboard selection */}
          <MenuItem>
            {({ active }) => (  /* 'active' is true when this item is focused/hovered */
              <a
                href="/profile"
                className={`
                  block px-4 py-2 text-sm
                  ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}
                `}
              >
                Your Profile
              </a>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <a
                href="/settings"
                className={`
                  block px-4 py-2 text-sm
                  ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}
                `}
              >
                Settings
              </a>
            )}
          </MenuItem>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1" />

          <MenuItem>
            {({ active }) => (
              <button
                className={`
                  block w-full text-left px-4 py-2 text-sm
                  ${active ? 'bg-red-50 text-red-700' : 'text-red-600'}
                `}
              >
                Sign Out
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}
```

> [!NOTE]
> Headless UI components work with **Vue** as well. The package is `@headlessui/vue` and the API is nearly identical.

---

### 3b. DaisyUI — Semantic Classes on Top of Tailwind

#### What is DaisyUI?

DaisyUI is a **Tailwind CSS plugin** that adds semantic component class names. Instead of writing 12 utility classes for a button, you write `btn btn-primary`. It's a layer of abstraction that trades flexibility for speed.

#### DaisyUI vs. Headless UI — When to Choose Which

| | DaisyUI | Headless UI |
|---|---|---|
| **Styling included?** | Yes, fully styled | No — you style everything |
| **Accessibility?** | Basic | Excellent (keyboard, ARIA) |
| **Customization?** | Via themes | Complete freedom |
| **Speed to build** | Very fast | Slower (you design everything) |
| **Best for** | Rapid prototyping, admin panels | Production apps, design systems |

#### Installing DaisyUI

```bash
# Install DaisyUI
npm install daisyui
```

```css
/* In your main CSS file (v4 syntax) */
@import "tailwindcss";
@plugin "daisyui";  /* activate DaisyUI — more on @plugin in the next section */
```

#### DaisyUI Theme System

DaisyUI ships with 30+ built-in themes. Each theme is a set of CSS custom properties (variables) that define a color palette.

```html
<!-- Apply a theme to the entire page -->
<html data-theme="dark">

<!-- Or scope a theme to just one section -->
<div data-theme="cupcake">
  <!-- Everything inside uses the cupcake theme colors -->
</div>
```

```html
<!-- DaisyUI button examples -->
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>

<!-- Sizes -->
<button class="btn btn-xs">Extra Small</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-md">Medium (default)</button>
<button class="btn btn-lg">Large</button>

<!-- States -->
<button class="btn btn-primary loading">Loading...</button>
<button class="btn" disabled>Disabled</button>
```

```html
<!-- DaisyUI card -->
<div class="card w-96 bg-base-100 shadow-xl">
  <figure>
    <img src="https://picsum.photos/400/200" alt="Card image" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A description of this card's content goes here.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
```

```html
<!-- DaisyUI modal -->
<dialog id="my_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press Escape or click the button below to close.</p>
    <div class="modal-action">
      <form method="dialog">
        <!-- Closing the <form> closes the <dialog> natively -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

<!-- Open the modal -->
<button onclick="document.getElementById('my_modal').showModal()" class="btn btn-primary">
  Open Modal
</button>
```

---

### Section Recap 📝

- **Headless UI**: gives you behavior + accessibility with zero styling — you bring all the design with Tailwind
- **DaisyUI**: gives you pre-styled components with semantic class names, theming built in — great for speed
- Use Headless UI when building a custom design system or when accessibility is paramount
- Use DaisyUI for rapid prototyping, admin dashboards, or when a pre-designed system is acceptable

---

## 4. Tailwind v4 `@plugin` Directive

### What changed from v3 to v4?

In **Tailwind v3**, you added plugins inside `tailwind.config.js`:

```js
// v3 — tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
}
```

In **Tailwind v4**, configuration moved primarily into your **CSS file**. The `@plugin` directive lets you import plugins directly from CSS — no JavaScript config file needed for most use cases.

```css
/* v4 — your main CSS file */
@import "tailwindcss";

/* Import plugins directly in CSS */
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
@plugin "daisyui";
```

### Step-by-Step: Adding a Plugin in Tailwind v4

**Step 1:** Install the plugin package via npm:
```bash
npm install @tailwindcss/typography
```

**Step 2:** Add the `@plugin` directive to your CSS file (after `@import "tailwindcss"`):
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

**Step 3:** That's it. The plugin's classes are now available throughout your project.

> [!NOTE]
> You still need to install the plugin package via npm. The `@plugin` directive tells Tailwind to **activate** the installed package — it doesn't download it.

---

### Section Recap 📝

- Tailwind v4 moves plugin configuration from `tailwind.config.js` into your CSS file
- Use `@plugin "package-name"` after your `@import "tailwindcss"` line
- You must still `npm install` the plugin first
- This makes your Tailwind setup more portable — the CSS file is now the single source of truth

---

## 5. `@tailwindcss/typography` — The `.prose` Class

### Why does this matter?

Raw HTML from a CMS or markdown renderer has no styling. Headings look like text, `<ul>` lists have no bullets, `<blockquote>` looks plain. The typography plugin adds a `.prose` class that makes **any block of HTML content look beautifully readable** with just one class — no custom CSS needed.

---

### Real-World Analogy

Imagine you're given a raw manuscript with no formatting — just text. The typography plugin is like a professional typesetter who applies all standard print conventions (heading sizes, line spacing, list indentation, pull quotes) automatically to whatever content you give it.

---

### Installation and Setup

```bash
npm install @tailwindcss/typography
```

```css
/* main CSS file */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

---

### Using the `.prose` Class

```html
<!--
  Simply add 'prose' to any container.
  All child elements (h1-h6, p, ul, ol, blockquote, code, etc.)
  will be automatically styled for readability.
-->
<article class="prose">
  <h1>Getting Started with Tailwind CSS</h1>
  <p>Tailwind CSS is a utility-first CSS framework...</p>
  <ul>
    <li>Fast development</li>
    <li>Consistent design</li>
    <li>Easy customization</li>
  </ul>
  <blockquote>
    <p>The best CSS framework for rapid UI development.</p>
  </blockquote>
  <pre><code>npm install tailwindcss</code></pre>
</article>
```

---

### Prose Sizes

```html
<!-- Extra small prose — tight spacing for dense content -->
<article class="prose prose-sm">...</article>

<!-- Default prose size -->
<article class="prose">...</article>

<!-- Large prose — more generous spacing -->
<article class="prose prose-lg">...</article>

<!-- Extra large prose — ideal for long-form articles -->
<article class="prose prose-xl">...</article>

<!-- 2xl prose — maximum spacing -->
<article class="prose prose-2xl">...</article>
```

---

### Dark Mode with `prose-invert`

```html
<!--
  prose-invert flips the prose color scheme for dark backgrounds.
  Use it inside a dark mode context.
-->
<article class="prose dark:prose-invert">
  <!-- 
    In light mode: dark text on light background
    In dark mode: light text on dark background
    Headings, links, code blocks all adapt automatically
  -->
</article>
```

---

### Prose Color Themes

```html
<!-- Change link and heading accent colors -->
<article class="prose prose-indigo">...</article>   <!-- Indigo links -->
<article class="prose prose-pink">...</article>     <!-- Pink links -->
<article class="prose prose-emerald">...</article>  <!-- Emerald links -->
```

---

### Customizing Prose with `@apply`

```css
/* You can customize prose within your theme */
@layer components {
  .prose-custom {
    @apply prose prose-lg prose-indigo dark:prose-invert max-w-none;
    /* max-w-none removes the default max-width constraint */
  }
}
```

---

### Section Recap 📝

- `@tailwindcss/typography` adds the `.prose` class for beautifully styled long-form content
- Use `.prose` on any container that holds HTML from a CMS, markdown renderer, or rich text editor
- Size variants: `prose-sm`, `prose`, `prose-lg`, `prose-xl`, `prose-2xl`
- Use `dark:prose-invert` for dark mode compatibility
- Color themes like `prose-indigo` customize link and heading colors

---

## 6. `@tailwindcss/forms` Plugin

### Why does this matter?

Browser default form element styles (inputs, selects, checkboxes, radio buttons) vary significantly between Chrome, Firefox, Safari, and Edge. The forms plugin applies a **consistent, clean baseline style** to all form elements, so they look decent and professional without any extra CSS.

---

### Installation

```bash
npm install @tailwindcss/forms
```

```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
```

---

### What It Does

Once installed, form elements get a clean, minimal style automatically:

```html
<!-- These elements are automatically styled after installing the plugin -->
<form class="space-y-4 max-w-md">
  <!-- Text input — gets consistent padding, border, border-radius -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Full Name
    </label>
    <input
      type="text"
      placeholder="John Doe"
      class="w-full rounded-lg border-gray-300 shadow-sm
             focus:border-indigo-500 focus:ring focus:ring-indigo-200"
    />
  </div>

  <!-- Select dropdown — cross-browser consistent arrow indicator -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Country
    </label>
    <select class="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200">
      <option>United States</option>
      <option>United Kingdom</option>
      <option>Canada</option>
    </select>
  </div>

  <!-- Checkbox — consistent cross-browser appearance -->
  <div class="flex items-center gap-2">
    <input
      type="checkbox"
      id="terms"
      class="rounded border-gray-300 text-indigo-600
             focus:ring-indigo-500"
    />
    <label for="terms" class="text-sm text-gray-700">
      I agree to the terms
    </label>
  </div>

  <!-- Radio buttons -->
  <div class="flex items-center gap-4">
    <label class="flex items-center gap-2">
      <input type="radio" name="plan" value="free"
             class="text-indigo-600 border-gray-300 focus:ring-indigo-500" />
      <span class="text-sm">Free</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="radio" name="plan" value="pro"
             class="text-indigo-600 border-gray-300 focus:ring-indigo-500" />
      <span class="text-sm">Pro</span>
    </label>
  </div>

  <!-- Textarea -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Message
    </label>
    <textarea
      rows="4"
      placeholder="Your message..."
      class="w-full rounded-lg border-gray-300 shadow-sm
             focus:border-indigo-500 focus:ring focus:ring-indigo-200"
    ></textarea>
  </div>
</form>
```

> [!TIP]
> The forms plugin uses a "base" strategy by default — it styles all form elements globally. If you want more control, you can use the "class" strategy, which only applies styles when you add a special class prefix like `form-input`, `form-select`, etc.

---

### Section Recap 📝

- The forms plugin normalizes form element styles across all browsers
- It applies a clean baseline automatically — no class names required for basic styling
- You still add Tailwind utilities on top for focus rings, border colors, rounding, etc.
- Great for any project with forms — saves hours of cross-browser form CSS

---

## 7. Dark Mode in Tailwind v4

### Why does this matter?

Dark mode is now an expected feature, not a luxury. Studies show that 80%+ of users prefer dark mode or toggle between modes. Implementing it correctly — especially respecting the user's OS preference AND allowing manual override — is a mark of a polished, professional application.

---

### Real-World Analogy

Think of dark mode like automatic vs. manual car headlights. By default (OS-based), the headlights turn on automatically when it gets dark. But you can also flip the switch manually to override the automatic setting. Your app should respect the OS preference by default and let the user override it manually.

---

### How Dark Mode Works in Tailwind

In Tailwind, dark mode works through the `dark:` **variant prefix**. Any utility prefixed with `dark:` only applies when dark mode is active.

```html
<!--
  Without dark mode active: bg-white text-gray-900 (light mode)
  With dark mode active:    bg-gray-900 text-gray-100 (dark mode)
-->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-2xl font-bold">Hello World</h1>
</div>
```

---

### Method 1: OS-Based Dark Mode (Default in Tailwind v4)

Tailwind v4 defaults to **media query-based** dark mode, which means it reads the user's operating system preference automatically using `@media (prefers-color-scheme: dark)`.

```css
/* This happens automatically in v4 — no configuration needed */
/* When user's OS is in dark mode, all dark: classes activate */
```

```html
<!-- This just works — the OS controls whether dark: classes apply -->
<nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
  <a class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
    Home
  </a>
</nav>
```

---

### Method 2: Manual Toggle with `@custom-variant`

For a manual toggle (user clicks a button to switch), you need to control when the `dark:` variant activates — not based on OS preference, but based on a class on the `<html>` element.

In Tailwind v4, you define this behavior using `@custom-variant` in your CSS:

```css
/* main CSS file */
@import "tailwindcss";

/*
  @custom-variant tells Tailwind:
  "The 'dark' variant should activate when the .dark class
  is present on the :root element (the <html> element)"
  
  This OVERRIDES the default media query behavior.
*/
@custom-variant dark (&:where(.dark, .dark *));
```

Now, adding the `.dark` class to `<html>` activates all `dark:` utilities:

```html
<!-- Dark mode OFF (light mode) -->
<html class="">
  <div class="bg-white dark:bg-gray-900">Light background</div>
</html>

<!-- Dark mode ON -->
<html class="dark">
  <div class="bg-white dark:bg-gray-900">Dark background applied!</div>
</html>
```

---

### Section Recap 📝

- The `dark:` prefix makes any utility conditional on dark mode being active
- **OS-based**: default in v4, uses `prefers-color-scheme` media query automatically
- **Manual toggle**: use `@custom-variant dark` to tie dark mode to a `.dark` class on `<html>`
- Both approaches can coexist: start with OS-based, then switch to class-based for toggle support

---

## 8. Implementing a Dark Mode Toggle with `localStorage` Persistence

### Why `localStorage`?

Without persistence, every page refresh resets to the OS default. `localStorage` remembers the user's choice between sessions — they don't have to re-toggle every visit.

---

### Full Implementation — Step by Step

**Step 1:** Configure Tailwind v4 for class-based dark mode

```css
/* src/index.css */
@import "tailwindcss";

/* Enable class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));
```

**Step 2:** Structure your HTML with dark mode classes

```html
<!DOCTYPE html>
<html lang="en">
  <!-- The 'dark' class here controls all dark: utilities -->
<head>
  <meta charset="UTF-8" />
  <title>Dark Mode Demo</title>
  <link rel="stylesheet" href="./src/index.css" />
  <!-- Load the dark mode script BEFORE content renders to prevent flash -->
  <script>
    /*
      This script runs synchronously (before the page renders).
      It checks localStorage and applies 'dark' class immediately,
      preventing a flash of wrong theme on page load.
    */
    (function() {
      // Check if user previously selected a theme
      const savedTheme = localStorage.getItem('theme');
      
      // Check OS preference as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Apply dark class if user chose dark, OR if OS is dark and no explicit choice made
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">

  <!-- Navigation with toggle button -->
  <nav class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <span class="text-xl font-bold">My App</span>
    
    <!--
      Toggle Button
      - Shows a sun icon in dark mode (click to go light)
      - Shows a moon icon in light mode (click to go dark)
    -->
    <button
      id="theme-toggle"
      aria-label="Toggle dark mode"
      class="
        relative w-10 h-10 rounded-full
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
    >
      <!-- Moon icon — visible in light mode -->
      <svg id="icon-moon" class="w-5 h-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>

      <!-- Sun icon — visible in dark mode -->
      <svg id="icon-sun" class="w-5 h-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </button>
  </nav>

  <!-- Page content -->
  <main class="max-w-2xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold mb-4">Welcome!</h1>
    <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
      This page supports both light and dark mode. Your preference is saved automatically.
    </p>
    
    <!-- A card to demonstrate dark mode -->
    <div class="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-2">A Sample Card</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Notice how the background, text, and border all adapt to the theme.
      </p>
    </div>
  </main>

  <script>
    /*
      Dark Mode Toggle Script
      
      Flow:
      1. User clicks the toggle button
      2. We check if <html> currently has the 'dark' class
      3. We toggle it (add if missing, remove if present)
      4. We save the choice to localStorage for next visit
    */
    
    const toggleBtn = document.getElementById('theme-toggle');
    
    toggleBtn.addEventListener('click', () => {
      // Get reference to the <html> element
      const html = document.documentElement;
      
      // Check current state
      const isDark = html.classList.contains('dark');
      
      if (isDark) {
        // Currently dark → switch to light
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light'); // Remember: user wants light
      } else {
        // Currently light → switch to dark
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark'); // Remember: user wants dark
      }
    });
    
    /*
      Optional: Listen for OS preference changes.
      If the user hasn't manually set a preference,
      follow the OS when it changes.
    */
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-follow OS if user hasn't made an explicit choice
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  </script>
</body>
</html>
```

---

### The Flash of Unstyled Content (FOUC) Problem

> [!IMPORTANT]
> Always place the theme-initialization script in the `<head>` (not at the bottom of `<body>`) and use a synchronous inline script (no `defer` or `async`). This ensures the `.dark` class is applied **before** the browser renders any content, preventing an ugly flash from light to dark mode on page load.

---

### Section Recap 📝

- Use an inline `<script>` in `<head>` to apply the saved theme before page renders
- Toggle the `.dark` class on `document.documentElement` (the `<html>` element)
- Save the choice to `localStorage` using `localStorage.setItem('theme', 'dark')`
- Read it back on load with `localStorage.getItem('theme')`
- Optionally listen for `prefers-color-scheme` changes as a fallback

---

## 9. CSS Variables in Dark Mode

### Why CSS Variables?

CSS custom properties (variables) are the perfect bridge between Tailwind's utility system and dynamic theming. You define a variable once and change its value in dark mode — every place that uses the variable automatically updates.

---

```css
/* src/index.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/*
  Define your theme tokens as CSS variables at the :root level.
  These are the default (light mode) values.
*/
:root {
  --color-bg-primary: #ffffff;      /* Page background */
  --color-bg-secondary: #f9fafb;    /* Card/section backgrounds */
  --color-text-primary: #111827;    /* Main text */
  --color-text-secondary: #6b7280;  /* Muted text */
  --color-border: #e5e7eb;          /* Border color */
  --color-accent: #4f46e5;          /* Accent/brand color */
}

/*
  In dark mode, redefine the same variables with dark-appropriate values.
  Tailwind's dark variant applies when .dark is on <html>.
*/
.dark {
  --color-bg-primary: #0f172a;      /* Deep dark background */
  --color-bg-secondary: #1e293b;    /* Slightly lighter card bg */
  --color-text-primary: #f1f5f9;    /* Near-white text */
  --color-text-secondary: #94a3b8;  /* Muted light text */
  --color-border: #334155;          /* Darker border */
  --color-accent: #818cf8;          /* Lighter accent for contrast */
}
```

Use the variables in regular CSS or inline styles:

```html
<!-- Using CSS variables directly in style attributes -->
<div style="background-color: var(--color-bg-primary); color: var(--color-text-primary);">
  This adapts to dark mode via CSS variables!
</div>
```

Or use them in components:

```css
@layer components {
  .surface {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .surface-elevated {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
  }
}
```

---

### Section Recap 📝

- Define theme tokens as CSS custom properties in `:root` (light mode)
- Redefine the same properties inside `.dark {}` for dark mode values
- Every element using `var(--token-name)` automatically adapts when `.dark` is toggled
- This is the most scalable approach for complex theming

---

## 10. Transitions — `transition`, `duration`, `ease`, `delay`

### Why does this matter?

Instant state changes (a button changing color the millisecond you hover it, a modal appearing with no animation) feel jarring and cheap. Transitions smooth those changes, making your UI feel polished and alive.

---

### Real-World Analogy

A door that slams open vs. one with a hydraulic closer. Both open — but one feels controlled, premium. Transitions are your hydraulic closer.

---

### The Four Transition Properties

Tailwind provides utilities for all four CSS transition sub-properties:

```
transition   → WHAT to animate (which CSS properties)
duration     → HOW LONG (in milliseconds)
ease         → HOW (the timing curve — does it accelerate? decelerate?)
delay        → WHEN to start (pause before the animation begins)
```

---

### `transition` — What to Animate

```html
<!-- transition: Apply transitions to commonly-changed properties -->
<!-- (color, background-color, border-color, text-decoration-color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter) -->
<button class="transition bg-blue-600 hover:bg-blue-800">
  Smooth color change
</button>

<!-- transition-colors: Only transitions color-related properties -->
<div class="transition-colors bg-green-500 hover:bg-green-700 text-white">
  Color only
</div>

<!-- transition-opacity: Only transitions opacity -->
<div class="transition-opacity opacity-50 hover:opacity-100">
  Fade in on hover
</div>

<!-- transition-transform: Only transitions transforms (scale, translate, rotate) -->
<div class="transition-transform hover:scale-110">
  Scale on hover
</div>

<!-- transition-all: Transitions EVERY property (use sparingly — performance cost) -->
<div class="transition-all hover:scale-105 hover:shadow-xl">
  Everything transitions
</div>

<!-- transition-none: Disable transitions (useful to override) -->
<div class="transition-none">No animation</div>
```

---

### `duration` — How Long

```html
<!-- Duration in milliseconds -->
<button class="transition duration-75">75ms (very fast)</button>
<button class="transition duration-100">100ms (fast)</button>
<button class="transition duration-150">150ms (default)</button>
<button class="transition duration-200">200ms (comfortable)</button>
<button class="transition duration-300">300ms (standard)</button>
<button class="transition duration-500">500ms (noticeable)</button>
<button class="transition duration-700">700ms (slow)</button>
<button class="transition duration-1000">1000ms (very slow)</button>
```

---

### `ease` — Timing Curve

```html
<!--
  Timing curves control how the animation accelerates/decelerates.
  
  ease-linear:    Constant speed throughout
  ease-in:        Starts slow, ends fast (like falling)
  ease-out:       Starts fast, ends slow (like braking) ← most natural feeling
  ease-in-out:    Slow start, fast middle, slow end (default for Tailwind's 'ease')
-->
<div class="transition duration-300 ease-linear">Linear</div>
<div class="transition duration-300 ease-in">Ease In</div>
<div class="transition duration-300 ease-out">Ease Out</div>
<div class="transition duration-300 ease-in-out">Ease In-Out</div>
```

---

### `delay` — When to Start

```html
<!-- Delay the transition start by X milliseconds -->
<!-- Useful for staggered animations -->
<div class="group flex gap-4">
  <div class="transition duration-300 group-hover:translate-y-[-4px] delay-0">Item 1</div>
  <div class="transition duration-300 group-hover:translate-y-[-4px] delay-75">Item 2</div>
  <div class="transition duration-300 group-hover:translate-y-[-4px] delay-150">Item 3</div>
  <div class="transition duration-300 group-hover:translate-y-[-4px] delay-300">Item 4</div>
</div>
```

---

### Practical Example: Animated Navigation Link

```html
<a
  href="#"
  class="
    relative                   /* position context for ::after pseudo-element */
    text-gray-700
    hover:text-indigo-600
    transition-colors          /* smooth color change */
    duration-200               /* 200ms — fast and responsive */
    font-medium
    pb-1                       /* bottom padding for underline space */
    after:absolute             /* absolute positioned underline */
    after:bottom-0
    after:left-0
    after:w-0                  /* starts at 0 width */
    after:h-0.5                /* 2px tall underline */
    after:bg-indigo-600
    hover:after:w-full         /* expands to full width on hover */
    after:transition-all       /* animate the width change */
    after:duration-300
    after:ease-out
  "
>
  About Us
</a>
```

---

### Section Recap 📝

- `transition` or `transition-colors` / `transition-transform` / `transition-opacity` define what CSS properties animate
- `duration-{n}` sets animation length in milliseconds (e.g., `duration-300` = 300ms)
- `ease-out` feels the most natural for most UI interactions
- `delay-{n}` staggers animations for visual interest
- Always pair `transition` with `duration` — don't leave duration at browser default

---

## 11. Transform Utilities — `scale`, `translate`, `rotate`, `skew`

### Real-World Analogy

CSS transforms are like a physical camera. `scale` is zoom. `translate` is panning. `rotate` is tilting the camera. `skew` is like tilting one axis while keeping the other still (like a perspective effect).

---

### `scale` — Resize an Element

```html
<!-- Scale uniformly -->
<img class="hover:scale-110 transition-transform duration-300" src="photo.jpg" alt="Photo" />
<!-- scale-110 = 110% size (grows 10%) -->

<!-- Scale down on click -->
<button class="active:scale-95 transition-transform duration-100">
  Click Me
</button>
<!-- scale-95 = 95% size (slightly shrinks — satisfying click feel) -->

<!-- Scale on both axes separately -->
<div class="hover:scale-x-150 transition-transform">Horizontal stretch</div>
<div class="hover:scale-y-75 transition-transform">Vertical squash</div>
```

---

### `translate` — Move an Element

```html
<!-- Translate on hover (slide up effect) -->
<div class="hover:-translate-y-2 transition-transform duration-200">
  Slides up on hover
</div>
<!-- -translate-y-2 moves the element UP by 8px (2 × 4px base unit) -->

<!-- Translate right -->
<div class="hover:translate-x-4 transition-transform duration-200">
  Slides right on hover
</div>

<!-- Floating card effect -->
<div class="
  bg-white rounded-xl shadow-md p-6
  hover:-translate-y-1              /* move up 4px */
  hover:shadow-xl                   /* increase shadow (appears to lift) */
  transition-all
  duration-300
  ease-out
">
  I float upward on hover!
</div>
```

---

### `rotate` — Spin an Element

```html
<!-- Rotate an arrow icon when accordion is open -->
<button class="flex items-center gap-2" onclick="this.classList.toggle('open')">
  FAQ Question
  <svg
    class="w-4 h-4 transition-transform duration-300 [.open_&]:rotate-180"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
  >
    <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" />
  </svg>
</button>

<!-- Available rotate values -->
<div class="rotate-0">0°</div>
<div class="rotate-1">1°</div>
<div class="rotate-2">2°</div>
<div class="rotate-3">3°</div>
<div class="rotate-6">6°</div>
<div class="rotate-12">12°</div>
<div class="rotate-45">45°</div>
<div class="rotate-90">90°</div>
<div class="rotate-180">180°</div>
<div class="-rotate-12">-12° (counterclockwise)</div>
```

---

### `skew` — Tilt Along One Axis

```html
<!-- Skew for decorative backgrounds or diagonal cuts -->
<div class="skew-x-3 bg-indigo-600 text-white py-12 px-8">
  Skewed background section
</div>

<!-- Wrap content in counter-skew to keep text straight -->
<div class="skew-x-3 bg-indigo-600 py-12 px-8">
  <div class="-skew-x-3">
    <p class="text-white text-xl">Text is straight!</p>
  </div>
</div>
```

---

### Section Recap 📝

- `scale-{n}` resizes: `scale-110` = 110%, `scale-95` = 95%
- `translate-{x|y}-{n}` moves elements: `-translate-y-2` slides up by 8px
- `rotate-{n}` spins elements by degrees
- `skew-{x|y}-{n}` tilts along an axis — great for decorative sections
- Always pair transforms with `transition-transform` and `duration-{n}` for smooth animation

---

## 12. Built-In Animations

Tailwind ships with four ready-to-use animations. These loop indefinitely — perfect for loading states, notifications, and attention indicators.

---

### `animate-spin` — Continuous Rotation

```html
<!--
  Perfect for loading spinners.
  The element rotates 360° continuously.
-->
<svg class="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none">
  <!-- Outer ring (mostly visible) -->
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
  <!-- Spinner arc (the moving part) -->
  <path class="opacity-75" fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>

<!-- Loading button with spinner -->
<button class="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg" disabled>
  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
  Saving...
</button>
```

---

### `animate-ping` — Expanding Ring

```html
<!--
  Creates an expanding, fading ring — like a sonar pulse.
  Perfect for "live" indicators (e.g., "Online now", new notifications).
-->
<span class="relative flex h-3 w-3">
  <!-- The ping: an expanding, fading copy of the dot -->
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
  <!-- The solid dot underneath -->
  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
</span>
```

---

### `animate-pulse` — Breathing Fade

```html
<!--
  Fades opacity from 100% to 50% and back.
  Standard loading skeleton animation.
-->

<!-- Loading skeleton card -->
<div class="bg-white rounded-xl p-6 shadow">
  <!-- Fake image placeholder -->
  <div class="animate-pulse bg-gray-200 rounded-lg h-40 mb-4"></div>
  
  <!-- Fake title placeholder -->
  <div class="animate-pulse bg-gray-200 rounded h-5 w-3/4 mb-2"></div>
  
  <!-- Fake text lines -->
  <div class="animate-pulse bg-gray-200 rounded h-4 w-full mb-1"></div>
  <div class="animate-pulse bg-gray-200 rounded h-4 w-5/6 mb-1"></div>
  <div class="animate-pulse bg-gray-200 rounded h-4 w-4/6"></div>
</div>
```

---

### `animate-bounce` — Vertical Bounce

```html
<!--
  Bounces the element up and down continuously.
  Use for scroll indicators or attention-grabbing elements.
-->

<!-- Scroll down indicator -->
<div class="flex justify-center mt-12">
  <div class="animate-bounce text-gray-400">
    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
```

---

### Section Recap 📝

- `animate-spin`: continuous 360° rotation — for loading indicators
- `animate-ping`: expanding ring pulse — for "live" status dots, notification badges
- `animate-pulse`: opacity breathing — for skeleton loading placeholders
- `animate-bounce`: up-down bounce — for scroll hints, attention indicators
- All four loop infinitely; to stop them conditionally, add/remove the class with JavaScript

---

## 13. Custom Keyframe Animations with `@theme` in Tailwind v4

### Why does this matter?

The four built-in animations cover common cases, but you'll inevitably need custom animations: a fade-in from below, a slide-in from the side, a custom notification popup. In Tailwind v4, you define custom keyframes inside `@theme`.

---

### The `@theme` Block

`@theme` in Tailwind v4 is where you extend Tailwind's design tokens — colors, spacing, fonts, and yes, animations.

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /*
    Define keyframes with --animate-{name}: {duration} {easing} {fill-mode};
    Then define the keyframe itself with @keyframes.
    
    Tailwind v4 uses CSS variables for animation definitions.
    The naming convention is:
    --animate-{name}: the full shorthand animation value
    Then the @keyframes are defined normally in CSS.
  */

  /* Fade-in-up animation */
  --animate-fade-in-up: fade-in-up 0.5s ease-out both;

  /* Slide-in from the right */
  --animate-slide-in-right: slide-in-right 0.4s ease-out both;

  /* Pop-in (scale + fade) */
  --animate-pop-in: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;

  /* Shimmer (for skeleton loading with moving highlight) */
  --animate-shimmer: shimmer 1.5s infinite;
}

/* Define the actual keyframes (plain CSS) */

/* Fades in and moves up from slightly below */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);   /* start 20px below final position */
  }
  to {
    opacity: 1;
    transform: translateY(0);      /* end at normal position */
  }
}

/* Slides in from the right side */
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(40px);   /* start 40px to the right */
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Pops in with a slight overshoot (spring effect) */
@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.8);         /* start at 80% size */
  }
  to {
    opacity: 1;
    transform: scale(1);           /* end at full size */
  }
}

/* Moving shimmer highlight (for skeleton loading) */
@keyframes shimmer {
  0% {
    background-position: -200% center;   /* shimmer starts off-screen left */
  }
  100% {
    background-position: 200% center;   /* shimmer ends off-screen right */
  }
}
```

Now use your custom animations with `animate-{name}`:

```html
<!-- These classes are now available! -->

<!-- Content appears fading up from below on page load -->
<section class="animate-fade-in-up">
  <h1 class="text-4xl font-bold">Hello World</h1>
</section>

<!-- Toast notification slides in from the right -->
<div class="animate-slide-in-right fixed top-4 right-4 bg-white shadow-xl rounded-lg p-4">
  ✅ Changes saved successfully!
</div>

<!-- Modal appears with a pop effect -->
<div class="animate-pop-in bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
  <h2 class="text-2xl font-bold">Subscribe!</h2>
</div>

<!-- Shimmer skeleton -->
<div class="
  h-5 w-3/4 rounded
  bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
  bg-[length:200%_100%]
  animate-shimmer
"></div>
```

---

### Staggered Animation Entry (CSS only approach)

```html
<!--
  CSS animation-delay creates a staggered reveal effect.
  Each card appears slightly after the previous one.
-->
<div class="grid grid-cols-3 gap-4">
  <div class="card animate-fade-in-up" style="animation-delay: 0ms">Card 1</div>
  <div class="card animate-fade-in-up" style="animation-delay: 100ms">Card 2</div>
  <div class="card animate-fade-in-up" style="animation-delay: 200ms">Card 3</div>
</div>
```

---

### Section Recap 📝

- Define custom animations in `@theme` using `--animate-{name}` CSS variables
- Write the actual `@keyframes` in plain CSS below `@theme`
- Tailwind auto-generates `animate-{name}` utility classes for each `--animate-*` variable defined
- Use `animation-delay` inline styles for staggered effects
- The `both` fill-mode keeps elements at their final keyframe state after the animation ends

---

## 14. Tailwind v4 Content Detection — Zero-Config and Automatic

### What is "content detection"?

Tailwind is a build tool. It scans your source files for class names and generates **only the CSS for classes you actually use**. This produces tiny CSS files — sometimes under 10KB for an entire app.

In **Tailwind v3**, you had to tell it where to look:

```js
// v3 — tailwind.config.js (you had to configure this manually)
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './public/index.html',
  ]
}
```

If you forgot a file pattern, Tailwind wouldn't include classes from those files — bugs!

In **Tailwind v4**, content detection is **automatic and zero-config**. Tailwind scans your entire project intelligently, finding all files that might contain class names. You don't need to configure anything.

> [!NOTE]
> Tailwind v4 uses the `@import "tailwindcss"` directive in your CSS as the entry point and figures out content detection from there. It ignores `node_modules`, `.git`, and other non-source directories automatically.

---

### Section Recap 📝

- v4 automatically detects all files containing Tailwind classes — no `content` config needed
- Files in `node_modules` and version control folders are excluded automatically
- Your CSS file with `@import "tailwindcss"` is the entry point — Tailwind traces from there

---

## 15. The Dynamic Class Name Problem and the Safelist

### Why does this matter?

This is one of the most common bugs beginners encounter with Tailwind. Understanding it will save you hours of debugging.

---

### The Problem — Template Literals Break Tailwind

Because Tailwind scans your source code as **text** (it doesn't run your JavaScript), it can't know what a computed class name will be at runtime.

```js
// ❌ BROKEN — Tailwind cannot detect these class names at build time

// Tailwind sees the string 'bg-${color}-500' literally.
// It never sees 'bg-red-500' or 'bg-blue-500' — so those are not generated.
const color = 'red';
const className = `bg-${color}-500`; // ❌ bg-red-500 NOT in your CSS!
```

```
ASCII Diagram — What Tailwind Sees vs. What You Expect:

Source file:
  `bg-${color}-500`

Tailwind's text scan finds:
  → the literal string: "bg-${color}-500"
  → This does NOT match any known utility
  → bg-red-500 and bg-blue-500 are NOT included in the output CSS

Result: The class is applied to the element, but there's no CSS for it → invisible.
```

---

### The Fix — Always Use Complete Class Names

```js
// ✅ CORRECT — use a lookup object with complete class names

const colorMap = {
  red:    'bg-red-500',     // Complete class name — Tailwind can scan this
  blue:   'bg-blue-500',    // Complete class name
  green:  'bg-green-500',   // Complete class name
  purple: 'bg-purple-500',  // Complete class name
};

const color = 'red';
const className = colorMap[color]; // 'bg-red-500' — Tailwind sees this!
```

```js
// ✅ CORRECT — use conditional expressions with complete names

function getStatusClass(status) {
  if (status === 'active')   return 'bg-green-100 text-green-800';  // ✅
  if (status === 'pending')  return 'bg-yellow-100 text-yellow-800'; // ✅
  if (status === 'inactive') return 'bg-gray-100 text-gray-800';    // ✅
  return 'bg-gray-100 text-gray-800';
}
```

---

### The Safelist — Force-Including Classes

Sometimes you truly cannot avoid dynamic class names (e.g., you receive class names from a CMS or API). The **safelist** tells Tailwind to always include certain classes, even if it doesn't find them in your source files.

In Tailwind v4, add safelist entries directly in your CSS:

```css
/* src/index.css */
@import "tailwindcss";

/*
  @source inline() forces Tailwind to include specific classes.
  Use pattern matching to include entire color scales.
*/
@source inline("bg-red-{50,100,200,300,400,500,600,700,800,900}");
@source inline("bg-blue-{50,100,200,300,400,500,600,700,800,900}");
@source inline("bg-green-{50,100,200,300,400,500,600,700,800,900}");
@source inline("text-red-{600,700,800} text-blue-{600,700,800} text-green-{600,700,800}");
```

> [!WARNING]
> Overusing the safelist defeats the purpose of Tailwind's purging. Only safelist classes that are genuinely dynamic (coming from a database or API). Don't safelist classes you can simply reference completely in your source code.

---

### Section Recap 📝

- Tailwind scans your **source code as text** — it does NOT run your JavaScript
- Never build class names with template literals like `` `bg-${color}-500` ``
- Always use complete, static class name strings — use a lookup object/map
- Use the safelist (via `@source inline()` in v4) only for truly dynamic class names from external sources
- This is the #1 gotcha for Tailwind beginners — memorize the rule: **always complete class names**

---

## 16. Responsive Design Breakpoints

### How Tailwind's Breakpoints Work

Tailwind uses a **mobile-first** approach. Unprefixed utilities apply at ALL screen sizes. Breakpoint prefixes apply at that size AND ABOVE.

```
sm:   640px and above
md:   768px and above
lg:   1024px and above
xl:   1280px and above
2xl:  1536px and above
```

```
ASCII Diagram — Mobile First Breakpoints:

Phone          Tablet         Laptop         Desktop        Wide Screen
0px ──────── 640px ───────── 768px ───────── 1024px ──────── 1280px ──────── 1536px →
  (base)        sm:            md:             lg:             xl:             2xl:
```

---

### Responsive Layout Examples

```html
<!--
  Responsive grid:
  - Mobile: 1 column
  - Tablet (sm): 2 columns
  - Laptop (lg): 3 columns
  - Desktop (xl): 4 columns
-->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>
```

```html
<!--
  Responsive navigation:
  - Mobile: stacked menu (hidden by default, toggle with JS)
  - md and above: horizontal nav
-->
<nav class="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8">
  <a class="text-gray-700 hover:text-indigo-600 font-medium">Home</a>
  <a class="text-gray-700 hover:text-indigo-600 font-medium">About</a>
  <a class="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
</nav>
```

```html
<!--
  Responsive text sizing:
  Tiny on mobile, gets larger on wider screens
-->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
  Headline That Scales
</h1>
```

```html
<!--
  Show/hide at breakpoints:
  - Mobile only: show sm:hidden
  - Tablet and above only: hidden sm:block
-->
<div class="block sm:hidden">Mobile-only menu icon</div>
<div class="hidden sm:flex">Desktop navigation</div>
```

---

### Custom Breakpoints in Tailwind v4

```css
@theme {
  /* Add a custom 'xs' breakpoint for very small devices */
  --breakpoint-xs: 480px;

  /* Override the default sm breakpoint */
  --breakpoint-sm: 576px;
}
```

```html
<!-- Now xs: works as a breakpoint prefix -->
<div class="text-sm xs:text-base sm:text-lg">Responsive text</div>
```

---

### Section Recap 📝

- Tailwind is **mobile-first**: unprefixed = all sizes; `sm:` = 640px+; `md:` = 768px+; `lg:` = 1024px+
- Always design for mobile first, then layer on breakpoint overrides for larger screens
- Use `hidden sm:block` to show elements only on tablet+; `block sm:hidden` for mobile-only elements
- Custom breakpoints are defined in `@theme` in Tailwind v4 with `--breakpoint-{name}`

---

## 17. State Variants

### What are State Variants?

State variants let you apply styles conditionally based on the element's state (hovered, focused, active, disabled) or its relationship to other elements. They use the colon syntax: `{variant}:{utility}`.

---

### Basic State Variants

```html
<!-- hover: — cursor is over the element -->
<button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
  Hover me
</button>

<!-- focus: — element has keyboard/click focus -->
<input class="
  border border-gray-300 rounded px-3 py-2
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:border-blue-500
" placeholder="Focus me" />

<!-- active: — element is being clicked/pressed -->
<button class="
  bg-blue-600 text-white py-2 px-4 rounded
  active:scale-95        /* shrinks slightly when pressed */
  active:bg-blue-800     /* darkens when pressed */
  transition-all
">
  Press me
</button>

<!-- disabled: — element has the disabled attribute -->
<button
  disabled
  class="
    bg-blue-600 text-white py-2 px-4 rounded
    disabled:opacity-50          /* muted when disabled */
    disabled:cursor-not-allowed  /* show 'no entry' cursor */
    disabled:bg-gray-400         /* gray out when disabled */
  "
>
  Submit
</button>

<!-- visited: — for links that have been visited -->
<a href="#" class="text-blue-600 visited:text-purple-600">Click me</a>

<!-- placeholder: — style input placeholder text -->
<input
  placeholder="Enter email"
  class="placeholder:text-gray-400 placeholder:italic border rounded px-3 py-2"
/>
```

---

### `group-hover` — Style Children Based on Parent Hover

`group` and `group-hover:` are one of Tailwind's most powerful features. When a parent element is hovered, you can style ANY of its children using `group-hover:`.

```html
<!--
  Step 1: Add 'group' to the parent
  Step 2: Add 'group-hover:{utility}' to any child
  When parent is hovered → all group-hover: classes on children activate
-->
<div class="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
  
  <!-- Icon container: changes background on parent hover -->
  <div class="
    w-12 h-12 rounded-lg bg-gray-100
    group-hover:bg-indigo-100    /* bg changes when PARENT is hovered */
    transition-colors duration-300
    flex items-center justify-center
    mb-4
  ">
    <svg class="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" ...>
    </svg>
  </div>

  <!-- Title: changes color on parent hover -->
  <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
    Feature Title
  </h3>

  <!-- Description: changes color on parent hover -->
  <p class="text-gray-500 group-hover:text-gray-700 transition-colors duration-300 mt-2">
    Feature description goes here.
  </p>

  <!-- Arrow: slides right on parent hover -->
  <div class="
    flex items-center gap-1 mt-4
    text-indigo-600 opacity-0
    group-hover:opacity-100      /* arrow appears on parent hover */
    group-hover:translate-x-1    /* arrow slides right */
    transition-all duration-300
    text-sm font-medium
  ">
    Learn more →
  </div>
</div>
```

---

### Named Groups — Multiple Nested Groups

```html
<!--
  When you have nested groups (group inside group),
  you need named groups to target the right ancestor.
-->
<div class="group/outer bg-white rounded-xl p-6">
  <h2 class="group-hover/outer:text-indigo-600">Outer heading</h2>
  
  <div class="group/inner mt-4 bg-gray-50 rounded-lg p-4">
    <p class="group-hover/inner:text-blue-600">
      This changes when the INNER div is hovered
    </p>
    <p class="group-hover/outer:text-indigo-400">
      This changes when the OUTER div is hovered
    </p>
  </div>
</div>
```

---

### `peer` — Style an Element Based on a Sibling's State

`peer` and `peer-{state}:` let you style an element based on the state of a **preceding sibling** element. Most commonly used with form inputs.

```html
<!--
  Pattern:
  1. Add 'peer' to the input
  2. Add 'peer-{state}:{utility}' to a FOLLOWING sibling element
  
  The following sibling responds to the peer element's state.
  ⚠️ The peer element must come BEFORE the peer-responding element in HTML.
-->

<!-- Floating label form field -->
<div class="relative">
  <input
    type="email"
    id="email"
    placeholder=" "     <!-- Note: space placeholder required for :placeholder-shown trick -->
    class="
      peer                /* Mark this as the peer element */
      block w-full
      border border-gray-300 rounded-lg
      px-3 pt-6 pb-2     /* Extra top padding for the floating label */
      focus:outline-none
      focus:ring-2 focus:ring-indigo-500
      focus:border-indigo-500
      placeholder-transparent  /* hide placeholder — we use the label instead */
    "
  />
  <label
    for="email"
    class="
      absolute left-3 text-gray-400 text-sm
      transition-all duration-200
      /* When input has placeholder shown (= empty), label sits inside input */
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
      /* When input has content (placeholder hidden) OR is focused, label floats up */
      peer-focus:top-2 peer-focus:translate-y-0
      peer-focus:text-xs peer-focus:text-indigo-600
      top-2 text-xs text-indigo-600   /* default state when has value */
    "
  >
    Email Address
  </label>
</div>

<!-- Validation state with peer -->
<div>
  <input
    type="email"
    required
    class="
      peer
      w-full border rounded-lg px-3 py-2
      focus:outline-none
      invalid:border-red-400    /* red border when invalid email format */
      valid:border-green-400    /* green border when valid */
    "
  />
  <!-- Error message: only visible when peer input is invalid AND has been interacted with -->
  <p class="
    hidden               /* hidden by default */
    peer-invalid:block   /* shows when peer is invalid */
    text-red-500 text-sm mt-1
  ">
    Please enter a valid email address.
  </p>
</div>
```

---

### Section Recap 📝

- `hover:`, `focus:`, `active:`, `disabled:` style elements based on their own state
- `group` + `group-hover:` lets you style ANY child when the parent is hovered — powerful for card interactions
- Use named groups (`group/name`) when nesting groups to target the right ancestor
- `peer` + `peer-{state}:` styles a following sibling based on the preceding sibling's state — ideal for form labels and validation messages

---

## 🧪 Lab 1: Dark Mode Toggle with `localStorage` (40 min)

### Objective

Build a complete, polished page with a working dark/light mode toggle that remembers the user's preference across page refreshes.

---

### What You'll Build

A personal profile card page with:
- A navigation bar with a theme toggle button (moon/sun icon)
- A profile card with avatar, bio, stats, and social links
- Full dark mode support for every element
- localStorage persistence so the preference survives page refreshes

---

### Step-by-Step Instructions

#### Step 1: Project Setup (5 min)

1. Create a new folder: `lab1-dark-mode/`
2. Inside it, create `index.html` and `src/input.css`
3. Install Tailwind v4:
   ```bash
   npm install tailwindcss @tailwindcss/cli
   ```
4. Add a build script to `package.json`:
   ```json
   {
     "scripts": {
       "dev": "npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch"
     }
   }
   ```
5. Create `src/input.css`:
   ```css
   @import "tailwindcss";
   @custom-variant dark (&:where(.dark, .dark *));
   ```

#### Step 2: HTML Structure (10 min)

Create the full HTML structure. Your page should have:

```
┌──────────────────────────────────────────────────────┐
│  NavBar: [Logo]                  [☾ / ☀ Toggle]     │
├──────────────────────────────────────────────────────┤
│                                                      │
│          [Avatar Image]                              │
│          John Developer                              │
│          Full-Stack Engineer @ Acme Corp             │
│          ★ 4.9 | 👥 2,400 followers | 📦 48 repos   │
│                                                      │
│          [GitHub]  [Twitter]  [LinkedIn]             │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ JavaScript  │  │  React      │  │  Node.js    │  │
│  │ Expert      │  │  Developer  │  │  Backend    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Step 3: Dark Mode Classes (10 min)

For every element, add both the light and dark variant:

| Element | Light mode | Dark mode |
|---|---|---|
| `<body>` | `bg-gray-50` | `dark:bg-gray-900` |
| Nav | `bg-white border-gray-200` | `dark:bg-gray-800 dark:border-gray-700` |
| Card | `bg-white shadow-lg` | `dark:bg-gray-800 dark:shadow-gray-900/50` |
| Headings | `text-gray-900` | `dark:text-gray-100` |
| Body text | `text-gray-600` | `dark:text-gray-400` |
| Badges | `bg-gray-100 text-gray-700` | `dark:bg-gray-700 dark:text-gray-300` |

#### Step 4: Implement the Toggle Script (10 min)

Implement the full toggle script as described in Section 8:
- Flash-prevention script in `<head>`
- Toggle button click handler
- `localStorage` save/restore logic
- OS preference change listener

#### Step 5: Polishing (5 min)

Add these finishing touches:
- `transition-colors duration-300` on `<body>` for smooth theme switching
- Use `transform` and `transition` on the toggle button icon for a rotation animation when switching
- Make the page responsive for mobile

#### ✅ Success Criteria

- [ ] Page renders in correct theme immediately (no flash)
- [ ] Toggle button changes light → dark → light smoothly
- [ ] Icons swap (moon ↔ sun) when toggling
- [ ] Preference persists after page refresh
- [ ] All elements have appropriate light AND dark mode classes
- [ ] Transition animation is smooth (≤ 300ms)
- [ ] Page looks great on both mobile and desktop

---

## 🧪 Lab 2: Custom Accessible Modal with Animations (50 min)

### Objective

Build a modal dialog from scratch with:
- A trigger button that opens it
- Smooth entry/exit animations using custom keyframes
- Proper accessibility (focus trap, Escape key, ARIA attributes)
- Dark mode support
- A backdrop blur/overlay

---

### What You'll Build

```
┌──────────────────────────────────────────────┐
│  [darkened backdrop with backdrop-blur]       │
│                                              │
│    ┌──────────────────────────────────────┐  │
│    │  ╳                                   │  │
│    │                                      │  │
│    │  🚀 Join our Newsletter              │  │
│    │                                      │  │
│    │  Get weekly tips on web development  │  │
│    │                                      │  │
│    │  ┌──────────────────────────┐        │  │
│    │  │ Enter your email...      │        │  │
│    │  └──────────────────────────┘        │  │
│    │                                      │  │
│    │  [Subscribe Now]  [No thanks]        │  │
│    │                                      │  │
│    └──────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

---

### Step-by-Step Instructions

#### Step 1: Define the Custom Animations (5 min)

Add these keyframes to your CSS:

```css
@theme {
  --animate-modal-in: modal-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  --animate-modal-out: modal-out 0.2s ease-in both;
  --animate-backdrop-in: backdrop-in 0.3s ease-out both;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes modal-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}

@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

#### Step 2: Build the HTML Structure (15 min)

```html
<!-- Trigger button -->
<button id="open-modal"
  class="btn-primary animate-fade-in-up">
  Subscribe to Newsletter
</button>

<!-- Modal (hidden by default with 'hidden' class) -->
<div
  id="modal-backdrop"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  class="
    hidden                       /* hidden until JS shows it */
    fixed inset-0                /* covers entire viewport */
    z-50                         /* on top of everything */
    flex items-center            /* vertically center the modal */
    justify-center               /* horizontally center the modal */
    p-4                          /* padding for mobile */
    bg-black/50                  /* semi-transparent black backdrop */
    backdrop-blur-sm             /* blur content behind modal */
    animate-backdrop-in
  "
>
  <div
    id="modal-content"
    class="
      relative                   /* for the close button positioning */
      bg-white dark:bg-gray-800  /* white in light, dark gray in dark mode */
      rounded-2xl                /* heavily rounded corners */
      shadow-2xl                 /* large shadow */
      w-full max-w-md            /* full width on mobile, max 448px on larger */
      p-8                        /* generous padding */
      animate-modal-in           /* pop-in animation on open */
    "
  >
    <!-- Close button -->
    <button
      id="close-modal"
      aria-label="Close modal"
      class="
        absolute top-4 right-4
        w-8 h-8 rounded-full
        bg-gray-100 dark:bg-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-600
        flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
    >
      <svg class="w-4 h-4" ...>✕</svg>
    </button>
    
    <!-- Modal content -->
    <div class="text-center">
      <div class="text-4xl mb-4">🚀</div>
      <h2 id="modal-title" class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Join our Newsletter
      </h2>
      <p id="modal-description" class="text-gray-500 dark:text-gray-400 mb-6">
        Get weekly tips on web development, design, and career growth.
      </p>
      
      <input
        type="email"
        placeholder="Enter your email..."
        class="
          w-full px-4 py-3 rounded-xl
          border border-gray-200 dark:border-gray-600
          bg-gray-50 dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          mb-4
          transition-colors
        "
      />
      
      <div class="flex gap-3">
        <button class="flex-1 btn-primary">Subscribe Now</button>
        <button id="cancel-modal" class="flex-1 btn-secondary">No thanks</button>
      </div>
    </div>
  </div>
</div>
```

#### Step 3: Implement the Accessibility-Focused JavaScript (20 min)

```js
/*
  Modal Accessibility Requirements:
  1. Focus moves INTO the modal when it opens
  2. Tab key cycles ONLY through modal elements (focus trap)
  3. Escape key closes the modal
  4. Focus returns to the trigger button when modal closes
  5. Backdrop click closes the modal
*/

const openBtn = document.getElementById('open-modal');
const closeBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-modal');
const backdrop = document.getElementById('modal-backdrop');
const modal = document.getElementById('modal-content');

// Query all focusable elements inside the modal
function getFocusableElements() {
  return modal.querySelectorAll(
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
}

function openModal() {
  backdrop.classList.remove('hidden');

  // Move focus to the first focusable element inside the modal
  setTimeout(() => {
    const focusable = getFocusableElements();
    if (focusable.length) focusable[0].focus();
  }, 50); // small delay allows the element to become visible first
}

function closeModal() {
  backdrop.classList.add('hidden');
  openBtn.focus(); // Return focus to the trigger
}

// Open on button click
openBtn.addEventListener('click', openModal);

// Close on X button
closeBtn.addEventListener('click', closeModal);

// Close on Cancel button
cancelBtn.addEventListener('click', closeModal);

// Close on backdrop click (but NOT modal content click)
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal(); // Only close if clicking the backdrop itself
});

// Escape key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
    closeModal();
  }
});

// Focus trap — keep Tab cycling within modal
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const focusable = Array.from(getFocusableElements());
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    // Shift+Tab: going backwards
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus(); // Wrap to last element
    }
  } else {
    // Tab: going forwards
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus(); // Wrap to first element
    }
  }
});
```

#### Step 4: Testing Checklist (10 min)

Test each of these scenarios:

- [ ] Modal opens with pop-in animation
- [ ] Backdrop is blurred/darkened
- [ ] Modal closes with clicking ✕
- [ ] Modal closes with clicking Cancel
- [ ] Modal closes with clicking backdrop
- [ ] Modal closes with Escape key
- [ ] Tab key cycles through modal elements without leaving the modal
- [ ] Shift+Tab cycles in reverse without leaving the modal
- [ ] Focus returns to "Subscribe" button after closing
- [ ] Works in dark mode
- [ ] Works on mobile (modal is full-width, readable)
- [ ] Screen reader (VoiceOver/NVDA) announces the modal title on open

#### ✅ Success Criteria

- [ ] Entry animation is smooth and springy
- [ ] All 6 close mechanisms work
- [ ] Focus trap prevents tab-escaping
- [ ] ARIA attributes are present and correct
- [ ] Dark mode is fully supported
- [ ] Mobile layout is clean

---

## 📝 Assignment: StartupLaunch Project Part 4 — Dark Mode & Animations

### Overview

Extend your StartupLaunch landing page (built in Parts 1–3) with a complete dark mode system and polish the page with animations and micro-interactions.

---

### Requirements

#### Part A — Dark Mode Implementation (40 points)

1. **Configure class-based dark mode** in your CSS with `@custom-variant dark`
2. **Flash-prevention script** in `<head>` — no white flash before dark mode loads
3. **Toggle button** in the navigation — moon/sun icon swap
4. **localStorage persistence** — preference survives refresh and new tabs
5. **Complete dark mode coverage** — every section must have appropriate dark variants:
   - Hero section
   - Features/benefits section
   - Pricing cards
   - Testimonials
   - CTA section
   - Footer
   - Navigation

> [!IMPORTANT]
> Every text color, background color, border color, and shadow should have a `dark:` variant. Dark mode must feel like a complete, intentional design — not an afterthought.

#### Part B — Animated Hero Section (20 points)

6. **Custom keyframe animation** defined in `@theme` for the hero content:
   - Headline fades and slides up on page load
   - Subheadline follows 150ms later
   - CTA buttons appear 300ms after headline
7. **Hero illustration/image** has a subtle `animate-pulse` or floating effect
8. **Animated gradient background** that slowly shifts colors

#### Part C — Interactive Feature Cards (20 points)

9. **Hover state on feature cards** using `group` and `group-hover`:
   - Card lifts with `hover:-translate-y-1 hover:shadow-xl`
   - Icon color changes
   - "Learn more →" arrow appears and slides right
10. **Staggered card reveal** with increasing `animation-delay` on each card

#### Part D — Animated CTA Button (10 points)

11. **Primary CTA button** with:
    - Smooth scale on hover: `hover:scale-105`
    - Scale down on click: `active:scale-95`
    - Pulsing glow ring: `animate-ping` on a background ring element
    - Transition smoothing on all states

#### Part E — Form Validation States (10 points)

12. **Email signup form** (if present) with:
    - `@tailwindcss/forms` plugin installed and activated
    - `valid:` and `invalid:` styling on the email input
    - `peer` + `peer-invalid:` error message visibility
    - Focus state with `focus:ring-2 focus:ring-indigo-500`

---

### Grading Breakdown

| Requirement | Points |
|---|---|
| Dark mode configured + flash prevention | 10 |
| Toggle button with icon swap | 10 |
| localStorage persistence | 10 |
| All sections have dark variants | 10 |
| Hero animations (keyframes in @theme) | 20 |
| Feature card hover interactions (group-hover) | 20 |
| Animated CTA button | 10 |
| Form validation states | 10 |
| **Total** | **100** |

---

### Submission Instructions

1. Ensure your project builds without errors (`npm run build`)
2. All functionality works in both light AND dark mode
3. Test on Chrome, Firefox, and Safari (check for visual consistency)
4. Submit your GitHub repository URL to the course portal
5. Include a brief `README.md` describing the features you implemented

---

## 📚 Resources

| Resource | URL | Description |
|---|---|---|
| Tailwind CSS v4 Docs | https://tailwindcss.com/docs | Official documentation — primary reference |
| Headless UI Docs | https://headlessui.com | Accessible component primitives |
| DaisyUI Components | https://daisyui.com/components | Pre-styled component reference |
| @tailwindcss/typography | https://github.com/tailwindlabs/tailwindcss-typography | Typography plugin docs |
| Tailwind v4 Migration Guide | https://tailwindcss.com/docs/upgrade-guide | v3 → v4 migration reference |
| CSS Tricks — Dark Mode | https://css-tricks.com/dark-modes-with-css | Deep dive on dark mode patterns |
| WebAIM — Modal Accessibility | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal | ARIA dialog pattern reference |
| MDN — CSS Custom Properties | https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS variables reference |
| MDN — prefers-color-scheme | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme | OS color scheme media query |
| Cubic Bezier Tool | https://cubic-bezier.com | Visual tool for custom easing curves |

---

## 🔑 Key Takeaways

1. **`@apply` is a tool, not a requirement.** Extract to `@layer components` only when a pattern is repeated and has a semantic name. Keep utilities inline for one-off elements.

2. **Headless UI gives you behavior; you provide style.** It's the right choice for production apps that need genuine accessibility. DaisyUI gives you style; choose it for speed.

3. **Tailwind v4's `@plugin` makes plugin activation frictionless.** No config file changes needed — one line in your CSS activates any plugin.

4. **The `.prose` class is magic for CMS content.** One class turns unstyled HTML into beautifully typeset content. Always use `dark:prose-invert` for dark mode.

5. **Dark mode in v4 defaults to OS preference** but can be switched to class-based with `@custom-variant dark` for manual toggle support.

6. **Always place the theme-init script in `<head>` before any content.** This prevents the flash of wrong theme on page load.

7. **NEVER build Tailwind class names with template literals.** Tailwind scans source as text — dynamic class construction breaks the build. Always use complete, static class name strings.

8. **`group` + `group-hover:` unlocks parent→child interaction.** It is one of the most powerful Tailwind patterns for interactive cards, menus, and UI components.

9. **`peer` + `peer-invalid:`/`peer-focus:` enables pure-CSS form interactions.** Floating labels, error messages, and validation states require no JavaScript.

10. **Animations should be purposeful, not decorative.** Use `animate-pulse` for loading, `animate-spin` for processing, `animate-ping` for attention, `animate-bounce` for direction. Custom keyframes should add meaning, not just visual noise.

---

## 🚨 Common Mistakes & How to Avoid Them

| Mistake | Why It Happens | How to Avoid It |
|---|---|---|
| Using `@apply` outside `@layer components` | Not knowing where `@apply` must live | Always wrap `@apply` rules in `@layer components { }` |
| Building class names with template literals | Feels natural from JavaScript string interpolation | Always use complete class names; use a lookup object for dynamic values |
| Not adding `dark:` variants everywhere | Forgetting some elements in dark mode | Systematically go section by section; every bg, text, and border color needs a `dark:` pair |
| White flash before dark mode on reload | Theme toggle script placed in `<body>` | Move the theme-init script to `<head>` as an inline (no defer/async) script |
| Over-extracting with `@apply` | Thinking it's always better to have CSS classes | Ask: "Is this reused in 3+ places with a clear semantic name?" If no, keep inline |
| Using `transition-all` everywhere | Seems like the easy option | Use specific transitions (`transition-colors`, `transition-transform`) — `transition-all` has performance costs |
| `group-hover:` not working | Forgetting to add `group` to the parent | Always add the `group` class to the ancestor element |
| `peer-{state}:` not working | Peer element comes AFTER the responder in HTML | The `peer` element must come BEFORE the element using `peer-{state}:` |
| `prose` making text too wide | Default prose has a `max-w-prose` constraint | Add `max-w-none` to override the max-width when you want full-width text |
| Modal not accessible | Building modal with just CSS and forgetting JS | Always implement focus trapping, Escape key handler, and ARIA attributes |
| Custom `@theme` animation not working | Typo in variable name or wrong naming convention | Use `--animate-{name}` format; the generated class will be `animate-{name}` |
| `@plugin` not activating | Package not installed via npm | Run `npm install {package-name}` first; `@plugin` activates — it doesn't install |
| Arbitrary values in `@apply` | Using `@apply text-[#ff3300]` | Use CSS custom properties or regular CSS for values not in Tailwind's scale |

---

*End of Lecture 18 — Tailwind CSS: Advanced Patterns, Components & Plugins*