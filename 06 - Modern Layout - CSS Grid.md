# Lecture 06 — Modern Layout: CSS Grid

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create a grid container and define tracks (rows and columns)
- Use `fr` units, `repeat()`, and `minmax()` to build flexible, responsive grids
- Place items explicitly using grid line numbers and the `span` keyword
- Build full-page layouts using named grid areas (`grid-template-areas`)
- Align items within grid cells using justify/align properties
- Use `auto-fill` vs `auto-fit` to create responsive card grids without media queries
- Understand CSS Subgrid and when it solves alignment problems

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is CSS Grid? (Grid vs Flexbox)
2. Grid Container, Columns & Rows
3. The `fr` unit, `repeat()`, `minmax()`
4. Gap, Grid Lines & Item Placement
5. Named Template Areas
6. Alignment Properties
7. `auto-fill` vs `auto-fit` & Subgrid

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: Holy Grail Layout
2. Lab 2: Auto-fit Image Gallery

---

## 1. What is CSS Grid?

CSS Grid is a two-dimensional layout system. While Flexbox controls layout in one direction (a row OR a column), Grid controls both rows AND columns simultaneously.

**Analogy:** Flexbox is arranging books on a single shelf. Grid is organizing an entire bookcase — you control both which shelf (row) and which slot (column) every book occupies.

| Layout Tool | Dimension | Best For |
|-------------|-----------|----------|
| **Flexbox** | 1D (row OR column) | Nav bars, button groups, centering |
| **CSS Grid** | 2D (rows AND columns) | Page layouts, card grids, dashboards |

> [!TIP]
> Use them together! Grid controls the overall page structure. Flexbox controls the content inside each grid area (e.g., nav links inside a header).

---

## 2. Creating a Grid Container

Add `display: grid` to a parent element. All direct children become **grid items**.

```html
<div class="grid-container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
```

```css
.grid-container {
  display: grid; /* All direct children are now grid items */
}
```

Without defining columns, items stack in a single column (just like block elements). The magic starts when you define columns.

---

## 3. Defining Columns & Rows

### `grid-template-columns`

Each space-separated value creates one column:

```css
.grid {
  display: grid;
  /* 3 columns: fixed sidebar, flexible main, fixed panel */
  grid-template-columns: 200px 1fr 150px;
}
```

### `grid-template-rows`

Same idea for rows. Often you let the grid create rows automatically:

```css
.page {
  display: grid;
  height: 100vh;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px; /* header | content | footer */
}
```

### Implicit Rows

If you define 2 rows but have 9 items (3×3), the grid auto-creates a third row. Control their size with:

```css
grid-auto-rows: 150px; /* Auto-created rows will be 150px tall */
```

---

## 4. The `fr` Unit

`fr` stands for **fraction** of the available space. Think of it like pizza slices.

```css
grid-template-columns: 1fr 2fr 1fr;
/* Total: 4 slices. Column 1 = 25%, Column 2 = 50%, Column 3 = 25% */
```

The `fr` unit is smart — it distributes space **after** fixed columns are subtracted:

```css
grid-template-columns: 200px 1fr 1fr;
/* In a 1000px container: 200px + 400px + 400px */
```

> [!NOTE]
> Unlike percentages, `fr` automatically accounts for `gap` spacing. No math needed.

---

## 5. The `repeat()` Function

Shorthand for repeating column/row definitions:

```css
/* Instead of: 1fr 1fr 1fr 1fr */
grid-template-columns: repeat(4, 1fr);

/* Mix with fixed values */
grid-template-columns: 250px repeat(3, 1fr);

/* Repeat a pattern */
grid-template-columns: repeat(3, 1fr 2fr); /* = 1fr 2fr 1fr 2fr 1fr 2fr */
```

---

## 6. The `minmax()` Function

Defines a size range: "at least X, at most Y."

```css
/* Each column: minimum 250px, maximum equal share */
grid-template-columns: repeat(3, minmax(250px, 1fr));
```

### The Ultimate Responsive Pattern

Combine `repeat()`, `auto-fill`, and `minmax()` for a fully responsive grid with **zero media queries**:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
/* 1 column on small screens, 2 on medium, 3+ on large — automatically! */
```

---

## 7. The `gap` Property

Adds spacing **between** grid items (not around the outer edges — use `padding` for that).

```css
gap: 20px;           /* 20px between all rows and columns */
gap: 10px 30px;      /* 10px row-gap, 30px column-gap */
row-gap: 10px;       /* Only between rows */
column-gap: 30px;    /* Only between columns */
```

---

## 8. Grid Lines & Item Placement

Grid lines are the invisible numbered lines between columns and rows. A 3-column grid has **4 column lines** (1, 2, 3, 4).

```
  Line 1    Line 2    Line 3    Line 4
    |         |         |         |
    | Col 1   | Col 2   | Col 3   |
```

### Explicit Placement with `grid-column` and `grid-row`

```css
.header {
  grid-column: 1 / 4;  /* Start at line 1, end at line 4 (spans all 3 columns) */
  grid-row: 1 / 2;     /* Row 1 only */
}

.sidebar {
  grid-column: 1 / 2;  /* Column 1 only */
  grid-row: 2 / 3;     /* Row 2 only */
}
```

### The `span` Keyword

Instead of memorizing line numbers, use `span` to say "take up N tracks":

```css
.featured-card {
  grid-column: span 2; /* Span across 2 columns */
  grid-row: span 2;    /* Span across 2 rows */
}
```

---

## 9. Named Template Areas

The most visual way to define layouts. You literally draw your layout in CSS:

```css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

