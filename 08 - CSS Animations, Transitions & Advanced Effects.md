# Lecture 08 — CSS Animations, Transitions & Advanced Effects

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Create smooth CSS transitions on hover, focus, and state changes
- Build multi-step animations using `@keyframes`
- Use 2D and 3D CSS transforms (`translate`, `rotate`, `scale`, `perspective`)
- Apply `box-shadow`, `text-shadow`, and gradient effects
- Build scroll-driven animations using the modern Scroll Timeline API
- Optimize animation performance using `will-change` and GPU-composited properties
- Respect user accessibility with `prefers-reduced-motion`

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. CSS Transitions
2. CSS Keyframe Animations
3. CSS Transforms (2D & 3D)
4. Shadows & Gradients
5. Scroll-Driven Animations
6. Performance & Accessibility

### Part 2 — Practice / Lab (~90 min)
1. Lab 1: 3D Flip Cards
2. Lab 2: Scroll-Driven Progress Bar

---

## 1. CSS Transitions

Transitions smoothly animate a property from one value to another when it changes (e.g., on hover).

**Analogy:** A light dimmer. Instead of snapping from off to on, the brightness gradually increases.

### The 4 Transition Properties

```css
.button {
  background: #6366f1;
  transition-property: background, transform;  /* WHAT to animate */
  transition-duration: 0.3s;                   /* HOW LONG */
  transition-timing-function: ease;            /* SPEED CURVE */
  transition-delay: 0s;                        /* WAIT before starting */
}

.button:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}
```

### Shorthand

```css
/* property | duration | timing-function | delay */
transition: all 0.3s ease 0s;

/* Multiple properties */
transition: background 0.3s ease, transform 0.2s ease;
```

### Timing Functions

| Function | Behavior |
|----------|----------|
| `ease` | Slow start, fast middle, slow end (default) |
| `linear` | Constant speed |
| `ease-in` | Starts slow, ends fast |
| `ease-out` | Starts fast, ends slow |
| `ease-in-out` | Slow at both ends |
| `cubic-bezier(x1,y1,x2,y2)` | Custom curve |

> [!TIP]
> Only certain properties can be transitioned — numeric values like `color`, `opacity`, `transform`, `width`, `height`. You cannot transition `display` or `font-family`.

---

## 2. CSS Keyframe Animations

Transitions only animate between two states (A → B). Keyframe animations can animate through **multiple steps**.

### Defining a Keyframe Animation

```css
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Applying the Animation

```css
.hero-text {
  animation-name: fadeSlideIn;
  animation-duration: 0.6s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: forwards;    /* Keep the final state after animation ends */
  animation-iteration-count: 1;     /* Run once (use `infinite` for looping) */
}
```

### Shorthand

```css
/* name | duration | timing | delay | count | direction | fill-mode */
animation: fadeSlideIn 0.6s ease-out 0.2s 1 normal forwards;
```

### Multi-Step Keyframes

```css
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.cta-button {
  animation: pulse 2s ease-in-out infinite; /* Loops forever */
}
```

### `animation-fill-mode` Explained

| Value | Behavior |
|-------|----------|
| `none` | Element reverts to original state after animation (default) |
| `forwards` | Element keeps the styles from the **last keyframe** |
| `backwards` | Element applies styles from the **first keyframe** during the delay |
| `both` | Combines `forwards` and `backwards` |

---

## 3. CSS Transforms (2D)

Transforms change an element's visual appearance **without affecting layout** — other elements don't move.

```css
.card:hover {
  transform: translateY(-8px) scale(1.02); /* Lift up and grow slightly */
}
```

| Function | What it does | Example |
|----------|-------------|---------|
| `translate(x, y)` | Moves element | `translateY(-10px)` |
| `rotate(angle)` | Rotates element | `rotate(45deg)` |
| `scale(x, y)` | Resizes element | `scale(1.1)` |
| `skew(x, y)` | Slants element | `skewX(5deg)` |

> [!NOTE]
> You can chain transforms: `transform: rotate(10deg) scale(1.2) translateX(20px);`  
> Order matters! Transforms are applied right-to-left.

---

## 4. CSS Transforms (3D)

Add `perspective` to the parent to enable 3D depth:

```css
.card-container {
  perspective: 800px; /* Lower = more dramatic 3D effect */
}

.card {
  transform-style: preserve-3d; /* Children participate in 3D space */
  transition: transform 0.6s ease;
}

.card:hover {
  transform: rotateY(180deg); /* Flip the card */
}
```

### 3D Card Flip Pattern

```css
.card-front, .card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden; /* Hide the back when facing away */
}

.card-back {
  transform: rotateY(180deg); /* Pre-rotated so it's hidden initially */
}
```

---

## 5. Shadows & Gradients

### Box Shadows

```css
/* offset-x | offset-y | blur | spread | color */
.card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
}

