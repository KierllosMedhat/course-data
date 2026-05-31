# Lecture 08 — CSS Animations, Transitions & Advanced Effects

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create smooth state transitions with the `transition` property
- Define multi-step animations with `@keyframes`
- Animate elements from `display: none` using the modern `@starting-style`
- Use 2D and 3D transforms to move, scale, rotate, and flip elements
- Apply visual effects: box shadows, text shadows, and CSS gradients
- Build modern Scroll-Driven Animations without JavaScript
- Respect user accessibility preferences with `prefers-reduced-motion`

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. Transitions: `property`, `duration`, `timing-function`, `delay`
2. Modern Transitions: Animating entry with `@starting-style`
3. Keyframes: `@keyframes`, `animation-name`, `fill-mode`
4. Transforms: `translate`, `scale`, `rotate`, `3D perspective`
5. Advanced Effects: shadows and gradients
6. Modern Scroll-Driven Animations (`animation-timeline`)
7. Performance & Accessibility (`will-change`, `prefers-reduced-motion`)

### Part 2 — Practice & Lab (~90–120 min)
1. Hover-animated product cards with 3D flips
2. Scroll-driven reading progress bar
3. Portfolio Project Part 8: Animations & Polish

---

## 1. CSS Transitions

A transition smoothly animates a property change over time instead of switching instantly.

```css
.btn {
  background-color: blue;
  /* transition: property duration timing-function delay; */
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: red;
}
```

### Timing Functions
- `ease` (default — starts slow, speeds up, ends slow)
- `linear` (constant speed)
- `ease-in` (starts slow, ends fast)
- `ease-out` (starts fast, ends slow)
- `cubic-bezier(...)` (custom curve)

---

## 2. Modern Transitions: `@starting-style`

Historically, you **could not** transition an element from `display: none` to `display: block`. It would just snap into existence.
In modern CSS, we use `@starting-style` to define the "before it entered" state!

```css
dialog {
  display: block; /* The browser needs to know it's rendered */
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s, transform 0.5s, display 0.5s allow-discrete;
}

/* This applies ONLY when the element is first rendered (e.g. dialog.showModal()) */
@starting-style {
  dialog {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```
**Note:** You must add `allow-discrete` to your transition to tell the browser to wait for the opacity animation before fully removing the element on exit.

---

## 3. Keyframe Animations

Keyframe animations can run **automatically** and have **multiple steps**.

```css
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.alert {
  /* name | duration | timing | count | fill-mode */
  animation: pulse 2s ease-in-out infinite;
}
```

> [!NOTE]
> Use `animation-fill-mode: forwards` to keep the element at its final keyframe style after the animation ends.

---

## 4. 2D & 3D Transforms

Transforms change an element's visual appearance without affecting the layout around it.

### 2D Transforms
- `translate(x, y)`: Moves the element
- `scale(x, y)`: Resizes the element
- `rotate(angle)`: Rotates the element (`rotate(45deg)`)

### 3D Transforms (Card Flip)
To create 3D depth, you need to set a `perspective` on the parent, keep children in 3D space (`transform-style`), and hide their backs (`backface-visibility`).

```css
.card-container { perspective: 800px; }
.card { transform-style: preserve-3d; transition: transform 0.6s; }
.card:hover { transform: rotateY(180deg); }
.card-front, .card-back { backface-visibility: hidden; }
.card-back { transform: rotateY(180deg); }
```

---

## 5. Shadows & Gradients

Create depth without images!

### Box Shadow
```css
/* x-offset | y-offset | blur | spread | color */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Gradients
```css
background: linear-gradient(135deg, #667eea, #764ba2);
```

---

## 6. Modern Scroll-Driven Animations

Historically, triggering animations based on scroll position required heavy JavaScript libraries (like GSAP or ScrollMagic).
Today, CSS can do it natively using `animation-timeline`!

### Example: A Reading Progress Bar
This bar grows from 0% to 100% width as you scroll down the page.

```css
@keyframes grow-progress {
  from { width: 0%; }
  to { width: 100%; }
}

.progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 5px;
  background: blue;
  
  /* Link the animation to the scroll progress! */
  animation: grow-progress linear;
  animation-timeline: scroll(root block);
}
```
As you scroll, the browser scrubs through the `grow-progress` keyframes automatically!

---

## 7. Performance & Accessibility

### Performance: The 60fps Rule
Animating `width`, `height`, or `margin` triggers **layout recalculation** (slow).
Animating `transform` and `opacity` is handled by the GPU (fast). **Always prefer `transform`.**

### Accessibility: `prefers-reduced-motion`
Some users experience motion sickness. Always respect their OS settings:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧪 Practice Labs

### Lab 1: 3D Flip Cards (30 min)
1. Open `labs/lab1-flip-cards/index.html`.
2. Build a product card that flips over when hovered to reveal more details.
3. Use `perspective`, `transform-style`, and `backface-visibility`.

### Lab 2: Scroll-Driven Progress (30 min)
1. Open `labs/lab2-scroll-progress/index.html`.
2. Implement a fixed reading progress bar at the top of the screen.
3. Link its width to the scroll position using `animation-timeline: scroll()`.

---

## 📝 Assignment: Portfolio Project — Part 8 (Module 1 Finale)

Congratulations! It's time to put the final polish on your Developer Portfolio.

### Requirements
1. **Interactive Buttons:** Add a `transition` to your buttons so they scale up slightly (`transform: scale(1.05)`) and increase their `box-shadow` on hover.
2. **Smooth Dialog Entry:** Use `@starting-style` to make your "Hire Me" `<dialog>` fade in (`opacity`) and slide down (`translateY`) smoothly when it opens, rather than snapping in.
3. **Scroll Animations:** Link an `@keyframes` animation to `animation-timeline: view()` on your Project Cards, so they fade in slightly as they scroll into view.
4. **Accessibility:** Add a `prefers-reduced-motion` media query at the bottom of your stylesheet to disable your new animations for users who prefer no motion.
5. **Final Review:** Validate your HTML and CSS, ensure your site is perfectly responsive on all devices, and verify your design tokens (`oklch`).

You now have a fully functional, highly modern, responsive HTML/CSS Developer Portfolio!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| CSS Scroll-Driven Animations | https://scroll-driven-animations.style/ |
| MDN — `@starting-style` | https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style |
| Easings.net | https://easings.net/ |

---

## 📌 Key Takeaways
- **Transitions** smooth state changes (hover). **Keyframes** define automatic, multi-step animations.
- Use `@starting-style` to animate entry from `display: none`.
- Use `animation-timeline` to link animations to scrolling natively in CSS.
- **Always** animate `transform` and `opacity` for 60fps performance.
- **Always** include `prefers-reduced-motion` for accessibility.

🎉 **Congratulations!** You've completed Module 1 — HTML5 & CSS3.

---

**Next Lecture:** [Lecture 09 — JavaScript Basics: Syntax, Types & Control Flow](./09%20-%20JavaScript%20Basics%20—%20Syntax,%20Types%20%26%20Control%20Flow.md) — Module 2 begins!
