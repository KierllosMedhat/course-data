# Lecture 04 — CSS Layout: Positioning, Floats & Display

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand how the `display` property changes an element's layout behaviour
- Use the five CSS positioning schemes (`static`, `relative`, `absolute`, `fixed`, `sticky`)
- Control element stacking with `z-index` and understand stacking contexts
- Handle content overflow with the `overflow` property
- Understand floats (legacy layout) and how to clear them
- Compare manual fixed positioning vs the native `<dialog>` element
- Start using BEM naming conventions for scalable CSS

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. The `display` property
2. Positioning: `static`, `relative`, `absolute`, `fixed`, `sticky`
3. `z-index` & Stacking Contexts
4. Legacy Floats & Clearing
5. Overflow management
6. Manual Overlays vs Native `<dialog>`
7. BEM naming convention introduction

### Part 2 — Practice & Lab (~90–120 minutes)
1. Sticky navigation bar with dropdown menu
2. The CSS-only Modal (Using `:target`)
3. Portfolio Project Part 4: Sticky Nav & Overlays

---

## 1. The `display` Property

Every HTML element has a default `display` value that determines how it behaves in the layout.

| Value | Behaviour | Default Examples |
|-------|-----------|-----------------|
| `block` | Takes up the **full width**, starts on a new line | `<div>`, `<p>`, `<h1>` |
| `inline` | Flows within text. **Cannot** set width/height | `<span>`, `<a>` |
| `inline-block` | Flows in text, but **can** set width/height | Buttons, nav items |
| `none` | Element is completely removed from the page | |

### `display: none` vs `visibility: hidden`
- `display: none`: Element disappears, takes up zero space.
- `visibility: hidden`: Element is invisible but **still takes up space**.

---

## 2. CSS Positioning

The `position` property controls **where** an element is placed. It works with offset properties: `top`, `right`, `bottom`, `left`.

| Value | How It Works | Stays in Normal Flow? |
|-------|-------------|----------------------|
| `static` | **Default.** Follows normal flow. Offsets have no effect. | ✅ Yes |
| `relative` | Element stays in its normal position but can be **nudged**. | ✅ Yes |
| `absolute` | Removed from normal flow. Positioned relative to its **nearest positioned ancestor**. | ❌ No |
| `fixed` | Removed from normal flow. Positioned relative to the **browser window**. Stays in place on scroll. | ❌ No |
| `sticky` | Acts like `relative` until it reaches a scroll threshold, then **sticks**. | ✅ Until stuck |

### The "Positioned Ancestor" Concept
Set a parent to `position: relative` to act as an anchor for an `absolute` child:
```css
.card {
  position: relative; /* Anchor */
}
.card-badge {
  position: absolute; /* Placed relative to .card */
  top: -10px;
  right: -10px;
}
```

---

## 3. Z-Index & Stacking Contexts

When elements overlap, `z-index` determines which one is on top.

- Higher `z-index` = in front.
- Only works on **positioned elements**.
- `z-index` is **scoped within its stacking context**.

> [!WARNING]
> A child inside a stacking context **cannot** appear above a sibling of its parent that has a higher `z-index`. `transform`, `opacity`, and `position: fixed` create new stacking contexts!

---

## 4. Legacy Floats & Clearing

Floats were originally for wrapping text around images. They were misused for layouts before Flexbox existed.

```css
img {
  float: left;
}
```
**Problem:** A container with only floated children **collapses to zero height**.
**Solution:** `display: flow-root;` on the parent container.

> [!NOTE]
> Do not build layouts with floats. Use Flexbox (Lecture 5). We only teach floats so you can maintain legacy enterprise code.

---

## 5. Overflow Handling

| Value | Behaviour |
|-------|-----------|
| `visible` (default)| Content spills outside |
| `hidden` | Content is clipped |
| `scroll` | Always shows scrollbars |
| `auto` | Shows scrollbars **only when needed** |

