# Lecture 05 — Modern Layout: Flexbox

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create flex containers and understand the parent-child relationship
- Understand the main axis and cross axis and how `flex-direction` changes them
- Align items horizontally with `justify-content` and vertically with `align-items`
- Control item sizing with `flex-grow`, `flex-shrink`, `flex-basis`, and the `flex` shorthand
- Create responsive layouts using `flex-wrap`
- Build common layout patterns: centring, navigation bars, card grids, and sidebar layouts

---

## 📋 Agenda

### Part 1 — Theory (90 min)
1. Flex Container vs Flex Items
2. Axes: main and cross
3. `flex-direction`
4. Container alignment: `justify-content`, `align-items`, `align-content`
5. Item properties: `flex-grow`, `flex-shrink`, `flex-basis`, `flex` shorthand
6. `order` and `align-self`
7. Common patterns: centring, nav bars, card grids, split layouts

### Part 2 — Practice & Lab (~90–120 min)
1. Holy Grail layout with Flexbox
2. Pricing card grid with equal-height cards
3. Portfolio Project Part 5: Flexbox Layouts

---

## 1. What is Flexbox?

**Flexbox** (Flexible Box Layout) is a modern CSS layout method designed to make it easy to arrange elements in a row or column. It solves many layout problems that were painful with older techniques (floats, positioning).

### Flex Container & Flex Items

Flexbox works on a **parent-child relationship**:

```css
.container {
  display: flex;   /* This turns the parent into a flex container */
}
```

- The **parent** becomes a **flex container**.
- Its **direct children** automatically become **flex items**.
- Items are laid out along a line (the main axis).

> [!TIP]
> Adding `display: flex` to a parent immediately makes its children sit side-by-side in a row!

---

## 2. Axes & `flex-direction`

Flexbox has two axes:
- **Main axis** — The direction items flow (default: left to right)
- **Cross axis** — Perpendicular to the main axis (default: top to bottom)

The `flex-direction` property changes the main axis:
| Value | Main Axis Direction | Use Case |
|-------|-------------------|-------------|
| `row` (default) | Left → Right | Horizontal layouts (navbars, card rows) |
| `column` | Top → Bottom | Vertical layouts (sidebars, stacked forms) |

---

## 3. Alignment

### Main Axis (`justify-content`)
Distributes items along the main axis.
- `flex-start` (default)
- `flex-end`
- `center`
- `space-between` (First and last items at edges, equal space between the rest)
- `space-around`
- `space-evenly`

### Cross Axis (`align-items`)
Aligns items along the cross axis.
- `stretch` (default - items stretch to fill container's height)
- `center` (vertically centered)
- `flex-start`
- `flex-end`

### The Holy Grail: Perfect Centring
```css
.parent {
  display: flex;
  justify-content: center;   /* Horizontal centre */
  align-items: center;       /* Vertical centre */
  min-height: 100vh;
}
```

---

## 4. Multi-Line Layouts & Spacing

### `flex-wrap`
To allow wrapping to multiple lines:
- `nowrap` (default)
- `wrap`

### The `gap` Property (Modern Standard)
`gap` adds consistent spacing **between** flex items (not at the edges):
```css
.container {
  display: flex;
  gap: 20px;
}
```

---

## 5. Flex Item Sizing

### The `flex` Shorthand
Instead of setting `flex-grow`, `flex-shrink`, and `flex-basis` separately:

```css
flex: <grow> <shrink> <basis>;
```

**Common patterns:**
| Shorthand | Meaning | Use Case |
|-----------|---------|----------|
| `flex: 1` | Grow equally, shrink, auto basis | Equal-width items |
| `flex: 0 0 250px` | Don't grow, don't shrink, fixed 250px | Fixed-width sidebar |

### Individual Item Control
- `order`: Changes visual order.
- `align-self`: Overrides `align-items` for a single item.

---

## 🧪 Practice Labs

### Lab 1: Holy Grail Layout (45 min)
Build the classic "Holy Grail" layout — header, footer, and a middle section with sidebar + main content.
1. Open `labs/lab1-holygrail/index.html`.
2. Use `flex-direction: column` on the body.
3. Use `display: flex` on the middle container.
4. Set the sidebar to `flex: 0 0 250px` and the main content to `flex: 1`.

### Lab 2: Pricing Card Grid (30 min)
1. Open `labs/lab2-pricing/index.html`.
2. Create three pricing cards side by side using `display: flex` and `gap: 20px`.
3. Use `align-items: stretch` so they are equal height.
4. Make the button inside each card push to the bottom using `margin-top: auto` (requires the card to be `display: flex; flex-direction: column;`).

---

## 📝 Assignment: Portfolio Project — Part 5

Let's use Flexbox to arrange your portfolio!

### Requirements
1. Open your portfolio from Lecture 4.
2. Update your `<nav>` links to sit horizontally using `display: flex; justify-content: center; gap: 1.5rem;`.
3. In your `<section id="home">` (hero section), use Flexbox to vertically and horizontally center your name and headline. Set its minimum height to `100vh`.
4. In your `<section id="skills">`, change your skills list into a flexible grid. Set `display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;`. Style the individual `<li>` elements to look like little badges (give them background color, padding, and border-radius).
5. Ensure your contact form from Lecture 02 uses Flexbox to stack the labels and inputs cleanly (`flex-direction: column; gap: 1rem;`).

### Optional Bonus
Update the layout of the projects section so your project cards sit side-by-side on large screens, wrapping naturally as the screen gets smaller using `flex-wrap: wrap`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Flexbox Froggy | https://flexboxfroggy.com/ |
| CSS-Tricks — Flexbox Guide | https://css-tricks.com/snippets/css/a-guide-to-flexbox/ |

---

## 📌 Key Takeaways
- Set `display: flex` on the **parent** — its direct children become flex items.
- `justify-content` distributes along the **main axis**; `align-items` aligns along the **cross axis**.
- `flex: 1` makes items share space equally.
- `gap` adds spacing between items without margin hacks.
- Perfect centring is just `justify-content: center; align-items: center;`.

---

**Next Lecture:** [Lecture 06 — Modern Layout: CSS Grid →](./06%20-%20Modern%20Layout%20—%20CSS%20Grid.md)