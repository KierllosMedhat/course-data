# Lecture 18 — Tailwind CSS v4: Advanced Patterns, Components & Plugins

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Extract reusable component classes using `@apply` (and know when not to)
- Choose between Tailwind component libraries (Headless UI, DaisyUI)
- Extend Tailwind with official plugins using the new v4 `@plugin` directive
- Implement manual dark mode using v4 `@custom-variant`
- Create animations and custom keyframes using v4 `@theme`
- Understand how Tailwind v4 automatically detects source files without config

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Component extraction: `@apply` vs inline utilities
2. Component libraries: Headless UI, DaisyUI
3. Official plugins: Typography & Forms via `@plugin`
4. Dark mode: automatic vs manual toggle (`@custom-variant`)
5. Animations: transitions, transforms, and custom keyframes
6. Tailwind v4's Automatic Content Detection

### Part 2 — Practice & Lab (~90–120 min)
1. Build a dark mode toggle with `localStorage`
2. Create an animated, accessible modal
3. StartupLaunch Project Part 4: Dark Mode & Animations

---

## 1. Component Extraction — `@apply`

**The problem:** When the same long string of utilities appears on every button, maintaining consistency becomes difficult.

**The solution:** Extract patterns into CSS classes using Tailwind's `@apply` directive.

```css
/* style.css */
@import "tailwindcss";

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg
           hover:bg-blue-700 transition duration-200;
  }
}
```

```html
<button class="btn-primary">Save Changes</button>
```

> [!WARNING]
> Don't over-extract! The Tailwind team recommends keeping utilities inline by default. If you are using React or Angular, extract the button into a true *Component* instead of a CSS class.

---

## 2. Component Libraries

When you need pre-built, interactive components, these libraries are built for Tailwind:

### Headless UI (Unstyled, Accessible)
- Built by the Tailwind team.
- Provides **behaviour only** (keyboard navigation, screen readers).
- You add the "looks" with Tailwind utilities.

### DaisyUI (Styled Components)
- Adds semantic classes like `.btn`, `.card`, `.modal` on top of Tailwind.
- Fully themeable.
- Feels like Bootstrap but powered by Tailwind.

---

## 3. Official Plugins in Tailwind v4

Plugins extend Tailwind with new utilities. In Tailwind v4, because `tailwind.config.js` is gone, you import plugins directly in your CSS file using `@plugin`.

### Typography Plugin
Beautifies long-form text (articles, blogs) automatically.

```css
/* style.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

```html
<article class="prose lg:prose-xl dark:prose-invert">
  <h1>Article Title</h1>
  <p>All headings, paragraphs, and lists are automatically styled.</p>
</article>
```

---

## 4. Dark Mode in Tailwind v4

By default, the `dark:` variant in Tailwind v4 uses the `prefers-color-scheme` media query (it follows the user's OS settings automatically).

### Manual Dark Mode Toggle
If you want a "Dark Mode" button on your site, you need to override the default behavior so it relies on a `.dark` class instead of the OS preference.

In Tailwind v4, you do this with a custom variant in your CSS:

```css
/* style.css */
@import "tailwindcss";

/* Override 'dark' to trigger when a parent has the .dark class */
@custom-variant dark (&:where(.dark, .dark *));
```

**HTML & JS Toggle:**
```html
<html class="dark">
  <body class="bg-white dark:bg-gray-900 text-black dark:text-white">
```
```js
document.getElementById('darkToggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});
```

---

## 5. Animations & Transitions

### Transitions
```html
<button class="hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
  Hover to jump
</button>
```

### Built-in Animations
```html
<div class="animate-spin">🔄</div>
<div class="animate-pulse">Loading...</div>
<div class="animate-bounce">⬇️</div>
```

### Custom Animations in Tailwind v4
In Tailwind v4, define custom keyframes directly using `@theme`!

```css
@import "tailwindcss";

@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;

  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
}
```

```html
<div class="animate-wiggle">👋</div>
```

---

## 6. Tailwind v4 Content Detection

In Tailwind v3, you had to carefully configure the `content: []` array in your `tailwind.config.js` so the compiler knew which files to scan for classes.

**In Tailwind v4, this is automatic!**
The Vite plugin automatically detects all your `.html`, `.js`, and `.ts` files and compiles only the CSS classes you actually used. It's truly zero-configuration.

> [!WARNING]
> Dynamic class names **still don't work**. Tailwind scans files as plain text. 
> `class="bg-${color}-500"` will NOT be compiled. Always use full class names!

---

## 🧪 Practice Labs

### Lab 1: Dark Mode Toggle (40 min)
1. Open `labs/lab1-darkmode/`.
2. Configure manual dark mode in `style.css` using `@custom-variant`.
3. Build a toggle button that switches the `.dark` class on the `<html>` element and saves the choice to `localStorage`.

### Lab 2: Custom Accessible Modal (50 min)
1. Open `labs/lab2-modal/`.
2. Create a "Contact Us" modal.
3. Style the backdrop with `bg-black/50 backdrop-blur-sm`.
4. Add entrance transitions using Tailwind utilities.
5. Ensure it closes when pressing the `Escape` key.

---

## 📝 Assignment: StartupLaunch Project — Part 4

This is the final phase of the StartupLaunch CSS module!

### Requirements
1. Open your StartupLaunch Vite project from Part 3.
2. Implement a **Manual Dark Mode Toggle** in the Navbar.
3. Ensure every section (Hero, Features, Pricing) has `dark:` variants configured.
4. Use the `@plugin "@tailwindcss/typography"` to style a new "Blog" section.
5. Create a **Custom Animation** in your `style.css` using `@theme` and apply it to an element on the homepage.
6. Make sure all buttons have smooth hover and active `transition` effects.

Congratulations! You've mastered modern utility-first CSS styling.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Tailwind CSS v4 Configuration | https://tailwindcss.com/docs/adding-custom-styles |
| Tailwind Typography Plugin | https://tailwindcss.com/docs/typography-plugin |

---

## 📌 Key Takeaways
- Use `@apply` sparingly. Use component frameworks (Angular, React) for real reuse.
- **Tailwind v4 is zero-config**: it automatically finds your HTML/JS files!
- Load plugins using the **`@plugin`** directive in your CSS.
- Configure manual dark mode using **`@custom-variant`**.
- Define custom animations and design tokens using **`@theme`**.

---

**Next Lecture:** [Lecture 19 — TypeScript Fundamentals: Types, Interfaces & Compilation](./19%20-%20TypeScript%20Fundamentals%20—%20Types,%20Interfaces%20%26%20Compilation.md) — Module 4 begins!