---

## 6. Manual Overlays vs Native `<dialog>`

Historically, modals were built using `position: fixed` and `z-index: 9999`.

### The Old Way (Manual)
```css
.modal-overlay {
  position: fixed;
  inset: 0; /* top:0, left:0, right:0, bottom:0 */
  background: rgba(0,0,0,0.5);
  z-index: 999;
}
```
*Drawbacks:* You have to manage focus trapping, screen readers, and stacking contexts manually.

### The Modern Way (Native `<dialog>`)
As introduced in Lecture 2, the `<dialog>` element solves this.
When opened with `dialog.showModal()`, the browser automatically puts it in the **Top Layer**—above everything else on the page, regardless of `z-index`!
You can style the background using the `::backdrop` pseudo-element:
```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px); /* Modern frosted glass effect */
}
```

---

## 7. BEM Naming Convention

**BEM** (Block, Element, Modifier) is a naming convention that keeps CSS scalable.

| Part | What It Represents | Pattern | Example |
|------|-------------------|---------|---------|
| **Block** | Standalone component | `.block` | `.card` |
| **Element** | Part of a block | `.block__element` | `.card__image` |
| **Modifier** | Variation | `.block--modifier` | `.card--featured` |

```html
<div class="card card--featured">
  <img class="card__image" src="...">
</div>
```
Why BEM? No IDs, low specificity, and self-documenting code.

---

## 🧪 Practice Labs

### Lab 1: Sticky Nav with Dropdown (40 min)
1. Build a navigation bar that sticks to the top of the page (`position: sticky`).
2. Make one link a dropdown — hovering reveals a sub-menu using `relative`/`absolute`.
3. Use BEM naming (e.g., `.nav`, `.nav__item`, `.nav__dropdown`).

### Lab 2: The CSS-Only Modal (20 min)
1. Build a modal without JS! Use the `:target` pseudo-class.
```html
<a href="#myModal">Open</a>
<div id="myModal" class="modal">
  <a href="#" class="close">X</a>
</div>
```
```css
.modal { display: none; position: fixed; inset: 0; }
.modal:target { display: block; }
```

---

## 📝 Assignment: Portfolio Project — Part 4

Let's add positioning and overlays to your Developer Portfolio.

### Requirements
1. Open your portfolio from Lecture 3.
2. Update your `<header>` to be `position: sticky; top: 0;`. Give it a `z-index` and a background color so content scrolls underneath it.
3. Apply BEM naming to your project section (e.g. `.project-card`, `.project-card__title`, `.project-card__image`).
4. In your `<section id="projects">`, wrap your image thumbnails in a container set to `position: relative`.
5. Add a "View Details" button inside the container using `position: absolute`. Position it in the center. Hide it by default (`opacity: 0`), and show it on hover (`opacity: 1`).
6. Add a native `<dialog>` element at the bottom of your HTML for a "Hire Me" contact form. Add a button in your hero section to open it via a simple inline script: `onclick="document.getElementById('hireDialog').showModal()"`. Style the `::backdrop`!

### Optional Bonus
Add a "Scroll to Top" button that is `position: fixed` in the bottom right corner of the screen.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — Position | https://developer.mozilla.org/en-US/docs/Web/CSS/position |
| Top Layer (Dialog) | https://developer.chrome.com/blog/what-is-the-top-layer/ |
| Get BEM | https://getbem.com/ |

---

## 📌 Key Takeaways
- `relative` is for nudging and creating anchors; `absolute` is for exact placement within an anchor; `fixed` anchors to the screen.
- The **Top Layer** (`<dialog>`) is superior to `z-index: 9999` for modals.
- **BEM naming** keeps your CSS organized and prevents specificity issues.

---

**Next Lecture:** [Lecture 05 — Modern Layout: Flexbox →](./05%20-%20Modern%20Layout%20—%20Flexbox.md)