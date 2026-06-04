# Lecture 18 — Tailwind CSS: Advanced Patterns, Components & Plugins

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Use `@apply` to extract reusable component classes from Tailwind utilities
- Install and use Tailwind plugins (`typography`, `forms`)
- Implement a dark mode system with `localStorage` persistence and a toggle button
- Add transitions, transforms, and custom keyframe animations in Tailwind v4
- Understand Tailwind v4's automatic content detection and the dynamic class name problem
- Use responsive breakpoints and state variants (`hover:`, `focus:`, `group-hover:`)

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. `@apply` vs Inline Utilities
2. Tailwind Plugins (Typography, Forms)
3. Dark Mode Implementation
4. Transitions & Animations
5. Content Detection & Safelists
6. Responsive Breakpoints & State Variants

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: Dark Mode Toggle with `localStorage`
2. Lab 2: Custom Modal with Animations

---

## 1. `@apply` — Extracting Reusable Components

When you find yourself repeating the same long chain of utilities, extract them into a reusable class:

```css
/* In your CSS file */
.btn-primary {
  @apply px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg
         hover:bg-indigo-700 focus:outline-none focus:ring-2
         focus:ring-indigo-500 focus:ring-offset-2
         transition-colors duration-200;
}
```

```html
<!-- Now use it cleanly in HTML -->
<button class="btn-primary">Get Started</button>
```

> [!WARNING]
> Don't overuse `@apply`! If you extract every group of utilities into a class, you lose the main benefit of Tailwind (seeing styles directly in HTML). Only extract when you have **true repetition** across many files.

---

## 2. Tailwind Plugins

### Typography Plugin (`@tailwindcss/typography`)

Styles rendered Markdown/HTML content with beautiful defaults using the `.prose` class:

```bash
npm install @tailwindcss/typography
```

```css
/* In your main CSS */
@plugin "@tailwindcss/typography";
```

```html
<article class="prose lg:prose-xl dark:prose-invert">
  <h1>My Blog Post</h1>
  <p>This paragraph is beautifully styled automatically.</p>
  <pre><code>console.log("Styled code block!");</code></pre>
</article>
```

### Forms Plugin (`@tailwindcss/forms`)

Resets browser form elements to a clean, consistent baseline:

```bash
npm install @tailwindcss/forms
```

```css
@plugin "@tailwindcss/forms";
```

Now `<input>`, `<select>`, `<textarea>` look clean by default and respond to Tailwind utilities.

---

## 3. Dark Mode

Tailwind v4 supports class-based dark mode. Define a custom variant:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Using Dark Mode Classes

```html
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-black dark:text-white">Hello</h1>
</body>
```

### Toggle with JavaScript and `localStorage`

```html
<script>
  // Prevent flash of wrong theme on page load
  if (localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

```js
// Toggle button handler
function toggleDarkMode() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
}
```

> [!IMPORTANT]
> Place the flash-prevention `<script>` in `<head>` (before any CSS loads) to prevent a brief white flash when the user prefers dark mode.

---

## 4. Transitions & Transforms

### Transitions

```html
<button class="bg-blue-500 hover:bg-blue-700 transition-colors duration-300 ease-in-out">
  Hover Me
</button>
```

| Class | What it does |
|-------|-------------|
| `transition` | Transitions all properties |
| `transition-colors` | Only color-related properties |
| `transition-transform` | Only transform |
| `duration-300` | 300ms duration |
| `ease-in-out` | Timing function |
| `delay-150` | 150ms delay |

### Transforms

```html
<div class="hover:scale-105 hover:-translate-y-1 hover:rotate-1 transition-transform duration-200">
  Card content
</div>
```

### Built-in Animations

```html
<div class="animate-spin">🔄</div>    <!-- Continuous rotation -->
<div class="animate-bounce">⬇️</div>   <!-- Bouncing -->
<div class="animate-pulse">💗</div>    <!-- Pulsing opacity -->
<div class="animate-ping">🔔</div>    <!-- Expanding ping -->
```

### Custom Keyframe Animations (Tailwind v4)

```css
@theme {
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}
```

```html
<div class="animate-fade-in">I fade in smoothly!</div>
```

---

## 5. Content Detection & Dynamic Classes

Tailwind v4 automatically detects which classes you use in your files. But **dynamic class names** built at runtime will be purged:

```js
// ❌ Tailwind can't see this — it will be purged!
const color = isError ? "red" : "green";
element.className = `bg-${color}-500`;

