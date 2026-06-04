# Lecture 05 — Modern Layout: Flexbox

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture you will be able to:

- Explain what Flexbox is and the layout problems it solves
- Identify the **flex container** and **flex items** in any layout
- Understand and manipulate the **main axis** and **cross axis**
- Use `flex-direction`, `justify-content`, `align-items`, `align-content`, and `flex-wrap`
- Control individual items with `flex-grow`, `flex-shrink`, `flex-basis`, `order`, and `align-self`
- Use the `flex` shorthand confidently
- Build real-world patterns: navbar, card grid, sidebar layout, and sticky footer

---

## 📋 1 — Why Old CSS Layout Was Hard

Before Flexbox, developers relied on **floats** (designed for wrapping text around images, not page layout) and **absolute positioning** (fragile for responsive designs). These hacks meant:

- Manually clearing floats or parents collapse to zero height
- Vertical centering required absurd workarounds (`table-cell`, `transform: translate(-50%, -50%)`)
- Equal-height columns needed JavaScript or background image tricks

CSS needed a **first-class layout system** — that system is **Flexbox**.

> [!NOTE]
> Floats still work for wrapping text around images. They're just the wrong tool for page layout.

---

## 📋 2 — What is Flexbox?

**Flexbox** (Flexible Box Layout) is a CSS layout mode that arranges child elements in a row or column and distributes space between them. It's supported in **all modern browsers**.

> [!IMPORTANT]
> Flexbox is **one-dimensional** — it works in a row OR a column, not both. For two-dimensional layout, use **CSS Grid** (next lecture).

---

## 📋 3 — Flex Container vs. Flex Items

Flexbox has two levels — like a **train and its cars**: the train (container) controls direction and spacing; each car (item) controls how much track it occupies.

- **Flex Container** — the parent, activated with `display: flex`
- **Flex Items** — the **direct children** only (grandchildren are NOT flex items)

```css
.container {
  display: flex; /* All direct children are now flex items */
}
```

### Property Ownership

| Container Properties | Item Properties |
|---------------------|-----------------|
| `display: flex` | `flex-grow` |
| `flex-direction` | `flex-shrink` |
| `justify-content` | `flex-basis` |
| `align-items` | `flex` (shorthand) |
| `align-content` | `align-self` |
| `flex-wrap` | `order` |
| `gap` | |

> [!TIP]
> Ask yourself: "Am I arranging the **whole group**? → Container property. Am I controlling **one item**? → Item property."

---

## 📋 4 — The Two Axes

Every Flexbox layout has two perpendicular axes:

- **Main Axis** — the direction items are placed (controlled by `flex-direction`)
- **Cross Axis** — perpendicular to the main axis

| Property | Controls |
|----------|----------|
| `justify-content` | **Main** axis |
| `align-items` | **Cross** axis |
| `align-content` | **Cross** axis (multi-line only) |

> [!WARNING]
> The axes **rotate** when you change `flex-direction`. In `column` mode, `justify-content` controls vertical spacing and `align-items` controls horizontal alignment. This is the #1 source of beginner confusion.

---

## 📋 5 — `flex-direction`

Sets the direction of the main axis.

| Value | Items Travel |
|-------|-------------|
| `row` (default) | Left → Right |
| `row-reverse` | Right → Left |
| `column` | Top → Bottom |
| `column-reverse` | Bottom → Top |

```css
.container { display: flex; flex-direction: column; }
```

**When to use each:** `row` for navbars/toolbars, `column` for vertical stacks/mobile layouts, `row-reverse` for RTL languages, `column-reverse` for chat UIs.

---

## 📋 6 — `justify-content`

Distributes **free space along the main axis**.

| Value | Behavior |
|-------|----------|
| `flex-start` (default) | Items packed at start |
| `flex-end` | Items packed at end |
| `center` | Items centered |
| `space-between` | First/last at edges, equal gaps between |
| `space-around` | Equal space around each item (edges get half-gaps) |
| `space-evenly` | Perfectly equal gaps everywhere |

