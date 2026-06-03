# 04 — CSS Layout: Positioning, Floats & Display

---

**Course:** Fullstack Web Development  
**Instructor:** [Your Instructor Name]  
**Duration:** 3 hours (lecture + labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [The `display` Property](#the-display-property)
4. [`display: none` vs `visibility: hidden`](#display-none-vs-visibility-hidden)
5. [CSS Positioning](#css-positioning)
6. [The Positioned Ancestor Concept](#the-positioned-ancestor-concept)
7. [Z-Index and Stacking Contexts](#z-index-and-stacking-contexts)
8. [Legacy Floats & Clearing](#legacy-floats--clearing)
9. [The `overflow` Property](#the-overflow-property)
10. [Overlays: Old Way vs Native `<dialog>`](#overlays-old-way-vs-native-dialog)
11. [BEM Naming Convention](#bem-naming-convention)
12. [Lab 1: Sticky Nav with Dropdown](#lab-1-sticky-nav-with-dropdown)
13. [Lab 2: CSS-Only Modal using `:target`](#lab-2-css-only-modal-using-target)
14. [Assignment: Portfolio Project Part 4](#assignment-portfolio-project-part-4)
15. [Resources](#resources)
16. [Key Takeaways](#key-takeaways)
17. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this lecture, you will be able to:

- Explain what the `display` property does and name at least six of its values
- Describe the visual difference between `display: none` and `visibility: hidden`
- Identify the five CSS positioning schemes and explain when to use each
- Build a component that uses the **positioned ancestor** pattern (relative parent + absolute child)
- Explain what a stacking context is and use `z-index` correctly
- Clear a float-collapsed container using `display: flow-root`
- Choose the correct `overflow` value for a given layout problem
- Build a modal overlay using both the legacy approach and the native `<dialog>` element
- Apply the **BEM** naming convention to a real HTML component

---

## Agenda

| Time | Topic |
|------|-------|
| 0:00 – 0:20 | Recap & Warm-up Q&A |
| 0:20 – 0:50 | The `display` property |
| 0:50 – 1:15 | `display: none` vs `visibility: hidden` |
| 1:15 – 1:50 | CSS Positioning (static → sticky) |
| 1:50 – 2:05 | Z-Index & Stacking Contexts |
| 2:05 – 2:20 | Legacy Floats & the Float Collapse Problem |
| 2:20 – 2:30 | Overflow |
| 2:30 – 2:45 | Overlays: Old Way vs `<dialog>` |
| 2:45 – 3:00 | BEM Naming Convention |
| 3:00 – 3:40 | **Lab 1**: Sticky Nav with Dropdown |
| 3:40 – 4:00 | **Lab 2**: CSS-Only Modal using `:target` |

---

## The `display` Property

### What is it, in plain English?

Every HTML element is a **box**. The `display` property tells the browser two things:

1. **How does this box behave on the outside?** — Does it sit on its own line, or does it flow alongside other elements?
2. **How does this box behave on the inside?** — How do *its children* get laid out?

Think of HTML elements as pieces of furniture in a room:

> 🛋️ **Block elements** are like a sofa — they take up the full width of the room wall-to-wall. You can't fit anything beside them on the same "row."
>
> 📱 **Inline elements** are like throw pillows — they sit side-by-side as long as there's space, and they only take up as much room as they need.

### Why does this matter?

Without understanding `display`, you'll spend hours fighting CSS — wondering why a `<span>` won't accept `width` and `height`, or why two `<div>`s stack on top of each other when you want them side-by-side. Mastering `display` is the foundation of every layout technique you'll ever use.

---

### `display: block`

**Behavior:**
- Takes up the **full width** of its parent container, even if the content is narrower
- Starts on a **new line**, pushing subsequent elements down
- Accepts all box model properties: `width`, `height`, `margin`, `padding`

**Default block elements:** `<div>`, `<p>`, `<h1>`–`<h6>`, `<ul>`, `<li>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<main>`

```html
<!-- Block elements: each takes a full row -->
<div style="background: #e0f0ff; margin-bottom: 8px;">Block 1 — I take the full width</div>
<div style="background: #ffe0e0; margin-bottom: 8px;">Block 2 — I start on a new line</div>
<div style="background: #e0ffe0;">Block 3 — Same here</div>
```

```css
/* Demonstrating block behaviour */
.card {
  display: block;       /* This is the default for <div> — listed for clarity */
  width: 300px;         /* We CAN set width on block elements */
  height: 150px;        /* We CAN set height on block elements */
  margin: 0 auto;       /* auto left/right margin centres a block element */
  background: #1e293b;
  color: #f8fafc;
  padding: 16px;
}
```

**ASCII Diagram — Block layout:**

```
┌──────────────────────────────────────────────┐
│ Parent container (full width)                │
│ ┌──────────────────────────────────────────┐ │
│ │ Block Element 1                          │ │  ← takes full width
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Block Element 2                          │ │  ← starts on NEW line
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

### `display: inline`

**Behavior:**
- Takes up only as much width as its **content requires**
- Does **NOT** start on a new line — flows alongside other inline elements (like words in a sentence)
- **Ignores** `width` and `height` properties (setting them has no effect!)
- Top and bottom `margin`/`padding` won't push other elements away (they may overlap)

**Default inline elements:** `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<button>` (partially), `<label>`

```html
<!-- Inline elements flow like words in a paragraph -->
<p>
  This is a paragraph with 
  <span style="background: yellow;">highlighted text</span>  <!-- inline: sits IN the sentence -->
  and a 
  <a href="#">link</a>                                       <!-- inline: also sits in the line -->
  right here.
</p>
```

```css
/* Why width/height don't work on inline elements */
span {
  display: inline;  /* default — listed for clarity */
  width: 200px;     /* ❌ IGNORED — inline elements size to their content */
  height: 100px;    /* ❌ IGNORED — same reason */
  background: gold; /* ✅ This DOES work — it colours the content area */
}
```

> [!WARNING]
> Setting `width` or `height` on a `display: inline` element has **no effect**. If you need those properties, switch to `inline-block` or `block`.

**ASCII Diagram — Inline layout:**

```
┌──────────────────────────────────────────────┐
│ Some text [inline 1][inline 2] more text...  │  ← all on the same line
│ ...wraps to next line when needed [inline 3] │
└──────────────────────────────────────────────┘
```

---

### `display: inline-block`

**Behavior:**
- Flows like an inline element (sits beside siblings on the same line)
- But respects `width`, `height`, `margin`, and `padding` like a block element

Think of it as a **hybrid**: the *outside* is inline (stays in the flow of text), but the *inside* is block (you control its dimensions).

**Real-world use case:** Navigation bar items, image + caption combos, buttons.

```html
<!-- Three boxes sitting side-by-side -->
<div class="box">Box 1</div>
<div class="box">Box 2</div>
<div class="box">Box 3</div>
```

```css
.box {
  display: inline-block; /* Sit side-by-side BUT respect width/height */
  width: 120px;          /* ✅ NOW this works! */
  height: 80px;          /* ✅ And this! */
  background: #6366f1;
  color: white;
  text-align: center;
  line-height: 80px;     /* Vertically centres text by matching line-height to box height */
  margin-right: 8px;     /* Space between boxes */
}
```

> [!NOTE]
> When you write `display: inline-block` elements in HTML with whitespace between them (e.g., a newline), the browser renders a small **gap** (~4px) between them. Fix this by removing whitespace in HTML, or use Flexbox instead.

---

### `display: none`

Completely **removes the element** from the page — as if it doesn't exist. No space is reserved for it.

```css
.hidden-element {
  display: none; /* Element gone: no space, no visibility, not accessible by default */
}
```

We cover this in depth in the next section alongside `visibility: hidden`.

---

### `display: flex`

Turns the element into a **flex container**. All direct children become **flex items** that can be arranged in rows or columns with powerful alignment controls.

> [!NOTE]
> Flexbox is covered in depth in Lecture 05. This section gives you the essential mental model.

```css
.navbar {
  display: flex;          /* Children (nav items) now participate in flexbox */
  justify-content: space-between; /* Space items across the main axis */
  align-items: center;    /* Centre items on the cross axis (vertical, here) */
  gap: 16px;              /* Modern way to add space between flex items */
}
```

---

### `display: grid`

Turns the element into a **grid container**. Children are placed on a two-dimensional grid of rows and columns.

> [!NOTE]
> CSS Grid is covered in depth in Lecture 06.

```css
.gallery {
  display: grid;                            /* Children placed on a grid */
  grid-template-columns: repeat(3, 1fr);   /* 3 equal-width columns */
  grid-template-rows: auto;                /* Rows sized to content */
  gap: 24px;                               /* Space between grid cells */
}
```

---

### `display` Values — Quick Reference Table

| Value | Sits on new line? | Accepts width/height? | Children layout |
|-------|:-----------------:|:--------------------:|----------------|
| `block` | ✅ Yes | ✅ Yes | Normal flow |
| `inline` | ❌ No | ❌ No | Normal flow |
| `inline-block` | ❌ No | ✅ Yes | Normal flow |
| `none` | — (invisible) | — (invisible) | — |
| `flex` | ✅ Yes | ✅ Yes | Flexbox |
| `grid` | ✅ Yes | ✅ Yes | Grid |

### Section Recap — `display`

- Every element is a box; `display` controls how that box behaves
- `block`: full-width, new line, accepts dimensions
- `inline`: content-width, flows inline, ignores width/height
- `inline-block`: flows inline, accepts dimensions (the best of both)
- `none`: removes element from the page entirely
- `flex` and `grid` unlock advanced 2D layout (covered later)

---

## `display: none` vs `visibility: hidden`

### Why does this matter?

Both techniques hide elements from the user, but they work **very differently**. Choosing the wrong one can break your layout or create accessibility issues. This is a classic interview question.

### The Space Problem

Imagine you're sitting in a row of cinema seats. If you leave your seat:

- **`display: none`** = you went home. Your seat collapses. The person next to you slides over.
- **`visibility: hidden`** = you're hiding under your coat. Your seat is **still there**, still reserved. The person next to you stays in place.

```html
<div class="container">
  <div class="box box-1">Box 1</div>
  <div class="box box-hidden">Box 2 (hidden)</div>  <!-- this one is hidden -->
  <div class="box box-3">Box 3</div>
</div>
```

```css
/* SCENARIO A: display: none */
.box-hidden-display-none {
  display: none;
  /* Box 2 vanishes completely — Box 3 slides up to fill its space */
}

/* SCENARIO B: visibility: hidden */
.box-hidden-visibility {
  visibility: hidden;
  /* Box 2 is invisible — Box 3 stays in its original position */
  /* A "ghost" gap remains where Box 2 was */
}
```

**ASCII Diagram — Side by side comparison:**

```
BEFORE HIDING:
┌────────┐ ┌────────┐ ┌────────┐
│ Box 1  │ │ Box 2  │ │ Box 3  │
└────────┘ └────────┘ └────────┘

AFTER display: none on Box 2:
┌────────┐ ┌────────┐
│ Box 1  │ │ Box 3  │   ← Box 2 is GONE; Box 3 moved left/up
└────────┘ └────────┘

AFTER visibility: hidden on Box 2:
┌────────┐ ┌        ┐ ┌────────┐
│ Box 1  │ │ (gap)  │ │ Box 3  │  ← Box 2 is INVISIBLE but space remains
└────────┘ └        ┘ └────────┘
```

---

### Accessibility Considerations

| Technique | Screen reader announces it? | Focusable? |
|-----------|:---------------------------:|:----------:|
| `display: none` | ❌ No | ❌ No |
| `visibility: hidden` | ❌ No | ❌ No |
| `opacity: 0` | ✅ Yes! | ✅ Yes! |

> [!IMPORTANT]
> If you want to visually hide something but still have it read by screen readers (e.g., a "skip to content" link), use the **visually-hidden** CSS utility pattern instead:
> ```css
> .visually-hidden {
>   position: absolute;
>   width: 1px;
>   height: 1px;
>   overflow: hidden;
>   clip: rect(0, 0, 0, 0);
>   white-space: nowrap;
> }
> ```

### When to use which

| Use case | Best choice |
|----------|-------------|
| Toggle element in/out of UI (e.g., dropdown menu) | `display: none` → `display: block` |
| Hide element but preserve surrounding layout | `visibility: hidden` |
| Fade element in/out with CSS transition | `opacity: 0` → `opacity: 1` |
| Hide from visual users but keep for screen readers | `.visually-hidden` class |

### Section Recap — `display: none` vs `visibility: hidden`

- `display: none` removes the element from the document flow — no space remains
- `visibility: hidden` makes the element invisible but preserves its space in the layout
- `opacity: 0` hides visually but keeps the element fully interactive and accessible
- Know which one you need before reaching for `display: none` by default

---

## CSS Positioning

### What is it, in plain English?

By default, every HTML element is placed in the **normal document flow** — one after another, like paragraphs in a book. CSS positioning lets you **break elements out** of this flow and place them exactly where you want on the screen.

### Building / Floor Analogy

Imagine a **skyscraper**:

- Most offices are on their assigned floor, in the normal layout of that floor — this is **static** positioning (the default)
- An office can be shifted slightly from where it would normally go — this is **relative** positioning
- A sign can be hung anywhere in the building, but its exact position is relative to *which floor* it's on — this is **absolute** positioning
- The lobby reception desk is always visible regardless of which floor you're looking from — this is **fixed** positioning
- A section header that sticks to the top of the window while you scroll through that section — this is **sticky** positioning

The CSS property that controls all this is `position`. Its offset properties — `top`, `right`, `bottom`, `left` — tell the element how far to move from its reference point.

---

### `position: static` (the default)

Every element starts with `position: static`. It simply means: **"go with the flow."** The `top`, `right`, `bottom`, `left`, and `z-index` properties have **no effect** on statically positioned elements.

```css
.paragraph {
  position: static; /* Default — element sits in normal document flow */
  /* top, left, etc. are IGNORED here */
}
```

> [!NOTE]
> You'll rarely write `position: static` explicitly. It's the default, so it's only useful to reset a position that was set elsewhere.

---

### `position: relative`

**"Move me from where I would normally be, but keep my original space."**

When you apply `position: relative`, the element stays in the **normal flow** (other elements act as if it's still there), but you can use `top`, `right`, `bottom`, `left` to nudge it from its natural position.

This serves two key purposes:
1. Fine-tuning element position
2. **Establishing a positioning context** for absolutely positioned children (more on this soon!)

```html
<div class="box normal">Normal Box</div>
<div class="box shifted">Shifted Box (relative)</div>
<div class="box normal">Another Normal Box</div>
```

```css
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: #6366f1;
  color: white;
  text-align: center;
  line-height: 100px;
  margin: 5px;
}

.shifted {
  position: relative;  /* Now we can use offset properties */
  top: 20px;           /* Move DOWN 20px from where it would normally sit */
  left: 30px;          /* Move RIGHT 30px from where it would normally sit */
  /* Its original space in the document is STILL RESERVED */
}
```

**ASCII Diagram — `position: relative`:**

```
NORMAL FLOW (where .shifted would be):
[Normal Box] [  GHOST  ] [Another Normal Box]
                ↓ 20px
              [Shifted Box]  ← visually moved, ghost still reserves space above
```

---

### `position: absolute`

**"Remove me from the flow and place me at exact coordinates relative to my nearest positioned ancestor."**

Two critical things happen with `absolute`:
1. The element is **removed from normal flow** — other elements behave as if it doesn't exist
2. Its `top/right/bottom/left` values are measured from its **nearest positioned ancestor** (an ancestor with `position` other than `static`)

If no positioned ancestor exists, the element is positioned relative to the **initial containing block** (the `<html>` element, essentially the viewport).

```html
<div class="card">
  <!-- The card is position: relative — it's the "anchor" -->
  <img src="product.jpg" alt="Product" class="card__image">
  <span class="card__badge">NEW</span>  <!-- This will be absolutely positioned -->
  <div class="card__body">
    <h3>Product Name</h3>
    <p>Description text here</p>
  </div>
</div>
```

```css
.card {
  position: relative; /* ← CRITICAL: Makes this the "anchor" for the badge */
  width: 280px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.card__badge {
  position: absolute; /* Removed from flow, positioned relative to .card */
  top: 12px;          /* 12px from the TOP edge of .card */
  right: 12px;        /* 12px from the RIGHT edge of .card */
  background: #ef4444;
  color: white;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}
```

**ASCII Diagram — Absolute positioning within a relative parent:**

```
┌──────────────────────────────────┐  ← .card (position: relative)
│                         ┌──────┐ │
│                         │ NEW  │ │  ← .card__badge (position: absolute)
│                         └──────┘ │    top: 12px; right: 12px
│  [product image]                 │
│                                  │
│  Product Name                    │
│  Description text                │
└──────────────────────────────────┘
```

> [!IMPORTANT]
> **The golden rule of absolute positioning:** Always check that your parent has `position: relative` (or `absolute`, `fixed`, or `sticky`) before positioning a child absolutely. If you forget, the child will escape to the nearest positioned ancestor — often jumping across the entire page!

---

### `position: fixed`

**"Lock me to the viewport — I never scroll away."**

Fixed elements are positioned relative to the **browser viewport** (the visible window area). They stay in place even when the user scrolls.

Common use cases: Sticky navigation bars, floating action buttons (FAB), cookie consent banners, chat widgets.

```css
.navbar {
  position: fixed;  /* Locked to the viewport */
  top: 0;           /* Hugs the top of the viewport */
  left: 0;          /* Starts from the left edge */
  right: 0;         /* Stretches to the right edge (equivalent to width: 100%) */
  height: 60px;
  background: #0f172a;
  z-index: 1000;    /* Sits on top of other content */
}

/*
 * IMPORTANT: When you have a fixed navbar, the content below it
 * gets hidden underneath it. Fix this by adding padding-top to <body>
 * equal to the navbar's height.
 */
body {
  padding-top: 60px; /* Prevents content from hiding behind the fixed navbar */
}
```

> [!WARNING]
> Fixed elements are removed from the normal flow. Content below them will slide up underneath. Always compensate with `padding-top` on the body or main content area.

---

### `position: sticky`

**"Flow normally until you hit a scroll threshold — then stick."**

Sticky is the clever hybrid. An element behaves like `relative` until the user scrolls it to a threshold (e.g., `top: 0`), at which point it behaves like `fixed` — stuck to that position — until its parent container scrolls out of view.

This is perfect for section headers that should stick while the user reads that section.

```css
.section-header {
  position: sticky; /* Normal flow until scroll threshold is reached */
  top: 60px;        /* Stick 60px from the viewport top (accounting for navbar) */
  background: white;
  z-index: 10;      /* Needs z-index to appear above scrolling content */
  padding: 8px 0;
}
```

**Step-by-step: How sticky scrolling works:**

1. Page loads — `.section-header` is in normal flow, like `position: relative`
2. User scrolls down — header moves upward with the page
3. Header reaches `top: 60px` from the viewport top — it **sticks** there
4. User keeps scrolling — header stays at `top: 60px` while page content scrolls beneath it
5. Parent container scrolls out of view — header unsticks and scrolls away naturally

> [!TIP]
> Sticky positioning has a known gotcha: it **only works** if all ancestor elements have `overflow` set to `visible` (the default). If any parent has `overflow: hidden`, `overflow: scroll`, or `overflow: auto`, sticky will silently fail. This is one of the most common sticky bugs!

---

### Positioning Cheatsheet

| Value | In normal flow? | Reference point | `top/left` work? |
|-------|:--------------:|-----------------|:----------------:|
| `static` | ✅ Yes | — | ❌ No |
| `relative` | ✅ Yes (space reserved) | Its own natural position | ✅ Yes |
| `absolute` | ❌ No | Nearest positioned ancestor | ✅ Yes |
| `fixed` | ❌ No | Viewport | ✅ Yes |
| `sticky` | ✅ Yes (until threshold) | Viewport (after threshold) | ✅ Yes |

### Section Recap — CSS Positioning

- `static` is the default; offset properties do nothing
- `relative` moves from natural position; original space is preserved; used as anchor for `absolute` children
- `absolute` is removed from flow; snaps to nearest positioned ancestor
- `fixed` locks to the viewport; always visible regardless of scroll
- `sticky` is a hybrid: flows normally, then "sticks" at a scroll threshold

---

## The Positioned Ancestor Concept

### Why does this matter?

This is the single most misunderstood concept in CSS positioning. Developers often see their absolutely positioned element fly to a completely unexpected location — the culprit is almost always a missing `position: relative` on the parent.

### The Pattern

```
Parent element: position: relative;
  └── Child element: position: absolute; top: X; left: Y;
```

The child's `top`, `right`, `bottom`, `left` values are measured from the **padding edge** of the nearest ancestor with a non-static position.

### Step-by-step: Building a Tooltip

```html
<!-- The button is the "anchor" — it contains the tooltip -->
<button class="btn-with-tooltip">
  Hover Me
  <!-- Tooltip lives INSIDE the button for positioning context -->
  <span class="tooltip">This is helpful info!</span>
</button>
```

```css
/* Step 1: Make the parent the positioning anchor */
.btn-with-tooltip {
  position: relative;        /* ← THIS is what the tooltip measures from */
  display: inline-block;
  padding: 10px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

/* Step 2: Position the tooltip relative to the button */
.tooltip {
  position: absolute;        /* Removed from flow, anchors to .btn-with-tooltip */
  bottom: calc(100% + 8px); /* 100% = full height of button, + 8px gap above it */
  left: 50%;                 /* Start at the horizontal centre of the button */
  transform: translateX(-50%); /* Pull back by half its own width to truly centre */
  background: #1e293b;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;       /* Prevent tooltip text from wrapping */
  pointer-events: none;      /* Don't block mouse events on other elements */

  /* Hide by default */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease; /* Smooth fade */
}

/* Step 3: Show tooltip on hover */
.btn-with-tooltip:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
```

**ASCII Diagram — Tooltip positioning:**

```
         ┌─────────────────────┐
         │  This is helpful!   │  ← .tooltip (position: absolute)
         └─────────────────────┘
                  ↕ 8px gap
         ┌────────────────────┐
         │     Hover Me       │  ← .btn-with-tooltip (position: relative)
         └────────────────────┘
```

### Section Recap — Positioned Ancestor

- Absolute children look for the **nearest non-static ancestor** as their reference
- Always set `position: relative` on the parent you want to use as the anchor
- If no positioned ancestor exists, absolute elements escape to the `<html>` element
- This pattern is used for badges, tooltips, dropdowns, overlays, and more

---

## Z-Index and Stacking Contexts

### What is z-index, in plain English?

Normally, web pages are laid out in 2D (left-right, up-down). But elements can **overlap** each other, creating a third dimension — depth. `z-index` controls which element appears **on top** when elements overlap.

### Layers of Paper Analogy

Imagine your desk covered in pieces of paper:

- Each piece of paper is an element
- `z-index` is like writing a number on each paper
- Higher number = paper is on top
- `z-index: 1` sits below `z-index: 2` which sits below `z-index: 10`

```
z-index: 9999  ← TOP (modal overlay)
z-index: 100   ← Navigation bar
z-index: 10    ← Dropdown menu
z-index: 1     ← Regular content
z-index: -1    ← Decorative background elements
```

> [!NOTE]
> `z-index` **only works on positioned elements** — elements with `position` set to anything other than `static`. Setting `z-index` on a static element has no effect.

```css
/* Example: Dropdown menu appears above page content */
.nav {
  position: fixed;  /* Must be positioned for z-index to work */
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;     /* Above regular content */
}

.dropdown-menu {
  position: absolute; /* Must be positioned */
  top: 100%;          /* Below the nav */
  z-index: 200;       /* Even higher than the nav itself */
}

.modal-overlay {
  position: fixed;    /* Covers the entire viewport */
  inset: 0;           /* Shorthand for top:0; right:0; bottom:0; left:0 */
  z-index: 9999;      /* Near-maximum — appears above everything */
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent dark overlay */
}
```

---

### Stacking Contexts

Here's where it gets tricky. A **stacking context** is like a separate "stack" of papers that operates independently.

When an element creates a stacking context, its children's `z-index` values are **only compared within that context** — not against elements outside it.

**What creates a new stacking context?**

- `position` (non-static) + `z-index` (non-auto)
- `opacity` less than 1
- `transform` with any value other than `none`
- `filter` with any value other than `none`
- `will-change` property on certain values

```html
<!-- Illustrating the stacking context trap -->
<div class="box-a">Box A (z-index: 1)</div>
<div class="box-b">
  <!-- This box creates its own stacking context! -->
  <div class="child">Child with z-index: 9999</div>
</div>
```

```css
.box-a {
  position: relative;
  z-index: 1;
  background: #6366f1;
  /* Box A is ABOVE Box B in the main stacking context */
}

.box-b {
  position: relative;
  z-index: 0;           /* Box B is below Box A */
  opacity: 0.99;        /* ← This creates a NEW stacking context! */
  /* Even though opacity is nearly 1, it still triggers a stacking context */
}

.child {
  position: relative;
  z-index: 9999;        /* This ONLY competes within Box B's stacking context */
  /* The child CANNOT appear above Box A, no matter how high its z-index is */
}
```

**ASCII Diagram — Stacking Contexts:**

```
Main stacking context:
  ┌─────────────────┐   z-index: 1  (top)
  │ Box A           │
  └─────────────────┘
  ┌─────────────────┐   z-index: 0  (bottom — its own stacking context)
  │ Box B           │
  │  ┌───────────┐  │   z-index: 9999 within Box B only
  │  │  Child    │  │   BUT still BELOW Box A globally!
  │  └───────────┘  │
  └─────────────────┘
```

> [!WARNING]
> The stacking context is one of the most common sources of z-index bugs. If your `z-index: 9999` isn't working, check if a parent element has `opacity < 1`, `transform`, or `filter` — any of these create a stacking context that traps your element.

---

### Z-Index Best Practices

1. **Use a z-index scale** — define meaningful levels in a design token system:

```css
:root {
  --z-base:    1;     /* Regular elevated content */
  --z-dropdown: 100;  /* Dropdown menus */
  --z-sticky:   200;  /* Sticky headers */
  --z-fixed:    300;  /* Fixed navigation */
  --z-modal:    400;  /* Modal overlays */
  --z-toast:    500;  /* Toast notifications (appear above modals) */
}
```

2. **Never use arbitrary magic numbers** like `z-index: 9999` or `z-index: 99999` — use your scale
3. **Check for stacking context traps** if z-index isn't working as expected

### Section Recap — Z-Index & Stacking Contexts

- `z-index` controls depth/layering of overlapping elements
- Only works on positioned elements (not `position: static`)
- Higher `z-index` = appears on top
- Stacking contexts create isolated "sub-stacks" — children can't escape their parent's context
- `opacity < 1`, `transform`, and `filter` all trigger stacking contexts

---

## Legacy Floats & Clearing

### Why does this matter?

Floats were the primary layout tool before Flexbox and Grid. You'll encounter them in legacy code and in situations like text wrapping around images. Understanding them — including their infamous quirks — is essential.

### What is a float?

`float` was originally designed for magazine-style layouts — think a photo with text flowing around it, like in a printed article.

```css
img.article-image {
  float: left;        /* Pull the image to the left; text wraps around it */
  margin-right: 16px; /* Space between image and text */
  margin-bottom: 8px;
}
```

**ASCII Diagram — Float: left:**

```
┌───────────────────────────────────────────┐
│ ┌─────────────┐  This is the article text │
│ │             │  that wraps around the    │
│ │   Image     │  floated image on the     │
│ │             │  left side. Pretty cool!  │
│ └─────────────┘  More text continues here │
│ after the image ends, it goes full width. │
└───────────────────────────────────────────┘
```

---

### The Float Collapse Problem

Here's the notorious quirk: **floated elements are partially removed from the normal flow**. If a parent container contains *only* floated children, the parent **collapses to zero height** — it doesn't see its floated children.

```html
<div class="container">
  <div class="floated">Float 1</div>
  <div class="floated">Float 2</div>
  <!-- No non-floated content — parent collapses! -->
</div>
```

```css
.container {
  background: #dbeafe;
  border: 2px solid #3b82f6;
  /* HEIGHT = 0! Parent can't see its floated children */
}

.floated {
  float: left;
  width: 100px;
  height: 100px;
  background: #6366f1;
  margin: 8px;
}
```

**ASCII Diagram — Float collapse:**

```
EXPECTED:                          ACTUAL (collapsed):
┌──────────────────────────┐       ┌──────────────────────────┐  ← 0px height!
│ [Float 1] [Float 2]      │       └──────────────────────────┘
└──────────────────────────┘       [Float 1] [Float 2]  ← escaped the container
```

---

### The Solution: `display: flow-root`

The modern and cleanest solution to float collapse is `display: flow-root`. It creates a **Block Formatting Context (BFC)** — a self-contained layout environment where floats are contained.

```css
.container {
  display: flow-root; /* Creates a BFC — contains floated children properly */
  background: #dbeafe;
  border: 2px solid #3b82f6;
  /* NOW the container grows to wrap its floated children */
}
```

**Step-by-step: Before `flow-root` existed, developers used hacks:**

1. **The `clearfix` hack** (old-school):
```css
/* The "clearfix" — added to the parent's ::after pseudo-element */
.clearfix::after {
  content: "";        /* Generate empty content */
  display: table;     /* Create an anonymous table element */
  clear: both;        /* Clear both left and right floats */
}
```

2. **Adding `overflow: hidden`** (side-effect-laden hack):
```css
.container {
  overflow: hidden; /* Also creates a BFC, but clips content — side effect! */
}
```

3. **Modern way — `display: flow-root`** (recommended today):
```css
.container {
  display: flow-root; /* Cleanly creates a BFC with no side effects */
}
```

> [!TIP]
> In new code, always prefer `display: flow-root` over the `clearfix` hack. For new layouts in general, prefer Flexbox or Grid over floats entirely.

---

### When to Still Use Floats

Even with Flexbox and Grid, floats are still the **correct tool** for one specific use case: **wrapping text around images**, exactly like in a printed magazine.

```css
/* Good use of float in 2024+ */
.article-figure {
  float: left;        /* Text wraps around the image naturally */
  width: 40%;
  margin: 0 24px 16px 0;
  shape-outside: circle(); /* Modern addition: text wraps to the image's shape! */
}
```

### Section Recap — Floats & Clearing

- Floats were the original layout tool; now largely replaced by Flexbox and Grid
- `float: left` or `float: right` pulls an element out of normal flow; text wraps around it
- Parent containers collapse (height: 0) if they contain only floated children
- Fix with `display: flow-root` on the parent (the modern, clean solution)
- Old `clearfix` hack used `::after { clear: both }` — you'll see this in legacy code
- Still valid for: text wrapping around images

---

## The `overflow` Property

### What is it, in plain English?

When an element's content is **larger than the element itself**, the content overflows. The `overflow` property tells the browser what to do in that situation.

Think of `overflow` like a swimming pool:

- **`visible`**: The water spills over the edge onto the patio (content escapes the box)
- **`hidden`**: The water is contained but you can't see the overflow (content clipped)
- **`scroll`**: You install a pump and bucket — you can manually move water around (always shows scrollbars)
- **`auto`**: A smart drain — only activates if water level rises too high (shows scrollbars only when needed)

### `overflow: visible` (default)

Content that exceeds the element's dimensions is rendered **outside** the element's box. Other layout is not affected.

```css
.box {
  width: 150px;
  height: 80px;
  overflow: visible; /* Default — content spills out; no clipping */
  background: #fef3c7;
  border: 1px solid #f59e0b;
}
```

### `overflow: hidden`

Content is **clipped** at the element's edge. Anything outside is invisible. Also useful for:
- Clipping images in a card (`border-radius` + `overflow: hidden`)
- Creating a BFC (as a clearfix — though `flow-root` is better)

```css
.card {
  border-radius: 12px;
  overflow: hidden;   /* Clips the image corners to match the card radius */
  /* Without this, the image would poke out of the rounded corners */
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;  /* Makes the box circular */
  overflow: hidden;    /* Ensures image is clipped to the circle */
}
```

> [!WARNING]
> `overflow: hidden` on a parent will clip absolutely positioned children that extend beyond the parent's bounds. It also prevents `position: sticky` from working on any descendants. Use with care!

### `overflow: scroll`

**Always** shows scrollbars — even when content fits. This can look ugly on some operating systems.

```css
.code-block {
  overflow: scroll; /* Always shows both X and Y scrollbars */
  /* Usually not what you want */
}
```

### `overflow: auto`

**Only** shows scrollbars when content overflows. This is almost always what you want.

```css
.chat-window {
  height: 400px;
  overflow-y: auto;  /* Vertical scroll when messages exceed 400px */
  overflow-x: hidden; /* No horizontal scroll */
}

.data-table-wrapper {
  overflow-x: auto;  /* Horizontal scroll for wide tables on small screens */
  overflow-y: visible;
}
```

### Controlling Axes Independently

```css
/* overflow is shorthand for overflow-x and overflow-y */
.element {
  overflow-x: hidden;  /* Clip horizontal overflow */
  overflow-y: auto;    /* Scroll vertical overflow only when needed */
}
```

### Section Recap — Overflow

- `visible` (default): content renders outside the box
- `hidden`: content is clipped; also creates a BFC; blocks sticky in descendants
- `scroll`: always shows scrollbars
- `auto`: shows scrollbars only when needed — use this most often
- Use `overflow-x` and `overflow-y` to control each axis independently

---

## Overlays: Old Way vs Native `<dialog>`

### Why does this matter?

Overlays (modals) are everywhere on the web — login prompts, confirmation dialogs, image lightboxes. Building them correctly is harder than it looks. There are accessibility, focus management, and layering concerns. Let's compare the old manual way versus the modern semantic approach.

---

### The Old Way: Manual Overlay with `z-index: 9999`

Before the `<dialog>` element was widely supported, developers built modals entirely from scratch.

**HTML Structure:**

```html
<!-- The overlay background -->
<div class="overlay" id="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <!-- The modal panel sits inside the overlay -->
  <div class="modal-panel">
    <button class="modal-close" aria-label="Close modal">&times;</button>
    <h2 id="modal-title">Confirm Action</h2>
    <p>Are you sure you want to delete this item? This cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn btn--secondary" id="cancel-btn">Cancel</button>
      <button class="btn btn--danger" id="confirm-btn">Delete</button>
    </div>
  </div>
</div>
```

**CSS:**

```css
/* Step 1: The overlay — covers the entire viewport */
.overlay {
  position: fixed;                  /* Stays put during scrolling */
  inset: 0;                         /* Shorthand: top:0; right:0; bottom:0; left:0 */
  background: rgba(0, 0, 0, 0.5);  /* Semi-transparent black backdrop */
  display: flex;                    /* Use flexbox to centre the modal panel */
  align-items: center;              /* Centre vertically */
  justify-content: center;          /* Centre horizontally */
  z-index: 9999;                    /* Above everything else */

  /* Hidden by default */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

/* Step 2: Show the overlay when it has the 'active' class */
.overlay.is-active {
  opacity: 1;
  visibility: visible;
}

/* Step 3: The modal panel itself */
.modal-panel {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 480px;
  width: 90%;                       /* Responsive: 90% on small screens */
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;               /* For the close button positioning */
}

/* Step 4: The close button (top-right corner of the panel) */
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}
```

**JavaScript (to toggle it):**

```js
const overlay = document.getElementById('modal-overlay');
const cancelBtn = document.getElementById('cancel-btn');

// Open the modal
function openModal() {
  overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Close the modal
function closeModal() {
  overlay.classList.remove('is-active');
  document.body.style.overflow = '';       // Restore background scroll
}

// Close when clicking the backdrop (not the panel)
overlay.addEventListener('click', function(e) {
  if (e.target === overlay) closeModal(); // Only close if backdrop clicked
});

// Close with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});
```

**Problems with the old approach:**

1. No native focus trapping (keyboard users can tab outside the modal)
2. Screen readers may not announce it correctly without careful ARIA
3. The `z-index: 9999` can still be trumped by a stacking context
4. You must manually handle Escape key, background scroll, and body scroll lock

---

### The Modern Way: Native `<dialog>` Element

The `<dialog>` HTML element is now supported in all modern browsers and solves almost all the problems above out of the box. It renders in the **Top Layer** — above all other content, above stacking contexts, above `z-index: 9999`.

```html
<!-- Clean semantic HTML — dialog is hidden by default (no 'open' attribute) -->
<dialog id="confirm-dialog" class="modal-dialog">
  <button class="modal-dialog__close" aria-label="Close">×</button>
  <h2>Confirm Delete</h2>
  <p>Are you sure you want to delete this item? This cannot be undone.</p>
  <div class="modal-dialog__actions">
    <!-- method="dialog" closes the dialog with its value as returnValue -->
    <form method="dialog">
      <button value="cancel" class="btn btn--secondary">Cancel</button>
      <button value="confirm" class="btn btn--danger">Delete</button>
    </form>
  </div>
</dialog>

<button id="open-dialog-btn">Delete Item</button>
```

**CSS for `<dialog>`:**

```css
/* Style the dialog panel */
dialog.modal-dialog {
  /* dialog has default browser styles — reset what we don't need */
  border: none;
  border-radius: 12px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
}

/* Style the backdrop using the ::backdrop pseudo-element */
dialog.modal-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent dark backdrop */
  backdrop-filter: blur(4px);      /* Optional: blur the background */
}

.modal-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.modal-dialog__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
```

**JavaScript:**

```js
const dialog = document.getElementById('confirm-dialog');
const openBtn = document.getElementById('open-dialog-btn');

// showModal() opens the dialog as a modal (with backdrop, focus trap, Escape key)
openBtn.addEventListener('click', () => {
  dialog.showModal(); // Automatically traps focus inside, enables Escape to close
});

// Listen for the dialog closing to get the return value
dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'confirm') {
    console.log('User confirmed — proceed with delete!');
  } else {
    console.log('User cancelled.');
  }
});
```

### Comparison Table

| Feature | Old Overlay (`z-index: 9999`) | Native `<dialog>` |
|---------|:-----------------------------:|:-----------------:|
| Focus trap | ❌ Manual JS required | ✅ Built-in |
| Escape key to close | ❌ Manual JS required | ✅ Built-in |
| Background scroll lock | ❌ Manual JS required | ✅ Built-in |
| Above stacking contexts | ❌ Can be beaten | ✅ Top Layer — always on top |
| Backdrop styling | ❌ Manual div | ✅ `::backdrop` pseudo-element |
| Accessibility (ARIA) | ❌ Manual attributes needed | ✅ Native role="dialog" |
| Browser support (2024) | ✅ Universal | ✅ All modern browsers |

> [!TIP]
> Use `dialog.showModal()` (not `dialog.show()`) for true modal behaviour. `show()` opens the dialog without focus trapping or a backdrop — useful for non-modal popups like tooltips or popovers.

### Section Recap — Overlays

- Old way: fixed position + high z-index + manual JS for everything
- New way: `<dialog>` element + `.showModal()` — built-in focus trapping, Escape key, backdrop, Top Layer
- `::backdrop` pseudo-element styles the overlay backdrop for native `<dialog>`
- Always prefer `<dialog>` for new projects — it's more accessible and less code

---

## BEM Naming Convention

### Why does this matter?

As your CSS grows, class names become a mess. You end up with names like `.btn2`, `.header-new`, `.fixed-blue-card` — and no one (including future you) knows what they mean or where they're used. BEM solves this.

### What is BEM?

**BEM** = **Block**, **Element**, **Modifier**

It's a naming convention — a set of rules for naming CSS classes — that makes your HTML and CSS self-documenting and predictable.

### The Three Parts

```
.block
.block__element
.block--modifier
.block__element--modifier
```

- **Block**: A standalone, reusable component. The "parent" concept. Examples: `.card`, `.nav`, `.button`, `.form`
- **Element**: A part of the block that has no standalone meaning. Separated by `__` (double underscore). Examples: `.card__title`, `.nav__item`, `.form__label`
- **Modifier**: A variation or state of a block or element. Separated by `--` (double hyphen). Examples: `.button--large`, `.card--featured`, `.nav__item--active`

### Real-World Example: A Card Component

```html
<!-- The BLOCK: .card -->
<article class="card card--featured">  <!-- card--featured is a MODIFIER -->

  <!-- ELEMENTS of the card -->
  <div class="card__media">
    <img class="card__image" src="thumbnail.jpg" alt="Article thumbnail">
    <span class="card__badge card__badge--new">NEW</span>  <!-- badge with a modifier -->
  </div>

  <div class="card__body">
    <span class="card__category">Technology</span>
    <h2 class="card__title">Building Better Web Apps with CSS</h2>
    <p class="card__excerpt">Learn the fundamentals of modern CSS layout...</p>
  </div>

  <footer class="card__footer">
    <span class="card__author">Jane Smith</span>
    <span class="card__date">June 3, 2026</span>
    <a href="/article" class="card__link">Read More →</a>
  </footer>

</article>
```

```css
/* === BLOCK === */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* === BLOCK MODIFIER === */
.card--featured {
  border: 2px solid #6366f1;     /* Featured cards have a purple border */
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.2); /* Coloured glow */
}

/* === ELEMENTS === */
.card__media {
  position: relative;            /* Anchor for the badge */
  overflow: hidden;
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;             /* Fill the space without stretching */
  display: block;                /* Remove bottom gap (inline images have it) */
  transition: transform 0.3s ease;
}

/* Show a subtle zoom on hover */
.card:hover .card__image {
  transform: scale(1.04);
}

.card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #94a3b8;          /* Default badge colour */
  color: white;
}

/* === ELEMENT MODIFIER === */
.card__badge--new {
  background: #22c55e;           /* Green for "NEW" badges */
}

.card__badge--sale {
  background: #ef4444;           /* Red for "SALE" badges */
}

.card__body {
  padding: 20px;
}

.card__category {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6366f1;
  margin-bottom: 8px;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
  line-height: 1.3;
}

.card__excerpt {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.card__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.8rem;
  color: #94a3b8;
}

.card__link {
  margin-left: auto;             /* Push to the right */
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;
}
```

### BEM Rules to Remember

1. **Elements belong to blocks** — `.card__title` not `.card .title`
2. **Elements can't have their own elements** — there's no `.card__body__title`. If you need that, make `body` its own block
3. **Modifiers are additions**, not replacements — use `class="card card--featured"` not just `class="card--featured"`
4. **Never nest BEM classes in CSS** (avoid `.card .card__title`) — BEM selectors should be flat

> [!NOTE]
> BEM might feel verbose at first, but it prevents **specificity wars** (where you have to write `.parent .parent .child` to override something) and makes it immediately clear what each class refers to just by reading the HTML.

### BEM vs Non-BEM

```html
<!-- ❌ Non-BEM: confusing, hard to maintain -->
<div class="card featured">
  <div class="inner">
    <h2 class="title big">...</h2>
    <span class="badge new">NEW</span>
  </div>
</div>

<!-- ✅ BEM: self-documenting, maintainable -->
<article class="card card--featured">
  <div class="card__body">
    <h2 class="card__title card__title--large">...</h2>
    <span class="card__badge card__badge--new">NEW</span>
  </div>
</article>
```

### Section Recap — BEM

- **Block** (`.card`): The standalone component
- **Element** (`.card__title`): A part of a block (double underscore `__`)
- **Modifier** (`.card--featured`): A variation or state (double hyphen `--`)
- Always include both the base class and the modifier class: `class="card card--featured"`
- Keep CSS selectors flat — no nesting of BEM selectors
- BEM prevents specificity wars and makes CSS self-documenting

---

## Lab 1: Sticky Nav with Dropdown

**Time:** 40 minutes  
**Goal:** Build a fully functional sticky navigation bar with a dropdown submenu, using pure CSS and HTML only.

### What You'll Build

```
┌─────────────────────────────────────────────────────────────┐
│  🌐 MyBrand    Home    About ▾    Work    Contact           │  ← Sticky Nav
│                       ┌───────────────┐                     │
│                       │ Our Team      │                     │  ← Dropdown
│                       │ Our Process   │                     │
│                       │ Awards        │                     │
│                       └───────────────┘                     │
│                                                             │
│  [Page content scrolls here while nav stays fixed]         │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Instructions

#### Step 1: Create the HTML Structure

Start by building the semantic HTML. Use the BEM convention for all class names.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab 1 — Sticky Nav with Dropdown</title>
  <link rel="stylesheet" href="lab1.css">
</head>
<body>

  <!-- The navigation bar -->
  <header class="site-header">
    <nav class="nav" aria-label="Main navigation">

      <!-- Logo / Brand -->
      <a href="/" class="nav__brand">🌐 MyBrand</a>

      <!-- Navigation links list -->
      <ul class="nav__list" role="list">

        <li class="nav__item">
          <a href="#home" class="nav__link">Home</a>
        </li>

        <!-- Item with dropdown: uses CSS :hover to reveal submenu -->
        <li class="nav__item nav__item--has-dropdown">
          <a href="#about" class="nav__link nav__link--dropdown-trigger"
             aria-haspopup="true" aria-expanded="false">
            About ▾
          </a>

          <!-- The dropdown submenu -->
          <ul class="nav__dropdown" role="list" aria-label="About submenu">
            <li class="nav__dropdown-item">
              <a href="#team" class="nav__dropdown-link">Our Team</a>
            </li>
            <li class="nav__dropdown-item">
              <a href="#process" class="nav__dropdown-link">Our Process</a>
            </li>
            <li class="nav__dropdown-item">
              <a href="#awards" class="nav__dropdown-link">Awards</a>
            </li>
          </ul>
        </li>

        <li class="nav__item">
          <a href="#work" class="nav__link">Work</a>
        </li>

        <li class="nav__item">
          <a href="#contact" class="nav__link nav__link--cta">Contact</a>
        </li>

      </ul>
    </nav>
  </header>

  <!-- Page content — needs padding-top to not hide under fixed nav -->
  <main class="main-content">
    <section id="home" class="page-section">
      <h1>Welcome to MyBrand</h1>
      <p>Scroll down to see the sticky navigation in action...</p>
    </section>
    <!-- Add more sections to make page scrollable -->
    <section id="about" class="page-section page-section--alt">
      <h2>About Us</h2>
      <p>We are a passionate team building beautiful digital experiences.</p>
    </section>
    <section id="work" class="page-section">
      <h2>Our Work</h2>
      <p>Explore our portfolio of projects...</p>
    </section>
    <section id="contact" class="page-section page-section--alt">
      <h2>Contact</h2>
      <p>Get in touch with us today.</p>
    </section>
  </main>

</body>
</html>
```

#### Step 2: Write the CSS — Base Styles

```css
/* lab1.css */

/* =============================================
   RESET & BASE
   ============================================= */

*, *::before, *::after {
  box-sizing: border-box; /* Padding/border included in element dimensions */
  margin: 0;
  padding: 0;
}

:root {
  /* Design tokens — change these to retheme everything */
  --nav-height: 64px;
  --nav-bg: #0f172a;
  --nav-text: #e2e8f0;
  --nav-hover: #6366f1;
  --nav-cta-bg: #6366f1;
  --nav-dropdown-bg: #1e293b;
  --nav-dropdown-border: rgba(255, 255, 255, 0.08);
  --transition-speed: 0.2s;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  color: #1e293b;
  /* Offset content below the fixed navbar */
  padding-top: var(--nav-height);
}
```

#### Step 3: Write the CSS — Navigation Styles

```css
/* =============================================
   SITE HEADER — sticky wrapper
   ============================================= */

.site-header {
  position: fixed;             /* Stays at top during scrolling */
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--nav-bg);
  box-shadow: 0 1px 20px rgba(0,0,0,0.3);
  z-index: 1000;               /* Above all page content */
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

/* =============================================
   NAV — flex container for brand + links
   ============================================= */

.nav {
  display: flex;               /* Brand on left, links on right */
  align-items: center;         /* Vertically centre everything */
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;           /* Max width for large screens */
  margin: 0 auto;              /* Centre the nav content */
  padding: 0 24px;
}

.nav__brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: -0.02em;
}

/* =============================================
   NAV LIST — horizontal list of nav items
   ============================================= */

.nav__list {
  display: flex;               /* Items sit side by side */
  align-items: center;
  gap: 4px;
  list-style: none;            /* Remove bullet points */
}

/* =============================================
   NAV ITEM — each list item
   ============================================= */

.nav__item {
  position: relative;          /* ← CRITICAL: anchors the dropdown menu */
}

/* =============================================
   NAV LINK — the clickable anchor
   ============================================= */

.nav__link {
  display: block;              /* Full clickable area */
  padding: 10px 14px;
  color: var(--nav-text);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  transition: color var(--transition-speed), background var(--transition-speed);
}

.nav__link:hover {
  color: white;
  background: rgba(255,255,255,0.06);
}

/* The CTA (call-to-action) link — stands out from other links */
.nav__link--cta {
  background: var(--nav-cta-bg);
  color: white;
  padding: 10px 18px;
}

.nav__link--cta:hover {
  background: #4f46e5;         /* Slightly darker purple on hover */
}
```

#### Step 4: Write the CSS — Dropdown

```css
/* =============================================
   DROPDOWN MENU
   ============================================= */

.nav__dropdown {
  position: absolute;          /* Removed from flow, anchored to .nav__item */
  top: calc(100% + 8px);       /* 8px below the parent nav item */
  left: 0;                     /* Aligns with left edge of parent */
  min-width: 200px;
  background: var(--nav-dropdown-bg);
  border: 1px solid var(--nav-dropdown-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  list-style: none;
  padding: 6px;
  z-index: 1100;               /* Higher than the nav (1000) to appear above it */

  /* Hidden by default */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px); /* Slide up 8px when hidden */
  transition:
    opacity var(--transition-speed) ease,
    visibility var(--transition-speed) ease,
    transform var(--transition-speed) ease;
}

/* Show the dropdown on hover of the parent nav item */
.nav__item--has-dropdown:hover .nav__dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);    /* Slide down to natural position */
}

.nav__dropdown-link {
  display: block;
  padding: 10px 14px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 6px;
  transition: background var(--transition-speed), color var(--transition-speed);
}

.nav__dropdown-link:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}
```

#### Step 5: Write the CSS — Page Sections

```css
/* =============================================
   PAGE SECTIONS — to demonstrate sticky nav
   ============================================= */

.page-section {
  min-height: 100vh;           /* Each section is full viewport height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  gap: 16px;
}

.page-section h1, .page-section h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #1e293b;
}

.page-section p {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 60ch;
  line-height: 1.7;
}

.page-section--alt {
  background: #f8fafc;         /* Alternating section backgrounds */
}
```

#### Lab 1 Challenge Extensions

Once the base is working, try these:

- [ ] Add a smooth **scroll behaviour** to the page: `scroll-behavior: smooth` on `:root`
- [ ] Make the nav background change on scroll using JavaScript (`window.scrollY > 50`)
- [ ] Add a **mobile hamburger menu** that toggles the nav list open/closed
- [ ] Add a **keyboard-accessible dropdown** using `:focus-within` instead of `:hover`

> [!TIP]
> Replace `:hover` with `:hover, :focus-within` on `.nav__item--has-dropdown` to make the dropdown accessible to keyboard users (they can Tab into it to reveal it).

---

## Lab 2: CSS-Only Modal using `:target`

**Time:** 20 minutes  
**Goal:** Create a functional modal dialog using only HTML and CSS — no JavaScript required — by exploiting the CSS `:target` pseudo-class.

### How `:target` Works

When you navigate to a URL with a `#hash`, the browser highlights the element with that `id`. CSS's `:target` pseudo-class selects that element. We can use this to show/hide a modal.

**Example:** `https://mysite.com/page#contact-modal`
- The element `<div id="contact-modal">` becomes the `:target`
- CSS `.modal:target { display: block; }` makes it visible

### Step-by-Step Instructions

#### Step 1: HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab 2 — CSS-Only Modal</title>
  <link rel="stylesheet" href="lab2.css">
</head>
<body>

  <!-- The page content / trigger button -->
  <main class="page">
    <h1>CSS-Only Modal Demo</h1>
    <p>Click the button below to open a modal — zero JavaScript needed!</p>

    <!-- The trigger: links to #contact-modal, which sets it as the :target -->
    <a href="#contact-modal" class="btn btn--primary">Open Modal</a>
  </main>

  <!-- THE MODAL — normally hidden, becomes visible when it's the :target -->
  <div class="modal" id="contact-modal" role="dialog"
       aria-modal="true" aria-labelledby="modal-heading">

    <!-- The backdrop is also a link — clicking it changes the URL to #, un-targeting the modal -->
    <a href="#" class="modal__backdrop" aria-label="Close modal"></a>

    <!-- The modal panel -->
    <div class="modal__panel">
      <!-- Close button: changes URL back to # to remove :target -->
      <a href="#" class="modal__close" aria-label="Close">&times;</a>

      <h2 id="modal-heading" class="modal__title">Get in Touch</h2>

      <form class="modal__form" action="#" method="post">
        <div class="form__group">
          <label for="name" class="form__label">Your Name</label>
          <input type="text" id="name" name="name" class="form__input"
                 placeholder="Jane Smith" required>
        </div>

        <div class="form__group">
          <label for="email" class="form__label">Email Address</label>
          <input type="email" id="email" name="email" class="form__input"
                 placeholder="jane@example.com" required>
        </div>

        <div class="form__group">
          <label for="message" class="form__label">Message</label>
          <textarea id="message" name="message" class="form__textarea"
                    rows="4" placeholder="Tell us about your project..." required></textarea>
        </div>

        <button type="submit" class="btn btn--primary btn--full">Send Message</button>
      </form>
    </div>
  </div>

</body>
</html>
```

#### Step 2: CSS

```css
/* lab2.css */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --radius: 12px;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #f8fafc;
  color: #1e293b;
}

/* =============================================
   PAGE
   ============================================= */

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
  padding: 24px;
}

.page h1 {
  font-size: 2.5rem;
  font-weight: 800;
}

/* =============================================
   BUTTONS
   ============================================= */

.btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.2s, transform 0.1s;
}

.btn--primary {
  background: var(--primary);
  color: white;
}

.btn--primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px); /* Subtle lift on hover */
}

.btn--full {
  display: block;
  width: 100%;
  text-align: center;
}

/* =============================================
   MODAL — hidden by default, shown when :target
   ============================================= */

/* The modal wrapper is hidden by default */
.modal {
  position: fixed;             /* Cover the full viewport */
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;

  /* Hidden until :target is applied */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

/* Show the modal when it IS the :target (i.e., URL has #contact-modal) */
.modal:target {
  opacity: 1;
  visibility: visible;
}

/* The backdrop — clicking it will change URL to #, removing :target */
.modal__backdrop {
  position: absolute;          /* Fills the .modal container */
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

/* The modal panel — sits above the backdrop */
.modal__panel {
  position: relative;          /* Ensures it appears above .modal__backdrop */
  background: white;
  border-radius: var(--radius);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);

  /* Entrance animation when :target is applied */
  transform: translateY(20px);
  transition: transform 0.25s ease;
}

.modal:target .modal__panel {
  transform: translateY(0);    /* Slides up into position when shown */
}

/* Close button — top right of the panel */
.modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  transition: background 0.15s, color 0.15s;
}

.modal__close:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1e293b;
}

/* =============================================
   FORM STYLES
   ============================================= */

.modal__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form__group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form__input,
.form__textarea {
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  background: #f8fafc;
}

.form__input:focus,
.form__textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); /* Focus ring */
  background: white;
}

