# Module 05 — Modern Layout: Flexbox

---

**Course:** Fullstack Web Development  
**Instructor:** [Instructor Name]  
**Duration:** 3 hours (lecture) + 75 minutes (labs)  
**Prerequisites:** Module 04 — CSS Fundamentals (Box Model, Selectors, Specificity)

---

## Learning Objectives

By the end of this module you will be able to:

- Explain **what Flexbox is** and the historical problem it solves
- Identify the **flex container** and **flex items** in any layout
- Understand and manipulate the **main axis** and **cross axis**
- Use every value of `flex-direction`, `justify-content`, `align-items`, `align-content`, and `flex-wrap`
- Control individual items with `flex-grow`, `flex-shrink`, `flex-basis`, `order`, and `align-self`
- Use the `flex` shorthand confidently
- Apply the `gap` property for clean spacing
- Build real-world patterns: **perfect centering**, **navbar**, **card grid**, **sidebar layout**, and the **Holy Grail layout**

---

## Agenda

| # | Topic | Time |
|---|-------|------|
| 1 | The Problem with Old CSS Layout | 15 min |
| 2 | Introducing Flexbox | 10 min |
| 3 | Flex Container vs. Flex Items | 15 min |
| 4 | The Two Axes | 10 min |
| 5 | `flex-direction` | 10 min |
| 6 | `justify-content` | 15 min |
| 7 | `align-items` | 10 min |
| 8 | `align-content` & `flex-wrap` | 10 min |
| 9 | `gap` | 5 min |
| 10 | `flex-grow`, `flex-shrink`, `flex-basis` | 25 min |
| 11 | The `flex` Shorthand | 10 min |
| 12 | `order` & `align-self` | 10 min |
| 13 | Common Real-World Patterns | 20 min |
| 14 | Lab 1 — Holy Grail Layout | 45 min |
| 15 | Lab 2 — Pricing Card Grid | 30 min |
| 16 | Assignment Overview | 10 min |

---

## 1. The Problem with Old CSS Layout

### Why Layout Was Hard

Before Flexbox existed (before 2012), web developers had **three main tools** to control layout:

1. **Normal flow** — elements stack vertically (block) or sit inline (inline). Zero control.
2. **Floats** — originally designed for wrapping text around images, like in a newspaper. Developers *hacked* this into layout columns. It was messy and fragile.
3. **Absolute/relative positioning** — removes an element from normal flow. It works for small widgets but is a nightmare for fluid, responsive layouts.

### The Float Hack Problem

Imagine you want three equal columns side-by-side. With floats you might write:

```css
/* OLD float-based column layout — don't do this anymore */

.column {
  float: left;          /* Pull each column to the left */
  width: 33.33%;        /* Divide the width into thirds */
}

.container::after {
  content: "";          /* Fake empty element */
  display: block;       /* Make it a block */
  clear: both;          /* Force the container to "see" its floated children */
}
```

This works — barely. But it has serious problems:

- You must manually **clear** the float or the parent collapses to zero height.
- **Vertical centering** is nearly impossible.
- **Equal-height columns** require hacks (fake backgrounds, JavaScript).
- Reordering columns in different screen sizes means duplicating or rewriting HTML.
- When the content of one column is longer, it breaks the layout.

> [!NOTE]
> Floats are not evil — they are still the correct tool for wrapping text around an image. But using them for full-page layout is a square peg in a round hole.

### The Vertical Centering Problem

For over a decade, "How do I vertically center a div?" was a running joke in web development. The solutions were absurd:

```css
/* "Solution" 1: table-cell trick */
.parent {
  display: table-cell;   /* Pretend the div is a table cell */
  vertical-align: middle; /* Table cells can align vertically */
}

/* "Solution" 2: absolute positioning math */
.child {
  position: absolute;
  top: 50%;             /* Move top edge to center */
  left: 50%;
  transform: translate(-50%, -50%); /* Pull back by half own size */
}
```

These tricks work, but they are **workarounds**, not real solutions. They break easily and are hard to maintain.

### The Takeaway

CSS needed a **first-class layout system** — one designed from the ground up to arrange items in a row or column, distribute space, and align things. That system is **Flexbox**.

---

## 2. Introducing Flexbox

### What is Flexbox?

**Flexbox** (short for *Flexible Box Layout Module*) is a CSS layout mode introduced to the spec around 2009 and fully stabilized by 2015. It is supported in **every modern browser**.

Flexbox answers one question: **"How should a set of child elements be arranged inside their parent container, and how should leftover space be distributed?"**

> [!IMPORTANT]
> Flexbox is **one-dimensional**. It works in either a row (horizontal) OR a column (vertical), but not both at once. For two-dimensional layout (rows AND columns simultaneously), use **CSS Grid** (covered in the next module).

### Why Does This Matter?

With Flexbox you can:

- **Vertically center anything** in two lines of CSS.
- Make equal-height columns without hacks.
- Push the last item to the right of a navbar automatically.
- Reorder items visually without changing the HTML.
- Make items grow or shrink to fill available space.
- Build responsive layouts that adapt to any screen size.

### Browser Support

Flexbox is supported in **all modern browsers** (Chrome, Firefox, Safari, Edge, Opera) and has been since 2015. You do not need any prefixes or polyfills for any layout built in this course.

---

## 3. Flex Container vs. Flex Items

### The Core Concept: Parent and Children

Flexbox works with a **parent-child relationship**. There are always exactly two levels:

1. **The Flex Container** — the parent element. You enable Flexbox on this element.
2. **The Flex Items** — the direct children of the container. These are the things being laid out.

> [!IMPORTANT]
> Only **direct children** become flex items. Grandchildren are NOT flex items. Flexbox does not cascade down the tree automatically.

### The Train Analogy

Think of it like a **train**:

```
┌─────────────────────────────────────────────────┐
│              FLEX CONTAINER (The Train)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ FLEX     │  │ FLEX     │  │ FLEX     │       │
│  │ ITEM     │  │ ITEM     │  │ ITEM     │       │
│  │ (Car 1)  │  │ (Car 2)  │  │ (Car 3)  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────┘
```

- The **train** (container) decides the direction cars travel, the spacing between cars, and where they sit vertically on the track.
- The **train cars** (items) can be told how much of the track they occupy and whether they should grow or shrink.
- Properties on the **train** affect all cars collectively.
- Properties on an individual **car** affect only that car.

### Enabling Flexbox

To turn a container into a flex container, you write exactly **one line of CSS**:

```css
/* This single declaration transforms this element into a flex container */
.container {
  display: flex;
}
```

That's it. The moment you write `display: flex`, all direct children of `.container` automatically become **flex items**.

### A Minimal Example

```html
<!-- HTML: One parent, three children -->
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

```css
/* Without Flexbox: items stack vertically (default block behavior) */
/* With Flexbox: items line up horizontally (the default flex direction is row) */

.container {
  display: flex;      /* 🔑 This single line does all the magic */
  background-color: #e0e0e0;
  padding: 10px;
}

.item {
  background-color: #4a90e2;  /* Blue background so we can see each item */
  color: white;
  padding: 20px;
  margin: 5px;
  font-size: 1rem;
}
```

**Result:** The three divs now sit side by side in a row instead of stacking.

### Flex Container Properties vs. Flex Item Properties

This is crucial to keep straight:

| Applied to the **Container** | Applied to the **Items** |
|------------------------------|--------------------------|
| `display: flex` | `flex-grow` |
| `flex-direction` | `flex-shrink` |
| `justify-content` | `flex-basis` |
| `align-items` | `flex` (shorthand) |
| `align-content` | `align-self` |
| `flex-wrap` | `order` |
| `gap` | |

> [!TIP]
> A common beginner mistake is putting `justify-content` on the items instead of the container. Always ask: "Is this property about arranging the whole group? → Container. Is it about one specific item? → Item."

### Section Recap

- `display: flex` turns an element into a **flex container**.
- Its **direct children** automatically become **flex items**.
- The two levels (container / items) have **separate sets of properties**.
- Flexbox does not apply to grandchildren — it only governs one level.

---

## 4. The Two Axes

### What Are Axes?

In Flexbox, all positioning and alignment is described relative to **two axes**. Think of these like the X and Y axes you learned in math class:

```
                  MAIN AXIS (by default = horizontal, left → right)
                  ──────────────────────────────────────────────────▶
                  │
                  │  CROSS AXIS (by default = vertical, top → bottom)
                  │
                  ▼