```css
/* Navbar: logo on left, links on right */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}
```

> [!TIP]
> `space-between` is the most commonly used value in real projects — perfect for navbars and card rows.

---

## 📋 7 — `align-items`

Aligns items along the **cross axis** (vertical alignment when direction is `row`).

| Value | Behavior |
|-------|----------|
| `stretch` (default) | Items stretch to fill container height |
| `flex-start` | Items at top |
| `flex-end` | Items at bottom |
| `center` | Items vertically centered |
| `baseline` | Items aligned by text baseline |

### ✨ Perfect Centering (2 lines!)

```css
.center-me {
  display: flex;
  justify-content: center; /* Horizontal */
  align-items: center;     /* Vertical */
  min-height: 100vh;       /* Container needs height! */
}
```

> [!IMPORTANT]
> The container must have an explicit height for vertical centering to be visible. If it shrinks to fit its content, there's no free space to center within.

---

## 📋 8 — `flex-wrap` & `align-content`

### `flex-wrap`

By default (`nowrap`), items squish onto one line. Use `wrap` to let them flow to new lines:

| Value | Behavior |
|-------|----------|
| `nowrap` (default) | All items on one line, may squish |
| `wrap` | Items wrap to new lines downward |
| `wrap-reverse` | Items wrap upward |

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  flex: 0 0 200px; /* Fixed 200px, will wrap when container is too narrow */
}
```

### `align-content`

Controls how **multiple lines** are spaced along the cross axis. Same values as `justify-content` plus `stretch`. **Only works when items wrap to multiple lines.**

| `align-items` | `align-content` |
|--------------|-----------------|
| Aligns individual items within each line | Distributes lines within the container |
| Works with single or multi-line | Only works with multiple lines |

---

## 📋 9 — `gap`

Adds space **between** items — never at the outer edges. Replaces the old margin hack.

```css
/* Old way — messy */
.item { margin-right: 15px; }
.item:last-child { margin-right: 0; }

/* New way — clean */
.container {
  display: flex;
  gap: 15px;            /* Equal gap everywhere */
  /* OR */ gap: 10px 20px; /* row-gap | column-gap */
}
```

---

## 📋 10 — `flex-grow`, `flex-shrink`, `flex-basis`

These three item properties answer: **How big should I be?**

| Property | Question It Answers | Default |
|----------|-------------------|---------|
| `flex-basis` | "What's my starting size?" | `auto` |
| `flex-grow` | "Should I grow into extra space?" (ratio) | `0` |
| `flex-shrink` | "Should I shrink when space is tight?" (ratio) | `1` |

### `flex-grow` Example

Think of it like splitting leftover pizza — items with higher `flex-grow` get proportionally more slices.

```css
.container { display: flex; width: 800px; }

.item-a { flex-basis: 100px; flex-grow: 1; } /* Gets 1/3 of 500px extra = ~267px total */
.item-b { flex-basis: 100px; flex-grow: 2; } /* Gets 2/3 of 500px extra = ~433px total */
.item-c { flex-basis: 100px; flex-grow: 0; } /* Stays at 100px */
```

### `flex-shrink` Example

```css
.container { display: flex; width: 400px; }

.item-a { flex-basis: 300px; flex-shrink: 1; } /* Will shrink to absorb deficit */
.item-b { flex-basis: 300px; flex-shrink: 0; } /* Refuses to shrink — may overflow */
```

> [!WARNING]
> `flex-shrink: 0` means the item will **never** shrink below its `flex-basis`. This can cause overflow.

---

## 📋 11 — The `flex` Shorthand

Combines `grow | shrink | basis` into one declaration.

| Shorthand | grow | shrink | basis | Use Case |
|-----------|------|--------|-------|----------|
| `flex: 1` | 1 | 1 | 0% | Equal columns |
| `flex: auto` | 1 | 1 | auto | Grow/shrink from natural size |
| `flex: none` | 0 | 0 | auto | Completely rigid |
| `flex: 0 0 250px` | 0 | 0 | 250px | Fixed-width sidebar |
| `flex: 2` | 2 | 1 | 0% | Double share of space |

```css
/* Sidebar + main content */
.sidebar      { flex: 0 0 250px; } /* Fixed width */
.main-content { flex: 1; }         /* Fills remaining space */
```

> [!TIP]
> `flex: 1` and `flex: 0 0 Xpx` cover 80% of real-world use cases.

---

## 📋 12 — `order` & `align-self`

### `order`

Changes **visual order** without changing HTML. Default is `0`; lower numbers appear first.

```css
/* HTML order: A, B, C — Displayed order: C, A, B */
.item-a { order: 1; }
.item-b { order: 2; }
.item-c { order: 0; }