.form__textarea {
  resize: vertical;            /* Only allow vertical resizing */
  min-height: 100px;
}
```

#### Lab 2 Limitations & Discussion

The `:target` approach has some trade-offs. Discuss these with your class:

| Consideration | `:target` Modal | `<dialog>` Modal |
|---------------|:--------------:|:---------------:|
| Needs JavaScript | ❌ No | ✅ Yes (minimal) |
| Focus trapping | ❌ No | ✅ Yes |
| Escape key to close | ❌ No | ✅ Yes |
| Bookmark-able state | ✅ Yes | ❌ No |
| Accessibility | ⚠️ Partial | ✅ Full |
| Browser history entry | ⚠️ Yes (changes URL) | ❌ No |

> [!NOTE]
> The `:target` trick is a clever demo of CSS's power, but for production modals, always prefer the native `<dialog>` element with a small amount of JavaScript for the best accessibility and user experience.

---

## Assignment: Portfolio Project Part 4

**Due:** Next class session  
**Goal:** Apply all the positioning and layout techniques from this lecture to enhance your portfolio site.

---

### Requirement 1: Fixed Navigation Bar

Add a navigation bar that stays fixed at the top of the viewport as the user scrolls.

**Requirements:**
- Uses `position: fixed` with `top: 0; left: 0; right: 0`
- Has a `z-index` high enough to appear above all page sections
- Adds `padding-top` to the `<body>` (equal to the nav height) to prevent content hiding
- Includes your name/brand and at least 3 navigation links

**Hints:**
- Start with `height: 64px` for the nav. Match this in `body { padding-top: 64px }`
- Use CSS variables: `--nav-height: 64px` so you only change it in one place
- Add a box-shadow to make the nav appear elevated above the page content
- Use `backdrop-filter: blur(12px)` + a semi-transparent background for a modern frosted-glass effect

---

### Requirement 2: Hero Section with Absolute Positioning

Create a full-viewport hero section with at least one element positioned absolutely within it.

**Requirements:**
- Hero section is at least `100vh` tall
- Contains a decorative element (badge, geometric shape, floating icon) positioned absolutely
- Parent container has `position: relative`
- The absolutely positioned element uses at least `top` and `right` (or similar) offset properties

**Hints:**
- A "currently available" badge in the top-right of the hero makes a great portfolio touch
- Use `border-radius: 999px` on a small element with a pulsing animation for a "live" indicator
- Try `bottom: -24px; left: 50%; transform: translateX(-50%)` for a centred element that extends below its parent

---

### Requirement 3: Project Cards with Hover Overlay

Create a grid of project cards. Each card should have an overlay that appears on hover.

**Requirements:**
- Cards arranged in a grid (at least 2 columns on desktop)
- Each card has a project image with an overlay (`position: absolute`, `inset: 0`)
- Overlay contains a title and "View Project" button
- Overlay is hidden by default (`opacity: 0`) and visible on `card:hover` (`opacity: 1`)
- Parent card has `position: relative` and `overflow: hidden`

**Hints:**
- Use `transition: opacity 0.3s ease` for a smooth fade-in effect
- Overlay background: `rgba(15, 23, 42, 0.8)` for a dark overlay with the ability to read white text
- Add `transform: translateY(8px)` to the overlay content by default, and `translateY(0)` on hover for a slide-up effect

---

### Requirement 4: Skills Section with Sticky Heading

Create a skills or experience section where the section heading sticks to the top as the user scrolls through its content.

**Requirements:**
- Section heading has `position: sticky`
- `top` value accounts for the fixed navigation bar height (e.g., `top: 64px`)
- Heading has a `z-index` to appear above the section content
- Heading has a background so it doesn't blend with content underneath

**Hints:**
- Add `padding: 12px 0` to the sticky heading and match its `background` to the section background
- Add a subtle bottom border to the sticky heading to visually separate it from scrolling content
- Test by adding enough skills items to make the section taller than the viewport

---

### Requirement 5: Contact Modal

Add a "Get in Touch" button that opens a modal with a contact form.

**Requirements:**
- Uses the native `<dialog>` element
- Opens with `dialog.showModal()` when the button is clicked
- Has a working close button
- Has at least 3 form fields (name, email, message)
- `::backdrop` is styled with a custom colour/blur

**Hints:**
- `<form method="dialog">` inside the dialog automatically closes it when submitted
- Listen to `dialog.addEventListener('close', ...)` to know when and how it was closed
- Use `dialog.returnValue` to check if the user submitted or cancelled
- Add `max-width: 90vw; max-height: 90vh; overflow-y: auto` to prevent the dialog overflowing on small screens

---

### Requirement 6: Apply BEM Throughout

Refactor all your CSS class names to follow the BEM naming convention.

**Requirements:**
- Every component has a clearly defined **Block** (`.card`, `.hero`, `.nav`, `.modal`)
- Elements use double-underscore notation: `.card__title`, `.hero__heading`, `.nav__link`
- Variations use double-hyphen modifiers: `.card--featured`, `.btn--primary`, `.nav__link--active`
- No nested BEM selectors in CSS (avoid `.card .card__title {}`)

**Hints:**
- Start by listing your components: nav, hero, card, skill-item, modal, footer
- For each component, list its "parts" (elements) and "variations" (modifiers)
- Rename one component at a time — don't try to refactor everything at once
- Use browser DevTools to test that the renamed classes still apply the correct styles

---

### Submission Checklist

Before submitting, verify each item:

- [ ] Fixed nav stays visible when scrolling; body has matching `padding-top`
- [ ] Hero section has at least one absolutely positioned child in a relative parent
- [ ] Project cards have hover overlays using `position: absolute; inset: 0`
- [ ] Skills section heading is sticky and has correct `top` offset
- [ ] Contact modal uses `<dialog>` and `.showModal()`; `::backdrop` is styled
- [ ] All CSS classes follow BEM convention
- [ ] No `z-index` magic numbers — use CSS variables for all z-index values
- [ ] Page is responsive (check at 375px, 768px, and 1280px viewport widths)

---

## Resources

### Official Documentation

- [MDN — CSS display property](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [MDN — CSS position property](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [MDN — z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- [MDN — \<dialog\> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN — CSS overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [MDN — float](https://developer.mozilla.org/en-US/docs/Web/CSS/float)

### Interactive Tools & Demos

- [CSS Stacking Context Inspector (DevTools)](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/inspect_and_select_colors/index.html) — Firefox's layer inspector
- [Stacking Context Explainer (Philip Walton)](https://philipwalton.com/articles/what-no-one-told-you-about-z-index/) — the definitive stacking context article
- [CSS Position Visualizer (Codepen)](https://codepen.io/) — search "CSS position demo"
- [BEM Official Methodology](https://getbem.com/)
- [BEM Cheat Sheet](https://9elements.com/bem-cheat-sheet/)

### Videos

- Kevin Powell — "Learn CSS position in 9 minutes" (YouTube)
- Fireship — "CSS Position Explained in 5 Minutes" (YouTube)
- Web Dev Simplified — "Learn CSS Display in 4 minutes" (YouTube)

---

## Key Takeaways

1. **`display` is the foundation** of all CSS layout — block, inline, inline-block are the building blocks; flex and grid are the power tools
2. **`display: none` vs `visibility: hidden`**: none removes the element from flow; hidden hides but preserves the space
3. **Positioning is a 5-value system**: static (default) → relative (nudge from natural position) → absolute (anchor to positioned parent) → fixed (locked to viewport) → sticky (hybrid)
4. **The positioned ancestor pattern** is everywhere: parent gets `position: relative`, child gets `position: absolute` — always check your parent!
5. **`z-index` only works on positioned elements** and is contained within stacking contexts — `opacity`, `transform`, and `filter` all create new stacking contexts
6. **Float collapse** is the classic float bug — fix with `display: flow-root` on the parent
7. **`overflow: auto`** is almost always what you want when you need scroll behaviour
8. **The `<dialog>` element** is the modern, accessible way to build modals — use `showModal()` for true modal behaviour with built-in focus trapping and Escape key support
9. **BEM** makes CSS maintainable at scale — block, element (double underscore), modifier (double hyphen)
10. **Use CSS variables for z-index values** — a scale prevents z-index wars and makes values meaningful

---

## Common Mistakes & How to Avoid Them

| # | Mistake | Why it happens | How to avoid it |
|---|---------|---------------|----------------|
| 1 | Setting `width`/`height` on an `inline` element and wondering why it has no effect | Forgetting that inline elements size to content | Switch to `display: inline-block` or `block` when you need dimensional control |
| 2 | Absolutely positioned element flying to wrong location | Missing `position: relative` on the intended parent anchor | Always add `position: relative` to the intended parent before using `absolute` on the child |
| 3 | `z-index: 9999` not working — element still appears below another | Parent element has `opacity < 1`, `transform`, or `filter` creating a stacking context | Inspect the parent hierarchy; remove the stacking-context-creating property from the parent, or restructure the DOM |
| 4 | Content hidden behind a fixed navbar | Fixed elements are removed from flow; content slides up under them | Add `padding-top` to `<body>` equal to the navbar height; use a CSS variable so it stays in sync |
| 5 | `position: sticky` not working | A parent or ancestor has `overflow: hidden`, `auto`, or `scroll` | Remove or change `overflow` on all ancestor elements between the sticky element and the scroll container |
| 6 | Float-collapsed container (background/border not visible) | Parent only contains floated children, so its computed height is 0 | Add `display: flow-root` to the parent container |
| 7 | Horizontal scrollbar appearing unexpectedly | A child element is wider than the viewport or has a negative margin that extends beyond the viewport edge | Add `overflow-x: hidden` on `<body>`, or debug with `* { outline: 1px solid red }` to find the offending element |
| 8 | Forgetting both base class and modifier class in BEM | Not understanding that modifiers are additions, not replacements | Always include `class="card card--featured"` — never just `class="card--featured"` |
| 9 | Using `display: none` to visually hide but still needing screen readers to announce | `display: none` removes element from accessibility tree entirely | Use the `.visually-hidden` CSS pattern to hide visually while remaining accessible |
| 10 | Dropdown menu closing when moving mouse diagonally to it | The mouse leaves the parent `nav__item` boundary before reaching the dropdown | Add a `padding-top` buffer to the dropdown equal to the gap between nav and dropdown, keeping the mouse within the hover area |
| 11 | Using arbitrary z-index numbers (`z-index: 999999`) | No system for z-index values | Define a z-index scale in CSS custom properties and always use those variables |
| 12 | Building a `div`-based modal instead of using `<dialog>` | Not knowing `<dialog>` exists or worrying about browser support | `<dialog>` has 97%+ browser support as of 2024; always prefer it for new projects |

---

*End of Lecture 04 — CSS Layout: Positioning, Floats & Display*