```

- The **Main Axis** is the direction flex items are **placed** (laid out).
- The **Cross Axis** is **perpendicular** to the main axis.

### Why This Matters

Every Flexbox property aligns things on **one of these two axes**:

| Property | Which Axis It Controls |
|----------|------------------------|
| `justify-content` | **Main** axis |
| `align-items` | **Cross** axis |
| `align-content` | **Cross** axis (multiple lines) |

This is the #1 source of confusion for beginners. Once you know which axis a property controls, everything clicks.

### The Axes Change with `flex-direction`

Here's the subtle part: **the main axis is not always horizontal**. The main axis follows the direction set by `flex-direction`.

When `flex-direction: row` (the default):
```
Main Axis  →  →  →  →  →  →  →  →  →  →  →
Cross Axis ↓
           ↓
           ↓
```

When `flex-direction: column`:
```
Main Axis  ↓
           ↓
           ↓
           ↓
Cross Axis →  →  →  →  →  →  →  →
```

> [!WARNING]
> This is the #1 source of confusion. `justify-content` centers things along the **main** axis. If you switch to `flex-direction: column`, `justify-content: center` will now center things **vertically**. The axis flips!

### Visual Diagram

```
flex-direction: row (DEFAULT)
┌──────────────────────────────────────────────────────┐
│                                                      │
│   [Item 1]    [Item 2]    [Item 3]                   │
│                                                      │
│   ←─────────── MAIN AXIS ────────────────────────→   │
│   ↑                                                  │
│   CROSS AXIS                                         │
│   ↓                                                  │
└──────────────────────────────────────────────────────┘

flex-direction: column
┌──────────────────────────────────────┐
│   ↑ CROSS AXIS →                     │
│   ┌────────┐                         │
│   │ Item 1 │  ↑                      │
│   └────────┘  │                      │
│   ┌────────┐  │ MAIN AXIS            │
│   │ Item 2 │  │                      │
│   └────────┘  │                      │
│   ┌────────┐  │                      │
│   │ Item 3 │  ↓                      │
│   └────────┘                         │
└──────────────────────────────────────┘
```

### Section Recap

- There are two axes: **main** and **cross** (perpendicular).
- By default, main axis = horizontal (left to right).
- `justify-content` → controls the **main** axis.
- `align-items` / `align-content` → control the **cross** axis.
- The axes **rotate** when you change `flex-direction`.

---

## 5. `flex-direction` — Setting the Main Axis

### What It Does

`flex-direction` tells the browser which direction flex items should be placed — the direction of the **main axis**.

It accepts four values:

| Value | Direction Items Travel |
|-------|----------------------|
| `row` | Left → Right (default) |
| `row-reverse` | Right → Left |
| `column` | Top → Bottom |
| `column-reverse` | Bottom → Top |

### Real-World Analogy

Imagine you're placing books on a shelf:

- `row` → Books placed left to right, spines facing you.
- `row-reverse` → Books placed right to left.
- `column` → Books stacked in a tower, bottom to top of vision... wait, `column` is top to bottom. Like stacking pancakes from the top.
- `column-reverse` → Pancakes stacked from the bottom up.

### Code Examples

```css
/* Default: items go left to right */
.container-row {
  display: flex;
  flex-direction: row; /* This is the default; you can omit it */
}

/* Items go right to left */
.container-row-reverse {
  display: flex;
  flex-direction: row-reverse;
}

/* Items stack top to bottom — like normal block elements, but now flex! */
.container-column {
  display: flex;
  flex-direction: column;
}

/* Items stack bottom to top */
.container-column-reverse {
  display: flex;
  flex-direction: column-reverse;
}
```

### Visual Diagrams

```
flex-direction: row
┌────────────────────────────────────────────────┐
│  [  1  ]   [  2  ]   [  3  ]                  │
└────────────────────────────────────────────────┘

flex-direction: row-reverse
┌────────────────────────────────────────────────┐
│                  [  3  ]   [  2  ]   [  1  ]  │
└────────────────────────────────────────────────┘

flex-direction: column
┌────────────────────┐
│  [      1      ]   │
│  [      2      ]   │
│  [      3      ]   │
└────────────────────┘

flex-direction: column-reverse
┌────────────────────┐
│  [      3      ]   │
│  [      2      ]   │
│  [      1      ]   │
└────────────────────┘
```

### When Would You Use Each?

- **`row`** — Navbars, toolbars, button groups, any horizontal layout.
- **`row-reverse`** — Right-to-left languages (Arabic, Hebrew). Sometimes useful for reversing button order on mobile.
- **`column`** — Sidebar menus, vertical stacks of cards, mobile-first layouts.
- **`column-reverse`** — Chat applications where newest messages appear at the bottom.

### Section Recap

- `flex-direction` sets the **main axis** direction.
- Four values: `row`, `row-reverse`, `column`, `column-reverse`.
- Changing direction **rotates both axes** — this affects `justify-content` and `align-items`.

---

## 6. `justify-content` — Distributing Space on the Main Axis

### What It Does

`justify-content` controls how flex items are **spaced and positioned along the main axis** (the direction items travel). It only affects leftover (free) space.

Think of it as: **"What do we do with the empty space on the train track?"**

### The Six Values

#### 1. `flex-start` (default)

Items pack toward the **start** of the main axis.

```
┌────────────────────────────────────────────────────────┐
│  [  1  ][  2  ][  3  ]                                │
└────────────────────────────────────────────────────────┘
```

#### 2. `flex-end`

Items pack toward the **end** of the main axis.

```
┌────────────────────────────────────────────────────────┐
│                                [  1  ][  2  ][  3  ]  │
└────────────────────────────────────────────────────────┘
```

#### 3. `center`

Items are centered on the main axis.

```
┌────────────────────────────────────────────────────────┐
│                [  1  ][  2  ][  3  ]                  │
└────────────────────────────────────────────────────────┘
```

#### 4. `space-between`

First item at start, last item at end, remaining space distributed **between** items evenly. No space at the edges.

```
┌────────────────────────────────────────────────────────┐
│  [  1  ]              [  2  ]              [  3  ]    │
└────────────────────────────────────────────────────────┘
```

#### 5. `space-around`

Equal space is placed **around** each item. This means the gap between two items is **double** the gap at the edges (because both adjacent items contribute their half-space).

```
┌────────────────────────────────────────────────────────┐
│    [  1  ]      [  2  ]      [  3  ]                  │
│  ↑       ↑  ↑           ↑                              │
│  ½      ½   ½           ½                              │
└────────────────────────────────────────────────────────┘
```

#### 6. `space-evenly`

Space is distributed so that the gap between **any two elements** (including the edges) is exactly equal.

```
┌────────────────────────────────────────────────────────┐
│      [  1  ]      [  2  ]      [  3  ]                │
│  ↑           ↑           ↑           ↑                 │
│  equal       equal       equal       equal             │
└────────────────────────────────────────────────────────┘
```

### Complete Code Example

```html
<!-- HTML: same structure, different justify-content values -->
<div class="container flex-start">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>
```

```css
/* Base styles for all containers */
.container {
  display: flex;           /* Enable flexbox */
  background: #f0f0f0;     /* Light gray so we can see the container */
  padding: 10px;
  margin-bottom: 15px;
  height: 80px;            /* Fixed height so centering is visible */
}

.box {
  background: #4a90e2;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
}

/* ── justify-content values ── */

