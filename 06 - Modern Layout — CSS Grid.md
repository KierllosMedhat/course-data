# Lecture 06 — Modern Layout: CSS Grid

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create a CSS Grid container and define rows and columns
- Use flexible track sizing with `fr`, `minmax()`, and `repeat()`
- Place items into specific grid cells using line numbers and the `span` keyword
- Design readable layouts with named template areas (`grid-template-areas`)
- Align items within grid cells and the grid within its container
- Build responsive grids without media queries using `auto-fill` and `auto-fit`
- Master modern `subgrid` for aligning nested components

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. Creating a Grid Container
2. Flexible track sizing (`fr`, `minmax()`, `repeat()`)
3. Placing items with `grid-column`, `grid-row`, `span`
4. Named template areas (`grid-template-areas`)
5. Alignment properties
6. `auto-fill`, `auto-fit` & dense packing
7. Modern CSS Subgrid (`grid-template-columns: subgrid`)

### Part 2 — Practice & Lab (~90–120 min)
1. Holy Grail layout with `grid-template-areas`
2. Image gallery with `auto-fit` and `minmax()`
3. Portfolio Project Part 6: Grid Layouts & Subgrid

---

## 1. What is CSS Grid?

**CSS Grid** is a two-dimensional layout system — it lets you control **both rows and columns** at the same time.

### Creating a Grid Container
```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;   /* 3 columns */
  grid-template-rows: auto 1fr auto;         /* 3 rows */
}
```

---

## 2. Track Sizing

### The `fr` Unit (Fractional Unit)
The `fr` unit distributes **remaining free space** proportionally:
```css
grid-template-columns: 1fr 2fr 1fr;
/* 25%, 50%, 25% */
```

### `minmax()` & `repeat()`
```css
/* 4 equal columns */
grid-template-columns: repeat(4, 1fr);

/* Columns at least 200px, but can grow to fill space */
grid-template-columns: repeat(3, minmax(200px, 1fr));
```

### Gap
```css
gap: 20px; /* 20px between all rows and columns */
```

---

## 3. Placing Items

By default, items fill the grid in source order. You can place them explicitly.

```css
.featured-item {
  grid-column: 1 / 3;   /* Starts at line 1, ends at line 3 (spans 2 columns) */
  grid-row: span 2;     /* Spans 2 rows */
}
```

---

## 4. Named Template Areas

The most **readable** way to design grid layouts!

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```
> [!TIP]
> This is a game-changer for maintainability. Want to swap the sidebar from left to right? Just change `"sidebar main"` to `"main sidebar"`.

---

## 5. Alignment in Grid

- `justify-items` / `align-items`: Aligns all items horizontally/vertically within their cells.
- `justify-content` / `align-content`: Distributes the grid tracks within the container.
- `place-items: center`: Centers all items both ways.

---

## 6. Responsive Grids Without Media Queries

### `auto-fit`
Automatically creates as many columns as will fit, and collapses empty ones so items stretch.

```css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```
If you have 3 items but the container can fit 4 columns → the 3 items stretch to fill the whole row. If the screen shrinks to 300px, it naturally wraps to 1 column.

### Dense Packing
```css
grid-auto-flow: dense;
```
Fills in empty gaps by reordering items visually.

---

## 7. Modern CSS Subgrid

Historically, if a grid item was also a grid container, its grid was entirely independent of its parent.
In modern CSS, `subgrid` allows a nested grid to participate in its parent's sizing!

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card {
  display: grid;
  /* The card borrows its row definitions from the parent! */
  grid-template-rows: subgrid; 
  /* This requires the parent to define the rows */
}
```
**Why?** This ensures that the headers, bodies, and footers of adjacent cards all perfectly align with each other, regardless of how much text is in each card.

---

## 🧪 Practice Labs

### Lab 1: Holy Grail with CSS Grid (30 min)
1. Open `labs/lab1-holygrail-grid/index.html`.
2. Use `grid-template-areas` to create a header, sidebar, main area, and footer.
3. Compare the code with your Flexbox version — notice how much simpler Grid is for 2D layouts.

### Lab 2: Auto-fit Image Gallery (30 min)
1. Open `labs/lab2-gallery/index.html`.
2. Display a grid of images using `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`.
3. Make some items span 2 columns and enable `grid-auto-flow: dense`. Resize the browser!

---

## 📝 Assignment: Portfolio Project — Part 6

Upgrade your portfolio layout using CSS Grid!

### Requirements
1. Open your portfolio from Lecture 5.
2. In your `<section id="projects">`, refactor the project cards container to use CSS Grid instead of Flexbox.
3. Use `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));` and `gap: 2rem;`. Watch the cards perfectly handle their own responsiveness!
4. **Subgrid Challenge:** Make the individual `.project-card` elements `display: grid;` and use `grid-template-rows: subgrid;` (make sure the parent explicitly defines `grid-auto-rows` or `grid-template-rows` across a spanning row). The goal is to perfectly align the title, image, and description across all cards in a row.

### Optional Bonus
Use `grid-template-areas` to redesign your overall site structure (Header, Hero, About, Projects, Contact, Footer) into a 2D layout.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| CSS Grid Garden | https://cssgridgarden.com/ |
| CSS-Tricks — Grid Guide | https://css-tricks.com/snippets/css/complete-guide-grid/ |
| MDN — Subgrid | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid |

---

## 📌 Key Takeaways
- Use **Grid for overall 2D layout** and **Flexbox for 1D components**.
- `fr` distributes remaining space proportionally.
- `grid-template-areas` creates readable, maintainable layouts using ASCII art.
- `auto-fit` + `minmax()` enables fully responsive grids **without media queries**.
- `subgrid` perfectly aligns internals of adjacent components.

---

**Next Lecture:** [Lecture 07 — Responsive Web Design & Media Queries →](./07%20-%20Responsive%20Web%20Design%20%26%20Media%20Queries.md)