/* Mobile reordering */
@media (max-width: 768px) {
  .sidebar      { order: 2; }
  .main-content { order: 1; }
}
```

> [!WARNING]
> `order` only changes visual order — screen readers and keyboard navigation still follow the DOM order.

### `align-self`

Overrides `align-items` for **one specific item**.

```css
.container   { display: flex; align-items: center; height: 200px; }
.special     { align-self: flex-end; } /* This item goes to the bottom */
```

Values: `auto` | `flex-start` | `flex-end` | `center` | `stretch` | `baseline`

---

## 📋 13 — Real-World Patterns

### Pattern 1: Navbar

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 64px;
}
.nav-links { display: flex; gap: 2rem; list-style: none; }
```

### Pattern 2: Card Grid with Bottom-Aligned Buttons

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.card {
  display: flex;
  flex-direction: column;  /* Stack content vertically */
  flex: 1 1 280px;
}
.card p     { flex-grow: 1; }     /* Pushes button to bottom */
.card button { margin-top: auto; } /* Alternative: auto margin */
```

### Pattern 3: Sidebar Layout

```css
.page   { display: flex; min-height: 100vh; }
.sidebar { flex: 0 0 280px; }  /* Fixed width */
.main    { flex: 1; }          /* Fills rest */
```

### Pattern 4: Sticky Footer

```css
.wrapper { display: flex; flex-direction: column; min-height: 100vh; }
.header  { /* natural height */ }
.main    { flex: 1; }  /* Grows to push footer down */
.footer  { /* natural height */ }
```

---

## 🧪 Practice Lab 1 — Holy Grail Layout (45 min)

Build the classic 5-region layout: **header → [left sidebar | main | right sidebar] → footer**.

### HTML Structure

```html
<div class="page-wrapper">
  <header class="site-header">Header</header>
  <div class="middle-row">
    <aside class="sidebar sidebar--left">Left Nav</aside>
    <main class="main-content">Main Content</main>
    <aside class="sidebar sidebar--right">Widgets</aside>
  </div>
  <footer class="site-footer">Footer</footer>
</div>
```

### Key CSS

```css
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.middle-row {
  display: flex;
  flex: 1;              /* Grow to fill space between header/footer */
}
.sidebar     { flex: 0 0 220px; }
.main-content { flex: 1; }

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .middle-row    { flex-direction: column; }
  .sidebar       { flex: none; width: 100%; }
  .main-content  { order: -1; } /* Main content first on mobile */
}
```

### ✅ Checklist

- [ ] Outer wrapper is a column flex container with `min-height: 100vh`
- [ ] Middle row is a row flex container with `flex: 1`
- [ ] Sidebars are fixed width (`flex: 0 0 220px`)
- [ ] Main content fills remaining space (`flex: 1`)
- [ ] Footer sticks to bottom even with little content
- [ ] Responsive breakpoint stacks layout vertically

---

## 🧪 Practice Lab 2 — Pricing Card Grid (30 min)

Build 3 pricing cards (Starter, Pro, Enterprise) with different feature counts but **equal height** and **bottom-aligned buttons**.

### Key CSS

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.pricing-card {
  display: flex;
  flex-direction: column;
  flex: 1 1 280px;
  max-width: 360px;
  padding: 2rem;
}

.feature-list {
  flex-grow: 1;  /* KEY: pushes button to bottom of every card */
}

.cta-button {
  display: block;
  padding: 0.875rem;
  text-align: center;
}
```