.flex-start   { justify-content: flex-start; }   /* Default: items at start */
.flex-end     { justify-content: flex-end; }     /* Items pushed to end */
.center       { justify-content: center; }       /* Items centered */
.space-between{ justify-content: space-between; }/* Space only between items */
.space-around { justify-content: space-around; } /* Half-space at edges */
.space-evenly { justify-content: space-evenly; } /* Equal space everywhere */
```

### Real-World Use Case: Navbar

```css
/* Navigation bar with logo on the left, links on the right */
.navbar {
  display: flex;
  justify-content: space-between; /* Logo ←──────────────→ Links */
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: #1a1a2e;
}
```

> [!TIP]
> `space-between` is the most commonly used value in real projects. It's perfect for navbars (logo on left, links on right) and for distributing cards across a row.

### Section Recap

- `justify-content` distributes space on the **main axis**.
- Six values: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`.
- Only works when there **is** free space (items don't fill the full container).

---

## 7. `align-items` — Aligning on the Cross Axis

### What It Does

`align-items` controls how flex items are **aligned along the cross axis** (perpendicular to the direction they travel).

If `flex-direction: row`, the cross axis is **vertical** — so `align-items` controls how tall items sit relative to shorter ones.

### The Five Values

#### 1. `stretch` (default)

Items **stretch** to fill the full height (or width on a column) of the container.

```
┌──────────────────────────────────────────┐
│ ┌──────┐ ┌──────────────┐ ┌───────┐     │
│ │      │ │              │ │       │     │
│ │  1   │ │      2       │ │   3   │     │  ← All same height
│ │      │ │              │ │       │     │
│ └──────┘ └──────────────┘ └───────┘     │
└──────────────────────────────────────────┘
```

#### 2. `flex-start`

Items align to the **start of the cross axis** (top, when direction is row).

```
┌──────────────────────────────────────────┐
│ ┌──┐ ┌──────────────┐ ┌────┐            │
│ │1 │ │      2       │ │  3 │            │
│ └──┘ └──────────────┘ └────┘            │
│                                          │
└──────────────────────────────────────────┘
```

#### 3. `flex-end`

Items align to the **end of the cross axis** (bottom, when direction is row).

```
┌──────────────────────────────────────────┐
│                                          │
│ ┌──┐ ┌──────────────┐ ┌────┐            │
│ │1 │ │      2       │ │  3 │            │
└─┴──┴─┴──────────────┴─┴────┴────────────┘
```

#### 4. `center`

Items align to the **center of the cross axis** (vertically centered in a row container).

```
┌──────────────────────────────────────────┐
│                                          │
│         ┌──┐ ┌──────┐ ┌──┐             │
│         │1 │ │  2   │ │3 │             │
│         └──┘ └──────┘ └──┘             │
│                                          │
└──────────────────────────────────────────┘
```

#### 5. `baseline`

Items align so that their **text baselines** are on the same horizontal line. Useful when items have different font sizes.

```
┌──────────────────────────────────────────┐
│  ┌─────┐                                 │
│  │BIG  │  ┌───────┐                      │
│  │TEXT │  │ text  │  ┌──────────┐        │
│  └─────┘  └───────┘  │tiny text │        │
│    ──baseline──────────────────────       │  ← baseline aligned
└──────────────────────────────────────────┘
```

### Code Example

```css
.container {
  display: flex;
  height: 150px;           /* Explicit height needed to see cross-axis alignment */
  background: #f5f5f5;
  border: 2px solid #ccc;
}

/* Values: stretch | flex-start | flex-end | center | baseline */
.container { align-items: center; } /* Vertically center all items */
```

### Perfect Centering — The Holy Grail of Old CSS

This was impossibly verbose before Flexbox. Now it's two lines:

```css
/* CENTER ANYTHING, BOTH HORIZONTALLY AND VERTICALLY */
.center-me {
  display: flex;
  justify-content: center;  /* Center on the main axis (horizontal) */
  align-items: center;      /* Center on the cross axis (vertical) */
}
```

> [!IMPORTANT]
> The container must have an explicit height (or be stretched by its parent) for vertical centering to be visible. If the container shrinks to fit its content, there's no free space to center within.

### Section Recap

- `align-items` aligns items on the **cross axis**.
- Five values: `stretch` (default), `flex-start`, `flex-end`, `center`, `baseline`.
- Combine with `justify-content: center` for perfect centering.

---

## 8. `flex-wrap` and `align-content`

### The Overflow Problem

By default, flex items try to fit on **one line**. If there are too many items, they shrink (even below their natural size) to stay on that single line. This is `flex-wrap: nowrap` — the default.

```
flex-wrap: nowrap (DEFAULT) — items squish to stay on one line
┌──────────────────────────────────────────────┐
│ [1][2][3][4][5][6][7][8][9][10][11][12][13] │  ← tiny and squished!
└──────────────────────────────────────────────┘
```

### `flex-wrap`

#### `nowrap` (default)

All items on one line. They shrink if needed.

#### `wrap`

Items wrap onto **multiple lines** when they don't fit. New lines go in the cross axis direction (downward for row).

```
flex-wrap: wrap
┌──────────────────────────────────────┐
│  [  1  ]  [  2  ]  [  3  ]  [  4  ] │
│  [  5  ]  [  6  ]  [  7  ]          │
└──────────────────────────────────────┘
```

#### `wrap-reverse`

Items wrap, but new lines appear **before** the current line (upward for row).

```
flex-wrap: wrap-reverse
┌──────────────────────────────────────┐
│  [  5  ]  [  6  ]  [  7  ]          │
│  [  1  ]  [  2  ]  [  3  ]  [  4  ] │
└──────────────────────────────────────┘
```

```css
.container {
  display: flex;
  flex-wrap: wrap;    /* Allow items to wrap to new lines */
  gap: 10px;          /* Space between items (we'll cover gap next) */
}

.item {
  flex: 0 0 200px;    /* Don't grow, don't shrink, be exactly 200px wide */
}
```

### `align-content` — For Multi-Line Containers

When items wrap to **multiple lines**, `align-content` controls how those **lines themselves** are distributed in the cross axis. It's like `justify-content` but for the cross axis when you have multiple rows.

> [!NOTE]
> `align-content` has **no effect** if there is only one line of items. You need `flex-wrap: wrap` and enough items to create multiple lines.

#### Values (same family as `justify-content`)

| Value | Effect |
|-------|--------|
| `flex-start` | Lines pack to start of cross axis |
| `flex-end` | Lines pack to end of cross axis |
| `center` | Lines centered in cross axis |
| `space-between` | Lines spread with space between |
| `space-around` | Lines spread with space around |
| `space-evenly` | Lines spread with equal space everywhere |
| `stretch` (default) | Lines stretch to fill the container |

```css
.container {
  display: flex;
  flex-wrap: wrap;         /* Must be wrapping to have multiple lines */
  align-content: center;   /* Center the group of lines within the container */
  height: 400px;           /* Needs height for align-content to be visible */
}
```

### Quick Reference: `align-items` vs. `align-content`

| Property | Applies To | Requires Wrap? |
|----------|-----------|----------------|
| `align-items` | Individual items within each line | No |
| `align-content` | Lines of items within the container | Yes (needs multiple lines) |

> [!WARNING]
> Many developers confuse `align-items` and `align-content`. Remember: `align-items` = each item individually. `align-content` = the whole group of rows/columns together.

### Section Recap

- `flex-wrap: wrap` allows items to overflow onto new lines.
- `flex-wrap: nowrap` (default) forces everything on one line.
- `align-content` distributes the cross-axis space between **lines** (only applies when there are multiple lines).

---

## 9. `gap` — Clean Spacing Between Items

### What It Does

`gap` (also called `column-gap` and `row-gap` individually) adds **space between flex items** — but not at the outer edges.

### The Old Way vs. The New Way

**Old way:** using `margin`

```css
/* OLD: Adding margin to items — messy because the last item also gets margin */
.item {
  margin-right: 15px;
}
/* You'd then have to negate the last item's margin */
.item:last-child {
  margin-right: 0;
}
```

**New way:** using `gap`

```css
/* NEW: gap is clean, correct, and simple */
.container {
  display: flex;
  gap: 15px;           /* 15px between every flex item, no extra edge space */
}
```

### Syntax

```css
.container {
  display: flex;
  gap: 20px;              /* Same gap in all directions */

  /* OR specify row and column gaps separately */
  row-gap: 10px;          /* Gap between rows (when wrapping) */
  column-gap: 20px;       /* Gap between columns (items on same row) */

  /* Shorthand: row-gap then column-gap */
  gap: 10px 20px;         /* row-gap: 10px; column-gap: 20px */
}
```

> [!TIP]
> Prefer `gap` over `margin` for spacing flex items. It only adds space **between** items — never at the outer edges — which means you don't need to cancel margins on the first or last child.

### Section Recap

- `gap` adds space **between** items, never at the edges.
- Use `gap` instead of margins for cleaner, more maintainable code.
- You can specify row and column gaps independently.

---

## 10. Controlling Item Size: `flex-grow`, `flex-shrink`, `flex-basis`

### Overview

These three properties are applied to **individual flex items** (not the container). Together, they define how each item should behave when there is extra space or not enough space.

Think of it as three questions:

1. **`flex-basis`** — "How big should I start out?"
2. **`flex-grow`** — "If there's extra space, should I grow to take some?"
3. **`flex-shrink`** — "If there's not enough space, should I shrink?"

---

### `flex-basis` — The Starting Size

`flex-basis` sets the **initial size** of a flex item before any growing or shrinking happens. It works like `width` (when in a row) or `height` (when in a column).

```css
.item {
  flex-basis: 200px;    /* Start at exactly 200px wide */
}

.item {
  flex-basis: 30%;      /* Start at 30% of the container */
}

.item {
  flex-basis: auto;     /* Use the item's natural width/height (default) */
}
```

> [!NOTE]
> `flex-basis` takes priority over `width` in a flex row (and `height` in a flex column). If you set both, `flex-basis` wins.

---

### `flex-grow` — Growing Into Extra Space

`flex-grow` controls **how much of the available (leftover) space** an item will claim. It's a **unitless ratio**.

- `flex-grow: 0` — Item does not grow. (This is the default.)
- `flex-grow: 1` — Item will grow to absorb free space.
- `flex-grow: 2` — Item grows twice as fast as items with `flex-grow: 1`.

#### The Pizza Analogy

Imagine 3 friends sharing a large pizza with slices left over:

```
Extra pizza slices: 6 remaining

Person A: flex-grow: 1  → Gets 1 share → 2 extra slices
Person B: flex-grow: 2  → Gets 2 shares → 4 extra slices
Person C: flex-grow: 0  → Doesn't want more → 0 extra slices
                                              ──────────────
Total ratio: 1+2+0 = 3                        6 slices split
```

```css
.container {
  display: flex;
  width: 800px;         /* Fixed container width */
}

.item-a {
  flex-grow: 1;         /* Takes 1 share of leftover space */
  flex-basis: 100px;    /* Starts at 100px */
  background: #e74c3c;
}

.item-b {
  flex-grow: 2;         /* Takes 2 shares of leftover space — grows faster */
  flex-basis: 100px;
  background: #3498db;
}

.item-c {
  flex-grow: 0;         /* Refuses to grow — stays at flex-basis size */
  flex-basis: 100px;
  background: #2ecc71;
}

/*
  Container width: 800px
  Total flex-basis: 100 + 100 + 100 = 300px
  Free space: 800 - 300 = 500px

  item-a gets: 500 × (1/3) ≈ 167px extra → total ≈ 267px
  item-b gets: 500 × (2/3) ≈ 333px extra → total ≈ 433px
  item-c gets: 0 extra           → total = 100px
*/
```

---

### `flex-shrink` — Shrinking When Space is Tight

`flex-shrink` controls how much an item **shrinks** when the container is too small to fit all items at their `flex-basis`.

- `flex-shrink: 1` — Item will shrink proportionally. (This is the default.)
- `flex-shrink: 0` — Item refuses to shrink. It will overflow if needed.
- `flex-shrink: 2` — Item shrinks twice as fast as items with `flex-shrink: 1`.

```css
.container {
  display: flex;
  width: 400px;          /* Narrow container */
}

.item-a {
  flex-shrink: 1;        /* Shrinks normally (default) */
  flex-basis: 300px;
}

.item-b {
  flex-shrink: 0;        /* REFUSES to shrink — will overflow or push others */
  flex-basis: 300px;
}

/*
  Total basis: 600px, but container is only 400px.
  Deficit: 200px needs to be absorbed.

  item-b won't shrink (flex-shrink: 0), so...
  item-a absorbs all 200px of shrinkage → final width: 100px
*/
```

> [!WARNING]
> Setting `flex-shrink: 0` on an item means it will **never get smaller** than its `flex-basis`. This can cause the item to overflow its container if the container is smaller than the item's basis. Use carefully.

---

### Putting It All Together

```css
/* A common pattern: sidebar + main content */
.sidebar {
  flex-grow: 0;      /* Don't grow beyond fixed width */
  flex-shrink: 0;    /* Don't shrink — stay at 250px */
  flex-basis: 250px; /* Exactly 250px wide */
}

.main-content {
  flex-grow: 1;      /* Grow to fill ALL remaining space */
  flex-shrink: 1;    /* Can shrink if needed */
  flex-basis: 0;     /* Start from 0, then grow to fill space */
}
```

### Section Recap

- `flex-basis` — the item's starting size before growing/shrinking.
- `flex-grow` — ratio of extra space each item claims (0 = don't grow).
- `flex-shrink` — ratio of how much each item gives up when space is tight (0 = don't shrink).
- All three work together to calculate the **final size** of each item.

---

## 11. The `flex` Shorthand

### What It Is

The `flex` property is a shorthand that combines `flex-grow`, `flex-shrink`, and `flex-basis` into one declaration.

```css
/* Longhand */
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}

/* Shorthand equivalent */
.item {
  flex: 1 1 0%;
  /* ORDER: grow | shrink | basis */
}
```

### The Most Common Shorthand Values

#### `flex: 1`

The single most common flex shorthand. It means:
- `flex-grow: 1` — Grow to fill available space.
- `flex-shrink: 1` — Shrink if needed.
- `flex-basis: 0%` — Start from zero width.

This makes all items with `flex: 1` share the container's space **equally**.

```css
/* Three equal columns, no matter the container width */
.container {
  display: flex;
}

.item {
  flex: 1;  /* Each item gets exactly 1/3 of the space */
}
```

#### `flex: 0 0 250px`

"Frozen" size — item will not grow, not shrink, and will always be exactly 250px.

```css
.sidebar {
  flex: 0 0 250px;   /* Locked at 250px — rigid sidebar */
}
```

#### `flex: auto`

Equivalent to `flex: 1 1 auto`. Item grows and shrinks, using its natural content size as the starting point.

```css
.item {
  flex: auto;   /* Like flex: 1 but starts from natural width, not 0 */
}
```

#### `flex: none`

Equivalent to `flex: 0 0 auto`. Item is completely rigid — doesn't grow or shrink. Always its natural size.

```css
.icon {
  flex: none;   /* Stay exactly as big as the image/content */
}
```

### Summary Table

| Shorthand | `flex-grow` | `flex-shrink` | `flex-basis` | Meaning |
|-----------|-------------|---------------|--------------|---------|
| `flex: 1` | 1 | 1 | 0% | Equal share of all space |
| `flex: auto` | 1 | 1 | auto | Grow/shrink from natural size |
| `flex: none` | 0 | 0 | auto | Totally rigid |
| `flex: 0 0 200px` | 0 | 0 | 200px | Frozen at 200px |
| `flex: 2` | 2 | 1 | 0% | Gets twice as much free space as `flex: 1` |

> [!TIP]
> In most cases, reach for `flex: 1` (equal columns) or `flex: 0 0 Xpx` (fixed size) first. These two cover 80% of real-world use cases.

### Section Recap

- `flex` shorthand order: `grow | shrink | basis`.
- `flex: 1` → Equal distribution of space.
- `flex: 0 0 250px` → Fixed, frozen size.
- `flex: auto` → Grow/shrink from natural content size.
- `flex: none` → Completely rigid.

---

## 12. `order` and `align-self`

### `order` — Reordering Items Visually

By default, flex items appear in the order they appear in the HTML source. The `order` property lets you change the **visual order** without touching the HTML.

- Default value: `0` for all items.
- Items are arranged in ascending order (lower numbers first).
- Negative values are valid and go before `0`.

```css
/* HTML order: A, B, C, D */
/* Displayed order: C, A, D, B */

.item-a { order: 1; }   /* 2nd in display */
.item-b { order: 3; }   /* 4th in display */
.item-c { order: 0; }   /* 1st in display (lowest number) */
.item-d { order: 2; }   /* 3rd in display */
```

#### Visual Diagram

```
HTML Source:     [A]  [B]  [C]  [D]
order values:     1    3    0    2

Displayed:       [C]  [A]  [D]  [B]
```

#### Real-World Use: Mobile Reordering

On mobile you might want the main content before the sidebar, even though in the desktop HTML the sidebar comes first (for SEO reasons):

```css
@media (max-width: 768px) {
  .sidebar {
    order: 2;   /* Sidebar appears second on mobile */
  }

  .main-content {
    order: 1;   /* Main content appears first on mobile */
  }
}
```

> [!WARNING]
> Using `order` only changes **visual** order, not the DOM order. Keyboard navigation and screen readers still follow the HTML source order. This can cause accessibility issues if the visual and DOM order diverge too much. Use with care.

---

### `align-self` — Overriding Alignment for One Item

`align-self` does the same thing as `align-items`, but it applies to a **single flex item** instead of all items in the container. It overrides whatever `align-items` the container sets.

```css
.container {
  display: flex;
  align-items: center;   /* All items centered by default */
  height: 200px;
}

.special-item {
  align-self: flex-end;  /* THIS item goes to the bottom, ignoring the container rule */
}
```

#### All Valid Values

```css
.item {
  align-self: auto;       /* Use the container's align-items value (default) */
  align-self: flex-start; /* Align to start of cross axis */
  align-self: flex-end;   /* Align to end of cross axis */
  align-self: center;     /* Center on cross axis */
  align-self: stretch;    /* Stretch to fill cross axis */
  align-self: baseline;   /* Align by text baseline */
}
```

#### Visual Diagram

```
Container: align-items: flex-start
┌──────────────────────────────────────────────────────┐
│ ┌──┐ ┌──┐                                ┌──┐        │
│ │  │ │  │                                │  │        │
│ │A │ │B │                                │D │        │
│ └──┘ └──┘                                │  │ ←── D has align-self: stretch
│                                          │  │
│             ┌──┐                         │  │
│             │C │ ← C has align-self: flex-end
│             └──┘  └──┘        │
└──────────────────────────────────────────────────────┘
```

### Section Recap

- `order` changes visual order without changing HTML. Default is `0`.
- `align-self` overrides `align-items` for one specific item.
- Both properties are applied to **flex items**, not the container.

---

## 13. Common Real-World Patterns

### Pattern 1: Perfect Centering

The most requested layout task before Flexbox. Now trivially easy.

```html
<div class="center-container">
  <div class="centered-content">
    <h1>I am perfectly centered!</h1>
    <p>Both horizontally and vertically.</p>
  </div>
</div>
```

```css
.center-container {
  display: flex;
  justify-content: center;   /* Horizontal center (main axis) */
  align-items: center;       /* Vertical center (cross axis) */
  min-height: 100vh;         /* Full viewport height so there's room to center */
  background: #1a1a2e;
}

.centered-content {
  text-align: center;
  color: white;
  padding: 40px;
}
```

---

### Pattern 2: Navbar with Logo and Links

```html
<nav class="navbar">
  <div class="nav-logo">MyApp</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;  /* Logo far left, links far right */
  align-items: center;             /* Vertically center both logo and links */
  padding: 0 2rem;
  height: 64px;
  background: #16213e;
  color: white;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e94560;
}

.nav-links {
  display: flex;           /* The link list is ALSO a flex container */
  gap: 2rem;               /* Space between links */
  list-style: none;        /* Remove bullet points */
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #e94560;
}
```

---

### Pattern 3: Equal-Height Card Grid

```html
<div class="card-grid">
  <div class="card">
    <h3>Card One</h3>
    <p>Some content here that might be long and cause the card to grow.</p>
    <button>Learn More</button>
  </div>
  <div class="card">
    <h3>Card Two</h3>
    <p>Shorter content.</p>
    <button>Learn More</button>
  </div>
  <div class="card">
    <h3>Card Three</h3>
    <p>Medium length content that sits between the other two cards.</p>
    <button>Learn More</button>
  </div>
</div>
```

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;        /* Wrap to next line on smaller screens */
  gap: 1.5rem;
  padding: 2rem;
}

.card {
  display: flex;          /* Make the CARD itself a flex container */
  flex-direction: column; /* Stack content vertically inside the card */
  flex: 1 1 280px;        /* Grow/shrink, but start at 280px */
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.card p {
  flex-grow: 1;           /* ← THE TRICK: paragraph grows to fill space */
  margin-bottom: 1.25rem; /* This pushes the button to the bottom of EVERY card */
  color: #555;
  line-height: 1.6;
}

.card button {
  /* Button stays at the bottom of every card regardless of content height */
  margin-top: auto;       /* Auto margin pushes button to bottom */
  padding: 0.75rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.card button:hover {
  background: #357abd;
}
```

> [!TIP]
> The **"button at the bottom of every card"** trick uses either `flex-grow: 1` on the content above the button, or `margin-top: auto` on the button itself. Both push the button to the bottom regardless of how much content is above it.

---

### Pattern 4: Sidebar Layout

```html
<div class="page-layout">
  <aside class="sidebar">
    <nav>Sidebar Navigation</nav>
  </aside>
  <main class="main-content">
    <h1>Main Content</h1>
    <p>This area fills the rest of the space.</p>
  </main>
</div>
```

```css
.page-layout {
  display: flex;
  min-height: 100vh;       /* Full page height */
  gap: 0;
}

.sidebar {
  flex: 0 0 280px;         /* Fixed 280px wide — doesn't grow or shrink */
  background: #1e1e2e;
  color: white;
  padding: 2rem;
}

.main-content {
  flex: 1;                 /* Takes ALL remaining space */
  padding: 2rem;
  background: #f8f9fa;
  overflow-y: auto;        /* Scrollable main content */
}
```

---

### Pattern 5: Sticky Footer

```html
<div class="site-wrapper">
  <header class="site-header">Header</header>
  <main class="site-main">Main (grows to fill page)</main>
  <footer class="site-footer">Footer (always at bottom)</footer>
</div>
```

```css
.site-wrapper {
  display: flex;
  flex-direction: column;  /* Stack children vertically */
  min-height: 100vh;       /* At least full viewport height */
}

.site-header {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
}

.site-main {
  flex: 1;                 /* Main grows to fill all available space */
  padding: 2rem;
}

.site-footer {
  background: #2c3e50;
  color: #bbb;
  padding: 1rem 2rem;
  text-align: center;
}
```

### Section Recap

- **Perfect centering**: `justify-content: center` + `align-items: center`.
- **Navbar**: `justify-content: space-between` + `align-items: center`.
- **Card grid**: `flex-wrap: wrap` + nested flex column cards + `flex-grow: 1` on content.
- **Sidebar**: fixed `flex: 0 0 280px` sidebar + `flex: 1` main content.
- **Sticky footer**: `flex-direction: column` + `flex: 1` on main.

---

## Lab 1: Holy Grail Layout (45 minutes)

### What You'll Build

The "Holy Grail Layout" is a classic web layout with five distinct regions:

```
┌─────────────────────────────────────────────────────┐
│                     HEADER                          │
├──────────┬──────────────────────────┬───────────────┤
│          │                          │               │
│   LEFT   │       MAIN CONTENT       │  RIGHT        │
│ SIDEBAR  │                          │ SIDEBAR       │
│          │                          │               │
├──────────┴──────────────────────────┴───────────────┤
│                     FOOTER                          │
└─────────────────────────────────────────────────────┘
```

It was historically called "Holy Grail" because it was notoriously difficult to build — equal-height columns, a sticky footer, and a fluid center column were near-impossible without JavaScript or CSS hacks before Flexbox.

### Files to Create

```
lab-01-holy-grail/
├── index.html
└── styles.css
```

### Step-by-Step Instructions

#### Step 1: Create the HTML Structure

Create `index.html` and write the semantic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lab 1 — Holy Grail Layout</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- 
    STRUCTURE: The page-wrapper will be our outer flex container.
    It holds: header, middle-row, footer.
  -->
  <div class="page-wrapper">

    <!-- 1. Header: spans full width -->
    <header class="site-header">
      <h1>Holy Grail Layout</h1>
      <p>Built with pure Flexbox</p>
    </header>

    <!-- 
      2. Middle Row: this becomes a HORIZONTAL flex container
      It holds: left-sidebar, main, right-sidebar
    -->
    <div class="middle-row">

      <!-- 2a. Left Sidebar: navigation links -->
      <aside class="sidebar sidebar--left">
        <h2>Navigation</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Articles</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </aside>

      <!-- 2b. Main Content: grows to fill remaining space -->
      <main class="main-content">
        <h2>Main Content Area</h2>
        <p>This region grows to fill all available horizontal space between the two sidebars.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat aliquet ante, nec sollicitudin turpis pellentesque at. Proin sed malesuada metus, sit amet blandit turpis.</p>
        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
      </main>

      <!-- 2c. Right Sidebar: ads or widgets -->
      <aside class="sidebar sidebar--right">
        <h2>Widget</h2>
        <div class="widget-box">
          <p>Advertisement or related content could go here.</p>
        </div>
        <div class="widget-box">
          <p>Another widget block.</p>
        </div>
      </aside>

    </div>
    <!-- end .middle-row -->

    <!-- 3. Footer: spans full width -->
    <footer class="site-footer">
      <p>&copy; 2026 Holy Grail Layout Lab. All rights reserved.</p>
    </footer>

  </div>
  <!-- end .page-wrapper -->

</body>
</html>
```

#### Step 2: Reset and Base Styles

In `styles.css`, start with a reset and base typography:

```css
/* ── 1. CSS Reset & Base ── */
*, *::before, *::after {
  box-sizing: border-box;   /* Include padding/border in element dimensions */
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  background: #f4f6f8;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul {
  list-style: none;         /* Remove default bullet points */
}
```

#### Step 3: The Outer Flex Container (Vertical Stack)

```css
/* ── 2. Page Wrapper: VERTICAL flex container ── */
.page-wrapper {
  display: flex;
  flex-direction: column;   /* Stack header, middle-row, footer vertically */
  min-height: 100vh;        /* At least full viewport height → sticky footer */
}
```

#### Step 4: The Header

```css
/* ── 3. Header ── */
.site-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 2rem 2.5rem;
  border-bottom: 3px solid #e94560;
}

.site-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #e94560;
}

.site-header p {
  font-size: 0.9rem;
  color: #aaa;
}
```

#### Step 5: The Middle Row (Horizontal Flex Container)

```css
/* ── 4. Middle Row: HORIZONTAL flex container ── */
.middle-row {
  display: flex;            /* Makes left sidebar, main, right sidebar sit side by side */
  flex: 1;                  /* Grows to fill space between header and footer */
}
```

#### Step 6: The Sidebars and Main Content

```css
/* ── 5. Sidebars ── */
.sidebar {
  flex: 0 0 220px;          /* Fixed width — never grows or shrinks */
  padding: 1.5rem;
  background: #fff;
}

.sidebar--left {
  border-right: 1px solid #e0e0e0;  /* Subtle divider line */
}

.sidebar--right {
  border-left: 1px solid #e0e0e0;
  background: #f9f9f9;      /* Slightly different background for distinction */
}

.sidebar h2 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e94560;
}

.sidebar ul li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar ul li a {
  color: #333;
  font-weight: 500;
  transition: color 0.2s;
}

.sidebar ul li a:hover {
  color: #e94560;
}

/* ── 6. Main Content ── */
.main-content {
  flex: 1;                  /* Take all remaining horizontal space */
  padding: 2rem;
  background: #fff;
}

.main-content h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
}

.main-content p {
  margin-bottom: 1rem;
  color: #555;
}
```

#### Step 7: The Widget Box and Footer

```css
/* ── 7. Widget Box (inside right sidebar) ── */
.widget-box {
  background: #f0f4ff;
  border: 1px solid #d0daf0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #555;
}

/* ── 8. Footer ── */
.site-footer {
  background: #1a1a2e;
  color: #aaa;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.875rem;
}
```

#### Step 8: Test Your Work

Open `index.html` in a browser. You should see:

- ✅ A dark header spanning the full width.
- ✅ Three columns below: left sidebar, main content, right sidebar.
- ✅ The main content fills all available space between the sidebars.
- ✅ All three columns have the same height regardless of content amount.
- ✅ Footer sticks to the bottom even when content is short.

#### Step 9: Bonus — Make It Responsive

```css
/* ── 9. Responsive: Stack vertically on small screens ── */
@media (max-width: 768px) {
  .middle-row {
    flex-direction: column; /* Stack the three columns vertically on mobile */
  }

  .sidebar {
    flex: none;              /* Remove the fixed width on mobile */
    width: 100%;             /* Full width */
    border: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .sidebar--left {
    order: 2;               /* Put left sidebar AFTER main content on mobile */
  }

  .sidebar--right {
    order: 3;               /* Right sidebar last */
  }

  .main-content {
    order: 1;               /* Main content first on mobile (best practice) */
  }
}
```

### Lab 1 Checklist

- [ ] Page wrapper uses `flex-direction: column` with `min-height: 100vh`
- [ ] Middle row uses `display: flex` (default row direction)
- [ ] Both sidebars have `flex: 0 0 220px` (fixed, rigid)
- [ ] Main content has `flex: 1` (fluid, fills remaining space)
- [ ] Columns are all equal height (flex makes this automatic)
- [ ] Footer stays at the bottom even when content is short
- [ ] **Bonus:** Responsive breakpoint collapses layout to single column

---

## Lab 2: Pricing Card Grid (30 minutes)

### What You'll Build

A set of pricing cards arranged in a responsive grid. Each card has:
- A plan name and price
- A list of features
- A "Get Started" button that always sits at the **bottom** of the card

The key challenge: all cards must be **equal height**, and the buttons must align at the **bottom** of every card regardless of how many features each plan lists.

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐            │
│  │   STARTER   │   │ PROFESSIONAL│   │  ENTERPRISE │            │
│  │             │   │             │   │             │            │
│  │  $9/month   │   │  $29/month  │   │  $99/month  │            │
│  │             │   │             │   │             │            │
│  │ ✓ Feature 1 │   │ ✓ Feature 1 │   │ ✓ Feature 1 │            │
│  │ ✓ Feature 2 │   │ ✓ Feature 2 │   │ ✓ Feature 2 │            │
│  │             │   │ ✓ Feature 3 │   │ ✓ Feature 3 │            │
│  │             │   │ ✓ Feature 4 │   │ ✓ Feature 4 │            │
│  │             │   │             │   │ ✓ Feature 5 │            │
│  │             │   │             │   │ ✓ Feature 6 │            │
│  │             │   │             │   │             │            │
│  │ [Get Started]   │ [Get Started]   │ [Get Started]            │
│  └─────────────┘   └─────────────┘   └─────────────┘            │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

Notice how all "Get Started" buttons are aligned at the same bottom level.

### Step-by-Step Instructions

#### Step 1: Create the File Structure

```
lab-02-pricing-cards/
├── index.html
└── styles.css
```

#### Step 2: HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lab 2 — Pricing Cards</title>
  <link rel="stylesheet" href="styles.css" />
  <!-- Import a clean Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>

  <section class="pricing-section">
    <h1 class="pricing-title">Choose Your Plan</h1>
    <p class="pricing-subtitle">All plans include a 14-day free trial. No credit card required.</p>

    <!-- The card grid: flex container -->
    <div class="card-grid">

      <!-- Card 1: Starter -->
      <article class="pricing-card">
        <div class="card-header">
          <span class="plan-badge">Starter</span>
          <div class="price">
            <span class="price-currency">$</span>
            <span class="price-amount">9</span>
            <span class="price-period">/month</span>
          </div>
          <p class="plan-tagline">Perfect for individuals and small projects.</p>
        </div>

        <ul class="feature-list">
          <!-- Only 2 features — card will be shorter content-wise -->
          <li class="feature-item">✓ 5 Projects</li>
          <li class="feature-item">✓ 10 GB Storage</li>
        </ul>

        <!-- Button MUST sit at the bottom despite short feature list -->
        <a href="#" class="cta-button">Get Started</a>
      </article>

      <!-- Card 2: Professional (highlighted / "popular") -->
      <article class="pricing-card pricing-card--featured">
        <div class="popular-badge">Most Popular</div>
        <div class="card-header">
          <span class="plan-badge">Professional</span>
          <div class="price">
            <span class="price-currency">$</span>
            <span class="price-amount">29</span>
            <span class="price-period">/month</span>
          </div>
          <p class="plan-tagline">For growing teams and businesses.</p>
        </div>

        <ul class="feature-list">
          <li class="feature-item">✓ Unlimited Projects</li>
          <li class="feature-item">✓ 100 GB Storage</li>
          <li class="feature-item">✓ Priority Support</li>
          <li class="feature-item">✓ Custom Domain</li>
        </ul>

        <a href="#" class="cta-button cta-button--featured">Get Started</a>
      </article>

      <!-- Card 3: Enterprise (most features) -->
      <article class="pricing-card">
        <div class="card-header">
          <span class="plan-badge">Enterprise</span>
          <div class="price">
            <span class="price-currency">$</span>
            <span class="price-amount">99</span>
            <span class="price-period">/month</span>
          </div>
          <p class="plan-tagline">For large organizations with advanced needs.</p>
        </div>

        <ul class="feature-list">
          <li class="feature-item">✓ Unlimited Projects</li>
          <li class="feature-item">✓ 1 TB Storage</li>
          <li class="feature-item">✓ 24/7 Dedicated Support</li>
          <li class="feature-item">✓ Custom Domain</li>
          <li class="feature-item">✓ SLA Guarantee</li>
          <li class="feature-item">✓ Advanced Analytics</li>
        </ul>

        <a href="#" class="cta-button">Get Started</a>
      </article>

    </div>
    <!-- end .card-grid -->

  </section>

</body>
</html>
```

#### Step 3: Base Styles and Page Layout

```css
/* ── 1. Reset & Base ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  min-height: 100vh;
  color: #333;
}

/* ── 2. Pricing Section ── */
.pricing-section {
  padding: 5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;           /* Center the section horizontally */
  text-align: center;
}

.pricing-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
}

.pricing-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 3rem;
}
```

#### Step 4: The Card Grid Container

```css
/* ── 3. Card Grid ── */
.card-grid {
  display: flex;              /* Flex container for the three cards */
  gap: 1.5rem;                /* Space between cards */
  flex-wrap: wrap;            /* Wrap to new line on small screens */
  justify-content: center;    /* Center cards when fewer than 3 per row */
  align-items: stretch;       /* stretch is default — makes all cards equal height */
}
```

#### Step 5: Individual Card Styles (The Key Flex Trick)

```css
/* ── 4. Pricing Card ── */
.pricing-card {
  display: flex;              /* 🔑 Make the CARD a flex container */
  flex-direction: column;     /* Stack content vertically inside */
  flex: 1 1 280px;            /* Grow/shrink, minimum 280px */
  max-width: 360px;           /* Don't get too wide */
  background: white;
  border-radius: 16px;
  padding: 2rem;
  position: relative;         /* For the "popular" badge positioning */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-6px);                   /* Lift card on hover */
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);  /* Deeper shadow on hover */
}

