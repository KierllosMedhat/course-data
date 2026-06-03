# 08 - CSS Animations, Transitions & Advanced Effects

---

**Course:** Fullstack Web Development  
**Instructor:** [Your Instructor Name]  
**Duration:** 3 hours (including labs)

---

## Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Agenda](#agenda)
3. [CSS Transitions](#css-transitions)
4. [CSS Keyframe Animations](#css-keyframe-animations)
5. [CSS Transforms (2D)](#css-transforms-2d)
6. [CSS Transforms (3D)](#css-transforms-3d)
7. [Box Shadows & Text Shadows](#box-shadows--text-shadows)
8. [CSS Gradients](#css-gradients)
9. [Scroll-Driven Animations](#scroll-driven-animations)
10. [Performance & Best Practices](#performance--best-practices)
11. [Accessibility: prefers-reduced-motion](#accessibility-prefers-reduced-motion)
12. [Lab 1: 3D Flip Cards](#lab-1-3d-flip-cards)
13. [Lab 2: Scroll-Driven Progress Bar](#lab-2-scroll-driven-progress-bar)
14. [Assignment: Portfolio Project Part 8](#assignment-portfolio-project-part-8)
15. [Resources](#resources)
16. [Key Takeaways](#key-takeaways)
17. [Common Mistakes & How to Avoid Them](#common-mistakes--how-to-avoid-them)

---

## Learning Objectives

By the end of this module, you will be able to:

- Explain what CSS transitions are and when to use them versus keyframe animations
- Write `transition` shorthand with all four sub-properties
- Choose appropriate timing functions (`ease`, `linear`, `ease-in`, `ease-out`, `cubic-bezier`)
- Build multi-step animations using `@keyframes`
- Use all `animation-*` sub-properties including `fill-mode`, `play-state`, and `direction`
- Apply 2D transforms (translate, scale, rotate, skew) and understand `transform-origin`
- Build a fully interactive 3D card flip using `perspective`, `rotateY`, and `backface-visibility`
- Create layered box shadows and text shadows for depth
- Use `linear-gradient`, `radial-gradient`, and `conic-gradient`
- Implement modern scroll-driven animations using `animation-timeline: scroll()` and `view()`
- Explain *why* `transform` and `opacity` are fast to animate (compositor thread)
- Use `will-change` correctly and avoid common pitfalls
- Respect user accessibility preferences with `prefers-reduced-motion`

---

## Agenda

| Time | Topic |
|------|-------|
| 0:00 – 0:20 | What are CSS Transitions and why do they matter? |
| 0:20 – 0:40 | The `transition` property deep-dive |
| 0:40 – 1:00 | Timing functions and `@starting-style` |
| 1:00 – 1:25 | Keyframe animations and the `animation` shorthand |
| 1:25 – 1:50 | 2D & 3D Transforms |
| 1:50 – 2:10 | Shadows & Gradients |
| 2:10 – 2:25 | Scroll-Driven Animations |
| 2:25 – 2:40 | Performance & Accessibility |
| 2:40 – 3:00 | Labs & Assignment overview |

---

## CSS Transitions

### What Is a CSS Transition? (And Why Does It Matter?)

Imagine you are walking into a room and someone is changing a light bulb. There are two ways this could happen:

1. **Snap:** You blink and suddenly the room is a different colour. Jarring. Disorienting.
2. **Smooth:** The light gradually shifts from one colour to the next. Comfortable. Natural.

That is exactly what CSS transitions do. Without them, every property change on an element happens **instantly** — one frame you see the old value, the next frame you see the new value. This snap feels cheap and unpolished. A transition tells the browser: *"take X seconds to smoothly interpolate from the old value to the new value."*

**Why does this matter for UX?**

- Smooth state changes give users **visual feedback** — they see *what* changed and *how*.
- Transitions make interactions feel **responsive and alive** without overwhelming the user.
- They signal affordance: a button that subtly grows on hover *feels* clickable.
- Research consistently shows that micro-animations increase perceived quality and trust in web products.

> [!NOTE]
> Transitions are **reactive** — they only play when a CSS property changes (e.g., on `:hover`, when a class is toggled by JavaScript). They do NOT play automatically on page load.

---

### The `transition` Property

The `transition` property is actually a shorthand for four separate sub-properties. Think of each one as answering a specific question:

```
transition: [property] [duration] [timing-function] [delay];
```

| Sub-property | Question it answers | Default value |
|---|---|---|
| `transition-property` | *Which CSS property should animate?* | `all` |
| `transition-duration` | *How long does the animation take?* | `0s` |
| `transition-timing-function` | *How does it speed up/slow down along the way?* | `ease` |
| `transition-delay` | *How long to wait before starting?* | `0s` |

> [!IMPORTANT]
> Without a `transition-duration`, the transition does absolutely nothing — it defaults to `0s`, which means instant. Always set a duration.

---

#### Sub-property 1: `transition-property`

This tells the browser *which CSS property* to watch for changes. When that property changes value, the transition plays.

```css
/* Only animate the background-color when it changes */
.button {
  background-color: royalblue;
  transition-property: background-color;
  transition-duration: 300ms;
}

.button:hover {
  background-color: navy; /* This change will now be animated */
}
```

You can specify multiple properties separated by commas:

```css
.card {
  transition-property: transform, box-shadow, opacity;
  transition-duration: 300ms;
}
```

---

#### Sub-property 2: `transition-duration`

How long the animation takes. You can use seconds (`s`) or milliseconds (`ms`).

```css
/* These are equivalent */
transition-duration: 0.3s;
transition-duration: 300ms;
```

**Rule of thumb for durations:**
- Micro-interactions (hover, button press): **100ms – 200ms** — snappy, feels immediate
- UI transitions (panel open, modal appear): **200ms – 400ms** — smooth but not slow
- Page-level transitions: **300ms – 600ms** — cinematic but not frustrating
- Anything over 1 second feels slow for interactive elements

---

#### Sub-property 3: `transition-timing-function`

This controls the *speed curve* — how fast the animation moves at different points in time.

Think of driving a car:
- **`ease`** — You accelerate from a stop, cruise at speed, then gently brake. Comfortable. This is the default.
- **`linear`** — Constant speed the whole way. Robotic. Good for spinners or looping animations, but unnatural for most interactions.
- **`ease-in`** — You start slow and build up speed. Good for things **leaving** the screen (they speed up as they go).
- **`ease-out`** — You start fast and decelerate. Good for things **entering** the screen (they naturally slow to a stop).
- **`ease-in-out`** — Slow start, full speed in middle, slow end. Elegant for things moving across the screen.

```
Time →
ease:        ___/‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
linear:      /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
ease-in:     _____________________/‾
ease-out:    ‾\___________________
ease-in-out: ___/‾‾‾‾‾‾‾‾‾‾‾‾‾\___
```

Visual representation of the curves:

```
Value (0→1)
  1 |         .....ease.....
    |       ..             ..
    |     . linear /         .
    |    .       /            .
  0 |___._______/_______________.___ Time (0→1)
    0                               1
```

---

##### `cubic-bezier()` — Custom Timing Functions

Every timing function keyword is actually a shorthand for a `cubic-bezier()` curve. A Bézier curve is defined by 4 control points.

```
cubic-bezier(x1, y1, x2, y2)
```

Think of it like a graph where:
- X axis = time (0 = start, 1 = end)
- Y axis = progress (0 = no change, 1 = full change)
- `x1, y1` = position of the first "handle"
- `x2, y2` = position of the second "handle"

The keywords map to these values:

```css
/* These are equivalent pairs: */
ease          → cubic-bezier(0.25, 0.1, 0.25, 1.0)
linear        → cubic-bezier(0.0, 0.0, 1.0, 1.0)
ease-in       → cubic-bezier(0.42, 0, 1.0, 1.0)
ease-out      → cubic-bezier(0, 0, 0.58, 1.0)
ease-in-out   → cubic-bezier(0.42, 0, 0.58, 1.0)
```

You can create custom curves at [cubic-bezier.com](https://cubic-bezier.com). Examples:

```css
/* Springy overshoot effect — goes slightly past then bounces back */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Very snappy start, lingering end */
transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
```

---

#### Sub-property 4: `transition-delay`

How long to wait *before* the animation starts. Useful for staggered effects or preventing accidental hover triggers.

```css
.tooltip {
  opacity: 0;
  /* Don't show the tooltip until the user has hovered for 300ms
     This prevents it from flashing when the mouse passes through */
  transition: opacity 200ms ease 300ms;
  /*                              ↑ This is the delay */
}

.trigger:hover .tooltip {
  opacity: 1;
}
```

---

### The Full Shorthand

Putting it all together in one line:

```css
.element {
  /* property | duration | timing-function | delay */
  transition: background-color 300ms ease-out 0s;
}
```

For multiple properties, separate with commas:

```css
.card {
  /* Each comma-separated group has its own timing */
  transition:
    transform 300ms ease-out,      /* transform snaps out quickly */
    box-shadow 300ms ease-out,     /* box-shadow matches transform */
    opacity 200ms ease 100ms;      /* opacity starts 100ms after the others */
}
```

---

### ⚠️ The `transition: all` Warning

It is tempting to write `transition: all 300ms ease` so that everything animates. **Resist this temptation.**

```css
/* ❌ DON'T DO THIS */
.element {
  transition: all 300ms ease;
}
```

**Why is this bad?**

1. **Performance:** The browser now has to watch *every* CSS property for changes. This includes properties you did not intend to animate (like `width`, `height`, `display`, `color`), causing unnecessary work.
2. **Bugs:** If you change a layout property like `height` or `padding` in JavaScript, it will now animate too — possibly in a way you did not want.
3. **Maintenance:** It is unclear which properties are supposed to animate. Future developers (including you) will be confused.

```css
/* ✅ DO THIS INSTEAD — be explicit */
.element {
  transition: background-color 300ms ease, transform 300ms ease;
}
```

> [!WARNING]
> `transition: all` can cause subtle performance issues and unexpected animations. Always name the specific properties you intend to transition.

---

### Complete Transition Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Button Transition</title>
  <style>
    /* Base button state */
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background-color: #6366f1;   /* indigo */
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;

      /* Define transitions ONLY on the base state, not the :hover state.
         This ensures the transition plays both ways (in AND out). */
      transition:
        background-color 200ms ease-out,
        transform 150ms ease-out,
        box-shadow 200ms ease-out;
    }

    /* Hover state — only defines the END values, not the transition */
    .btn:hover {
      background-color: #4f46e5;   /* slightly darker indigo */
      transform: translateY(-2px); /* lifts the button up slightly */
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4); /* glowing shadow below */
    }

    /* Active (clicked) state */
    .btn:active {
      transform: translateY(0);    /* button "presses in" */
      box-shadow: none;
    }
  </style>
</head>
<body>
  <button class="btn">Hover over me!</button>
</body>
</html>
```

> [!TIP]
> Always put the `transition` property on the **base state** (`.btn`), not on the `:hover` state. If you put it on `:hover`, the transition only plays going *into* the hover state — reverting back to normal will be instant. Putting it on the base state makes it animate in both directions.

---

### `@starting-style` — Animating Entry from `display: none`

One historical limitation of CSS transitions was that you could not animate an element that starts from `display: none`, because `display` is not interpolatable — it cannot be gradually changed. So any element that goes from `display: none` to `display: block` would always snap, even with transitions defined.

**The `@starting-style` rule solves this.** It lets you define what the styles should be *before* an element is first rendered (or first displayed), allowing transitions to play on entry.

```css
/* The element in its normal shown state */
.dialog {
  display: block;           /* Shown */
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease, transform 300ms ease;

  /* @starting-style defines the INITIAL style before the element appears */
  @starting-style {
    opacity: 0;             /* Starts invisible */
    transform: translateY(-20px); /* Starts above its final position */
  }
}

/* When hidden — transition plays on the way OUT too */
.dialog[hidden] {
  display: none;
  opacity: 0;
  transform: translateY(-20px);
}
```

> [!NOTE]
> `@starting-style` is a modern feature (Chrome 117+, Firefox 129+). Check [Can I Use](https://caniuse.com/?search=starting-style) for current support. For older browsers, JavaScript-based class toggling is a reliable fallback.

---

### Section Recap: CSS Transitions

- A transition smoothly interpolates a CSS property from one value to another over time
- The `transition` shorthand has 4 parts: `property duration timing-function delay`
- Always set `transition-duration` — the default is `0s` (instant)
- Choose timing functions based on whether an element is entering or leaving
- Use `cubic-bezier()` for custom curves
- Avoid `transition: all` — be explicit about which properties animate
- Put the `transition` rule on the **base state**, not the hover/active state
- `@starting-style` allows transitions to play when an element first appears from `display: none`

---

## CSS Keyframe Animations

### Transitions vs. Keyframe Animations

You now know that transitions are **triggered** — they react to a change in CSS property value. But what if you want an animation that:

- **Plays automatically** on page load?
- **Loops continuously** (like a loading spinner)?
- **Has multiple intermediate steps** (not just A → B but A → B → C → D)?
- **Controls its own timing independently** of user interaction?

That is where **keyframe animations** come in.

Think of it like this:

| Feature | Transitions | Keyframe Animations |
|---|---|---|
| Triggered by | Property change (hover, JS class toggle) | Defined by the animation itself |
| Steps | 2 (start → end) | Unlimited (`from/to` or `0%` to `100%`) |
| Looping | No | Yes (`animation-iteration-count: infinite`) |
| Auto-play | No | Yes |
| Direction control | No | Yes (`animation-direction`) |
| Fill-mode control | No | Yes (`animation-fill-mode`) |

---

### `@keyframes` Syntax

The `@keyframes` rule is where you define the animation's "script" — the exact values at specific points in time.

```css
/* Define an animation named "fadeIn" */
@keyframes fadeIn {
  /* "from" is equivalent to 0% — the start */
  from {
    opacity: 0;           /* Element starts invisible */
    transform: translateY(20px); /* Starts 20px below its final position */
  }

  /* "to" is equivalent to 100% — the end */
  to {
    opacity: 1;           /* Element ends fully visible */
    transform: translateY(0);    /* Arrives at its natural position */
  }
}
```

You can also use percentage stops for more complex animations:

```css
/* A bouncing animation with 5 steps */
@keyframes bounce {
  0% {
    transform: translateY(0);    /* Starts at natural position */
  }
  20% {
    transform: translateY(-30px); /* Jumps up */
  }
  40% {
    transform: translateY(0);    /* Falls back down */
  }
  60% {
    transform: translateY(-15px); /* Smaller bounce */
  }
  80% {
    transform: translateY(0);    /* Falls back */
  }
  100% {
    transform: translateY(0);    /* Settles */
  }
}
```

```
Animation timeline visualization:

0%  →  20%  →  40%  →  60%  →  80%  →  100%
 ●       ●       ●       ●       ●        ●
 |       |       |       |       |        |
 0     -30px     0     -15px     0        0
 ↕       ↑       ↓       ↑       ↓        ↕
(start) (up)  (down)   (up)  (down)    (end)
```

---

### Applying Animations with the `animation` Property

Just like `transition`, `animation` is a shorthand. The full syntax is:

```
animation: [name] [duration] [timing-function] [delay] [iteration-count] [direction] [fill-mode] [play-state];
```

Let us break each part down:

---

#### `animation-name`

The name of the `@keyframes` rule to use.

```css
.element {
  animation-name: fadeIn; /* Must match an @keyframes name exactly */
}
```

---

#### `animation-duration`

How long one cycle of the animation takes. Same as `transition-duration`.

```css
.element {
  animation-duration: 600ms;
}
```

---

#### `animation-timing-function`

Same as `transition-timing-function`. The speed curve for the animation.

```css
.element {
  animation-timing-function: ease-out;
}
```

---

#### `animation-delay`

How long to wait before the animation starts. Useful for staggered entrance effects.

```css
/* Each list item enters 100ms after the previous one */
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 100ms; }
.list-item:nth-child(3) { animation-delay: 200ms; }
.list-item:nth-child(4) { animation-delay: 300ms; }
```

> [!TIP]
> You can use **negative delay values** to make an animation start as if it already partway through. `animation-delay: -500ms` with a 1-second animation means it starts playing from the halfway point.

---

#### `animation-iteration-count`

How many times the animation plays.

```css
/* Play once (default) */
animation-iteration-count: 1;

/* Play exactly 3 times */
animation-iteration-count: 3;

/* Loop forever */
animation-iteration-count: infinite;

/* Play 2.5 times — stops halfway through the 3rd cycle */
animation-iteration-count: 2.5;
```

---

#### `animation-direction`

Which direction the animation plays in each cycle. This only matters for animations with more than one iteration.

```css
/* Normal: always plays from 0% → 100% */
animation-direction: normal;

/* Reverse: always plays from 100% → 0% */
animation-direction: reverse;

/* Alternate: first cycle is 0%→100%, second is 100%→0%, etc.
   Great for ping-pong effects */
animation-direction: alternate;

/* Alternate-reverse: first cycle is 100%→0%, second is 0%→100% */
animation-direction: alternate-reverse;
```

```
Normal:            0% → 100% | 0% → 100% | 0% → 100%
Reverse:           100% → 0% | 100% → 0% | 100% → 0%
Alternate:         0% → 100% | 100% → 0% | 0% → 100%
Alternate-reverse: 100% → 0% | 0% → 100% | 100% → 0%
```

---

#### `animation-fill-mode`

This is one of the most misunderstood properties. It determines what styles are applied to the element **before and after** the animation plays.

```
Timeline:
         [delay] → [animation plays] → [after animation]
fill-mode affects:     ↑ this gap           ↑ this gap
```

```css
/* none (default): Element has its normal styles before AND after.
   The animation styles only exist WHILE playing. */
animation-fill-mode: none;

/* forwards: After the animation finishes, hold the FINAL keyframe's styles.
   Without this, the element snaps back to its original style when done. */
animation-fill-mode: forwards;

/* backwards: During the delay period, apply the FIRST keyframe's styles.
   Without this, the original styles show during the delay. */
animation-fill-mode: backwards;

/* both: Apply backwards during delay, AND hold forwards after finishing. */
animation-fill-mode: both;
```

**Real-world example showing why `forwards` matters:**

```css
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

/* ❌ Without forwards: The element disappears after animation ends!
   (It snaps back to whatever transform/opacity was in the base CSS) */
.card {
  opacity: 0;
  animation: slideIn 500ms ease-out;
}

/* ✅ With forwards: The element stays at the final keyframe values */
.card {
  opacity: 0;
  animation: slideIn 500ms ease-out forwards;
}
```

---

#### `animation-play-state`

Controls whether the animation is currently playing or paused. The magic of this property is that you can toggle it with CSS (e.g., on hover) or JavaScript.

```css
/* A continuously spinning loader */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
  /* animation-play-state defaults to "running" */
}

/* Pause the spinner when hovering over it */
.spinner:hover {
  animation-play-state: paused;
}
```

```javascript
// Or control it with JavaScript
const spinner = document.querySelector('.spinner');

// Pause
spinner.style.animationPlayState = 'paused';

// Resume
spinner.style.animationPlayState = 'running';
```

---

### Full Animation Shorthand Examples

```css
/* All 8 sub-properties in one line: */
/* name | duration | timing | delay | iterations | direction | fill-mode | play-state */
.element {
  animation: fadeIn 600ms ease-out 200ms 1 normal forwards running;
}

/* In practice, most of these are defaults, so you usually write: */
.element {
  animation: fadeIn 600ms ease-out 200ms forwards;
}

/* Multiple animations separated by commas: */
.element {
  animation:
    fadeIn 600ms ease-out forwards,   /* fade in once */
    pulse 2s ease-in-out 600ms infinite; /* then pulse forever starting at 600ms */
}
```

---

### Practical Keyframe Animation Examples

```css
/* ---- 1. Fade In (classic entrance) ---- */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-text {
  animation: fadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ---- 2. Pulse (attention-grabber) ---- */
@keyframes pulse {
  0%, 100% { transform: scale(1); }      /* Normal size at start and end */
  50%       { transform: scale(1.05); }  /* Slightly larger in the middle */
}

.badge {
  animation: pulse 2s ease-in-out infinite;
}

/* ---- 3. Shimmer (loading skeleton) ---- */
@keyframes shimmer {
  0%   { background-position: -200% center; } /* Gradient off-screen to the left */
  100% { background-position: 200% center; }  /* Gradient off-screen to the right */
}

.skeleton {
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,   /* Gray */
    #f3f4f6 50%,   /* Lighter gray (the shimmer) */
    #e5e7eb 75%    /* Gray again */
  );
  background-size: 200% 100%; /* Wide background so we can pan across it */
  animation: shimmer 1.5s linear infinite;
}

/* ---- 4. Typewriter effect ---- */
@keyframes typing {
  from { width: 0; }       /* No text visible */
  to   { width: 100%; }    /* Full text visible */
}
@keyframes blink-cursor {
  50% { border-color: transparent; } /* Makes the cursor blink */
}

.typewriter {
  overflow: hidden;            /* Hides overflow — the magic of the effect */
  border-right: 3px solid;    /* The "cursor" */
  white-space: nowrap;         /* Keeps text on one line */
  width: 0;                   /* Start with no width */
  animation:
    typing 3s steps(30, end) forwards,      /* Step through 30 characters */
    blink-cursor 0.75s step-end infinite;   /* Blink cursor */
}
```

> [!NOTE]
> The `steps()` timing function (used in the typewriter effect) jumps between discrete states rather than smoothly interpolating. `steps(30, end)` means: jump 30 times, with each jump happening at the END of the interval. This creates the character-by-character typing effect.

---

### Section Recap: CSS Keyframe Animations

- Keyframe animations are defined with `@keyframes` and applied with the `animation` property
- Use `from/to` for two-step animations, or percentage stops for multi-step sequences
- The `animation` shorthand has 8 sub-properties: name, duration, timing, delay, iteration-count, direction, fill-mode, play-state
- `animation-fill-mode: forwards` keeps the final keyframe styles after the animation ends
- `animation-fill-mode: backwards` applies the first keyframe styles during the delay period
- `animation-play-state: paused` can pause an animation from CSS or JavaScript
- Multiple animations can be applied to one element by separating them with commas

---

## CSS Transforms (2D)

### What Is a CSS Transform?

A CSS transform changes an element's **appearance on screen** without affecting the document layout. This is a crucial distinction.

Think of it like a film projector: the film (layout) stays unchanged, but the projector can rotate, zoom, or shift the *image* on screen. Other elements around the transformed element do NOT reflow — they remain in their original positions as if the transform never happened.

This is also why transforms are **fast to animate** (more on this in the Performance section).

> [!IMPORTANT]
> `transform` does NOT affect layout. A translated element does not push other elements around. If you need to actually move an element in the document flow, use `margin` or `position`.

---

### `translate(x, y)` — Moving Elements

Moves an element relative to its current position.

```css
.element {
  /* Move 50px to the right and 20px down */
  transform: translate(50px, 20px);

  /* Or use individual axis functions: */
  transform: translateX(50px);  /* Move only horizontally */
  transform: translateY(-20px); /* Move 20px upward (negative = up) */

  /* Or use the modern translate property (CSS Level 5): */
  translate: 50px 20px;
}
```

```
Before translate(50px, 20px):    After translate(50px, 20px):
┌─────────┐                           ┌─────────┐
│ Element │  →→→→→→→→→→→→→→→→→→→→    │ Element │
└─────────┘                      ↓    └─────────┘
                                  ↓
```

**Common use case:** Centering an element precisely

```css
/* Classic centering trick before Flexbox */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Pull back by half the element's own size */
}
```

---

### `scale(x, y)` — Resizing Elements

Scales an element up or down. Values are multipliers (1 = original size, 2 = double, 0.5 = half).

```css
.element {
  /* Scale both axes by 1.5 (50% bigger) */
  transform: scale(1.5);

  /* Scale X and Y independently (distorts the element) */
  transform: scale(1.5, 0.8);  /* Wider and shorter */

  /* Individual axis */
  transform: scaleX(2);  /* Double the width */
  transform: scaleY(0.5); /* Half the height */
}
```

```
scale(1) — original:   scale(1.5):     scale(0.5):
┌───────────┐          ┌────────────────┐   ┌──────┐
│  Element  │          │                │   │      │
└───────────┘          │    Element     │   └──────┘
                        │                │
                        └────────────────┘
```

Negative scale values **flip** the element:

```css
.mirrored {
  transform: scaleX(-1); /* Mirror image horizontally */
}
```

---

### `rotate(angle)` — Rotating Elements

Rotates an element clockwise by default. Use negative values for counter-clockwise.

```css
.element {
  transform: rotate(45deg);   /* 45 degrees clockwise */
  transform: rotate(-90deg);  /* 90 degrees counter-clockwise */
  transform: rotate(0.5turn); /* 180 degrees (half a turn) */
  transform: rotate(3.14159rad); /* Using radians */
}
```

```
rotate(0deg):  rotate(45deg):  rotate(90deg):  rotate(180deg):
  ┌───┐           ╲ ╱              │               ─────
  │ ↑ │            ╳               │               │ ↓ │
  └───┘           ╱ ╲             ─┼─              └───┘
```

---

### `skew(x, y)` — Shearing Elements

Skews (slants) an element along the X and/or Y axis. Creates a parallelogram effect.

```css
.element {
  transform: skewX(20deg); /* Slant horizontally */
  transform: skewY(10deg); /* Slant vertically */
  transform: skew(20deg, 10deg); /* Both axes */
}
```

```
skewX(0):    skewX(20deg):
┌──────┐      /──────/
│      │     /      /
└──────┘    /──────/
```

**Skew is commonly used** for decorative shapes, diagonal section dividers, and Italian-style UI elements (like italicized banner backgrounds).

---

### Combining Multiple Transforms

You can chain multiple transform functions in one `transform` property. They are applied **right to left** (last function in the list is applied first).

```css
.element {
  /* Rotate 45°, then scale to 1.5x, then move right 100px */
  /* Order matters! Rotating THEN translating is different from translating THEN rotating */
  transform: translateX(100px) rotate(45deg) scale(1.5);
}
```

```
Translation then Rotation (translating in rotated space):
Step 1 (scale 1.5): Make it bigger
Step 2 (rotate 45°): Rotate the bigger element
Step 3 (translateX 100px): Move it 100px along the ORIGINAL X-axis
```

> [!WARNING]
> The order of transforms matters significantly. `rotate(45deg) translateX(100px)` and `translateX(100px) rotate(45deg)` produce different results because after rotation, the local X-axis is also rotated.

---

### `transform-origin` — The Center of Transformation

By default, all transforms happen around the **center of the element**. `transform-origin` lets you change that pivot point.

```css
.element {
  /* Default: center center */
  transform-origin: 50% 50%;

  /* Top-left corner (like a door hinge on the left) */
  transform-origin: 0 0;
  transform-origin: top left;

  /* Bottom center (like a pendulum) */
  transform-origin: 50% 100%;
  transform-origin: bottom center;

  /* A specific pixel value */
  transform-origin: 20px 40px;
}
```

```
transform-origin: center (default)    transform-origin: top left
         ↑                                  ↑ (pivot here)
    ┌────●────┐                        ●────────┐
    │         │      rotate(45deg)     ╲        │
    └─────────┘        →→→→→→          ╲───────╱
```

---

### Section Recap: CSS Transforms (2D)

- Transforms change appearance without affecting document layout
- `translate(x, y)` moves an element relative to its current position
- `scale(x, y)` resizes (< 1 = shrink, > 1 = grow, negative = flip)
- `rotate(angle)` rotates clockwise by default
- `skew(x, y)` slants/shears an element
- Multiple transforms can be chained; they are applied right to left
- `transform-origin` sets the pivot point for the transformation (default is center)

---

## CSS Transforms (3D)

### The Third Dimension

So far, all our transforms have been on a flat 2D plane. CSS also supports a Z-axis — depth — allowing you to create genuinely three-dimensional effects.

Imagine the screen as a pane of glass:
- **X axis** → left/right
- **Y axis** → up/down
- **Z axis** → towards you / away from you (depth)

```
         Y (up)
         ↑
         │
         │     Z (toward you)
         │   ↗
         │ ↗
─────────●──────────→ X (right)
```

---

### `perspective` — Creating Depth

Without `perspective`, 3D transforms look flat because the browser does not apply foreshortening (the way objects look smaller when they are far away). `perspective` adds this depth effect.

Think of it as placing a camera at a certain distance from the scene. A **small value** = camera close up = dramatic, exaggerated perspective. A **large value** = camera far away = subtle, gentle perspective.

```css
/* Method 1: Apply perspective to the PARENT/CONTAINER */
/* This creates a shared perspective for all children */
.scene {
  perspective: 600px; /* Perspective distance from the viewer to the z=0 plane */
}

/* Method 2: Apply perspective() to the transform property of the ELEMENT ITSELF */
/* Each element has its own independent perspective — children do not share it */
.element {
  transform: perspective(600px) rotateY(45deg);
}
```

> [!IMPORTANT]
> For 3D scenes with multiple objects (like a flip card), always apply `perspective` to the **parent container**, not the individual elements. This gives all children the same vanishing point, making the 3D look coherent.

```
perspective: 200px (close up, dramatic)    perspective: 2000px (far away, subtle)
        ___________                                  _________
       /           \                               /           \
      /   rotated   \       vs.                  / rotated card \
     /     card      \                          /                \
    /                 \                        /                  \
```

---

### `rotateX()` and `rotateY()`

These rotate elements around the X and Y axes respectively, creating 3D flip effects.

```css
/* Rotate around the horizontal (X) axis — like opening a book face-up */
transform: rotateX(45deg);

/* Rotate around the vertical (Y) axis — like a revolving door */
transform: rotateY(45deg);
```

---

### `transform-style: preserve-3d`

When you have nested 3D-transformed elements, by default the browser **flattens** each element's children into 2D before compositing. `transform-style: preserve-3d` tells the browser to keep the children in the same 3D space as the parent.

**This is critical for the flip card effect.** Without it, the card's front and back faces would not appear on opposite sides of the card.

```css
.card {
  transform-style: preserve-3d; /* Children (front/back) share the same 3D space */
}
```

---

### `backface-visibility`

When an element is rotated more than 90° around X or Y, you start seeing its **back face** — a mirror image of the front. By default this is visible.

For a card flip, you want the back face of the front card and the front face of the back card to be invisible when they are facing away from the viewer.

```css
.card-face {
  backface-visibility: hidden; /* Hide this element when it is rotated away from the viewer */
}
```

```
Front face (facing you):        Back face (facing away):
┌──────────────┐                 ┌──────────────┐
│ ♦  Card ♦   │    rotateY      │ (hidden with  │
│              │  →→→→→→→→→→→   │  backface-    │
│     Front    │                 │  visibility:  │
└──────────────┘                 │   hidden)     │
                                  └──────────────┘
```

---

### Section Recap: CSS Transforms (3D)

- 3D transforms add depth on the Z-axis
- `perspective` on the parent container creates realistic foreshortening
- Small perspective values = dramatic depth; large values = subtle depth
- `rotateX()` flips like a book page, `rotateY()` flips like a door
- `transform-style: preserve-3d` keeps children in the same 3D space as their parent
- `backface-visibility: hidden` hides the rear face of a rotated element

---

## Box Shadows & Text Shadows

### `box-shadow`

A box shadow casts a shadow from an element's box (the rectangular boundary including border-radius). It can create depth, focus effects, glows, and more.

The syntax is:

```
box-shadow: [inset] [offset-x] [offset-y] [blur-radius] [spread-radius] [color];
```

Let us understand each part:

```
          offset-x
          ←──────→
          ┌────────────┐    ↑ offset-y
          │  Element   │    ↓
          └────────────┘
                       ░░░░░░░░░   ← shadow (blurred)
                       ░░░░░░░░░
```

```css
.element {
  /* A simple drop shadow: 5px right, 5px down, 15px blur, dark gray */
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);

  /* No offset (centered shadow), blur only — creates a "glow" effect */
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);

  /* Spread radius makes the shadow larger or smaller than the element */
  /* Positive = shadow extends beyond element */
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4); /* Focus ring with no blur */

  /* inset keyword — shadow is inside the element */
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2); /* Pressed-in effect */
}
```

#### Multiple Shadows

You can layer multiple shadows by separating them with commas. They are rendered front-to-back (first in the list is on top).

```css
.premium-card {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),    /* Tiny ambient shadow (contact) */
    0 4px 6px rgba(0, 0, 0, 0.10),    /* Medium diffuse shadow */
    0 20px 40px rgba(0, 0, 0, 0.08);  /* Large, soft environmental shadow */
}
```

This layering technique creates realistic, physically-based shadows similar to those in Google's Material Design.

---

### `text-shadow`

Similar to `box-shadow` but applied to text characters. It does NOT have `inset` or `spread-radius`.

```
text-shadow: [offset-x] [offset-y] [blur-radius] [color];
```

```css
/* Simple text shadow */
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Glowing text (no offset, just blur and color) */
.neon {
  color: #39ff14;
  text-shadow:
    0 0 5px #39ff14,    /* Tight inner glow */
    0 0 20px #39ff14,   /* Medium glow */
    0 0 40px #39ff14;   /* Wide outer glow */
}

/* Embossed (raised) effect — light source from top-left */
.embossed {
  color: #e2e8f0;
  text-shadow:
    -1px -1px 1px rgba(0, 0, 0, 0.3), /* Dark shadow bottom-right */
     1px  1px 1px rgba(255,255,255,0.7); /* Light highlight top-left */
}
```

---

### Section Recap: Shadows

- `box-shadow: offset-x offset-y blur spread color` — shadows on element boxes
- Use `inset` to create an inner shadow (pressed-in look)
- Multiple shadows (comma-separated) create realistic depth
- `text-shadow: offset-x offset-y blur color` — shadows on text
- Zero-offset shadows with blur only create glow effects

---

## CSS Gradients

### What Are CSS Gradients?

A gradient is a smooth transition between two or more colors. In CSS, gradients are **images** — they can be used anywhere an image is allowed (primarily `background-image` and `background`).

> [!NOTE]
> Gradients are `background-image` values, not `background-color`. This is important because `background-color` sits *behind* `background-image`.

---

### `linear-gradient()`

A linear gradient transitions colors along a straight line.

```
linear-gradient([direction], color-stop1, color-stop2, ...);
```

```css
/* Default direction: top to bottom */
.element {
  background: linear-gradient(#6366f1, #a855f7);
}

/* Direction with angle (0deg = bottom to top, 90deg = left to right) */
.element {
  background: linear-gradient(135deg, #6366f1, #a855f7);
}

/* Direction with keywords */
.element {
  background: linear-gradient(to right, #6366f1, #a855f7);
  background: linear-gradient(to bottom right, #6366f1, #a855f7);
}

/* Multiple color stops with optional position */
.rainbow {
  background: linear-gradient(
    to right,
    #ef4444,       /* Red — starts at 0% */
    #f97316 25%,   /* Orange — at 25% */
    #eab308 50%,   /* Yellow — at 50% */
    #22c55e 75%,   /* Green — at 75% */
    #3b82f6        /* Blue — ends at 100% */
  );
}

/* Hard stop (no blend) — color changes instantly at a position */
.striped {
  background: linear-gradient(
    to right,
    #6366f1 50%,   /* Indigo from 0% to 50% */
    #a855f7 50%    /* Purple from 50% to 100% (same position = hard edge) */
  );
}
```

```
linear-gradient(to right, blue, purple):

LEFT ──────────────────────────────── RIGHT
■■■■■▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░
blue                               purple
```

---

### `radial-gradient()`

A radial gradient radiates from a central point outward in a circle or ellipse.

```
radial-gradient([shape size at position], color-stop1, color-stop2, ...);
```

```css
/* Simple circle from center */
.element {
  background: radial-gradient(circle, #6366f1, #1e1b4b);
}

/* Ellipse (default shape) */
.element {
  background: radial-gradient(ellipse at center, #6366f1, #1e1b4b);
}

/* Position the center point */
.spotlight {
  background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3), transparent);
}

/* Sized radial gradient */
.glowing-button {
  background: radial-gradient(
    circle farthest-corner at center,
    #818cf8 0%,    /* Light indigo at center */
    #4f46e5 50%,   /* Indigo in middle */
    #3730a3 100%   /* Dark indigo at edges */
  );
}
```

```
radial-gradient(circle, orange, blue):

       ┌────────────────────┐
       │    ░░░░░░░░░░░░    │
       │  ░░▒▒▒▒▒▒▒▒▒▒░░   │
       │  ░▒▒▓▓▓▓▓▓▓▒▒░    │
       │  ░▒▒▓▓■■■▓▓▒▒░    │  ← center (orange)
       │  ░▒▒▓▓▓▓▓▓▓▒▒░    │
       │  ░░▒▒▒▒▒▒▒▒▒▒░░   │
       │    ░░░░░░░░░░░░    │
       └────────────────────┘
                              ↑ edges (blue)
```

---

### `conic-gradient()`

A conic gradient sweeps around a center point like a pie chart or colour wheel.

```css
/* Simple pie chart (50% blue, 50% red) */
.pie {
  background: conic-gradient(blue 50%, red 50%);
  border-radius: 50%; /* Make it circular */
}

/* Progress indicator (75% filled) */
.progress {
  background: conic-gradient(
    #6366f1 75%,   /* 75% filled (270deg = 75% of 360deg) */
    #e5e7eb 75%    /* 25% empty */
  );
  border-radius: 50%;
}

/* Colour wheel */
.color-wheel {
  background: conic-gradient(
    red, orange, yellow, green, blue, indigo, violet, red
  );
  border-radius: 50%;
}
```

```
conic-gradient(blue 50%, red 50%):

        ████████████
      ████████████████
    ████  (blue)  ████
    ████          ████  ← 50% boundary
    ████  (red )  ████
      ████████████████
        ████████████
```

---

### Section Recap: CSS Gradients

- Gradients are `background-image` values (not `background-color`)
- `linear-gradient()` — colors transition along a straight line; use angles or keywords for direction
- `radial-gradient()` — colors radiate outward from a center point
- `conic-gradient()` — colors sweep around a center point like a clock
- Hard stops (same position for two colors) create sharp color changes instead of gradual blends
- Gradients can be layered using multiple backgrounds separated by commas

---

## Scroll-Driven Animations

### What Are Scroll-Driven Animations?

Scroll-driven animations are a **modern CSS feature** that lets you link an animation's progress directly to the user's scroll position. Instead of time driving the animation, the scroll position drives it.

Until recently, this required JavaScript (usually with `IntersectionObserver` or libraries like GSAP). Now you can do it purely in CSS.

> [!NOTE]
> Scroll-driven animations are well-supported in Chromium-based browsers (Chrome 115+, Edge 115+) but Safari support arrived in Safari 18 (2024). Always check [caniuse.com/css-scroll-driven-animations](https://caniuse.com/?search=scroll-driven-animations) for current support.

---

### How It Works: `animation-timeline`

The `animation-timeline` property replaces the normal time-based animation clock with a scroll-based one.

```css
.element {
  animation: myAnimation linear;
  animation-timeline: scroll(); /* Linked to scroll progress */
}
```

There are two types of scroll timelines:

1. **`scroll()`** — tracks the scroll progress of a scroll container (0% = top, 100% = bottom)
2. **`view()`** — tracks when an element enters and exits the viewport

---

### `animation-timeline: scroll()` — Page Scroll Progress Bar

The most common use: a progress bar that fills as you scroll down the page.

```css
/* Step 1: Define the animation keyframes */
@keyframes grow-width {
  from { transform: scaleX(0); } /* Starts at 0% width */
  to   { transform: scaleX(1); } /* Ends at 100% width */
}

/* Step 2: Apply the animation and link it to scroll */
.progress-bar {
  position: fixed;      /* Stick to the top of the viewport */
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #6366f1, #a855f7);
  transform-origin: left center; /* Scale from left to right */

  /* The animation itself */
  animation: grow-width linear;

  /* KEY: link the animation progress to scroll position */
  animation-timeline: scroll(root); /* "root" = the document scroll container */
}
```

The `scroll()` function accepts optional arguments:

```css
/* scroll([scroller] [axis]) */
animation-timeline: scroll();         /* Nearest scrollable ancestor, block axis */
animation-timeline: scroll(root);    /* Document root (the page) */
animation-timeline: scroll(self);    /* The element itself (if it scrolls) */
animation-timeline: scroll(root x);  /* Horizontal scroll */
animation-timeline: scroll(root y);  /* Vertical scroll (default) */
```

---

### `animation-timeline: view()` — Viewport Entry Animations

`view()` tracks when a specific element enters and exits the **viewport**. Animation progress goes from 0% (element just entering viewport at the bottom) to 100% (element fully visible or exiting at the top).

```css
/* Fade in + slide up as element enters the viewport */
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-on-scroll {
  animation: reveal linear both;
  animation-timeline: view();

  /* animation-range controls WHEN in the entry timeline the animation plays */
  /* "entry 0% 40%" means: play the animation during the first 40% of the entry phase */
  animation-range: entry 0% entry 40%;
}
```

`animation-range` lets you control the portion of the timeline the animation uses:

```css
/* Play animation only as element enters viewport (first 30% of entry) */
animation-range: entry 0% entry 30%;

/* Play animation as element exits viewport */
animation-range: exit 0% exit 100%;

/* Play across the entire time the element is in view */
animation-range: cover 0% cover 100%;
```

---

### Full Scroll Animation Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Scroll-Driven Demo</title>
  <style>
    /* Progress bar at the top of the page */
    .scroll-progress {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(to right, #6366f1, #a855f7);
      transform-origin: left;        /* Scale from the left edge */
      transform: scaleX(0);          /* Start at 0 width */
      z-index: 999;                  /* Always on top */

      animation: progress-grow linear forwards;
      animation-timeline: scroll(root); /* Tied to page scroll */
    }

    @keyframes progress-grow {
      to { transform: scaleX(1); } /* Grow to full width */
    }

    /* Cards that reveal as they scroll into view */
    .card {
      opacity: 0;                    /* Hidden by default */
      animation: card-reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 50%; /* Play during first half of entry */
    }

    @keyframes card-reveal {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  </style>
</head>
<body>
  <div class="scroll-progress"></div>

  <!-- Many cards to scroll through -->
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <!-- ... -->
</body>
</html>
```

---

### Section Recap: Scroll-Driven Animations

- Scroll-driven animations link animation progress to scroll position — no JavaScript needed
- `animation-timeline: scroll()` — links to a scroll container's scroll progress (0% = top, 100% = bottom)
- `animation-timeline: view()` — links to when a specific element enters/exits the viewport
- `animation-range` controls which portion of the scroll timeline the animation covers
- Great support in Chrome/Edge; check Safari support for production use
- Always provide a fallback for non-supporting browsers (`@supports`)

---

## Performance & Best Practices

### Why Do Some Animations Run Smoothly and Others Stutter?

To understand CSS animation performance, you need to understand the browser rendering pipeline. Every time the browser needs to update what you see on screen, it goes through these steps:

```
┌────────────┐   ┌──────────┐   ┌────────────┐   ┌──────────┐   ┌─────────┐
│  JavaScript │ → │   Style  │ → │   Layout   │ → │   Paint  │ → │Composite│
└────────────┘   └──────────┘   └────────────┘   └──────────┘   └─────────┘
  (DOM changes)  (calc styles)  (size+position)  (draw pixels)  (layer merge)
```

1. **JavaScript** — runs any JS that modifies the DOM
2. **Style** — calculates which CSS rules apply to each element
3. **Layout** — figures out the exact size and position of every element
4. **Paint** — fills in the actual pixels for each element
5. **Composite** — combines the layers and displays the result

The more steps triggered, the more expensive the update.

---

### The Fast Lane: `transform` and `opacity`

The key insight is that **`transform` and `opacity` only trigger the Composite step** — they skip Layout and Paint entirely.

Why? Because the browser can handle these on the **compositor thread** (a separate thread from the main JavaScript thread). Even if your JS is running heavy computations and blocking the main thread, transform and opacity animations can still run at 60fps.

```
Animating transform/opacity:
JavaScript → Style → Composite ✅ (Skip Layout & Paint)
                    ↑
              Fast! On compositor thread!

Animating width/height/margin/top/left:
JavaScript → Style → Layout → Paint → Composite ❌
                     ↑
            SLOW! Forces full recalculation.
            Every pixel must be recalculated.
```

**Practical rule:**

```css
/* ✅ Fast — uses compositor thread */
.element {
  transition: transform 300ms ease, opacity 300ms ease;
}

/* ❌ Slow — triggers layout recalculation on every frame */
.element {
  transition: width 300ms ease, height 300ms ease, margin 300ms ease;
}
```

If you want to move something, use `translateX/Y` instead of `left/top`. If you want to resize, use `scale` instead of `width/height`.

---

### `will-change` — Telling the Browser to Prepare

`will-change` is a hint to the browser that an element is about to be animated. The browser can then **promote the element to its own compositor layer** ahead of time, making the animation start instantly instead of having a brief hiccup.

```css
.animated-card {
  /* Tell the browser: "this element will use transform and opacity" */
  will-change: transform, opacity;
}
```

**⚠️ Warnings about `will-change`:**

1. **Don't apply it to everything.** Every promoted layer consumes GPU memory. Excessive `will-change` will *hurt* performance, not help it.
2. **Apply it just before the animation, remove it after.** Ideally, use JavaScript to add/remove `will-change`.
3. **Only use it for frequently animated elements** (like elements that animate on hover, or looping animations).

```css
/* ✅ Good use: Only promotes layers on hover, right when needed */
.card {
  transition: transform 300ms ease, box-shadow 300ms ease;
}
.card:hover {
  will-change: transform, box-shadow;
}

/* ❌ Bad use: Promotes ALL cards to separate layers constantly */
.card {
  will-change: transform; /* Don't do this to every card on the page */
}
```

> [!WARNING]
> Overusing `will-change` is a common mistake. It forces the browser to allocate separate GPU memory for each promoted element. On a page with many elements using `will-change`, this can cause memory pressure and actually degrade performance on lower-end devices.

---

### Section Recap: Performance

- The browser rendering pipeline: JS → Style → Layout → Paint → Composite
- `transform` and `opacity` only trigger Composite — they run on the compositor thread and are always fast
- Animating `width`, `height`, `top`, `left`, `margin` etc. triggers Layout — expensive and can cause jank
- Use `translateX/Y` instead of `left/top`, use `scale` instead of `width/height`
- `will-change` hints to the browser to promote an element to its own GPU layer
- Only use `will-change` on elements that are actively animated; overuse wastes GPU memory

---

## Accessibility: prefers-reduced-motion

### Who Is Affected?

Many users experience negative physical reactions to motion on screen. This includes people with:

- **Vestibular disorders** — motion on screen can cause dizziness, nausea, and disorientation
- **Epilepsy** — flashing animations can trigger seizures
- **ADHD** — excessive motion is distracting and impairs focus
- **General motion sensitivity** — especially on mobile devices

Operating systems allow users to declare a preference for reduced motion:
- **macOS:** System Settings → Accessibility → Display → Reduce Motion
- **Windows:** Settings → Ease of Access → Display → Show animations in Windows (toggle off)
- **iOS:** Settings → Accessibility → Motion → Reduce Motion
- **Android:** Settings → Accessibility → Remove animations

---

### The `prefers-reduced-motion` Media Query

CSS provides a media query to detect this preference:

```css
/* Default: Animations are ON for users with no preference */
.animated {
  animation: fadeIn 600ms ease both;
  transition: transform 300ms ease;
}

/* Override: Disable or reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  /* Option 1: Disable all animations and transitions entirely */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Option 2: Provide a reduced-motion alternative (preferred) */
  /* Instead of a slide-in, just fade in (less spatial movement) */
  .animated {
    animation: simpleFade 300ms ease both; /* Fade without movement */
  }
}

@keyframes simpleFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

**The Best Pattern — Motion-First with Reduced Fallback:**

```css
/* Base: Minimal motion (for users who prefer reduced motion) */
.card {
  opacity: 0;
  transition: opacity 300ms ease;
}

.card.visible {
  opacity: 1;
}

/* Enhancement: Full animation for users who are okay with motion */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transform: translateY(20px);
    transition: opacity 300ms ease, transform 300ms ease;
  }

  .card.visible {
    transform: translateY(0);
  }
}
```

> [!IMPORTANT]
> Respecting `prefers-reduced-motion` is not just good practice — it is an **accessibility requirement** under WCAG 2.1 guideline 2.3 (Seizures and Physical Reactions). Failing to respect it can make your site unusable or harmful to some users.

---

### Section Recap: Accessibility

- Many users have medical conditions that make screen motion physically harmful
- `@media (prefers-reduced-motion: reduce)` detects when users have requested less motion
- The nuclear option: set `animation-duration` and `transition-duration` to near-zero for everyone in the media query
- The preferred option: provide thoughtful reduced-motion alternatives (e.g., fade instead of slide)
- The best pattern: build with minimal motion as the baseline, add full animations as an enhancement

---

## Lab 1: 3D Flip Cards

### Overview

**Duration:** 30 minutes  
**Goal:** Build a set of interactive 3D flip cards that reveal content on the back when hovered.

```
┌────────────────┐         ┌────────────────┐
│                │         │                │
│   ♦  FRONT  ♦  │ hover → │   ♦  BACK   ♦  │
│                │         │                │
│   (face down)  │ ←─────  │  (face down)   │
└────────────────┘         └────────────────┘
```

---

### Step-by-Step Instructions

#### Step 1: Set Up the HTML Structure

The 3D flip card requires three nested elements:
- `.scene` — the outer container that defines the perspective (the camera distance)
- `.card` — the element that actually rotates
- `.card__face` — the individual faces (front and back)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Flip Cards</title>
  <link rel="stylesheet" href="flip-cards.css">
</head>
<body>

  <h1>Hover to Reveal</h1>

  <div class="cards-grid">

    <!-- Card 1 -->
    <div class="scene">             <!-- Camera / perspective container -->
      <div class="card">            <!-- The rotating card -->
        <div class="card__face card__face--front">  <!-- Front face -->
          <div class="card__content">
            <div class="card__icon">🌊</div>
            <h2 class="card__title">Ocean</h2>
            <p class="card__subtitle">Hover to explore</p>
          </div>
        </div>
        <div class="card__face card__face--back">   <!-- Back face -->
          <div class="card__content">
            <h2 class="card__back-title">Did You Know?</h2>
            <p class="card__fact">The ocean covers 71% of Earth's surface and contains 97% of all water.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="scene">
      <div class="card">
        <div class="card__face card__face--front">
          <div class="card__content">
            <div class="card__icon">🌋</div>
            <h2 class="card__title">Volcanoes</h2>
            <p class="card__subtitle">Hover to explore</p>
          </div>
        </div>
        <div class="card__face card__face--back">
          <div class="card__content">
            <h2 class="card__back-title">Did You Know?</h2>
            <p class="card__fact">There are about 1,500 potentially active volcanoes worldwide.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="scene">
      <div class="card">
        <div class="card__face card__face--front">
          <div class="card__content">
            <div class="card__icon">🌌</div>
            <h2 class="card__title">Space</h2>
            <p class="card__subtitle">Hover to explore</p>
          </div>
        </div>
        <div class="card__face card__face--back">
          <div class="card__content">
            <h2 class="card__back-title">Did You Know?</h2>
            <p class="card__fact">The universe is approximately 13.8 billion years old.</p>
          </div>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
```

---

#### Step 2: Style the Grid and Scene Container

```css
/* flip-cards.css */

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

/* ---- Reset & Base ---- */
*, *::before, *::after {
  box-sizing: border-box; /* Border and padding are included in element dimensions */
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  background: #0f172a;      /* Dark navy background */
  color: white;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  gap: 40px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #a855f7); /* Gradient text */
  -webkit-background-clip: text;  /* Clip the gradient to just the text */
  background-clip: text;
  -webkit-text-fill-color: transparent; /* Makes the gradient visible */
  text-fill-color: transparent;
}

/* Grid of cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 960px;
}
```

---

#### Step 3: Style the 3D Scene (Perspective Container)

```css
/* ---- The Scene: Sets the 3D perspective ---- */
.scene {
  width: 100%;
  max-width: 320px;
  height: 400px;
  margin: 0 auto;

  /* perspective sets the "camera distance" from the viewer to z=0 plane.
     800px is a good default — realistic without being too dramatic.
     Must be on the PARENT of the rotating element. */
  perspective: 800px;

  /* pointer cursor indicates the card is interactive */
  cursor: pointer;
}
```

---

#### Step 4: Style the Card (The Rotating Element)

```css
/* ---- The Card: The element that actually rotates ---- */
.card {
  width: 100%;
  height: 100%;
  position: relative; /* Positions faces absolutely within */

  /* transform-style: preserve-3d is the MOST IMPORTANT property here.
     Without it, the card faces would be flattened into 2D and you would
     not see a 3D flip — you would see a 2D scale/flip instead. */
  transform-style: preserve-3d;

  /* The rotation transition — this is what creates the flip animation */
  transition: transform 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* When the .scene is hovered, rotate the .card 180 degrees around the Y-axis
   (like a revolving door turning away from you) */
.scene:hover .card {
  transform: rotateY(180deg);
}
```

---

#### Step 5: Style the Card Faces

```css
/* ---- Both Faces (shared styles) ---- */
.card__face {
  position: absolute; /* Stack faces on top of each other */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;

  /* backface-visibility: hidden hides this face when it is rotated
     more than 90 degrees away from the viewer.
     This prevents seeing the back of the front card through the back card. */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari prefix */

  /* Centering the content inside each face */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Front Face ---- */
.card__face--front {
  /* Gradient background */
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.3),
    0 20px 60px rgba(99, 102, 241, 0.2);

  /* The front face starts at 0deg rotation — facing the viewer */
  /* No extra transform needed */
}

/* ---- Back Face ---- */
.card__face--back {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.3),
    0 20px 60px rgba(168, 85, 247, 0.2);

  /* CRITICAL: Pre-rotate the back face by 180deg.
     When the card is at 0deg (not flipped):
       - Front face is at 0deg → facing viewer ✓
       - Back face is at 180deg → facing AWAY from viewer (hidden) ✓
     When the card is at 180deg (flipped):
       - Front face is at 0+180 = 180deg → facing away (hidden) ✓
       - Back face is at 180+180 = 360deg = 0deg → facing viewer ✓ */
  transform: rotateY(180deg);
}
```

---

#### Step 6: Style the Card Content

```css
/* ---- Card Content Styles ---- */
.card__content {
  text-align: center;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.card__icon {
  font-size: 4rem;           /* Large emoji */
  line-height: 1;
  margin-bottom: 8px;

  /* Subtle float animation */
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

.card__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e0e7ff;
}

.card__subtitle {
  font-size: 0.875rem;
  color: #6366f1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.card__back-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a855f7;
  margin-bottom: 12px;
}

.card__fact {
  font-size: 1rem;
  line-height: 1.6;
  color: #c4b5fd;
}
```

---

#### Step 7: Add `prefers-reduced-motion` Support

```css
/* ---- Accessibility: Respect reduced motion preference ---- */
@media (prefers-reduced-motion: reduce) {
  /* Replace the 3D flip with a simple fade transition */
  .card {
    transform-style: flat; /* Disable 3D */
    transition: none;
  }

  /* Show the back face with opacity instead */
  .card__face--back {
    opacity: 0;
    transition: opacity 200ms ease;
    transform: none; /* Remove the 180deg pre-rotation */
  }

  .scene:hover .card {
    transform: none; /* Don't flip */
  }

  .scene:hover .card__face--back {
    opacity: 1; /* Fade in the back face */
  }

  /* Stop the floating icon animation */
  .card__icon {
    animation: none;
  }
}
```

---

#### Step 8: Review the Complete Structure

Before testing, verify your file structure is correct:

```
your-project/
├── index.html
└── flip-cards.css
```

Open `index.html` in a browser, hover over the cards, and you should see them flip to reveal the back face with a smooth 3D rotation.

**Troubleshooting Checklist:**
- Card does not flip → Check that `.scene:hover .card` has `transform: rotateY(180deg)`
- Can see through card → Check that `.card__face` has `backface-visibility: hidden`
- Both faces visible at same time → Check that `.card` has `transform-style: preserve-3d`
- Back face appears mirrored → Check that `.card__face--back` has `transform: rotateY(180deg)` to pre-rotate it
- No 3D perspective → Check that `.scene` has `perspective: 800px`

---

## Lab 2: Scroll-Driven Progress Bar

### Overview

**Duration:** 30 minutes  
**Goal:** Build a reading progress bar fixed at the top of the page that fills up as the user scrolls down.

```
┌──────────────────────────────────────────────────────┐
│██████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← Progress bar (4px)
├──────────────────────────────────────────────────────┤
│                  Article Content                     │
│                                                      │
│  [User has scrolled ~40% of the way down the page]  │
```

---

### Step-by-Step Instructions

#### Step 1: Create the HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scroll Progress Bar</title>
  <link rel="stylesheet" href="progress.css">
</head>
<body>

  <!-- The progress bar — fixed at the top of the page -->
  <div class="scroll-progress" role="progressbar" aria-label="Reading progress"></div>

  <!-- Navigation bar -->
  <nav class="navbar">
    <div class="nav-inner">
      <span class="nav-logo">📖 Reader</span>
      <span class="nav-reading-time">~5 min read</span>
    </div>
  </nav>

  <!-- Main article content — make it long enough to scroll -->
  <main class="article">
    <header class="article-header">
      <p class="article-category">Technology</p>
      <h1 class="article-title">The Future of the Web</h1>
      <p class="article-meta">June 3, 2026 · 5 min read</p>
    </header>

    <div class="article-body">
      <!-- Repeat this paragraph several times to create scrollable content -->
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <h2>The Rise of CSS Superpowers</h2>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>

      <h2>Scroll-Driven Animations Change Everything</h2>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>

      <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque.</p>

      <!-- Add more paragraphs to ensure scrollability -->
      <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.</p>

      <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>

      <h2>Conclusion</h2>
      <p>And so we arrive at the conclusion of this demonstration. If you have scrolled all the way down here, you should see the progress bar at the top of the page fully filled. Congratulations — you have built your first scroll-driven animation!</p>
    </div>
  </main>

</body>
</html>
```

---

#### Step 2: Style the Document Foundation

```css
/* progress.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:ital@0;1&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth; /* Smooth scroll for any anchor links */
}

body {
  background: #fafafa;
  color: #1a1a2e;
  font-family: 'Inter', sans-serif;
  line-height: 1.7;
}
```

---

#### Step 3: Build the Progress Bar (CSS-Only)

```css
/* ---- Scroll Progress Bar ---- */

/* Define the animation that grows the bar from left to right */
@keyframes grow-progress {
  /* We only define the end state — from is implicitly scaleX(0)
     because that is the element's current transform */
  to {
    transform: scaleX(1); /* Full width */
  }
}

.scroll-progress {
  /* Fixed positioning: sticks to the top of the viewport always */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;           /* Thin bar */
  z-index: 1000;         /* Above navbar */

  /* Gradient fill — purple to pink */
  background: linear-gradient(
    to right,
    #6366f1,  /* indigo */
    #a855f7,  /* purple */
    #ec4899   /* pink */
  );

  /* Start fully scaled to 0 on the X-axis (invisible) */
  transform: scaleX(0);

  /* Scale from the LEFT side (not the center) */
  transform-origin: left center;

  /* ---- The Scroll-Driven Animation ---- */
  /* Apply the grow-progress keyframe */
  animation: grow-progress linear;

  /* Link the animation timeline to the PAGE SCROLL progress */
  animation-timeline: scroll(root);

  /* Ensure the animation plays forwards (reaches full scale when at bottom) */
  animation-fill-mode: forwards;
}

/* Glow effect on the progress bar */
.scroll-progress::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(236, 72, 153, 0.8));
  filter: blur(4px); /* Glowing leading edge */
}
```

---

#### Step 4: Style the Navigation

```css
/* ---- Navbar ---- */
.navbar {
  position: sticky;      /* Sticks to top as you scroll */
  top: 0;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(12px);  /* Frosted glass effect */
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  z-index: 100;
  padding: 0 24px;
}

.nav-inner {
  max-width: 720px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-weight: 700;
  font-size: 1.1rem;
}

.nav-reading-time {
  font-size: 0.875rem;
  color: #6b7280;
}
```

---

#### Step 5: Style the Article Content

```css
/* ---- Article ---- */
.article {
  max-width: 720px;
  margin: 0 auto;
  padding: 60px 24px 120px; /* Extra bottom padding for scrollable content */
}

.article-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.article-category {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6366f1;
  margin-bottom: 12px;
}

.article-title {
  font-size: clamp(2rem, 5vw, 3rem); /* Responsive font size */
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  color: #0f172a;
}

.article-meta {
  font-size: 0.875rem;
  color: #6b7280;
}

/* ---- Article Body Text ---- */
.article-body p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 24px;
  font-family: 'Georgia', serif; /* Serif font for readable body text */
}

.article-body h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 48px;
  margin-bottom: 20px;
}
```

---

#### Step 6: Add Scroll-Reveal for Article Sections

As a bonus enhancement, add subtle scroll-reveal animations for the headings:

```css
/* ---- Scroll-Reveal for Content Elements ---- */

/* Define the reveal animation */
@keyframes article-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply scroll-driven reveal to h2 elements */
.article-body h2 {
  animation: article-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 50%; /* Play during first half of entry into viewport */
}
```

---

#### Step 7: Accessibility and Browser Support

```css
/* ---- Browser Support Fallback ---- */
/* For browsers that do not support scroll-driven animations,
   provide a JavaScript-based fallback */

/* Check if scroll-driven animations are supported */
@supports not (animation-timeline: scroll()) {
  /* Hide the CSS-driven bar and show a note */
  .scroll-progress {
    display: none;
  }
}

/* ---- Reduced Motion ---- */
@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    /* Instead of animating, just show the bar statically at some width.
       Or hide it entirely. Here we hide it. */
    display: none;
  }

  .article-body h2 {
    animation: none; /* Remove scroll-reveal */
    opacity: 1;
    transform: none;
  }
}
```

---

#### Optional JavaScript Fallback

For browsers that don't support `animation-timeline: scroll()`, add this small JavaScript fallback:

```html
<script>
  // Check if CSS scroll-driven animations are supported
  const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

  if (!supportsScrollTimeline) {
    // Show the progress bar
    const progressBar = document.querySelector('.scroll-progress');
    progressBar.style.display = 'block';
    progressBar.style.transform = 'scaleX(0)';
    progressBar.style.transition = 'transform 0.1s linear';

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / scrollHeight;

      progressBar.style.transform = `scaleX(${progress})`;
    });
  }