/* Inset shadow (inner shadow) */
.input:focus {
  box-shadow: inset 0 0 0 3px #6366f1;
}
```

### Text Shadows

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

### Gradients

```css
/* Linear gradient */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Radial gradient */
.spotlight {
  background: radial-gradient(circle at center, #fff 0%, transparent 70%);
}
```

---

## 6. Scroll-Driven Animations

The modern Scroll Timeline API lets you tie animations to scroll position — no JavaScript needed.

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section {
  animation: reveal linear both;
  animation-timeline: view();          /* Tied to element entering viewport */
  animation-range: entry 0% entry 100%; /* Run while entering the viewport */
}
```

### Scroll Progress Bar

```css
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: #6366f1;
  transform-origin: left;
  animation: grow linear;
  animation-timeline: scroll();  /* Tied to page scroll */
}

@keyframes grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

> [!NOTE]
> Scroll-driven animations are supported in Chrome 115+ and Edge. Check browser support before using in production.

---

## 7. Performance & Best Practices

Only **3 properties** are GPU-composited (hardware-accelerated) and safe to animate at 60fps:
- `transform`
- `opacity`
- `filter`

Animating `width`, `height`, `margin`, `padding`, `top`, `left` forces the browser to recalculate layout every frame — causing jank.

```css
/* ❌ Bad: animating width triggers layout recalculation */
.bad { transition: width 0.3s; }

/* ✅ Good: animating transform uses GPU */
.good { transition: transform 0.3s; }
```

Use `will-change` sparingly to hint the browser to pre-optimize:

```css
.animated-element {
  will-change: transform, opacity; /* Pre-allocate GPU layer */
}
```

> [!WARNING]
> Don't slap `will-change` on everything — each element with `will-change` gets its own GPU layer, consuming memory.

---

## 8. Accessibility: `prefers-reduced-motion`

Always respect users who experience motion sickness:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Common Mistakes & How to Avoid Them

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Animating `width`/`height`/`left`/`top` | Use `transform: translate()` and `transform: scale()` instead |
| Forgetting `animation-fill-mode: forwards` | Without it, the element snaps back to its original state |
| Using `transition: all` | Specify exact properties — `all` can trigger unintended transitions |
| Not setting `backface-visibility: hidden` on flip cards | Both sides will be visible simultaneously |
| Ignoring `prefers-reduced-motion` | Always add the reduce-motion media query |
| Adding `will-change` to every element | Use it only on elements that are actually animated |

---

## 🧪 Practice Labs

### Lab 1 — 3D Flip Cards (45 min)
1. Create `labs/lab1-flip/index.html` with 3 card elements
2. Each card has a `.card-front` (product image + name) and `.card-back` (description + price)
3. On hover, the card flips 180° on the Y-axis
4. Use `perspective` on the container, `transform-style: preserve-3d` on the card
5. Add `backface-visibility: hidden` to both faces
6. Add a smooth `transition: transform 0.6s ease`

### Lab 2 — Scroll-Driven Progress Bar (45 min)
1. Create `labs/lab2-scroll/index.html` with a long page (multiple sections)
2. Add a fixed progress bar at the top using `animation-timeline: scroll()`
3. Add `@keyframes reveal` animations on each section that trigger on scroll using `animation-timeline: view()`
4. Ensure all animations are disabled inside `@media (prefers-reduced-motion: reduce)`

---

## 📝 Assignment: Portfolio Project — Part 8

Add animation polish to your portfolio.

### Requirements
1. Add hover transitions to all buttons and links (color, background, transform)
2. Add a `@keyframes fadeSlideIn` animation to the hero section content
3. Add hover lift effects to project cards (`translateY(-8px)` + deeper `box-shadow`)
4. Add at least one CSS gradient (hero background or a section divider)
5. Add a scroll-driven progress bar at the top of the page
6. Wrap ALL animations in a `prefers-reduced-motion: reduce` override

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN: CSS Transitions | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions |
| MDN: CSS Animations | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations |
| MDN: Scroll-Driven Animations | https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline |
| Cubic Bezier Generator | https://cubic-bezier.com/ |
| CSS Triggers (Performance) | https://csstriggers.com/ |

---

## 📌 Key Takeaways
- **Transitions** animate between two states (A → B) on events like `:hover`
- **Keyframe animations** animate through multiple steps and can loop infinitely
- **Transforms** (translate, rotate, scale) change appearance without affecting layout — and are GPU-accelerated
- Only animate `transform`, `opacity`, and `filter` for smooth 60fps performance
- **3D transforms** require `perspective` on the parent and `transform-style: preserve-3d`
- **Scroll-driven animations** tie CSS animations to scroll position — no JavaScript needed
- **Always** add `prefers-reduced-motion: reduce` to respect users with motion sensitivities

---

**Next Lecture:** [Lecture 09 — JavaScript Basics: Syntax, Types & Control Flow](./09%20-%20JavaScript%20Basics%20-%20Syntax,%20Types%20%26%20Control%20Flow.md)
