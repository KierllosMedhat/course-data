# Lecture 03 — CSS3 Fundamentals & Selectors

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand CSS syntax and how to apply styles to HTML elements
- Use different selector types to target specific elements
- Calculate specificity and understand the cascade, including modern `@layer` support
- Apply the box model to control spacing and sizing
- Define and use CSS custom properties (variables) for consistent theming
- Set up typography using modern system fonts and Google Fonts
- Write modern CSS using Native Nesting
- Work with modern color spaces like `oklch`

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. CSS Syntax & Rules
2. Selector Types & Native Nesting
3. Specificity, the Cascade, and `@layer`
4. The Box Model & `box-sizing`
5. Colours & Modern `oklch()`
6. Custom Properties (Variables)
7. Typography & Web Fonts

### Part 2 — Practice & Lab (~90–120 minutes)
1. Style your Lecture 1 Profile Page
2. Specificity & Layer Wars
3. Portfolio Project Part 3: Global Styling & Design Tokens

---

## 1. What is CSS?

**CSS** stands for **Cascading Style Sheets**. If HTML defines the *structure* of a web page (what things are), CSS defines the *presentation* (how things look) — colours, fonts, spacing, layout, and animations.

### Three Ways to Include CSS

| Method | How | When to Use |
|--------|-----|-------------|
| **Inline** | `<p style="color: red;">` | Quick testing only — avoid in production |
| **Internal** | `<style>` block inside `<head>` | Small, single-page projects |
| **External** | `<link rel="stylesheet" href="styles.css">` | All real projects — separates content from presentation |

> [!TIP]
> Always use **external stylesheets** in your projects. This keeps your HTML clean and your styles reusable.

---

## 2. Selector Types & Native Nesting

Selectors determine *which* HTML elements your CSS rules apply to.

| Selector Type | Syntax | Example |
|--------------|--------|---------|
| **Element** | `element` | `p` |
| **Class** | `.classname` | `.highlight` |
| **ID** | `#idname` | `#nav` |
| **Grouping** | `sel1, sel2` | `h1, h2` |

### Advanced Selectors
- **Attribute:** `input[type="text"]`
- **Pseudo-Class (State):** `:hover`, `:focus`, `:first-child`, `:not(.active)`
- **Pseudo-Element (Parts):** `::before`, `::after`

### CSS Native Nesting (Modern Standard)
In 2026, we don't need preprocessors like Sass to nest our CSS. Browsers support it natively!

```css
.card {
  background: white;
  padding: 1rem;

  /* Nested targeting elements inside .card */
  h2 {
    color: blue;
  }

  /* Nested pseudo-class targeting .card itself */
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}
```

---

## 3. Specificity, the Cascade, and `@layer`

### Specificity Calculation
Specificity is a scoring system: `(IDs, Classes, Elements)`.
- `#nav` = (1, 0, 0)
- `.btn.active` = (0, 2, 0)
- `div p` = (0, 0, 2)

### Cascade Layers (`@layer`)
A massive modern CSS feature is cascade layers. They let you explicitly define the priority of your styles, completely bypassing specificity wars!

```css
@layer reset, base, components;

@layer components {
  /* High priority layer */
  .title { color: blue; }
}

@layer base {
  /* Lower priority layer. Even if the selector is an ID, 
     it loses to the components layer! */
  #main-title { color: red; } 
}
```
> [!NOTE]
> Layers guarantee that your component styles will override your base styles, regardless of how specific the selectors are.

---

## 4. The Box Model & `box-sizing`

**Every HTML element is a rectangular box**.
1. **Content** — The actual text/image
2. **Padding** — Space inside the border
3. **Border** — A visible line
4. **Margin** — Space outside the border

### The `box-sizing` Fix
By default, padding and border are added *on top* of the width you specify. 
**Always set this globally to fix it:**

```css
* {
  box-sizing: border-box;
}
```

---

## 5. Colours & Modern `oklch()`

Historically, web developers used HEX (`#ff0000`) or RGB (`rgb(255,0,0)`).

**The modern standard is `oklch()`**. It represents how the human eye actually perceives color, making it mathematically perfect for creating color palettes and dark modes.

```css
/* oklch(lightness chroma hue / alpha) */
.btn {
  background: oklch(60% 0.15 250); /* A nice blue */
}

/* Creating a darker version for hover is easy: just lower the lightness! */
.btn:hover {
  background: oklch(50% 0.15 250);
}
```

---

## 6. Custom Properties (Variables)

CSS Variables let you define a value once and reuse it everywhere.

```css
:root {
  --primary: oklch(60% 0.15 250);
  --text: oklch(20% 0.05 250);
  --space-md: 1rem;
}

.card {
  background-color: var(--primary);
  padding: var(--space-md);
}
```

---

## 7. Typography

### System Fonts
The fastest web font is no web font! You can use the operating system's native font (San Francisco on Mac, Segoe UI on Windows):

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
}
```

### Font Size Units
- **`px`** (Pixels): Fixed size.
- **`rem`**: Relative to the root element (usually 16px). **Always use `rem` for font sizes!** `1rem` = 16px, `1.5rem` = 24px.

---

## 🧪 Practice Labs

### Lab 1: Style Your Profile Page (30 min)
1. Open `labs/lab1-profile-css/index.html`.
2. Create `style.css` and link it.
3. Write a CSS reset (`box-sizing: border-box`, remove default margins).
4. Use native nesting to style the `<nav>` links.

### Lab 2: Layer & Specificity Wars (20 min)
1. Open `labs/lab2-layers/`.
2. Create an `@layer` structure.
3. Prove that an element selector in a high-priority layer beats an ID selector in a low-priority layer.

---

## 📝 Assignment: Portfolio Project — Part 3

It's time to add **Global Design Tokens** to your Developer Portfolio.

### Requirements
1. Open your portfolio project folder from Lecture 02.
2. Create a `styles.css` file and link it in the `<head>` of your `index.html`.
3. Add a universal reset setting `box-sizing: border-box`.
4. In the `:root` pseudo-class, define your **Design Tokens** (Variables):
   - At least 4 colours using `oklch()` (Background, Text, Primary Accent, Secondary Accent).
   - At least 3 spacing variables (e.g., `--space-sm: 0.5rem`, `--space-md: 1rem`, `--space-lg: 2rem`).
5. Apply these variables to the `<body>` (set background color, text color, and `system-ui` font).
6. Style your `<nav>` links using CSS Nesting and your spacing variables.
7. Style your `<section>` elements to have consistent padding using `--space-lg`.

### Optional Bonus
Set up your cascade layers: `@layer reset, base, layout, components, utilities;` and place your CSS inside them accordingly!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN CSS Reference | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference |
| OKLCH Color Picker | https://oklch.com/ |
| Cascade Layers | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer |

---

## 📌 Key Takeaways
- Use **native CSS nesting** instead of repeating selectors.
- **`@layer`** solves specificity issues by explicitly defining rule priority.
- **`oklch()`** is the superior modern color space for building palettes.
- **CSS variables** enable consistent, maintainable theming (Design Tokens).
- Always use `rem` for font sizes to respect user browser settings.

---

**Next Lecture:** [Lecture 04 — CSS Layout: Positioning, Floats & Display →](./04%20-%20CSS%20Layout%20—%20Positioning,%20Floats%20%26%20Display.md)