</script>
```

---

## Assignment: Portfolio Project Part 8

### Module 1 Finale — Animate Your Portfolio

This is the final assignment of Module 1. You will take your existing portfolio project from the previous modules and bring it to life with CSS animations, transitions, and advanced visual effects. This is your chance to showcase everything you have learned in this module.

**Duration:** Due next class session  
**Submission:** GitHub repository link + deployed URL (Netlify/GitHub Pages)

---

### Requirements Checklist

#### 1. CSS Transitions on Interactive Elements (25 points)

Every interactive element must have a smooth transition — not a snap.

- [ ] **Navigation links** — transition `color` and add an animated underline effect using `::after` pseudo-element
- [ ] **Buttons** — transition `background-color`, `transform`, and `box-shadow`; buttons should lift (`translateY(-2px)`) on hover and press in (`translateY(0)`) on `:active`
- [ ] **Cards** — transition `transform` and `box-shadow`; cards should elevate on hover (subtle `translateY(-4px)` and larger shadow)
- [ ] **Form inputs** — transition `border-color` and `box-shadow` (focus ring effect)
- [ ] All transitions must use appropriate timing functions (not just `ease` everywhere — think about which direction each element is moving)

#### 2. Keyframe Animations (25 points)

Add at minimum **three distinct keyframe animations**:

- [ ] **Hero entrance** — The hero section elements (heading, subheading, CTA button) must animate in on page load. Stagger them with `animation-delay` so they enter one after another (e.g., heading at `0ms`, subheading at `150ms`, button at `300ms`).
- [ ] **Floating/pulsing element** — Add a continuously animated decorative element to the hero (e.g., a floating badge, an animated avatar border, a pulsing gradient orb in the background).
- [ ] **Loading animation** — Create a custom loading screen or skeleton placeholder for at least one section that plays on page load before the content is revealed.

#### 3. CSS Transforms (20 points)

- [ ] **Project cards** — use `scale` or `translateY` on hover (transform only, not `width`/`height`)
- [ ] **At least one 3D effect** — either a flip card in your Skills or Tools section, or a 3D parallax tilt effect using JavaScript + CSS transforms
- [ ] **Rotating icons or decorative elements** — at least one icon or badge that uses `rotate` as part of an animation
- [ ] Correct `transform-origin` usage where needed

#### 4. Advanced Visual Effects (15 points)

- [ ] **Gradient hero background** — replace any flat-color hero with a `linear-gradient` or `radial-gradient` (or both layered)
- [ ] **Layered box shadows** — use at least three-layer box shadow stacking on your primary cards to achieve realistic depth
- [ ] **Gradient text** — apply a gradient to at least one heading using `background-clip: text` technique
- [ ] **Animated gradient** — at minimum one element has an animated gradient (e.g., background-position shift, or a shimmer effect)

#### 5. Scroll-Driven Animation (10 points)

Implement at least **one** of the following:

- [ ] **Option A:** A scroll progress bar fixed at the top of the page (from Lab 2)
- [ ] **Option B:** Section reveal animations — use `animation-timeline: view()` to animate sections, skill bars, or project cards as they scroll into view

> [!NOTE]
> Include a JavaScript fallback for browsers that don't support scroll-driven animations. `@supports` can be used in CSS to detect support, or `CSS.supports()` in JavaScript.

#### 6. Accessibility (5 points)

- [ ] Add a `@media (prefers-reduced-motion: reduce)` block that disables or meaningfully reduces all animations
- [ ] Ensure reduced-motion fallbacks are functional, not just `animation: none` on everything — keep fade-in effects but remove movement

---

### Grading Rubric

| Category | Points | Criteria |
|---|---|---|
| Transitions | 25 | All interactive elements have smooth, well-timed transitions |
| Keyframe Animations | 25 | 3+ distinct animations; staggered entrances; looping animation |
| Transforms | 20 | Correct use of transform for hover effects; at least one 3D effect |
| Visual Effects | 15 | Gradients, layered shadows, gradient text all present |
| Scroll Animation | 10 | Functioning scroll-driven animation with fallback |
| Accessibility | 5 | `prefers-reduced-motion` media query present and functional |
| **Total** | **100** | |

---

### Stretch Goals (Bonus, not graded)

For students who complete the requirements early:

- **Custom cursor:** Replace the browser cursor with a custom animated circle that follows the mouse
- **Parallax background:** Make the hero background image move at a different speed than the foreground content as the user scrolls
- **Page transition:** Add a full-page fade or slide transition when navigating between pages
- **Magnetic buttons:** Make buttons subtly "attract" the cursor as it gets close (requires JavaScript + CSS transforms)
- **Scroll-synced parallax:** Use `animation-timeline: scroll()` to move decorative elements at different rates creating a parallax depth effect

---

## Resources

### Official Documentation

- [MDN: CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions) — comprehensive reference for all transition properties
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations) — keyframes and animation sub-properties
- [MDN: CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transforms) — 2D and 3D transform functions
- [MDN: Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) — animation-timeline documentation
- [MDN: @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) — entry animations from display:none

### Tools

- [cubic-bezier.com](https://cubic-bezier.com) — Visual editor for custom timing functions
- [Animista](https://animista.net) — Pre-built CSS animation library with copy-paste code
- [Can I Use](https://caniuse.com) — Browser support tables for all CSS features
- [Chrome DevTools: Animations Panel](https://developer.chrome.com/docs/devtools/css/animations/) — Debug and slow-motion replay CSS animations
- [Easing Functions Cheat Sheet](https://easings.net) — Visual guide to all easing functions

### Further Reading

- [CSS Tricks: A Complete Guide to CSS Transitions](https://css-tricks.com/almanac/properties/t/transition/)
- [Google Developers: Stick to Compositor-Only Properties](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
- [web.dev: Scroll-Driven Animations](https://developer.chrome.com/articles/scroll-driven-animations/) — in-depth tutorial from Chrome team
- [WCAG 2.1: Success Criterion 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — Animation accessibility guidelines

---

## Key Takeaways

1. **Transitions** are triggered by property changes; **keyframe animations** run automatically. Choose the right tool for the job.

2. **Always put `transition` on the base state**, not the hover/active state, so the animation plays in both directions.

3. **Timing functions** are not an afterthought — `ease-out` for entering elements, `ease-in` for exiting elements, `ease` for general interactions.

4. **Avoid `transition: all`** — name the specific properties you want to animate for better performance and predictability.

5. **`transform` and `opacity` are the only CSS properties that are truly safe to animate** for 60fps performance. They run on the compositor thread, bypassing Layout and Paint.

6. **For 3D effects**, remember the magic trio: `perspective` on parent → `transform-style: preserve-3d` on the rotating element → `backface-visibility: hidden` on the faces.

7. **Scroll-driven animations** let you link animation progress to scroll position with zero JavaScript, using `animation-timeline: scroll()` and `view()`.

8. **`animation-fill-mode: forwards`** keeps the final keyframe values after an animation ends. Without it, elements snap back to their original styles.

9. **`will-change` is not a magic performance booster** — use it only on actively animating elements. Overuse wastes GPU memory.

10. **Always include `@media (prefers-reduced-motion: reduce)`** — it is an accessibility requirement, not optional. Some users will experience genuine physical discomfort or medical reactions without it.

---

## Common Mistakes & How to Avoid Them

| Mistake | Why It's a Problem | How to Avoid It |
|---|---|---|
| Putting `transition` on the `:hover` state | The transition only plays going *into* hover. Reverting is instant and jarring. | Always put `transition` on the base element selector, never on `:hover`. |
| Using `transition: all` | Watches all properties for changes, causing unnecessary work and unexpected animations. | Name specific properties: `transition: transform 300ms, opacity 300ms`. |
| Animating `width`, `height`, `top`, `left` | Triggers Layout recalculation on every frame, causing jank and dropped frames. | Use `transform: translateX/Y()` for movement, `scale()` for size. |
| Forgetting `animation-fill-mode: forwards` | Element snaps back to its original style immediately when animation ends. | Add `forwards` (or `both`) to keyframe animations that should hold their final state. |
| Using `perspective` on the element itself (not the parent) | Each child element gets its own independent vanishing point — the 3D looks incoherent. | Put `perspective` on the **parent** container for shared 3D space. |
| Forgetting `transform-style: preserve-3d` on the flipping card | Faces are flattened to 2D — you see a 2D scale/fade instead of a 3D flip. | Set `transform-style: preserve-3d` on the rotating parent element. |
| Forgetting `backface-visibility: hidden` on card faces | Both faces visible simultaneously during the flip. | Apply `backface-visibility: hidden` to both `.card__face` elements. |
| Forgetting to pre-rotate the back face | Back face starts facing viewer — the animation is wrong from the beginning. | Set `transform: rotateY(180deg)` on the back face's CSS. |
| Overusing `will-change` | Each promoted layer costs GPU memory. Too many → memory pressure → slower performance. | Only use `will-change` on elements that animate frequently, ideally applied/removed via JS. |
| Not using `@media (prefers-reduced-motion: reduce)` | Users with vestibular disorders may experience dizziness, nausea, or seizures. | Always add a reduced-motion media query for any significant motion animation. |
| Hardcoding `animation-delay` without `animation-fill-mode: backwards` | Element appears at its non-animated state during the delay period, then jumps. | Add `backwards` or `both` to `animation-fill-mode` for delayed entrance animations. |
| Using large `perspective` values for dramatic effects | A large value (e.g., 5000px) means the camera is far away — the 3D is barely visible. | Use 600px–1200px for noticeable 3D. Smaller = more dramatic. |
| Building animations that rely only on `transition: all` for drag/resize | Any resize or layout change triggers an unintended animation. | Never use `transition: all` in production code. |
| Applying gradient text without the `background-clip` and `color` trick | The gradient shows as a background, not on the text itself. | Use `-webkit-background-clip: text; background-clip: text; color: transparent;`. |