// ✅ Use complete class names so Tailwind can detect them
element.className = isError ? "bg-red-500" : "bg-green-500";
```

If you absolutely need dynamic classes, use the `@source` directive to add them to the safelist:

```css
@source inline("bg-red-500 bg-green-500 bg-blue-500");
```

---

## 6. Responsive Breakpoints & State Variants

### Responsive (Mobile-First)

```html
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

| Prefix | Min-Width | Typical Device |
|--------|-----------|---------------|
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large monitors |

### State Variants

```html
<!-- Hover, Focus, Active -->
<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2 active:scale-95">

<!-- Group hover: parent hover affects child -->
<div class="group">
  <p class="group-hover:text-blue-500">I change when the parent is hovered!</p>
</div>

<!-- Peer: sibling state affects another sibling -->
<input class="peer" type="email" />
<p class="hidden peer-invalid:block text-red-500">Invalid email</p>
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Over-extracting with `@apply` | Only extract truly repeated patterns (buttons, badges). Keep most utilities inline. |
| Building class names dynamically with string concatenation | Always use complete, static class strings so Tailwind can detect them |
| Forgetting the dark mode flash-prevention script | Put the theme-check script in `<head>` before CSS loads |
| Using `transition` on every element | Only add transitions where users expect interactive feedback (buttons, links, cards) |
| Not testing dark mode for every section | Every background, text, border, and shadow needs a `dark:` variant |

---

## 🧪 Practice Labs

### Lab 1 — Dark Mode Toggle with `localStorage` (40 min)
1. Create a page with a sun/moon toggle button in the navbar
2. Implement class-based dark mode with `@custom-variant dark`
3. Save the preference to `localStorage`
4. Add the flash-prevention script in `<head>`
5. Ensure every section has proper `dark:` variants

### Lab 2 — Custom Modal with Animations (50 min)
1. Create a modal that opens when a button is clicked
2. The backdrop should fade in (`animate-fade-in`)
3. The modal content should slide up (`animate-slide-up`)
4. Define both custom animations in `@theme`
5. Add `group-hover:` effects on the feature cards behind the modal

---

## 📝 Assignment: StartupLaunch Project — Part 4: Dark Mode & Animations

### Requirements
1. Implement class-based dark mode with toggle button and `localStorage` persistence
2. Add `dark:` variants to every section (hero, features, pricing, testimonials, footer)
3. Create a custom `@keyframes` hero entrance animation (fade + slide up)
4. Add `hover:-translate-y-1 hover:shadow-xl` effects to feature cards using `group` and `group-hover:`
5. Create an animated CTA button with `hover:scale-105` and `active:scale-95`
6. Install `@tailwindcss/forms` and add `valid:`/`invalid:` styling to an email input

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Tailwind CSS Docs | https://tailwindcss.com/docs |
| Tailwind Typography Plugin | https://tailwindcss.com/docs/typography-plugin |
| Tailwind Forms Plugin | https://github.com/tailwindlabs/tailwindcss-forms |
| Headless UI | https://headlessui.com/ |

---

## 📌 Key Takeaways
- **`@apply`** extracts repeated utility chains into reusable classes — but use sparingly
- **Typography plugin** (`.prose`) beautifully styles rendered Markdown/HTML content
- **Dark mode** in Tailwind uses class-based toggling with `localStorage` for persistence
- **Custom animations** are defined in `@theme` using `@keyframes` in Tailwind v4
- **Dynamic class names** (string concatenation) will be purged — always use complete static class strings
- **State variants** (`hover:`, `focus:`, `group-hover:`, `peer-invalid:`) make interactive UIs without JavaScript

---

**Next Lecture:** [Lecture 19 — TypeScript Fundamentals: Types, Interfaces & Compilation](./19%20-%20TypeScript%20Fundamentals%20-%20Types,%20Interfaces%20%26%20Compilation.md)