/* Assign items to areas by name */
.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main    { grid-area: main; }
.page-footer  { grid-area: footer; }
```

> [!TIP]
> Use a period (`.`) for empty cells: `"sidebar main ."` leaves the third column empty.

---

## 10. Alignment in Grid

Grid has 4 alignment properties that work on two axes:

| Property | Axis | Applies to | Controls |
|----------|------|-----------|----------|
| `justify-items` | Horizontal | All items | How items sit inside their cell horizontally |
| `align-items` | Vertical | All items | How items sit inside their cell vertically |
| `justify-content` | Horizontal | The grid itself | How the grid sits inside the container |
| `align-content` | Vertical | The grid itself | How the grid sits inside the container |

**Common values:** `start`, `end`, `center`, `stretch` (default)

Per-item overrides: `justify-self` and `align-self`.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  justify-content: center;  /* Center the entire grid horizontally */
  align-items: center;      /* Center items vertically within their cells */
}
```

---

## 11. `auto-fill` vs `auto-fit`

Both create as many columns as fit, but differ when there's leftover space:

| Keyword | Behavior with extra space |
|---------|--------------------------|
| `auto-fill` | Keeps empty tracks — items stay at their `minmax` minimum |
| `auto-fit` | Collapses empty tracks — items stretch to fill the container |

```css
/* auto-fill: items stay 250px, leaving empty space on the right */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* auto-fit: items stretch to fill the entire row */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

> [!TIP]
> Use `auto-fit` in most cases — it looks better when you have fewer items than columns.

---

## 12. `grid-auto-flow: dense`

By default, the grid places items in order, leaving gaps if a large item doesn't fit. `dense` tells the grid to backfill those gaps with smaller items that fit.

```css
.masonry-like {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: dense; /* Fill visual gaps with smaller items */
}
```

> [!WARNING]
> `dense` reorders items visually, which can confuse keyboard and screen reader users. Use it only for decorative grids (like image galleries), not for content that must be read in order.

---

## 13. CSS Subgrid

Normally, only direct children participate in the parent grid. Grandchildren are independent. **Subgrid** lets a child grid inherit its parent's track definitions, so grandchildren align to the parent's columns/rows.

```css
.parent {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.child {
  grid-column: 1 / 4; /* Spans all 3 parent columns */
  display: grid;
  grid-template-columns: subgrid; /* Inherit parent's column lines! */
}
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgetting `display: grid` on the parent | Grid properties only work on grid containers |
| Using `%` instead of `fr` for flexible columns | `fr` handles `gap` automatically; `%` doesn't |
| `grid-template-columns: 1fr` (just one column) | You need at least 2 values for a multi-column layout |
| Sticky positioning breaking inside grid | Ensure no grid ancestor has `overflow: hidden` |
| Confusing `auto-fill` and `auto-fit` | `auto-fit` stretches items; `auto-fill` keeps empty tracks |
| Items overflowing the grid | Use `minmax(0, 1fr)` instead of `1fr` if items contain long words |

---

## 🧪 Practice Labs

### Lab 1 — Holy Grail Layout (40 min)
Build the classic header/sidebar/main/footer layout using `grid-template-areas`:

1. Create `labs/lab1-holy-grail/index.html` with a `.page` container containing `.header`, `.sidebar`, `.main`, `.footer`
2. Use `grid-template-areas` to define the layout
3. Make it responsive: on screens below 768px, stack everything in a single column using a media query
4. The header should be 70px, footer 60px, sidebar 250px, main fills remaining space

### Lab 2 — Auto-fit Image Gallery (40 min)
Build a responsive photo gallery that adapts automatically:

1. Create `labs/lab2-gallery/index.html` with 12 image cards
2. Use `repeat(auto-fit, minmax(250px, 1fr))` for fully responsive columns
3. Make one card span 2 columns and 2 rows using `grid-column: span 2; grid-row: span 2`
4. Add `grid-auto-flow: dense` to fill gaps
5. Add `gap: 16px` and `border-radius` for polish

---

## 📝 Assignment: Portfolio Project — Part 6

Rebuild your portfolio layout using CSS Grid.

### Requirements
1. Replace any float/flexbox-based page layout with CSS Grid using `grid-template-areas`
2. Define at least 3 named areas: `header`, `main`, `footer`
3. Create a responsive Projects section using `repeat(auto-fit, minmax(300px, 1fr))`
4. Use `gap` for all spacing between grid items
5. Add a media query at 768px that switches the layout to a single column
6. Ensure all content is accessible and the page works without JavaScript

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| CSS Grid Guide (CSS-Tricks) | https://css-tricks.com/snippets/css/complete-guide-grid/ |
| Grid by Example | https://gridbyexample.com/ |
| Grid Garden (Interactive Game) | https://cssgridgarden.com/ |
| MDN: CSS Grid | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout |
| Can I Use: CSS Grid | https://caniuse.com/css-grid |

---

## 📌 Key Takeaways
- **CSS Grid** is a 2D layout system — it controls rows AND columns simultaneously
- `fr` units distribute remaining space proportionally (like pizza slices)
- `repeat(auto-fit, minmax(250px, 1fr))` is the ultimate responsive grid pattern — no media queries needed
- `grid-template-areas` lets you visually draw your layout in CSS
- Grid Lines are numbered starting at 1; use `grid-column` and `grid-row` for explicit placement
- `span` is more readable than memorizing line numbers
- Use Grid for the overall page structure; use Flexbox for content inside grid cells

---

**Next Lecture:** [Lecture 07 — Responsive Web Design & Media Queries](./07%20-%20Responsive%20Web%20Design%20%26%20Media%20Queries.md)