/* Featured card: slightly bigger, different color */
.pricing-card--featured {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: scale(1.03);   /* Slightly larger than the others */
}

.pricing-card--featured:hover {
  transform: scale(1.03) translateY(-6px);  /* Keep scale while lifting */
}
```

#### Step 6: Card Header (Plan Name and Price)

```css
/* ── 5. Card Header ── */
.popular-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);  /* Center horizontally */
  background: #f7c948;
  color: #333;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 0.75rem;
}

.pricing-card--featured .plan-badge {
  color: rgba(255, 255, 255, 0.75);  /* Lighter on dark featured card */
}

.price {
  display: flex;
  align-items: flex-start;  /* Currency symbol at top */
  line-height: 1;
  margin-bottom: 0.75rem;
}

.price-currency {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 0.5rem;       /* Align with the top of the number */
}

.price-amount {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
}

.price-period {
  font-size: 0.9rem;
  color: #888;
  align-self: flex-end;     /* Align to bottom of the price number */
  margin-bottom: 0.3rem;
}

.pricing-card--featured .price-period {
  color: rgba(255, 255, 255, 0.65);
}

.plan-tagline {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.pricing-card--featured .plan-tagline {
  color: rgba(255, 255, 255, 0.75);
}
```

#### Step 7: Feature List and CTA Button (The Key Trick)

```css
/* ── 6. Feature List ── */
.feature-list {
  list-style: none;
  margin-bottom: 1.5rem;
  text-align: left;

  /* 🔑 THE KEY: flex-grow: 1 makes the feature list fill all available space */
  /* This pushes the button to the very bottom of every card */
  flex-grow: 1;
}

.feature-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 0.9rem;
  color: #444;
}

