# Module 06 — Modern Layout: CSS Grid

---

**Course:** Fullstack Web Development  
**Instructor:** [Instructor Name]  
**Duration:** ~3 hours (lecture + labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [What is CSS Grid?](#1-what-is-css-grid)
4. [Grid vs Flexbox — When to Use Which](#2-grid-vs-flexbox--when-to-use-which)
5. [Creating a Grid Container](#3-creating-a-grid-container)
6. [Defining Columns with grid-template-columns](#4-defining-columns-with-grid-template-columns)
7. [Defining Rows with grid-template-rows](#5-defining-rows-with-grid-template-rows)
8. [The fr Unit — Fractional Units](#6-the-fr-unit--fractional-units)
9. [The repeat() Function](#7-the-repeat-function)
10. [The minmax() Function](#8-the-minmax-function)
11. [The gap Property](#9-the-gap-property)
12. [Grid Lines and Default Item Placement](#10-grid-lines-and-default-item-placement)
13. [Explicit Placement — grid-column and grid-row](#11-explicit-placement--grid-column-and-grid-row)
14. [The span Keyword](#12-the-span-keyword)
15. [Named Template Areas — grid-template-areas](#13-named-template-areas--grid-template-areas)
16. [Alignment in Grid](#14-alignment-in-grid)
17. [auto-fill vs auto-fit](#15-auto-fill-vs-auto-fit)
18. [grid-auto-flow: dense](#16-grid-auto-flow-dense)
19. [Modern CSS Subgrid](#17-modern-css-subgrid)
20. [Lab 1: Holy Grail Layout](#lab-1-holy-grail-layout-with-css-grid)
21. [Lab 2: Auto-fit Image Gallery](#lab-2-auto-fit-image-gallery)
22. [Assignment: Portfolio Project Part 6](#assignment-portfolio-project-part-6)
23. [Resources](#resources)
24. [Key Takeaways](#key-takeaways)
25. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this module, you will be able to:

- [ ] Explain **what CSS Grid is** and how it differs from Flexbox
- [ ] Create a **grid container** and define tracks (rows and columns)
- [ ] Use **`fr` units**, `repeat()`, and `minmax()` to build flexible, responsive grids
- [ ] Control **item placement** using explicit line numbers and the `span` keyword
- [ ] Build full-page layouts using **named grid areas** (`grid-template-areas`)
- [ ] Apply **alignment properties** to control how items sit inside grid cells
- [ ] Understand the difference between **`auto-fill` and `auto-fit`** and when to choose each
- [ ] Use **`grid-auto-flow: dense`** to fill visual gaps in irregular layouts
- [ ] Explain what **CSS Subgrid** solves and write a basic subgrid example

---

## Agenda

| # | Topic | Time |
|---|-------|------|
| 1 | What is CSS Grid and when to use it | 15 min |
| 2 | Grid containers, columns, and rows | 20 min |
| 3 | The `fr` unit, `repeat()`, and `minmax()` | 20 min |
| 4 | Gap, grid lines, and default placement | 15 min |
| 5 | Explicit placement with line numbers | 20 min |
| 6 | Named template areas | 20 min |
| 7 | Alignment properties | 15 min |
| 8 | `auto-fill` vs `auto-fit` | 15 min |
| 9 | `grid-auto-flow: dense` and Subgrid | 10 min |
| — | Lab 1: Holy Grail Layout | 30 min |
| — | Lab 2: Auto-fit Image Gallery | 30 min |

---

## 1. What is CSS Grid?

### Plain-English Explanation

Imagine you are decorating a room. Before placing any furniture, you draw a **floor plan** — a grid of squares — on graph paper. Each square on the paper represents an area of the room. You then decide which furniture goes in which square (or spans across multiple squares).

**CSS Grid works exactly like that.** You define an invisible grid of rows and columns on a parent element (the "container"), and then you decide where each child element (the "item") sits on that grid.

CSS Grid gives you **two-dimensional control** — meaning you can position and size things both **horizontally (columns)** and **vertically (rows)** at the same time, from a single parent element.

### Why Was Grid Invented?

Before CSS Grid (introduced around 2017), developers built complex layouts using:

- `float` + `clearfix` hacks (messy, fragile)
- `display: table` (semantic nonsense)
- Positioning tricks (`position: absolute`)
- Flexbox (great, but only 1D)

CSS Grid was purpose-built to solve **two-dimensional layout problems** — things like full-page layouts, magazine-style article layouts, and card grids.

> [!NOTE]
> CSS Grid is now supported by **all modern browsers**. There is no reason to avoid it. Check [caniuse.com/css-grid](https://caniuse.com/css-grid) for specific version support.

### Why Does This Matter?

Before Grid, building a classic "Holy Grail" layout (header, sidebar, main content, another sidebar, footer) required deeply nested HTML, float hacks, and dozens of lines of tricky CSS. With Grid, you can do it in **10 lines of CSS** and keep your HTML clean and semantic.

---

## 2. Grid vs Flexbox — When to Use Which

### The Core Difference: 1D vs 2D

This is the most important distinction you need to understand:

| Layout Tool | Dimension | Best For |
|-------------|-----------|----------|
| **Flexbox** | 1D — either a row OR a column | Navigation bars, button groups, centering a single item, card content alignment |
| **CSS Grid** | 2D — rows AND columns simultaneously | Full-page layouts, card grids, magazine layouts, any time you need rows and columns to align together |

### The Bookshelf vs The Library Analogy

Think of it this way:

- **Flexbox** is like arranging books on **a single shelf**. You control how the books are spaced and aligned along that one shelf. You can go left-to-right or top-to-bottom, but it's still one line.
- **CSS Grid** is like organizing an **entire library**. You control both which shelf (row) and which section (column) every book goes into. You see the full two-dimensional picture.

### The Decision Flowchart

```
Do you need to control layout in BOTH rows AND columns?
│
├── YES → Use CSS GRID
│         (full-page layouts, card grids, complex UI sections)
│
└── NO → Do you need items to flow in one direction (row or column)?
          │
          ├── YES → Use FLEXBOX
          │         (nav bars, button rows, vertically centering one item)
          │
          └── UNSURE → Start with Grid. You can always nest Flexbox inside Grid cells.
```

### Can You Use Both?

**Absolutely yes.** In real projects, you use Grid and Flexbox together all the time:
- **Grid** controls the overall page structure (header/sidebar/main/footer)
- **Flexbox** controls the content *inside* each grid area (e.g., the nav links inside the header)

```
┌─────────────────────────────────────────────────┐
│   HEADER (Grid area)                            │
│   ┌────────┬────────┬────────┬──────────────┐   │
│   │  Logo  │  Home  │  About │    Contact   │   │
│   └────────┴────────┴────────┴──────────────┘   │
│         ↑ Flexbox used INSIDE the header         │
├───────────┬─────────────────────────────────────┤
│  SIDEBAR  │  MAIN CONTENT                       │
│  (Grid)   │  (Grid)                             │
├───────────┴─────────────────────────────────────┤
│   FOOTER (Grid area)                            │
└─────────────────────────────────────────────────┘
↑ The overall structure above is controlled by CSS Grid
```

### Section Recap

- Flexbox = **1D** (one row OR one column)
- Grid = **2D** (rows AND columns at the same time)
- When in doubt, use Grid for the big picture, Flexbox for detail inside cells
- They work together — you'll use both in the same project

---

## 3. Creating a Grid Container

### Plain-English Explanation

A **grid container** is the parent element that you turn into a grid. Once you do this, all its **direct children** automatically become **grid items** and participate in the grid layout.

Think of it like this: declaring `display: grid` on a parent element is like laying down your graph-paper floor plan. Nothing moves yet — you've just established the grid system. The children will arrange themselves according to the rules you define next.

### Step-by-Step: How to Create a Grid Container

**Step 1 — Write your HTML with a parent and children:**

```html
<!-- The parent element will become our grid container -->
<div class="grid-container">
  <!-- Each of these divs is a grid item -->
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
  <div class="item">Item 5</div>
  <div class="item">Item 6</div>
</div>
```

**Step 2 — Apply `display: grid` to the parent:**

```css
.grid-container {
  /* This single line turns .grid-container into a grid */
  /* All direct children immediately become grid items */
  display: grid;

  /* Without any other rules, items stack in a single column
     (just like normal block elements) */
}
```

**Step 3 — Add some visual styling so you can see what's happening:**

```css
.grid-container {
  display: grid;
  background-color: #f0f0f0; /* Light grey background for the container */
  padding: 10px;             /* Some breathing room */
}

.item {
  background-color: #4a90d9; /* Blue boxes for visibility */
  color: white;
  padding: 20px;
  text-align: center;
  font-family: sans-serif;
  border: 2px solid #2c5f8a; /* Darker blue border */
}
```

### What Does It Look Like Before We Define Columns?

Right now, with just `display: grid` and no columns defined, items stack in a **single column**, each taking up the full width of the container. This is the **default** grid behavior.

```
┌──────────────────────────────┐
│         Item 1               │  ← full width
├──────────────────────────────┤
│         Item 2               │
├──────────────────────────────┤
│         Item 3               │
├──────────────────────────────┤
│         Item 4               │
└──────────────────────────────┘
```

Not very exciting — but the grid is ready. Now let's define some columns.

> [!IMPORTANT]
> Only **direct children** become grid items. Grandchildren (children of children) do NOT participate in the parent grid. If you need grandchildren to align with the grid, look into **CSS Subgrid** (covered later in this module).

### Section Recap

- Add `display: grid` to the **parent** element to create a grid container
- The parent's direct children automatically become **grid items**
- Without defining columns/rows, items just stack in a single column
- `display: inline-grid` exists too — it makes the container inline-level (rare, but available)

---

## 4. Defining Columns with grid-template-columns

### Plain-English Explanation

Now that we have a grid container, we need to tell it **how many columns** to have and **how wide** each column should be. We do this with the `grid-template-columns` property.

You give it a **space-separated list of sizes**, and each size you provide creates one column. So if you write three sizes, you get three columns.

### Why Does This Matter?

This is where the real power of Grid starts. You define the structure of your entire layout in one clean line, and the browser automatically places your items into those columns.

### Units You Can Use

You can mix and match different units in the same column definition:

| Unit | Meaning | Example |
|------|---------|---------|
| `px` | Fixed pixel width — never changes | `200px` |
| `%` | Percentage of the container width | `33%` |
| `fr` | Fractional unit — takes remaining space | `1fr` (explained in detail next section) |
| `auto` | Shrinks/grows to fit content | `auto` |
| `em`, `rem` | Relative to font size | `10rem` |
| `min-content` | As narrow as the widest word | `min-content` |
| `max-content` | As wide as the longest line | `max-content` |

### Step-by-Step Examples

#### Example A — Three equal columns using pixels

```css
.grid-container {
  display: grid;

  /* Three columns, each exactly 200px wide */
  /* Space-separated values — each value = one column */
  grid-template-columns: 200px 200px 200px;
}
```

Visual result:

```
┌──────────┬──────────┬──────────┐
│  200px   │  200px   │  200px   │
│  Item 1  │  Item 2  │  Item 3  │
├──────────┼──────────┼──────────┤
│  Item 4  │  Item 5  │  Item 6  │
└──────────┴──────────┴──────────┘
```

#### Example B — Three columns with different units mixed

```css
.grid-container {
  display: grid;

  /* Column 1: fixed 150px sidebar */
  /* Column 2: flexible, takes remaining space */
  /* Column 3: fixed 100px for a small panel */
  grid-template-columns: 150px 1fr 100px;
}
```

Visual result (in a 500px container):

```
┌──────────┬──────────────────┬──────────┐
│  150px   │   250px (1fr)    │  100px   │
│ Sidebar  │   Main Content   │  Panel   │
└──────────┴──────────────────┴──────────┘
```

#### Example C — Using `auto` to fit content

```css
.grid-container {
  display: grid;

  /* Column 1: fixed 200px */
  /* Column 2: auto — shrinks to fit its content */
  /* Column 3: fills remaining space */
  grid-template-columns: 200px auto 1fr;
}
```

> [!TIP]
> `auto` is tricky to predict because it depends on content size. In most cases, `fr` gives more predictable results. Use `auto` only when you specifically want a column to shrink-wrap its content.

### Section Recap

- `grid-template-columns` defines **how many columns** and **how wide** each one is
- Each space-separated value creates one column
- You can mix `px`, `%`, `fr`, `auto`, etc. freely
- Items fill in row by row (left to right, then wrap to next row) by default

---

## 5. Defining Rows with grid-template-rows

### Plain-English Explanation

Just like `grid-template-columns` defines your columns, `grid-template-rows` defines your rows — their **count and height**.

However, rows behave a little differently from columns:
- You often **don't need to define rows explicitly**, because the grid will create them automatically as items are placed
- When you do define rows, you're setting **explicit row heights**
- Any rows beyond your explicit definition are called **implicit rows** (created automatically)

### When Should You Define Rows?

Define rows explicitly when:
1. You need rows to be a **specific height** (like a fixed-height header)
2. You are building a **full-viewport layout** (like a dashboard that fills the whole screen)
3. You need **precise control** over row proportions

### Step-by-Step Examples

#### Example A — Defining row heights explicitly

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */

  /* Row 1: 100px tall */
  /* Row 2: flexible, takes remaining space */
  /* Row 3: 80px tall */
  grid-template-rows: 100px 1fr 80px;
}
```

#### Example B — Full-page layout with rows

```css
.page-layout {
  display: grid;
  height: 100vh;         /* Fill the entire viewport height */

  /* 3 columns: sidebar | main | aside */
  grid-template-columns: 250px 1fr 200px;

  /* 3 rows: header | content | footer */
  grid-template-rows: 80px 1fr 60px;
}
```

```
┌────────────────────────────────────────────┐  ↑
│              HEADER (80px)                 │  80px
├──────────┬───────────────────┬─────────────┤  ↑
│          │                   │             │  1fr
│ Sidebar  │    Main Content   │    Aside    │  (remaining)
│  (250px) │      (1fr)        │   (200px)   │
│          │                   │             │  ↓
├──────────┴───────────────────┴─────────────┤  ↑
│              FOOTER (60px)                 │  60px
└────────────────────────────────────────────┘  ↓
```

### Implicit Rows — The Grid Creates Them Automatically

If you define 2 rows but place 9 items (3 columns × 3 rows), the grid **automatically creates a third row**. These are **implicit rows**.

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 columns */
  grid-template-rows: 100px 100px;    /* Only 2 rows defined */

  /* Any extra rows created automatically are controlled by: */
  grid-auto-rows: 80px; /* Implicit rows will be 80px tall */
}
```

> [!NOTE]
> `grid-auto-rows` controls the height of **implicitly created rows**. This is very useful in card grids where you don't know how many rows will be created.

### Section Recap

- `grid-template-rows` sets **explicit row heights**, just like columns set column widths
- Rows are often left to the browser to create **implicitly** (automatically)
- Use `grid-auto-rows` to control the size of auto-created rows
- Use `height: 100vh` on the container when building full-viewport layouts

---

## 6. The fr Unit — Fractional Units

### Plain-English Explanation

The `fr` unit is **unique to CSS Grid** — you won't find it anywhere else in CSS.

`fr` stands for **fraction** — specifically, a fraction of the **available space** in the grid container.

### The Pizza Slice Analogy

Imagine you have one pizza to split among friends. The pizza is the **total available space** in your grid container.

- `1fr` = "give me **1 slice**"
- `2fr` = "give me **2 slices**"
- `3fr` = "give me **3 slices**"

The total number of "slices" is the **sum of all fr values**. Each column or row gets a proportional share.

**Example:** `grid-template-columns: 1fr 2fr 1fr;`

- Total slices: 1 + 2 + 1 = **4 slices**
- Column 1: 1/4 of the space
- Column 2: 2/4 (half) of the space
- Column 3: 1/4 of the space

```
┌──────────┬──────────────────┬──────────┐
│   1fr    │       2fr        │   1fr    │
│  (25%)   │      (50%)       │  (25%)   │
└──────────┴──────────────────┴──────────┘
```

### How fr Handles Fixed Columns

The `fr` unit is smart: it distributes the **remaining space** after fixed-size columns are accounted for.

```css
.grid-container {
  display: grid;
  width: 800px;

  /* Column 1: fixed 200px */
  /* Remaining space: 800 - 200 = 600px */
  /* Column 2: 1fr = all 600px remaining */
  /* Column 3: 0fr = 0px (it would just disappear) */
  grid-template-columns: 200px 1fr;
}
```

Another example — combining fixed and flexible:

```css
.grid-container {
  display: grid;
  width: 1000px;

  /* Fixed 250px sidebar, then split the remaining 750px equally */
  grid-template-columns: 250px 1fr 1fr;
  /*                     250px 375px 375px  (in a 1000px container) */
}
```

### Why Does This Matter?

Before `fr`, making flexible columns meant using percentages. But percentages don't account for `gap` (spacing) between columns — you'd always have to do messy math. The `fr` unit automatically handles gap spacing for you.

```css
/* OLD WAY — messy math to account for gaps */
.old-grid {
  display: flex;
  gap: 20px;
  /* Each of 3 columns = (100% - 2*20px) / 3 ... headache */
}

/* NEW WAY — fr handles it automatically */
.new-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr; /* Browser does the math */
}
```

### Section Recap

- `fr` = **fractional unit** — a share of the available space after fixed sizes are removed
- Think of it as **pizza slices**: `2fr` gets twice as much as `1fr`
- `fr` automatically accounts for `gap` spacing — no math needed
- Mix `fr` with `px` freely: fixed columns are subtracted first, then `fr` divides the rest

---

## 7. The repeat() Function

### Plain-English Explanation

The `repeat()` function is a **shorthand** to avoid writing the same column/row size multiple times.

If you want 12 equal columns (like a Bootstrap-style grid), without `repeat()` you'd need to write:

```css
grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
/* This is ridiculous */
```

With `repeat()`:

```css
grid-template-columns: repeat(12, 1fr);
/* Much better! */
```

### Syntax

```css
repeat(number-of-times, size)
```

- **First argument:** How many times to repeat
- **Second argument:** The size (or sizes) to repeat

### Step-by-Step Examples

#### Example A — Basic repetition

```css
.grid-container {
  display: grid;

  /* Creates 3 columns, each 200px wide */
  /* Same as: 200px 200px 200px */
  grid-template-columns: repeat(3, 200px);
}
```

#### Example B — Repeat with fr units

```css
.grid-container {
  display: grid;

  /* Creates 4 equal flexible columns */
  /* Same as: 1fr 1fr 1fr 1fr */
  grid-template-columns: repeat(4, 1fr);
}
```

#### Example C — Repeating a pattern of multiple values

You can repeat a **pattern** of multiple sizes:

```css
.grid-container {
  display: grid;

  /* Repeats the pattern "1fr 2fr" three times */
  /* Result: 1fr 2fr 1fr 2fr 1fr 2fr */
  /* You get 6 columns total */
  grid-template-columns: repeat(3, 1fr 2fr);
}
```

#### Example D — Mixing repeat() with fixed values

```css
.grid-container {
  display: grid;

  /* Column 1: fixed 250px sidebar */
  /* Columns 2-4: three equal flexible columns */
  grid-template-columns: 250px repeat(3, 1fr);
}
```

Visual:

```
┌──────────┬──────────┬──────────┬──────────┐
│  250px   │   1fr    │   1fr    │   1fr    │
│ Sidebar  │  Col 2   │  Col 3   │  Col 4   │
└──────────┴──────────┴──────────┴──────────┘
```

#### Example E — Repeat with auto-fill or auto-fit (preview)

`repeat()` can also take `auto-fill` or `auto-fit` as its first argument — we'll cover this in depth in Section 15.

```css
/* Creates as many 200px columns as will fit in the container */
grid-template-columns: repeat(auto-fill, 200px);
```

> [!TIP]
> `repeat()` works for both `grid-template-columns` and `grid-template-rows`. Use it anytime you need to repeat a size more than twice.

### Section Recap

- `repeat(count, size)` is shorthand for writing the same size multiple times
- First argument = **how many times**, Second argument = **what size**
- You can repeat a pattern of multiple sizes: `repeat(3, 1fr 2fr)`
- Mix `repeat()` with other values: `250px repeat(3, 1fr)`

---

## 8. The minmax() Function

### Plain-English Explanation

`minmax(min, max)` lets you define a **range** for a column or row size. It tells the browser:

> "This track (column or row) should be **at least** [min] wide/tall, but **no more than** [max] wide/tall."

### The Rubber Band Analogy

Think of `minmax()` like a rubber band with stops at both ends:
- The **minimum** is a rigid peg — the column can **never shrink below** this
- The **maximum** is another peg — the column can **never grow beyond** this
- Between those pegs, the column **stretches and squishes** freely

### Why Does This Matter?

`minmax()` is the key to building **truly responsive grids** without media queries. Instead of defining breakpoints, you let the browser naturally resize columns within a safe range.

### Step-by-Step Examples

#### Example A — Basic minmax

```css
.grid-container {
  display: grid;

  /* Column will be at least 100px, at most 300px */
  grid-template-columns: minmax(100px, 300px);
}
```

#### Example B — minmax with fr (the most common use)

The most powerful pattern: `minmax(min, 1fr)`

```css
.grid-container {
  display: grid;

  /* 3 columns, each at least 200px, but share space equally above that */
  grid-template-columns: repeat(3, minmax(200px, 1fr));
}
```

What happens:
- If container is 600px wide → each column is 200px (at the minimum)
- If container is 900px → each column is 300px (1fr each)
- If container is 1200px → each column is 400px (1fr each, growing)

#### Example C — Using minmax with auto-fill (ultimate responsive pattern)

```css
.card-grid {
  display: grid;

  /* Create as many columns as fit, each between 250px and 1fr */
  /* No media queries needed! */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
```

This creates:
- 1 column on very small screens
- 2 columns on medium screens
- 3, 4, 5+ columns on larger screens

All automatically, with no media queries!

#### Example D — Using max-content and min-content as values

```css
.grid-container {
  display: grid;

  /* Column 1: at least as wide as the longest word, at most as wide as longest line */
  /* Column 2: fills remaining space */
  grid-template-columns: minmax(min-content, max-content) 1fr;
}
```

> [!WARNING]
> Avoid `minmax(0, 1fr)` vs `minmax(auto, 1fr)`. The default minimum for `1fr` alone is actually `auto` (which respects content size). If you write `minmax(0, 1fr)`, you're explicitly allowing columns to shrink to zero, which can cause overflow. Usually `minmax(min-content, 1fr)` is safer.

### Section Recap

- `minmax(min, max)` creates a **flexible range** for column or row size
- The column will never be **smaller than min** or **larger than max**
- Use `minmax(250px, 1fr)` with `repeat(auto-fill, ...)` for the most powerful responsive grid pattern
- Works for both columns (`grid-template-columns`) and rows (`grid-template-rows`)

---

## 9. The gap Property

### Plain-English Explanation

`gap` (previously called `grid-gap`) adds **spacing between grid tracks** — between rows and between columns. Think of it as the mortar between tiles on a floor.

Importantly, `gap` only adds space **between** items — it does NOT add space around the outer edges of the grid. For outer padding, use the `padding` property on the container.

### Syntax

```css
/* Both row-gap and column-gap at once */
gap: row-gap column-gap;

/* Or set them individually */
row-gap: 20px;
column-gap: 30px;

/* If you give one value, it applies to both */
gap: 20px; /* 20px between rows AND 20px between columns */
```

### Step-by-Step Examples

#### Example A — Equal gap between rows and columns

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  /* 20px space between every row and column */
  gap: 20px;
}
```

Visual:

```
┌──────────┐  ←20px→  ┌──────────┐  ←20px→  ┌──────────┐
│  Item 1  │           │  Item 2  │           │  Item 3  │
└──────────┘           └──────────┘           └──────────┘
     ↕ 20px                 ↕ 20px                 ↕ 20px
┌──────────┐           ┌──────────┐           ┌──────────┐
│  Item 4  │           │  Item 5  │           │  Item 6  │
└──────────┘           └──────────┘           └──────────┘
```

#### Example B — Different row and column gaps

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  /* 10px between rows, 30px between columns */
  gap: 10px 30px;
  /*   ↑        ↑
       row-gap  column-gap  */
}
```

#### Example C — Why gap is better than margin

Using `margin` on grid items causes problems at edges (extra space on the outside). `gap` is smarter:

```css
/* BAD — margin adds unwanted space outside the grid too */
.item {
  margin: 10px; /* Adds 10px on ALL sides, including the outer edges */
}

/* GOOD — gap only adds space BETWEEN items */
.grid-container {
  gap: 20px; /* Clean spacing only between items */
}
```

> [!NOTE]
> The `gap` property also works in Flexbox containers — it's not Grid-exclusive! This makes it the preferred modern way to add spacing between flex items too.

### Section Recap

- `gap` adds **spacing between** grid tracks (rows and columns)
- It does NOT add spacing on the outer edges of the grid
- One value = same gap for rows and columns; two values = `row-gap column-gap`
- `gap` is smarter than using `margin` on items because it doesn't create edge artifacts
- `gap` also works in Flexbox

---

## 10. Grid Lines and Default Item Placement

### Plain-English Explanation

When CSS Grid creates a grid, it also creates invisible **numbered lines** that run along the edges of each track (column and row).

Think of them like the **coordinates on a map** or the **lines on graph paper**. They let you precisely say "this item starts at line 2 and ends at line 4."

### How Grid Lines Are Numbered

Grid lines are numbered starting from **1** at the top-left, counting toward the right for column lines and downward for row lines. The lines also have **negative numbers** counting from the opposite end.

For a 3-column, 2-row grid:

```
Column lines:  1    2    3    4
               ↓    ↓    ↓    ↓
Row line 1 → ┌────┬────┬────┐
              │ A  │ B  │ C  │
Row line 2 → ├────┼────┼────┤
              │ D  │ E  │ F  │
Row line 3 → └────┴────┴────┘

Negative line numbers (from right/bottom):
Column:  -4   -3   -2   -1
Row:      -3   -2   -1
```

### Default Placement (Auto-Flow)

By default, grid items are placed:
1. **Left to right** (filling columns)
2. **Top to bottom** (starting a new row when the current row is full)

This is called **auto-flow** or **auto-placement**. You don't have to do anything — it just works.

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
}
```

Auto-placement result:

```
┌──────┬──────┬──────┐
│  1   │  2   │  3   │ ← Row 1 fills left to right
├──────┼──────┼──────┤
│  4   │  5   │      │ ← Row 2 fills until items run out
└──────┴──────┴──────┘
```

> [!TIP]
> You can inspect grid lines in your browser's DevTools! In Chrome, open DevTools → Elements → select a grid container → click the "grid" badge that appears next to it. It overlays the line numbers on the page!

### Why Do Grid Lines Matter?

Grid lines are the foundation of **explicit placement**. In the next section, you'll learn to use these line numbers to place items exactly where you want them — instead of relying on auto-placement.

### Section Recap

- CSS Grid creates numbered **grid lines** at the edge of every track
- Lines are numbered from **1** starting at the top-left corner
- Negative numbers count from the opposite end (useful for "last column")
- By default, items fill **left to right, then wrap down** (auto-placement)
- Use browser DevTools to **visualize grid lines** while developing

---

## 11. Explicit Placement — grid-column and grid-row

### Plain-English Explanation

Instead of letting the browser decide where items go, you can **explicitly place them** on the grid using:
- `grid-column` — where the item sits horizontally (which column lines it spans)
- `grid-row` — where the item sits vertically (which row lines it spans)

You reference the **grid line numbers** from Section 10.

### Syntax

```css
.item {
  /* Start at column line 1, end at column line 3 */
  grid-column: 1 / 3;

  /* Start at row line 2, end at row line 4 */
  grid-row: 2 / 4;
}
```

The `/` separates **start line** from **end line**.

### Longhand Properties

`grid-column` is shorthand for:
- `grid-column-start: 1;`
- `grid-column-end: 3;`

And `grid-row` is shorthand for:
- `grid-row-start: 2;`
- `grid-row-end: 4;`

Use the shorthand — it's much cleaner.

### Step-by-Step Examples

#### Example A — Place an item in a specific cell

```html
<div class="container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main</div>
  <div class="footer">Footer</div>
</div>
```

```css
.container {
  display: grid;
  /* 3 columns */
  grid-template-columns: 200px 1fr 1fr;
  /* 3 rows */
  grid-template-rows: 80px 1fr 60px;
  gap: 10px;
  height: 100vh;
}

.header {
  /* Start at column line 1, end at column line 4 (spans all 3 columns) */
  grid-column: 1 / 4;
  /* Stay in row 1 (from line 1 to line 2) */
  grid-row: 1 / 2;
  background: #4a90d9;
}

.sidebar {
  /* Stay in column 1 */
  grid-column: 1 / 2;
  /* Span row 2 (middle row) */
  grid-row: 2 / 3;
  background: #7bc67e;
}

.main {
  /* Span columns 2 and 3 */
  grid-column: 2 / 4;
  /* Stay in row 2 */
  grid-row: 2 / 3;
  background: #f0f0f0;
}

.footer {
  /* Span all columns */
  grid-column: 1 / 4;
  /* Stay in row 3 */
  grid-row: 3 / 4;
  background: #333;
  color: white;
}
```

Result:

```
Col: 1       2       3       4
     ↓       ↓       ↓       ↓
  ┌───────────────────────────┐ ← Row line 1
  │          HEADER           │
  ├───────┬───────────────────┤ ← Row line 2
  │       │                   │
  │  SBR  │      MAIN         │
  │       │                   │
  ├───────┴───────────────────┤ ← Row line 3
  │          FOOTER           │
  └───────────────────────────┘ ← Row line 4
```

#### Example B — Using -1 to mean "the last line"

The number `-1` always means the **last grid line** (no matter how many columns you have). This is incredibly useful when you want something to span the full width.

```css
.header {
  /* From column line 1 to the very last column line */
  grid-column: 1 / -1;
  /* This always spans the full width, regardless of column count! */
}
```

> [!TIP]
> Use `grid-column: 1 / -1` to make an element span the entire width of the grid. It's more resilient than hardcoding the last line number.

### Section Recap

- `grid-column: start / end` places an item between two column lines
- `grid-row: start / end` places an item between two row lines
- Lines start at **1** from the top-left and go negative (-1) from the bottom-right
- `-1` always means "the last line" — great for full-width spanning
- Explicitly placed items can **overlap** auto-placed items if not careful

---

## 12. The span Keyword

### Plain-English Explanation

Instead of saying "start at line 2 and end at line 5" (which requires you to do math), you can use `span` to say "start wherever you are and stretch across N tracks."

`span` = "extend across this many columns/rows"

### Syntax

```css
/* Start at line 2, span 3 columns (ends at line 5) */
grid-column: 2 / span 3;

/* Or just span from the auto-placed position */
grid-column: span 2; /* Occupy 2 columns wide, wherever auto-placement puts it */

/* Same for rows */
grid-row: span 2; /* Occupy 2 rows tall */
```

### Why Use span Instead of Line Numbers?

`span` is more **readable** and **maintainable**. Instead of calculating end line numbers, you just say how many tracks to cover.

### Step-by-Step Examples

#### Example A — Making a featured card span 2 columns

```html
<div class="card-grid">
  <div class="card featured">Featured</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
</div>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3-column grid */
  gap: 16px;
}

.card {
  background: #4a90d9;
  padding: 20px;
  color: white;
  border-radius: 8px;
}

.featured {
  /* This card spans 2 columns wide (and stays 1 row tall) */
  grid-column: span 2;
  background: #e74c3c; /* Red to stand out */
}
```

Result:

```
┌──────────────────────┬──────────┐
│   FEATURED (span 2)  │  Card 2  │
├──────────┬───────────┴──────────┤
│  Card 3  │  Card 4  │  Card 5   │
└──────────┴──────────┴───────────┘
```

#### Example B — Spanning both rows and columns (magazine layout)

```css
.hero-article {
  /* Wide: spans 2 columns */
  grid-column: span 2;
  /* Tall: spans 2 rows */
  grid-row: span 2;
}
```

#### Example C — Combining explicit start with span

```css
.sidebar {
  /* Start at column line 1 and span 1 column */
  grid-column: 1 / span 1;

  /* Start at row line 2 and span 3 rows */
  grid-row: 2 / span 3;
}
```

> [!NOTE]
> When you use `span` without a start line (e.g., `grid-column: span 2`), the browser uses auto-placement to decide where the item starts. The item will then stretch across the specified number of tracks from that position.

### Section Recap

- `span N` means "stretch across N tracks from the current position"
- Use `span` instead of line numbers when you care about **size** but not **start position**
- Combine start lines with span: `grid-column: 2 / span 3` (start at 2, span 3)
- `span` works with both `grid-column` and `grid-row`

---

## 13. Named Template Areas — grid-template-areas

### Plain-English Explanation

`grid-template-areas` is arguably the most **readable and intuitive** feature in CSS Grid. It lets you draw your layout as **ASCII art** directly in your CSS, using words to name each area.

Instead of working with abstract line numbers, you literally write out what your layout looks like:

```css
grid-template-areas:
  "header header header"
  "sidebar main main"
  "footer footer footer";
```

This visually represents a grid where:
- The top row is a header spanning all 3 columns
- The middle row has a sidebar and a main content area (main spans 2 columns)
- The bottom row is a footer spanning all 3 columns

### Why Does This Matter?

This approach makes your layout **self-documenting**. Any developer reading your CSS can immediately understand the full page structure — without needing to trace line numbers or do math.

### The Rules for grid-template-areas

1. Each **string** (in quotes) represents one row
2. Names within a row are separated by spaces — each name occupies one column
3. A name spanning multiple columns must be **repeated** in consecutive cells
4. Use a **dot** (`.`) for empty cells
5. After defining the areas, assign each grid item to an area using `grid-area`

### Step-by-Step Walkthrough

#### Step 1 — Write your HTML

```html
<div class="page">
  <header class="page-header">Header</header>
  <nav class="page-nav">Navigation</nav>
  <main class="page-main">Main Content</main>
  <aside class="page-aside">Aside</aside>
  <footer class="page-footer">Footer</footer>
</div>
```

#### Step 2 — Define the grid and its areas

```css
.page {
  display: grid;

  /* 3 columns: fixed nav | flexible main | fixed aside */
  grid-template-columns: 200px 1fr 200px;

  /* 3 rows: fixed header | flexible main | fixed footer */
  grid-template-rows: 80px 1fr 60px;

  /* This is the "ASCII art" layout map */
  /* Each string = one row, each word = one column */
  /* Repeated words = the area spans multiple cells */
  grid-template-areas:
    "header header  header"   /* Row 1: header spans all 3 columns */
    "nav    main    aside"    /* Row 2: three separate areas */
    "footer footer  footer";  /* Row 3: footer spans all 3 columns */

  height: 100vh; /* Fill the viewport */
  gap: 10px;
}
```

Visual map of the areas:

```
┌──────────────────────────────────────┐
│           header                     │  ← Row 1
├──────────┬───────────────┬───────────┤
│   nav    │     main      │   aside   │  ← Row 2
├──────────┴───────────────┴───────────┤
│           footer                     │  ← Row 3
└──────────────────────────────────────┘
```

#### Step 3 — Assign each item to its named area

```css
/* Assign each element to its named area */
/* The name must match EXACTLY what you wrote in grid-template-areas */

.page-header {
  grid-area: header; /* Tells this element to occupy the "header" area */
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.page-nav {
  grid-area: nav; /* Occupies the "nav" area */
  background: #34495e;
  color: white;
  padding: 20px;
}

.page-main {
  grid-area: main; /* Occupies the "main" area */
  background: #ecf0f1;
  padding: 20px;
  overflow-y: auto; /* Scroll if content overflows */
}

.page-aside {
  grid-area: aside; /* Occupies the "aside" area */
  background: #bdc3c7;
  padding: 20px;
}

.page-footer {
  grid-area: footer; /* Occupies the "footer" area */
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### Step 4 — Using dots for empty cells

If you want a cell in the grid to be intentionally empty, use a dot (`.`):

```css
grid-template-areas:
  "header header header"
  "nav    main   .    "   /* The right cell in row 2 is empty */
  "footer footer footer";
```

> [!IMPORTANT]
> Named areas must form a **rectangle** — you cannot create L-shapes or disconnected areas. If you try, the browser will ignore the `grid-template-areas` declaration entirely.

### Responsive Layouts with Media Queries + grid-template-areas

One of the greatest advantages of named areas is how easy it is to **rearrange the layout for different screen sizes**:

```css
/* Mobile: single column stacked layout */
.page {
  display: grid;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "aside"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: auto;
}

/* Desktop: full two-sidebar layout */
@media (min-width: 768px) {
  .page {
    grid-template-areas:
      "header header  header"
      "nav    main    aside"
      "footer footer  footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 80px 1fr 60px;
    height: 100vh;
  }
}
```

The grid items themselves don't need to change — just the parent's `grid-template-areas`!

### Section Recap

- `grid-template-areas` lets you write your layout as **ASCII art** in CSS
- Each string = one row; each word = one column area
- Repeated words = area spans multiple cells (must form a rectangle)
- Use `.` for empty cells
- Assign items to areas with `grid-area: name` on the child
- Perfect for responsive: just rewrite `grid-template-areas` in media queries

---

## 14. Alignment in Grid

### Plain-English Explanation

CSS Grid gives you powerful alignment controls. These can feel confusing at first because there are many properties with similar names. Here's the key to understanding them all:

**Two axes:**
- **Inline axis** (horizontal, left-right) — controlled by `justify-*`
- **Block axis** (vertical, top-bottom) — controlled by `align-*`

**Two levels:**
- **Items inside their cell** — `justify-items` and `align-items`
- **The grid tracks themselves inside the container** — `justify-content` and `align-content`

### Complete Alignment Property Reference

| Property | Axis | What It Aligns | Applies To |
|----------|------|----------------|------------|
| `justify-items` | Horizontal | Items inside their grid cell | Container |
| `align-items` | Vertical | Items inside their grid cell | Container |
| `place-items` | Both | Shorthand for align-items + justify-items | Container |
| `justify-content` | Horizontal | Grid tracks inside the container | Container |
| `align-content` | Vertical | Grid tracks inside the container | Container |
| `place-content` | Both | Shorthand for align-content + justify-content | Container |
| `justify-self` | Horizontal | Single item inside its grid cell | Item |
| `align-self` | Vertical | Single item inside its grid cell | Item |
| `place-self` | Both | Shorthand for align-self + justify-self | Item |

### justify-items and align-items

These control how items sit **inside their individual grid cell**.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(2, 150px);

  /* Default: items stretch to fill their entire cell */
  justify-items: stretch; /* start | end | center | stretch */
  align-items: stretch;   /* start | end | center | stretch */
}
```

Values explained:

```
justify-items: start          justify-items: center         justify-items: end
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│[item]            │          │     [item]       │          │            [item]│
│                  │          │                  │          │                  │
└──────────────────┘          └──────────────────┘          └──────────────────┘

justify-items: stretch (default)
┌──────────────────┐
│[item fills cell ]│
└──────────────────┘
```

#### Example — Centering items in their cells

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(2, 150px);

  /* Center items both horizontally and vertically in their cells */
  /* place-items is shorthand: align-items then justify-items */
  place-items: center; /* Equivalent to: align-items: center; justify-items: center; */
}
```

### justify-content and align-content

These control how the **grid tracks** (the grid as a whole) are positioned inside the container. This only has a visible effect when the **grid is smaller than the container**.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 100px); /* Total: 300px of columns */
  width: 600px; /* Container is wider than the grid */

  /* Distribute extra space between columns */
  justify-content: space-between; /* start | end | center | space-between | space-around | space-evenly */
}
```

Values for `justify-content`:

```
start:         [■][■][■]                    (all at left)
end:                      [■][■][■]         (all at right)
center:              [■][■][■]              (centered)
space-between: [■]         [■]         [■]  (spread, no edge space)
space-around:     [■]      [■]      [■]     (equal space around each)
space-evenly:    [■]     [■]     [■]        (equal space everywhere)
```

### justify-self and align-self — Per-Item Overrides

Override alignment for a **single specific item** without changing others:

```css
.special-item {
  /* This item aligns itself to the right in its cell */
  justify-self: end;

  /* This item aligns itself to the top of its cell */
  align-self: start;
}
```

### Quick Example — Centering Everything

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 400px;

  /* Center ALL items inside their cells (both axes) */
  place-items: center;

  /* Center the GRID TRACKS inside the container (both axes) */
  place-content: center;
}
```

> [!TIP]
> **`place-items: center`** is the modern, cleanest way to center content inside grid cells. It replaces old tricks like `margin: auto` or position-based centering.

### Section Recap

- `justify-*` = **horizontal** (inline) axis; `align-*` = **vertical** (block) axis
- `*-items` = how items sit inside their cell; `*-content` = how the whole grid sits in the container
- `place-*` is shorthand for both `align-*` and `justify-*` together
- `*-self` overrides alignment for a single item
- `place-items: center` is the clean modern way to center items in grid cells

---

## 15. auto-fill vs auto-fit

### Plain-English Explanation

Both `auto-fill` and `auto-fit` are used with `repeat()` to **automatically create as many columns as will fit** in the container, without you specifying a count. This is how you build truly responsive grids without media queries.

They sound identical — and in many cases they produce the same result. But their behavior diverges when there are **fewer items than columns**. This is the key distinction.

### The Core Difference

- **`auto-fill`**: Creates as many column tracks as will fit, **even if those tracks are empty**. The grid "reserves" the space for potential future items.
- **`auto-fit`**: Creates as many column tracks as will fit, but **collapses empty tracks to zero width**. Items stretch to fill all available space.

### Visual Comparison (Fewer Items Than Space Allows)

Assume: container width = 600px, minimum column size = 200px → max 3 columns fit.
But we only have **2 items**.

```
auto-fill (3 columns created, 1 is empty):
┌────────┬────────┬────────┐
│ Item 1 │ Item 2 │ [empty]│  ← empty track still takes space
└────────┴────────┴────────┘
  200px    200px    200px

auto-fit (empty column collapsed):
┌────────────────┬────────────────┐
│    Item 1      │    Item 2      │  ← items grow to fill the space
└────────────────┴────────────────┘
       300px           300px
```

### Code Examples

```css
/* SETUP: same for both — the difference is only auto-fill vs auto-fit */

.auto-fill-grid {
  display: grid;

  /* Create as many 200px columns as fit, filling the remaining space equally */
  /* If there are fewer items than columns, empty columns STAY */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

  gap: 16px;
}

.auto-fit-grid {
  display: grid;

  /* Create as many 200px columns as fit */
  /* If there are fewer items than columns, empty columns COLLAPSE to 0 */
  /* Items EXPAND to fill the full container width */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  gap: 16px;
}
```

### When to Use Which?

| Scenario | Use |
|----------|-----|
| **Image gallery** where you want items to always fill the full width | `auto-fit` |
| **Card grid** where items should maintain a consistent size regardless of count | `auto-fill` |
| **Dynamic lists** where the number of items changes (JS-driven) | `auto-fill` (prevents layout jumps) |
| **Portfolio grid** where you want a few featured items to be large | `auto-fit` |

### Detailed Step-by-Step Comparison

Let's say our container is 700px wide and we have 5 items at `minmax(200px, 1fr)`:

**Step 1:** Browser calculates: `700 / 200 = 3.5` → **3 columns fit** (floor division)

**Step 2a (auto-fill):** Creates 3 columns. 5 items → fills 2 rows. No problem.

**Step 2b (auto-fit):** Also creates 3 columns. Same behavior when items fill all columns.

**Now remove 2 items (only 1 item left):**

**Step 3a (auto-fill):** Still creates 3 columns. Item 1 sits in column 1 at 200px. Columns 2 and 3 are empty but still exist.

**Step 3b (auto-fit):** Creates only 1 "real" column. Columns 2 and 3 collapse. Item 1 stretches to fill all 700px.

### A Practical Rule of Thumb

> Use **`auto-fit`** when you want items to always fill the container's full width.  
> Use **`auto-fill`** when you want items to maintain a consistent size and not stretch excessively.

> [!WARNING]
> If all your grid columns are full (no empty tracks), `auto-fill` and `auto-fit` behave **identically**. The difference only appears with empty tracks.

### Section Recap

- Both `auto-fill` and `auto-fit` create as many columns as fit automatically
- `auto-fill` keeps empty columns → items keep their defined size
- `auto-fit` collapses empty columns → items stretch to fill the container
- The difference only matters when **fewer items than columns**
- Use with `minmax()` for the most powerful responsive grid pattern

---

## 16. grid-auto-flow: dense

### Plain-English Explanation

By default, grid auto-placement works like a **typewriter**: it fills each row left-to-right, top-to-bottom, and it **never goes back to fill gaps** left by larger items.

If item A is `span 2` wide and it doesn't fit at the end of a row, the browser puts it on the next row — leaving a hole in the current row.

`grid-auto-flow: dense` tells the grid to **go back and fill those holes** with smaller items that fit, even if those smaller items come later in the DOM.

### The Brick Wall Analogy

Normal grid auto-flow is like building a wall where you lay bricks strictly in order, left to right. If a wide brick doesn't fit, you start a new row and leave a gap.

`dense` is like having a brick-layer who looks at all the available bricks and fits them into the wall optimally — sliding smaller bricks into gaps left by bigger ones.

### Visual Comparison

HTML: Items 1 and 3 are wide (span 2). Items 2, 4, 5 are normal (span 1).

**Without dense:**
```
┌──────────┬──────────┬──────────┐
│  Item 1 (span 2)   │  Item 2  │
├──────────────────────────────  ┤
│  [GAP]   │  Item 3 (span 2)   │  ← Item 2 fit, but left a gap
├──────────┼──────────┬──────────┤
│  Item 4  │  Item 5  │          │
└──────────┴──────────┴──────────┘
```

**With `grid-auto-flow: dense`:**
```
┌──────────┬──────────┬──────────┐
│  Item 1 (span 2)   │  Item 2  │
├──────────────────────────────  ┤
│  Item 4  │  Item 3 (span 2)   │  ← Item 4 filled the gap!
├──────────┼──────────┬──────────┤
│  Item 5  │          │          │
└──────────┴──────────┴──────────┘
```

> [!WARNING]
> `dense` can cause grid items to appear **out of DOM order** visually. This is a problem for **accessibility** — screen readers follow DOM order, not visual order. Use `dense` only for decorative grids (like photo galleries) where order doesn't matter for the content.

### Code Example

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  /* Pack items in to fill holes left by spanning items */
  grid-auto-flow: dense;

  /* You can also combine with row or column */
  /* grid-auto-flow: row dense; (default direction with dense) */
  /* grid-auto-flow: column dense; (fills columns first, then rows) */
}

.gallery-item {
  background: #4a90d9;
  min-height: 100px;
}

/* Make some items larger */
.gallery-item.wide {
  grid-column: span 2; /* Wide items — may leave gaps */
}

.gallery-item.tall {
  grid-row: span 2; /* Tall items */
}

.gallery-item.featured {
  grid-column: span 2;
  grid-row: span 2; /* Both wide and tall */
}
```

### Section Recap

- By default, auto-placement fills left-to-right, top-to-bottom and **never goes back to fill gaps**
- `grid-auto-flow: dense` fills gaps by placing later items into earlier holes
- Items may appear **out of DOM order** visually — accessibility concern
- Best for decorative grids (photo galleries, pattern layouts)
- Combine with `column`: `grid-auto-flow: column dense` to fill columns first

---

## 17. Modern CSS Subgrid

### The Problem Subgrid Solves

Imagine you have a grid of cards. Each card has: a title, a body, and a button at the bottom. You want all the buttons in the same row to be at the same vertical position, regardless of how much text is in each card.

Without subgrid, this is extremely difficult. The cards are grid items, and their internal content is in a **separate layout context** — they don't "know" about the parent grid's column and row structure.

```
Without Subgrid:
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Title   │ │  Title   │ │  Title   │
│          │ │          │ │          │
│ Short    │ │ A much   │ │ Medium   │
│ body.    │ │ longer   │ │ content  │
│          │ │ body     │ │ here.    │
│          │ │ text.    │ │          │
│ [Button] │ │ [Button] │ │ [Button] │ ← Buttons are NOT aligned!
└──────────┘ └──────────┘ └──────────┘
```

### What Subgrid Does

`subgrid` lets a **nested element participate in its ancestor's grid**. The child grid item can say: "use the parent's row tracks for my own children."

```
With Subgrid:
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Title   │ │  Title   │ │  Title   │  ← Row 1 of parent grid
├──────────┤ ├──────────┤ ├──────────┤
│ Short    │ │ A much   │ │ Medium   │  ← Row 2
│ body.    │ │ longer   │ │ content  │
│          │ │ body     │ │ here.    │
│          │ │ text.    │ │          │
├──────────┤ ├──────────┤ ├──────────┤
│ [Button] │ │ [Button] │ │ [Button] │  ← Row 3 — ALL ALIGNED! ✓
└──────────┘ └──────────┘ └──────────┘
```

### Subgrid Code Example

```css
/* Step 1: Create the outer grid */
.card-grid {
  display: grid;

  /* 3 equal columns */
  grid-template-columns: repeat(3, 1fr);

  /* Define rows for the card content structure */
  /* 3 rows: one for title, one for body (flexible), one for button */
  grid-template-rows: auto 1fr auto;

  gap: 20px;
}

/* Step 2: Make each card span all 3 row tracks */
.card {
  /* The card spans 3 rows of the parent grid */
  grid-row: span 3;

  /* The card itself becomes a grid using the PARENT'S row tracks */
  display: grid;

  /* subgrid means: use the parent's row track definitions */
  /* for this element's own rows */
  grid-template-rows: subgrid;

  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Step 3: Card children now align to the parent grid's rows */
.card-title {
  /* Sits in parent grid's row 1 — title row */
  font-size: 1.25rem;
  font-weight: bold;
}

.card-body {
  /* Sits in parent grid's row 2 — flexible body row */
  /* This is what stretches to match the tallest card */
  font-size: 0.9rem;
  color: #666;
}

.card-button {
  /* Sits in parent grid's row 3 — button row */
  /* ALL buttons will now be at the same vertical position */
  align-self: end;
  padding: 10px 20px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

> [!NOTE]
> CSS Subgrid is now supported in all modern browsers (Chrome 117+, Firefox 71+, Safari 16+). You can use it in production today, but consider a fallback for older browsers if needed.

> [!TIP]
> Subgrid also works for columns: `grid-template-columns: subgrid`. This is useful when grid items contain sub-items that should align to the parent's column lines.

### Section Recap

- Subgrid solves the **nested alignment problem** — getting children of grid items to align with the parent grid's tracks
- Set `grid-template-rows: subgrid` (or columns) on a grid item to make it adopt the parent's track definitions
- The grid item must span the parent tracks it wants to inherit
- Perfect for **card grids** where you want titles, bodies, and buttons to align across all cards
- Now well-supported in modern browsers

---

## Lab 1: Holy Grail Layout with CSS Grid

### Overview

The "Holy Grail" layout is a classic web design pattern — a full-page layout with a header, footer, and three columns in the middle (left sidebar, main content, right sidebar). It was notoriously difficult to implement before CSS Grid.

In this lab, you will build it cleanly using `grid-template-areas`.

**Time:** 30 minutes  
**Difficulty:** Intermediate

### What You'll Build

```
┌────────────────────────────────────────────────┐
│                   HEADER                       │
├─────────────┬───────────────────┬──────────────┤
│             │                   │              │
│  Left Nav   │   Main Content    │  Right Aside │
│   (200px)   │      (1fr)        │   (180px)    │
│             │                   │              │
├─────────────┴───────────────────┴──────────────┤
│                   FOOTER                       │
└────────────────────────────────────────────────┘
```

### Step-by-Step Instructions

#### Step 1 — Create your project files

Create a folder called `holy-grail` and inside it create two files:
- `index.html`
- `style.css`

#### Step 2 — Write the HTML structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Holy Grail Layout — CSS Grid Lab</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- This is our grid container -->
  <div class="page">

    <!-- These 5 elements become grid items -->
    <header class="page-header">
      <h1>My Website</h1>
    </header>

    <nav class="page-nav">
      <h2>Navigation</h2>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Portfolio</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>

    <main class="page-main">
      <h2>Main Content</h2>
      <p>Welcome to the Holy Grail Layout! This is the main content area. It flexibly takes up all remaining space between the two sidebars.</p>
      <p>Add more content here. The layout adapts to any amount of content.</p>
    </main>

    <aside class="page-aside">
      <h2>Aside</h2>
      <p>This is the right sidebar. It contains supplementary content.</p>
    </aside>

    <footer class="page-footer">
      <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>

  </div><!-- end .page -->

</body>
</html>
```

#### Step 3 — Reset and base styles

```css
/* style.css */

/* =====================
   RESET & BASE STYLES
   ===================== */

/* Remove default browser spacing that could break our layout */
*, *::before, *::after {
  box-sizing: border-box; /* Include padding and border in element's total width/height */
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  color: #333;
  background: #f5f5f5;
}

h1, h2 { margin-bottom: 0.5em; }
p { line-height: 1.6; margin-bottom: 1em; }
a { color: #4a90d9; text-decoration: none; }
a:hover { text-decoration: underline; }
ul { list-style: none; padding: 0; }
li { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.2); }
```

#### Step 4 — Build the grid layout

```css
/* =====================
   HOLY GRAIL GRID
   ===================== */

.page {
  display: grid; /* Turn .page into a grid container */

  /* Define 3 columns:
     - Left nav: fixed 200px
     - Main content: flexible (takes remaining space)
     - Right aside: fixed 180px */
  grid-template-columns: 200px 1fr 180px;

  /* Define 3 rows:
     - Header: fixed 70px tall
     - Content area: flexible (fills remaining viewport height)
     - Footer: fixed 50px tall */
  grid-template-rows: 70px 1fr 50px;

  /* Draw the layout as ASCII art */
  /* Each string is a row, each word is a column */
  grid-template-areas:
    "header header header"  /* Row 1: header spans all 3 columns */
    "nav    main   aside"   /* Row 2: three separate sections */
    "footer footer footer"; /* Row 3: footer spans all 3 columns */

  min-height: 100vh; /* At least fill the full viewport height */
  gap: 4px;          /* Small gap between areas */
  background: #ccc;  /* The gap color shows through the grid */
}

/* =====================
   GRID AREA ASSIGNMENTS
   ===================== */

/* Assign each child to its named area */

.page-header {
  grid-area: header; /* This element fills the "header" named area */
  background: #2c3e50;
  color: white;
  display: flex;               /* Use flexbox INSIDE the header */
  align-items: center;         /* Vertically center the h1 */
  padding: 0 24px;
}

.page-nav {
  grid-area: nav; /* This element fills the "nav" named area */
  background: #34495e;
  color: white;
  padding: 20px;
  overflow-y: auto; /* Scroll if nav content is too tall */
}

.page-main {
  grid-area: main; /* This element fills the "main" named area */
  background: white;
  padding: 24px;
  overflow-y: auto; /* Scroll if content overflows */
}

.page-aside {
  grid-area: aside; /* This element fills the "aside" named area */
  background: #ecf0f1;
  padding: 20px;
  overflow-y: auto;
}

.page-footer {
  grid-area: footer; /* This element fills the "footer" named area */
  background: #2c3e50;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center; /* Center footer text */
  font-size: 0.85rem;
}
```

#### Step 5 — Add responsive behavior

```css
/* =====================
   RESPONSIVE LAYOUT
   ===================== */

/* On screens narrower than 768px (phones, small tablets) */
@media (max-width: 768px) {
  .page {
    /* Switch to a single column layout */
    grid-template-columns: 1fr;

    /* Rows are now auto-sized (grow to fit content) */
    grid-template-rows: auto;

    /* Redraw the layout map for mobile */
    /* Everything stacks vertically */
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";

    min-height: 100vh;
    gap: 0; /* No gaps on mobile */
  }
}
```

#### Step 6 — Test your layout

Open `index.html` in a browser. You should see:
- A dark header spanning the full width
- A dark left navigation, white main content, and light-grey aside in the middle row
- A dark footer spanning the full width

Resize the browser window to see the responsive behavior kick in at 768px.

### Bonus Challenges

1. **Add a sticky header:** Try `position: sticky; top: 0; z-index: 10;` on `.page-header`
2. **Add active state to nav:** Style the current nav item with a different background
3. **Make the layout 4-column:** Add a second left sidebar for secondary navigation

---

## Lab 2: Auto-fit Image Gallery

### Overview

In this lab, you will build a **fully responsive image gallery** using `repeat(auto-fit, minmax(...))`. The gallery will automatically adjust from 1 to 5 columns depending on available screen width — with **zero media queries**.

**Time:** 30 minutes  
**Difficulty:** Beginner–Intermediate

### What You'll Build

```
On wide screens (4 columns):
┌──────────┬──────────┬──────────┬──────────┐
│  Image 1 │  Image 2 │ Wide (2) │  Image 4 │
├──────────┼──────────┤          ├──────────┤
│  Image 5 │  Image 6 │          │  Image 8 │
├──────────┴──────────┴──────────┴──────────┤
│                Image 9 (wide)             │
└──────────────────────────────────────────┘

On narrow screens (2 columns):
┌──────────┬──────────┐
│  Image 1 │  Image 2 │
├──────────┼──────────┤
│    Wide Item (2)    │
└──────────┴──────────┘
```

### Step-by-Step Instructions

#### Step 1 — Create the project files

Create a folder called `image-gallery` with:
- `index.html`
- `style.css`

#### Step 2 — Write the HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Image Gallery — CSS Grid Lab</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="gallery-header">
    <h1>My Photo Gallery</h1>
    <p>A responsive grid gallery built with CSS Grid</p>
  </header>

  <!-- The gallery grid container -->
  <main class="gallery" id="gallery">

    <!-- Gallery items — some are "wide" (span 2 columns) -->
    <!-- We're using colored divs as image placeholders -->

    <div class="gallery-item">
      <div class="image-placeholder" style="background: #e74c3c;">Photo 1</div>
      <p class="caption">Mountain Sunrise</p>
    </div>

    <div class="gallery-item">
      <div class="image-placeholder" style="background: #3498db;">Photo 2</div>
      <p class="caption">Ocean Waves</p>
    </div>

    <div class="gallery-item wide">
      <!-- "wide" class makes this span 2 columns -->
      <div class="image-placeholder" style="background: #2ecc71;">Photo 3 (Wide)</div>
      <p class="caption">Forest Panorama</p>
    </div>

    <div class="gallery-item">
      <div class="image-placeholder" style="background: #9b59b6;">Photo 4</div>
      <p class="caption">City Lights</p>
    </div>

    <div class="gallery-item">
      <div class="image-placeholder" style="background: #f39c12;">Photo 5</div>
      <p class="caption">Desert Dunes</p>
    </div>

    <div class="gallery-item tall">
      <!-- "tall" class makes this span 2 rows -->
      <div class="image-placeholder" style="background: #1abc9c;">Photo 6 (Tall)</div>
      <p class="caption">Waterfall</p>
    </div>

    <div class="gallery-item">
      <div class="image-placeholder" style="background: #e67e22;">Photo 7</div>
      <p class="caption">Autumn Leaves</p>
    </div>

    <div class="gallery-item">
      <div class="image-placeholder" style="background: #c0392b;">Photo 8</div>
      <p class="caption">Snowy Peak</p>
    </div>

    <div class="gallery-item wide">
      <div class="image-placeholder" style="background: #2980b9;">Photo 9 (Wide)</div>
      <p class="caption">Coastal Cliffs</p>
    </div>

  </main>

</body>
</html>
```

#### Step 3 — Style the gallery

```css
/* style.css */

/* ========================
   RESET & BASE
   ======================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #111; /* Dark background for a gallery feel */
  color: white;
  min-height: 100vh;
}

/* ========================
   GALLERY HEADER
   ======================== */
.gallery-header {
  text-align: center;
  padding: 40px 20px 30px;
}

.gallery-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #4a90d9, #e056fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* Gradient text effect */
}

.gallery-header p {
  color: #aaa;
  font-size: 1rem;
}

/* ========================
   GALLERY GRID
   ======================== */
.gallery {
  display: grid;

  /* THE KEY LINE:
     - repeat(auto-fit, ...) = create as many columns as fit
     - minmax(220px, 1fr) = each column is at least 220px, grows to fill space
     - Result: automatically responsive without ANY media queries */
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  /* Auto-rows: each row is at least 200px tall */
  grid-auto-rows: 200px;

  /* Fill gaps when items have different sizes (dense packing) */
  grid-auto-flow: dense;

  gap: 8px;         /* Small gap between gallery items */
  padding: 0 16px 40px; /* Padding around the gallery */
  max-width: 1400px;    /* Don't let the gallery get too wide */
  margin: 0 auto;       /* Center the gallery horizontally */
}

/* ========================
   GALLERY ITEM
   ======================== */
.gallery-item {
  position: relative;  /* For the hover overlay positioning */
  overflow: hidden;    /* Clip the hover effect inside the item */
  border-radius: 6px;
  cursor: pointer;
}

/* Special sizes */
.gallery-item.wide {
  /* These items span 2 columns */
  grid-column: span 2;
}

.gallery-item.tall {
  /* These items span 2 rows */
  grid-row: span 2;
}

/* ========================
   IMAGE PLACEHOLDER
   ======================== */
.image-placeholder {
  width: 100%;
  height: 100%;          /* Fill the grid cell */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: rgba(255,255,255,0.8);
  transition: transform 0.3s ease; /* Smooth zoom on hover */
}

/* Zoom effect on hover */
.gallery-item:hover .image-placeholder {
  transform: scale(1.05); /* Slight zoom in */
}

/* ========================
   CAPTION
   ======================== */
.caption {
  position: absolute;    /* Float over the image */
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7)); /* Fade-in caption */
  font-size: 0.85rem;
  color: white;
  opacity: 0;            /* Hidden by default */
  transition: opacity 0.3s ease; /* Smooth fade in */
}

/* Show caption on hover */
.gallery-item:hover .caption {
  opacity: 1;
}
```

#### Step 4 — Test your gallery

Open `index.html` in a browser and:
1. Note how items fill the full width with equal columns
2. Resize the browser window — watch columns automatically appear/disappear
3. Notice how the `wide` items span 2 columns and how `dense` auto-flow fills the gaps
4. Hover over items to see the zoom and caption effects

#### Step 5 — Replace placeholder divs with real images (Bonus)

Once you understand the layout, replace the `<div class="image-placeholder">` elements with actual `<img>` tags:

```html
<!-- Replace this: -->
<div class="image-placeholder" style="background: #e74c3c;">Photo 1</div>

<!-- With this: -->
<img src="your-photo.jpg" alt="Mountain Sunrise" class="gallery-image">
```

```css
/* Add this CSS for real images */
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Crop image to fill the cell without distortion */
  display: block;
}
```

### Bonus Challenges

1. **Lightbox:** When an image is clicked, show it in a fullscreen overlay using JavaScript
2. **Filter buttons:** Add category buttons that show/hide items by class
3. **Masonry-like layout:** Try different `span` values for different items and see how `dense` fills the layout

---

## Assignment: Portfolio Project Part 6

### Objective

Apply everything you've learned in this module to redesign your portfolio website's layout using CSS Grid. By the end, your portfolio should have a professional, responsive layout built entirely with Grid (and Flexbox where appropriate inside Grid areas).

### Requirements

#### Requirement 1 — Full-Page Grid Layout (30 points)

Convert your portfolio's main layout to use CSS Grid with named template areas.

**You must have at minimum:**
- A header area
- A main content area
- A footer area
- At least one sidebar or aside (on larger screens)

**Hint:** Start with this pattern and customize:
```css
.portfolio {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

Then add columns and more areas for desktop:

```css
@media (min-width: 900px) {
  .portfolio {
    grid-template-areas:
      "header  header"
      "sidebar main  "
      "footer  footer";
    grid-template-columns: 280px 1fr;
  }
}
```

#### Requirement 2 — Projects/Works Grid (30 points)

Your portfolio projects section must use a **responsive CSS Grid** that automatically adjusts columns.

**You must use:**
- `repeat(auto-fill, minmax(280px, 1fr))` or similar
- At least one project card that spans 2 columns (a "featured" project)
- `gap` for spacing
- `grid-auto-rows` to maintain consistent card heights

**Hint for featured project:**
```css
.project-card.featured {
  grid-column: span 2; /* Featured project is twice as wide */
}

/* Make sure it doesn't break on small screens */
@media (max-width: 600px) {
  .project-card.featured {
    grid-column: span 1; /* Normal width on small screens */
  }
}
```

#### Requirement 3 — Skills or About Section Grid (20 points)

Your skills section (or any other section with multiple items) must use CSS Grid.

**Requirements:**
- Use `repeat()` for your column definition
- Use `minmax()` for responsive sizing
- Each skill card should have consistent alignment using `place-items` or `align-items`

**Hint:**
```css
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  place-items: center; /* Center content inside each skill cell */
}
```

#### Requirement 4 — Subgrid for Project Cards (20 points — Bonus)

Use CSS Subgrid to make project card content (title, description, tags, link) align consistently across cards.

**Hint:**
```css
/* Outer grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-template-rows: auto 1fr auto auto; /* title | body | tags | button */
  gap: 20px;
}

/* Each card spans 4 rows of the parent */
.project-card {
  grid-row: span 4;
  display: grid;
  grid-template-rows: subgrid; /* Inherit parent's rows */
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

### Submission Checklist

Before submitting, verify:

- [ ] The portfolio uses `display: grid` on at least the main layout container
- [ ] `grid-template-areas` is used for the page layout
- [ ] The projects grid uses `repeat(auto-fill, minmax(...))` for responsiveness
- [ ] At least one project card uses `grid-column: span 2` for emphasis
- [ ] The layout is responsive at mobile (< 768px), tablet (~768px), and desktop (> 1024px) breakpoints
- [ ] No layout is broken at any viewport width (check by slowly resizing)
- [ ] All grid areas are named meaningfully
- [ ] Code is commented explaining why each grid property is used

### Grading Criteria

| Criteria | Points |
|----------|--------|
| Correct use of `grid-template-areas` | 20 |
| Responsive projects grid without bugs | 20 |
| `repeat()`, `minmax()`, `fr` used appropriately | 15 |
| Named grid areas are semantic and meaningful | 10 |
| Alignment properties used correctly | 10 |
| Code is clean, commented, and well-organized | 10 |
| Mobile responsiveness is smooth and correct | 10 |
| Subgrid bonus (project card alignment) | 5 (bonus) |
| **Total** | **100 (+ 5 bonus)** |

---

## Resources

### Official Documentation

- [MDN Web Docs — CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout) — The definitive reference
- [MDN — grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
- [MDN — CSS Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [CSS Tricks — A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) — Excellent visual reference
- [Can I Use — CSS Grid](https://caniuse.com/css-grid) — Browser support data

### Interactive Learning Tools

- [Grid Garden](https://cssgridgarden.com/) — Game for learning CSS Grid (highly recommended!)
- [CSS Grid Generator](https://cssgrid-generator.netlify.app/) — Visual grid builder
- [Firefox Grid Inspector](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_grid_layouts/index.html) — Best browser tool for debugging grids
- [Layoutit Grid](https://grid.layoutit.com/) — Interactive grid builder with code export

### Videos & Courses

- [Kevin Powell — CSS Grid Tutorial](https://www.youtube.com/watch?v=EiNiSFIPIQE) — Excellent beginner explanation
- [Wes Bos — CSS Grid Course](https://cssgrid.io/) — Free comprehensive video course
- [Jen Simmons — Layout Land](https://www.youtube.com/layoutland) — Advanced CSS Grid techniques

### Cheatsheets

| Property | Quick Reference |
|----------|----------------|
| `display: grid` | Creates grid container |
| `grid-template-columns: 1fr 2fr` | 2 columns, second is twice as wide |
| `grid-template-rows: 100px 1fr` | 2 rows: fixed 100px, then flexible |
| `grid-template-areas: "a b" "c c"` | Named area layout map |
| `grid-area: a` | Assign item to named area |
| `grid-column: 1 / 3` | Span from column line 1 to 3 |
| `grid-row: span 2` | Item occupies 2 row tracks |
| `gap: 20px` | 20px between all tracks |
| `repeat(3, 1fr)` | 3 equal flexible columns |
| `minmax(200px, 1fr)` | At least 200px, at most 1fr |
| `repeat(auto-fill, minmax(200px, 1fr))` | Responsive columns, no media queries |
| `place-items: center` | Center all items in their cells |
| `grid-auto-flow: dense` | Fill gaps with smaller items |
| `grid-template-rows: subgrid` | Inherit parent's row tracks |

---

## Key Takeaways

1. **CSS Grid is 2D** — it controls both rows and columns simultaneously; Flexbox is 1D (one direction at a time)

2. **`display: grid` on the parent** makes all direct children grid items — grandchildren don't participate unless you use subgrid

3. **`fr` units** distribute available space proportionally — they automatically account for `gap` spacing, unlike percentages

4. **`repeat(auto-fit, minmax(250px, 1fr))`** is the most powerful responsive pattern — it creates as many columns as fit with zero media queries

5. **`grid-template-areas`** is the most readable way to define page layouts — it makes your CSS self-documenting and makes responsive redesigns trivial

6. **`auto-fill`** reserves space for empty columns; **`auto-fit`** collapses empty columns and lets items grow

7. **`grid-auto-flow: dense`** fills visual holes but can break DOM order — be careful with accessibility

8. **CSS Subgrid** solves the hardest Grid problem: aligning children of grid items across multiple cards/cells

9. **Use Grid for the big picture, Flexbox for the details** — they complement each other perfectly in real projects

10. **Browser DevTools** (Chrome and Firefox) have excellent Grid inspectors — use them constantly while building layouts

---

## Common Mistakes & How to Avoid Them

| Mistake | What Happens | How to Avoid It |
|---------|-------------|-----------------|
| Applying `display: grid` to the wrong element | Children don't become grid items; layout doesn't work | Always apply `display: grid` to the **parent/container**, not the items |
| Using `grid-area` with a name that doesn't match `grid-template-areas` | Item falls out of the named layout into auto-placement | Names must match exactly — check for typos; CSS is case-sensitive |
| Forgetting that `grid-template-areas` requires rectangular shapes | Browser ignores the entire `grid-template-areas` declaration | Never create L-shapes or disconnected areas; all named areas must be contiguous rectangles |
| Using `%` widths instead of `fr` | Columns overflow when you add `gap` | Use `fr` units; they automatically deduct `gap` space before distributing |
| Hard-coding the last column line number | Layout breaks when columns are added or changed | Use `-1` to mean "last line": `grid-column: 1 / -1` |
| Expecting `gap` to add outer padding | Content is flush against the container edges | `gap` only adds space **between** tracks; use `padding` on the container for edge spacing |
| Confusing `justify-items` with `justify-content` | Items or grid alignment behaves unexpectedly | `*-items` = items inside cells; `*-content` = tracks inside the container |
| Using `auto-fit` when `auto-fill` is needed | With many items, no visible difference, but with few items, they stretch unexpectedly wide | Use `auto-fill` for grids where items should keep a consistent size; `auto-fit` when you want items to expand to fill space |
| Using `grid-auto-flow: dense` on content grids | Screen reader users encounter content out of reading order | Only use `dense` on decorative/visual-only grids (photo galleries); avoid on grids where reading order matters |
| Setting `height` instead of `min-height` on the page container | On pages with little content, the footer doesn't reach the bottom; on long pages, content overflows | Use `min-height: 100vh` on your page grid container |
| Not setting `height: 100%` on grid items in a fixed-height grid | Grid cells have height, but the item inside doesn't fill it | Items stretch by default (`align-items: stretch`); if this doesn't work, check if a parent has a height set |
| Forgetting `grid-row: span N` on cards using subgrid | Subgrid items don't align to parent rows | The card must span the same number of rows it wants to inherit from the parent |
| Nesting grids without `subgrid` and expecting alignment | Children of grid items don't align to the outer grid | Use `grid-template-rows: subgrid` or `grid-template-columns: subgrid` on the nested container |

---

*End of Module 06 — Modern Layout: CSS Grid*

*Next Module: Module 07 — Responsive Design & Media Queries*