### ✅ Checklist

- [ ] Card grid uses `display: flex` with `flex-wrap: wrap`
- [ ] Each card is a column flex container
- [ ] `flex-grow: 1` on feature list pushes buttons to bottom
- [ ] All cards are equal height regardless of content
- [ ] Featured card is visually distinct
- [ ] Layout is responsive on mobile

---

## 📝 Assignment: Portfolio Project Part 5

Rebuild your Portfolio Project layout using **Flexbox exclusively** — no floats, no absolute positioning for layout.

| Requirement | Points | Hint |
|-------------|--------|------|
| **Navbar** — logo left, links right | 10 | `justify-content: space-between` |
| **Hero** — text left, image right, vertically centered | 15 | `align-items: center`, text `flex: 1`, image `flex: 0 0 400px` |
| **Skills/Services cards** — 3–6 cards, equal height, wrapped | 20 | `flex-wrap: wrap`, `flex: 1 1 240px`, button pinned to bottom |
| **About section** — photo + bio side-by-side | 15 | `display: flex`, `gap: 3rem`, column on mobile |
| **Footer** — 3 columns + copyright bar | 10 | Each column `flex: 1` |
| **Responsive** — at least one breakpoint | 15 | `flex-direction: column` in `@media` query |
| **Perfect centering** — full-viewport CTA section | 15 | `justify-content: center` + `align-items: center` + `min-height: 100vh` |
| **Total** | **100** | |

---

## 📌 Common Mistakes & How to Avoid Them

| Mistake | Fix |
|---------|-----|
| `justify-content` on items instead of container | It's a **container** property — always goes on the parent |
| `align-content` has no effect | It only works with `flex-wrap: wrap` and multiple lines |
| `align-items: center` doesn't work | Container needs an explicit `height` or `min-height` |
| Using `width` instead of `flex-basis` | `flex-basis` overrides `width` in flex context — prefer it |
| `flex-shrink: 0` causes overflow | Item refuses to shrink — add `overflow: auto` or remove the `0` |
| `order` breaks keyboard navigation | Only changes visual order — DOM order stays the same |
| Axes swapped after `flex-direction: column` | `justify-content` is now vertical, `align-items` is horizontal |
| Button not at bottom of card | Make card `flex-direction: column`, give content above `flex-grow: 1` |
| Items overflow instead of wrapping | Default is `nowrap` — add `flex-wrap: wrap` |
| Fixed sidebar won't stay fixed width | Use `flex: 0 0 250px` (no grow, no shrink) |

---

## 📌 Key Takeaways

- `display: flex` on the parent activates Flexbox — direct children become flex items
- **Main axis** = direction of travel; **Cross axis** = perpendicular. `justify-content` → main, `align-items` → cross
- `flex-direction` rotates both axes — this changes what `justify-content` and `align-items` do
- **Perfect centering** = `justify-content: center` + `align-items: center` + explicit height
- `flex-wrap: wrap` allows multi-line layouts; `align-content` distributes those lines
- `gap` adds space between items without edge bleeding — replaces margin hacks
- **`flex` shorthand** = `grow | shrink | basis`. Use `flex: 1` for equal columns, `flex: 0 0 Xpx` for fixed sizes
- `order` reorders visually; `align-self` overrides one item's cross-axis alignment
- **Card bottom-align trick**: card as column flex container + `flex-grow: 1` on content above button

---

## 🔗 Resources

- [MDN — Flexbox Concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
- [CSS-Tricks — Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Flexbox Froggy](https://flexboxfroggy.com/) — Interactive game to learn Flexbox
- [Flexbox Defense](http://www.flexboxdefense.com/) — Tower defense game for Flexbox
- [Flexbox Playground](https://flexbox.netlify.app/) — Visual property explorer