.pricing-card--featured .feature-item {
  color: rgba(255, 255, 255, 0.9);
  border-bottom-color: rgba(255, 255, 255, 0.15);
}

/* ── 7. CTA Button ── */
.cta-button {
  display: block;           /* Full width button */
  padding: 0.875rem;
  background: #667eea;
  color: white;
  text-align: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.15s ease;
  /* margin-top: auto is an ALTERNATIVE to flex-grow on the feature list */
}

.cta-button:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.cta-button--featured {
  background: white;
  color: #667eea;
}

.cta-button--featured:hover {
  background: rgba(255, 255, 255, 0.9);
}
```

#### Step 8: Responsive Styles

```css
/* ── 8. Responsive ── */
@media (max-width: 640px) {
  .pricing-title {
    font-size: 1.75rem;
  }

  .card-grid {
    flex-direction: column;  /* Stack cards vertically on mobile */
    align-items: center;
  }

  .pricing-card {
    width: 100%;
    max-width: 400px;
  }

  .pricing-card--featured {
    transform: none;         /* Remove scale effect on mobile */
    order: -1;               /* Show featured card first on mobile */
  }
}
```

### Lab 2 Checklist

- [ ] Card grid uses `display: flex` with `flex-wrap: wrap`
- [ ] Each card is itself a `flex-direction: column` flex container
- [ ] `flex-grow: 1` on `.feature-list` pushes the button to the bottom
- [ ] All three buttons align at the same vertical level
- [ ] Cards are equal height regardless of feature count
- [ ] Featured card is visually distinct (color/scale)
- [ ] Hover effects work on all cards
- [ ] **Bonus:** Layout is responsive on mobile

---

## Assignment: Portfolio Project Part 5

### Overview

In this assignment you will rebuild or enhance the layout of your Portfolio Project website using **Flexbox exclusively**. No floats. No absolute positioning for layout.

### Requirements

#### Requirement 1: Navigation Bar (10 points)

Rebuild your navbar using Flexbox.

**Hint:** Set `display: flex` on the `<nav>` element. Use `justify-content: space-between` to push the logo to one side and links to the other. Use `align-items: center` to vertically center both. The `<ul>` of links should itself be a flex container with `gap`.

```css
/* Starter hint */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 70px;
}

nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}
```

#### Requirement 2: Hero Section (15 points)

Create a hero section with:
- Content (heading + paragraph + button) on the left.
- An image or graphic on the right.
- Both sides are vertically centered.

**Hint:** Use `display: flex` on the hero container. Give the text side `flex: 1` and the image side a fixed width using `flex: 0 0 400px`. Use `align-items: center` to vertically center both halves.

#### Requirement 3: Skills/Services Section (20 points)

Display 3–6 skill or service cards in a responsive grid.

**Requirements:**
- Cards use `flex-wrap: wrap` to wrap on smaller screens.
- Each card has a minimum width of `240px` (`flex: 1 1 240px`).
- All cards are equal height.
- If the card has a button or a "learn more" link, it must be pinned to the bottom.

**Hint:** Make each card a `flex-direction: column` flex container. Give `flex-grow: 1` to the description paragraph so the button is always pushed to the bottom.

#### Requirement 4: About/Bio Section (15 points)

A two-column layout: photo on left, bio text on right.

**Hint:** Use `display: flex` on the section, `align-items: center` for vertical alignment, and `gap: 3rem` between the photo and text. On mobile (`max-width: 768px`), switch to `flex-direction: column`.

#### Requirement 5: Footer (10 points)

A footer with three columns (links, contact, social media) and a copyright bar below.

**Hint:** The three-column area uses `display: flex` with `gap`. Each column uses `flex: 1`. The copyright bar uses `display: flex` with `justify-content: space-between`.

#### Requirement 6: Responsive Design (15 points)

All Flexbox layouts must respond to at least one breakpoint (e.g., `max-width: 768px`).

- Navbars can collapse or stack.
- Two-column layouts switch to single column.
- Card grids wrap properly.

**Hint:** Use `@media` queries. Inside the breakpoint, change `flex-direction` to `column` and set widths to `100%` as needed.

#### Requirement 7: Perfect Centering Demo (15 points)

Add a full-viewport-height "call to action" section that perfectly centers its content both horizontally and vertically.

**Hint:** Just two lines:
```css
.cta-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

### Submission

- Submit your updated `index.html` and `styles.css` files.
- Open your project in the browser and take a screenshot of each section.
- Include the screenshots in a short Loom video (max 3 minutes) walking through your layout decisions.

### Grading Rubric

| Criteria | Points |
|----------|--------|
| Navbar with Flexbox | 10 |
| Hero two-column layout | 15 |
| Card grid with equal-height cards | 20 |
| About section layout | 15 |
| Footer layout | 10 |
| Responsive at mobile breakpoint | 15 |
| Perfect centering section | 15 |
| **Total** | **100** |

---

## Resources

### Official Documentation

- [MDN — Flexbox Concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
- [MDN — Flexbox Property Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)
- [CSS-Tricks — A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### Interactive Practice Tools

- [Flexbox Froggy](https://flexboxfroggy.com/) — Learn Flexbox by positioning frogs on lily pads. Highly recommended!
- [Flexbox Defense](http://www.flexboxdefense.com/) — Learn Flexbox through a tower defense game.
- [Flexbox Playground](https://flexbox.netlify.app/) — Interactive visualizer for all Flexbox properties.

### Videos

- Kevin Powell's "Flexbox" series on YouTube — exceptional for visual learners.
- Traversy Media — "Flexbox Crash Course" (free on YouTube).

### Cheat Sheets

- [Flexbox Cheatsheet — yoksel](https://yoksel.github.io/flex-cheatsheet/)
- [Grid vs Flexbox Guide — web.dev](https://web.dev/articles/flexbox)

---

## Key Takeaways

1. **`display: flex` on the parent** activates Flexbox. Direct children become flex items automatically.

2. **There are two axes.** Main axis (direction of travel) and cross axis (perpendicular). `justify-content` controls the main axis. `align-items` controls the cross axis.

3. **`flex-direction` determines the main axis.** `row` (default) = horizontal. `column` = vertical. Switching direction rotates both axes.

4. **Distributing space on the main axis** uses `justify-content`: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`.

5. **Aligning on the cross axis** uses `align-items`: `stretch` (default), `flex-start`, `flex-end`, `center`, `baseline`.

6. **Perfect centering** = `justify-content: center` + `align-items: center`.

7. **`flex-wrap: wrap`** allows items to wrap to new lines. `align-content` then controls those lines.

8. **`gap`** adds clean space between items without edge bleeding.

9. **The `flex` shorthand** = `grow | shrink | basis`. Most common: `flex: 1` (equal share), `flex: 0 0 250px` (fixed size).

10. **`order`** changes visual order without changing HTML. **`align-self`** overrides a single item's cross-axis alignment.

11. **Equal-height card buttons:** Make the card a column flex container, give `flex-grow: 1` to the content above the button, and the button is always pinned to the bottom.

---

## Common Mistakes & How to Avoid Them

| Mistake | Why It Happens | How to Fix It |
|---------|---------------|---------------|
| Putting `justify-content` on items instead of the container | Confusion about which element to target | Remember: `justify-content` is a **container** property |
| Forgetting that `align-content` needs `flex-wrap: wrap` | Using `align-content` on a single-line container | Check that items are actually wrapping to multiple lines |
| Expecting `align-items: center` to work without a height | The container shrinks to fit its content | Give the container an explicit `height` or `min-height` |
| Using `width` instead of `flex-basis` | Not knowing the difference | `flex-basis` overrides `width` in flex context; prefer `flex-basis` |
| `flex: 1` makes items different sizes | Items have different natural content widths | Use `flex: 1 1 0` instead of `flex: 1` (which is `1 1 0%`) — this forces equal sharing |
| `flex-shrink: 0` causes overflow | Item refuses to shrink even when container is tiny | Add `overflow: hidden` or `overflow: auto` on the container, or remove `flex-shrink: 0` |
| Vertical alignment not working in a column flex | `justify-content` is now the vertical axis in a column | Use `justify-content` for vertical alignment and `align-items` for horizontal when in column direction |
| `order` property breaks keyboard navigation | DOM order differs from visual order | Minimize use of `order`; only use it for cosmetic reordering, not for content flow |
| Nested flex containers create confusion | Hard to track which level a property applies to | Draw a box diagram of parent/child relationships before writing CSS |
| `gap` not working | Using an old browser or wrong property name | Check browser support; use `column-gap` / `row-gap` as fallback |
| All flex items same width even with different content | `flex-grow: 1` makes all items equal | Set `flex-grow: 0` and use `flex-basis: auto` if you want natural widths |
| Flex items overflow the container horizontally | Default `flex-wrap: nowrap` prevents wrapping | Add `flex-wrap: wrap` to the container |
| Can't get sidebar to stay at a fixed width | Using `width` which gets overridden | Use `flex: 0 0 250px` (grow:0, shrink:0, basis:250px) |
| Items don't fill the full height of the container | `align-items` defaults to `stretch` but something is overriding it | Check for explicit `height` values on items; remove or use `align-self: stretch` |
| Button not at the bottom of card | Not using the column+grow trick | Make card `flex-direction: column`, give content above button `flex-grow: 1` |