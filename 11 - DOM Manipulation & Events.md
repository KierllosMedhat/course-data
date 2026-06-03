# Lecture 11 — DOM Manipulation & Events

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand the Document Object Model (DOM) as a tree of nodes
- Select elements using `querySelector` and `querySelectorAll`
- Traverse the DOM tree (parents, children, siblings)
- Create, modify, and remove elements dynamically
- Empty elements efficiently using `replaceChildren()`
- Manage CSS classes with `classList` and store data with `dataset`
- Handle user interactions with `addEventListener`
- Remove event listeners cleanly using modern `AbortController`
- Use event delegation for dynamic content

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. The DOM tree: nodes, elements, text
2. Selectors: `querySelector`, `querySelectorAll`
3. Traversing: `parentElement`, `closest`, `matches`
4. Modifying content: `textContent`, `createElement`, `replaceChildren()`
5. Attributes, classes (`classList`), data attributes (`dataset`)
6. Event handling: `addEventListener`, `preventDefault()`, `stopPropagation()`
7. Removing listeners with `AbortController`
8. Event delegation pattern

### Part 2 — Practice & Lab (~90–120 min)
1. Real-time character counter
2. Shopping cart that updates totals
3. TaskFlow Project Part 3: DOM Rendering

---

## 1. The Document Object Model (DOM)

### What Is the DOM? (Plain English)

When a browser loads an HTML file, it doesn't just display it as text — it **parses** the HTML and builds a live, interactive model of the page in memory. This model is called the **Document Object Model (DOM)**.

Think of your HTML like a **blueprint** for a house. The DOM is the actual house that gets built from that blueprint. Once the house exists, you can rearrange the furniture (elements), repaint the walls (change styles), or add new rooms (create new elements) — all without rebuilding the house from scratch.

**The critical insight:** The DOM is not your HTML file. It's a live JavaScript object tree that the browser creates *from* your HTML file. JavaScript can then read and modify this tree in real time, and those changes appear on screen immediately.

### Why Does This Matter?

Without the DOM, JavaScript would have no way to interact with the page. The DOM is the bridge between your JavaScript code and what the user sees. Every interactive feature you'll ever build — dropdown menus, live search, form validation, shopping carts — works by reading or changing the DOM.

### The DOM as a Tree

Every HTML element becomes a **node** in this tree. The `<html>` tag is the root (the trunk), and every nested element is a branch or leaf.

```
HTML file:                        DOM Tree:
──────────────                    ─────────────────────────────
<!DOCTYPE html>                   document
<html>                            └── html
  <head>                              ├── head
    <title>Page</title>               │   └── title
  </head>                            │       └── "Page" (text node)
  <body>                             └── body
    <h1>Hello!</h1>                       ├── h1
    <ul>                                  │   └── "Hello!" (text node)
      <li>Item 1</li>                     └── ul
      <li>Item 2</li>                         ├── li → "Item 1"
    </ul>                                     └── li → "Item 2"
  </body>
</html>
```

There are three types of nodes you'll work with:
1. **Element nodes** — HTML tags like `<div>`, `<p>`, `<h1>` — the most common
2. **Text nodes** — The actual text content inside elements
3. **Attribute nodes** — The attributes on elements (`class`, `id`, `href`)

### Step-by-Step: How the Browser Creates the DOM

1. Browser downloads the HTML file from the server
2. HTML parser reads the file character by character
3. As it encounters tags, it creates node objects in memory
4. Nested tags become children of their parent node
5. The result is a complete tree of objects — the DOM
6. JavaScript can now query, modify, or watch any node

### 📌 Section Recap
- The DOM is a live JavaScript object tree the browser creates from HTML
- It's NOT the same as your HTML file — it can be changed without touching the file
- JavaScript interacts with the page by reading and modifying DOM nodes
- Nodes include elements, text, and attributes

---

## 2. Selecting Elements

### The Two Essential Selectors

Before you can modify an element, you need to **find** it. The two most important methods use CSS selector syntax — the same selectors you write in your stylesheet.

```js
// querySelector — Returns the FIRST matching element, or null if not found
const mainTitle  = document.querySelector('h1');               // By tag name
const submitBtn  = document.querySelector('#submit-btn');       // By ID (#)
const firstCard  = document.querySelector('.card');             // By class (.)
const firstInput = document.querySelector('form input');        // Descendant selector
const activeNav  = document.querySelector('.nav-item.active'); // Multiple classes
const emailInput = document.querySelector('input[type="email"]'); // Attribute selector

// querySelectorAll — Returns ALL matching elements as a NodeList
const allCards    = document.querySelectorAll('.card');
const allInputs   = document.querySelectorAll('input');
const allButtons  = document.querySelectorAll('button[type="submit"]');
const navLinks    = document.querySelectorAll('.navbar a'); // All links inside navbar
```

> [!IMPORTANT]
> `querySelector` returns `null` if nothing is found — always check before using it, or your code will crash with a `TypeError: Cannot read properties of null`!

### Why CSS Selectors?

CSS selectors are a language you already know from styling. Using the same syntax in JavaScript means one less thing to learn, and you can select elements with any specificity you need.

### Working with NodeLists

`querySelectorAll` returns a **NodeList**, which is *similar* to an array but not quite the same. It has `forEach` but lacks `map`, `filter`, and `reduce`. If you need those, convert it:

```js
const cards = document.querySelectorAll('.card');

// ✅ forEach works on NodeLists:
cards.forEach(card => {
  console.log(card.textContent);
});

// ✅ Convert to a real array for full array methods:
const cardsArray = Array.from(cards);
// OR use spread — even more concise:
const cardsArray = [...cards]; // Spread converts NodeList to array

// Now you can use map, filter, reduce, etc.:
const cardTexts = cardsArray.map(card => card.textContent.trim());
const longCards = cardsArray.filter(card => card.textContent.length > 100);
```

### Checking for `null` Before Use

```js
const button = document.querySelector('#my-button');

// ❌ This crashes if the element doesn't exist!
button.addEventListener('click', () => {});
// TypeError: Cannot read properties of null (reading 'addEventListener')

// ✅ Guard with an if statement:
if (button) {
  button.addEventListener('click', () => {});
}

// ✅ Or use optional chaining (modern, concise):
button?.addEventListener('click', () => {});
// If button is null, the ?. stops and nothing happens — no crash

// ✅ Or assert it exists (good for elements you're sure will be there):
const btn = document.querySelector('#my-button');
if (!btn) throw new Error('Button #my-button not found in DOM');
btn.addEventListener('click', () => {});
```

### Scoping Queries to a Parent Element

You can call `querySelector` on any element, not just `document`. This limits the search to that element's descendants:

```js
const modal = document.querySelector('#login-modal');

// Search only inside the modal — won't find elements outside it:
const emailInput  = modal.querySelector('input[type="email"]');
const submitBtn   = modal.querySelector('[type="submit"]');
const allInputs   = modal.querySelectorAll('input');
```

### Common Mistakes & How to Avoid Them — Selecting Elements

**Mistake 1: Using `getElementById` when you should use `querySelector`**

```js
// ❌ Old way — only works for IDs, less flexible
const el = document.getElementById('my-id');

// ✅ Modern way — works for any CSS selector
const el = document.querySelector('#my-id');
```

**Mistake 2: Querying inside a loop unnecessarily**

```js
// ❌ Runs querySelector on every iteration — slow!
for (let i = 0; i < 100; i++) {
  document.querySelector('#total').textContent = i;
}

// ✅ Query once, reuse the reference
const total = document.querySelector('#total');
for (let i = 0; i < 100; i++) {
  total.textContent = i;
}
```

### 📌 Section Recap
- `querySelector()` returns the first match or `null` — always handle `null`
- `querySelectorAll()` returns a NodeList of all matches
- Use CSS selector syntax for both — any valid CSS selector works
- Scope queries to a parent element to limit the search area
- Convert NodeList to array with `Array.from()` or `[...nodeList]`

---

## 3. Traversing the DOM

Once you have an element, you often need to navigate to **related** elements — its parent, siblings, or children. This is called **traversal**.

```
                     ┌─── parentElement ───┐
                     │                     │
                    nav                   header
                   / | \
                  /  |  \
             .logo  ul  button  ←── siblings ───→
                   / \
                  /   \
                 li   li  ← children (firstElementChild, lastElementChild)
```

### Key Traversal Properties

```js
const listItem = document.querySelector('.nav-item');

// Navigate UP the tree:
const parent     = listItem.parentElement;          // Direct parent element
const grandparent = listItem.parentElement?.parentElement; // One more level up

// Navigate DOWN the tree (into children):
const children    = parent.children;               // HTMLCollection of child ELEMENTS
const childArray  = [...parent.children];          // Convert to real array
const firstChild  = parent.firstElementChild;      // First child element
const lastChild   = parent.lastElementChild;       // Last child element
const childCount  = parent.childElementCount;      // Number of child elements

// Navigate SIDEWAYS (to siblings):
const next     = listItem.nextElementSibling;      // Next sibling element
const previous = listItem.previousElementSibling;  // Previous sibling element
```

> [!NOTE]
> Always use `parentElement`, `firstElementChild`, `nextElementSibling`, etc. — NOT `parentNode`, `firstChild`, `nextSibling`. The non-Element versions include text nodes (whitespace!), which is almost never what you want.

### The Powerful `closest()` Method

`closest()` walks **up** the tree from the current element and returns the first ancestor that matches the given CSS selector. It also checks the element itself. Returns `null` if nothing matches.

This is extremely useful in event delegation (see Section 8).

```js
// Imagine you have this HTML:
// <ul class="task-list">
//   <li class="task-item" data-id="5">
//     <span class="task-title">Buy milk</span>
//     <button class="delete-btn">Delete</button>
//   </li>
// </ul>

const deleteBtn = document.querySelector('.delete-btn');

// If the user clicks the delete button, find its parent task item:
const taskItem = deleteBtn.closest('.task-item');
// .closest() walks UP: button → li.task-item ✅ Found!

// Walk all the way to the ul:
const taskList = deleteBtn.closest('.task-list');
// button → li.task-item → ul.task-list ✅ Found!

// It also checks the element itself:
const alsoDeleteBtn = deleteBtn.closest('.delete-btn'); // Returns itself

// Returns null if nothing matches:
const result = deleteBtn.closest('.nonexistent'); // null
```

### The `matches()` Method

Check if an element matches a CSS selector without traversing — returns `true` or `false`:

```js
const btn = document.querySelector('button');

if (btn.matches('.btn-primary')) {
  console.log('This is a primary button!');
}

if (btn.matches('[disabled]')) {
  console.log('Button is disabled');
}

// Useful in event handlers to check what was clicked:
document.addEventListener('click', (e) => {
  if (e.target.matches('button.danger')) {
    console.log('A danger button was clicked!');
  }
});
```

### 📌 Section Recap
- Use `parentElement`, `children`, `firstElementChild`, `nextElementSibling` for traversal
- `closest(selector)` walks up the tree — returns first matching ancestor or null
- `matches(selector)` checks if an element matches without traversing
- Prefer `*Element` properties over `*Node` to avoid text node confusion

---

## 4. Modifying Content

### Setting Text Content

There are two ways to set an element's content. The choice has major **security implications**:

```js
const paragraph = document.querySelector('p');

// textContent — Sets PLAIN TEXT only. Safe from XSS attacks.
paragraph.textContent = 'Hello, <strong>World</strong>!';
// The browser displays literally: Hello, <strong>World</strong>!
// The HTML tags are ESCAPED — they are shown as text, NOT rendered as HTML.

// innerHTML — Renders the string AS HTML. DANGEROUS with user-provided content!
paragraph.innerHTML = 'Hello, <strong>World</strong>!';
// The browser displays: Hello, World! (with "World" in bold)
// ⚠️ NEVER put user input into innerHTML — it enables XSS attacks!
```

> [!WARNING]
> **XSS (Cross-Site Scripting)** is a security vulnerability where an attacker injects malicious JavaScript into your page via `innerHTML`. For example: `element.innerHTML = userInput` where `userInput = '<img src=x onerror="stealCookies()">'`. Always use `textContent` for user-generated content.

### When Is `innerHTML` Acceptable?

`innerHTML` is safe when:
- The string is **hardcoded** in your source code (you wrote it, not a user)
- The HTML comes from a **trusted server** that sanitizes output
- You're using a sanitization library like DOMPurify

### Creating New Elements from Scratch

The recommended approach is to create elements programmatically — not by injecting HTML strings. This is both safer and more readable.

**Step-by-step breakdown:**

```js
// Step 1: Create the element (it doesn't appear in the DOM yet)
const newItem = document.createElement('li'); // Creates <li></li>

// Step 2: Set its text content
newItem.textContent = 'New Task';             // <li>New Task</li>

// Step 3: Add CSS classes
newItem.classList.add('task-item', 'pending'); // <li class="task-item pending">...

// Step 4: Add data attributes (for JavaScript use)
newItem.dataset.id = '42';                    // <li ... data-id="42">...

// Step 5: Add ARIA attributes for accessibility
newItem.setAttribute('role', 'listitem');

// Step 6: Append it to an existing element in the DOM
const taskList = document.querySelector('#task-list');
taskList.append(newItem); // Adds at the END of the list — NOW it appears on screen!
```

### Full Example: Rendering a List from an Array

This is the most important pattern — rendering data to the DOM:

```js
const tasks = [
  { id: 1, title: "Buy milk",  completed: true  },
  { id: 2, title: "Walk dog",  completed: false },
  { id: 3, title: "Read book", completed: false },
];

function renderTasks(taskArray) {
  const list = document.querySelector('#task-list');

  // Step 1: Clear the existing list efficiently
  list.replaceChildren(); // Modern, fast, safe way to clear

  // Step 2: Create and append a new <li> for each task
  taskArray.forEach(task => {
    // Create a container for the task
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.dataset.id = task.id; // Store the ID for later retrieval

    // Create the title span
    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;
    titleSpan.classList.add('task-title');

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn-delete');

    // Mark completed tasks
    if (task.completed) {
      li.classList.add('completed');
    }

    // Build the structure (append children to the li)
    li.append(titleSpan, deleteBtn);

    // Finally, add the li to the list in the DOM
    list.append(li);
  });
}

renderTasks(tasks);
```

### Emptying an Element — The Modern Way

Historically, developers used `element.innerHTML = ''` to clear a container. Modern JavaScript provides a much better way:

```js
const container = document.querySelector('.container');

// ❌ Old way — slow and potentially causes memory leaks
container.innerHTML = '';
// Problem: Event listeners attached to children may not be garbage collected

// ✅ Modern way — safe, fast, and semantic
container.replaceChildren(); // No arguments = empties the container completely

// BONUS: replaceChildren() can also REPLACE content with new children:
const newHeading = document.createElement('h2');
newHeading.textContent = 'New Content';
container.replaceChildren(newHeading); // Clears AND inserts in one step
```

### Inserting Elements at Specific Positions

```js
const list = document.querySelector('ul');
const newItem = document.createElement('li');
newItem.textContent = 'New Item';

list.prepend(newItem);     // Insert as FIRST child (before existing children)
list.append(newItem);      // Insert as LAST child (after existing children)
list.before(newItem);      // Insert BEFORE the list itself (as a sibling)
list.after(newItem);       // Insert AFTER the list itself (as a sibling)

// Insert at a specific position:
const referenceItem = list.children[1]; // The second item
list.insertBefore(newItem, referenceItem); // Insert before the second item

// Modern insertAdjacentElement (4 positions):
list.insertAdjacentElement('beforebegin', newItem); // Before the list
list.insertAdjacentElement('afterbegin', newItem);  // First inside the list
list.insertAdjacentElement('beforeend', newItem);   // Last inside the list
list.insertAdjacentElement('afterend', newItem);    // After the list
```

### Removing Elements

```js
const item = document.querySelector('.task-item');
item.remove(); // Removes the element from the DOM — simple and clean!

// ❌ Old way (still works but verbose):
item.parentNode.removeChild(item);
```

### Common Mistakes & How to Avoid Them — Modifying Content

**Mistake: Using `innerHTML` for user input**

```js
const userComment = '<script>alert("hacked!")</script>'; // Malicious input!

// ❌ DANGEROUS — executes the script!
commentEl.innerHTML = userComment;

// ✅ SAFE — displays it as literal text
commentEl.textContent = userComment;
// Shows: <script>alert("hacked!")</script> — harmless text
```

**Mistake: Not removing child elements before re-rendering**

```js
function renderList(items) {
  const list = document.querySelector('ul');
  // ❌ This ADDS to existing items instead of replacing them!
  items.forEach(item => list.append(createItem(item)));

  // ✅ Clear first, then render
  list.replaceChildren();
  items.forEach(item => list.append(createItem(item)));
}
```

### 📌 Section Recap
- Use `textContent` for plain text — NEVER `innerHTML` with user data
- Create elements with `createElement()`, set properties, then `append()`
- Use `replaceChildren()` (no args) to clear a container safely and efficiently
- Use `element.remove()` to delete an element from the DOM

---

## 5. Classes and Data Attributes

### Managing CSS Classes with `classList`

Manipulating classes is how you apply and remove visual styles dynamically (showing/hiding elements, marking active states, toggling themes, etc.).

```js
const card = document.querySelector('.card');

// ─── Adding classes ──────────────────────────────────────────
card.classList.add('active');                    // Add one class
card.classList.add('highlighted', 'visible');    // Add multiple classes at once

// ─── Removing classes ────────────────────────────────────────
card.classList.remove('active');                 // Remove one class

// ─── Toggling (adds if absent, removes if present) ───────────
const wasAdded = card.classList.toggle('dark-mode');
// Returns true if class was ADDED, false if it was REMOVED

// ─── Checking if a class exists ──────────────────────────────
if (card.classList.contains('active')) {
  console.log('Card is active!');
}

// ─── Replacing one class with another ────────────────────────
card.classList.replace('theme-light', 'theme-dark');

// ─── Getting all classes as an array ─────────────────────────
const classNames = [...card.classList]; // ["card", "active", "highlighted"]
```

### Practical Toggle Example: Collapsible Sidebar

```js
const sidebarToggle = document.querySelector('#sidebar-toggle');
const sidebar = document.querySelector('#sidebar');

sidebarToggle.addEventListener('click', () => {
  // Toggle the 'hidden' class on the sidebar
  const isNowHidden = sidebar.classList.toggle('hidden');
  
  // Update the button's text and ARIA attribute for accessibility
  sidebarToggle.textContent = isNowHidden ? 'Show Sidebar' : 'Hide Sidebar';
  sidebarToggle.setAttribute('aria-expanded', !isNowHidden);
});
```

### Data Attributes (`data-*`)

Data attributes let you store **custom information** directly on HTML elements without affecting the visual presentation. They bridge the gap between HTML structure and JavaScript logic.

**Real-world analogy:** Like a sticky note on a physical item. The item looks the same, but it carries extra information for whoever handles it next.

```html
<!-- HTML: Store information on each product element -->
<ul id="product-list">
  <li class="product" data-id="101" data-category="electronics" data-price="999">
    Laptop
    <button class="btn-add-cart">Add to Cart</button>
  </li>
  <li class="product" data-id="102" data-category="clothing" data-price="25">
    T-Shirt
    <button class="btn-add-cart">Add to Cart</button>
  </li>
</ul>
```

```js
// JavaScript: Access data attributes via the .dataset property
const product = document.querySelector('.product');

// Reading data attributes (converted to camelCase automatically):
// data-id       → dataset.id
// data-category → dataset.category
// data-price    → dataset.price
// data-product-name → dataset.productName (kebab → camelCase)

console.log(product.dataset.id);       // "101" (always a string!)
console.log(product.dataset.category); // "electronics"
console.log(product.dataset.price);    // "999" (a string, not a number!)

// ⚠️ Always convert to the right type when needed:
const price = Number(product.dataset.price); // 999 (number)
const id    = parseInt(product.dataset.id, 10); // 101 (integer)

// Writing data attributes:
product.dataset.inCart = "true";
// Now the HTML looks like: data-in-cart="true"
// Note: camelCase in JS → kebab-case in HTML

// Removing a data attribute:
delete product.dataset.inCart;

// Reading via getAttribute (same result, less convenient):
const id2 = product.getAttribute('data-id'); // "101"
```

> [!NOTE]
> Data attributes are multi-word using `kebab-case` in HTML (`data-product-id`) but accessed in `camelCase` via JavaScript (`element.dataset.productId`). Always remember this conversion!

### Common Mistakes & How to Avoid Them — Classes & Data

**Mistake 1: Forgetting that dataset values are always strings**

```js
const el = document.createElement('div');
el.dataset.count = 0;     // Stored as the STRING "0"
el.dataset.active = true; // Stored as the STRING "true"

// ❌ Bug! "0" is truthy in JavaScript (non-empty string)
if (el.dataset.count) { /* runs even though count is 0! */ }

// ✅ Convert before comparison
if (Number(el.dataset.count) > 0) { /* correct */ }
if (el.dataset.active === "true") { /* correct */ }
```

**Mistake 2: Using `className` instead of `classList`**

```js
const el = document.querySelector('.card');

// ❌ Fragile — overwrites ALL existing classes!
el.className = 'active'; // Removes 'card', only 'active' remains!

// ✅ classList only adds/removes the specific class you target
el.classList.add('active'); // 'card' is still there
```

### 📌 Section Recap
- `classList.add()`, `.remove()`, `.toggle()`, `.contains()`, `.replace()` manage classes
- `toggle()` returns `true` if added, `false` if removed — useful for updating UI state
- Data attributes (`data-*`) store custom data on elements — always strings
- Access data attributes via `element.dataset.propertyName` (camelCase)

---

## 6. Event Handling

### What Is an Event?

An event is something that happens in the browser that JavaScript can **listen to and respond to**. Events are how web pages become interactive.

**Analogy:** Events are like notifications. Your phone doesn't do anything until you get a text. JavaScript doesn't do anything until a user clicks a button, presses a key, or scrolls the page.

Common events:
- **Mouse:** `click`, `dblclick`, `mouseenter`, `mouseleave`, `mousemove`, `contextmenu`
- **Keyboard:** `keydown`, `keyup`
- **Form:** `submit`, `input`, `change`, `focus`, `blur`
- **Page:** `load`, `DOMContentLoaded`, `resize`, `scroll`
- **Touch:** `touchstart`, `touchend`, `touchmove`

### Adding Event Listeners

```js
const button = document.querySelector('#my-button');

// addEventListener(eventType, callbackFunction)
button.addEventListener('click', (event) => {
  // The 'event' object is automatically passed by the browser
  // It contains information about what happened:
  console.log('Button was clicked!');
  console.log('Which element was clicked?', event.target);       // The exact element
  console.log('Which element has the listener?', event.currentTarget); // The button
  console.log('What type of event?',         event.type);        // "click"
  console.log('Mouse X position (viewport):', event.clientX);    // e.g., 450
  console.log('Mouse X position (page):',     event.pageX);
  console.log('Shift key held down?',         event.shiftKey);   // true/false
  console.log('Ctrl key held down?',          event.ctrlKey);    // true/false
});
```

### The Event Object

The event callback receives an `event` object (often written as `e` or `evt`) with useful properties that vary by event type:

```js
// Keyboard events:
document.addEventListener('keydown', (e) => {
  console.log(e.key);     // "Enter", "Escape", "a", "ArrowUp", " " (spacebar)
  console.log(e.code);    // "KeyA", "Enter", "Space" — physical key (layout-independent)
  console.log(e.ctrlKey); // Was Ctrl held? (true/false)
  console.log(e.altKey);  // Was Alt held?
  console.log(e.shiftKey);// Was Shift held?

  if (e.key === 'Escape') {
    closeModal();
  }

  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault(); // Stop browser's save dialog
    saveDocument();     // Our custom save
  }
});

// Form input events:
const input = document.querySelector('#search');
input.addEventListener('input', (e) => {
  console.log(e.target.value); // The current value as user types
});

// Scroll events:
window.addEventListener('scroll', (e) => {
  console.log(window.scrollY); // How far scrolled vertically
});
```

### `event.preventDefault()`

Some elements have **default browser behaviours** that run when certain events fire. `preventDefault()` stops these:

- `<a href="...">` → navigates to URL on click
- `<form>` → refreshes the page on submit
- `<input type="checkbox">` → toggles state on click

```js
const form = document.querySelector('#login-form');

form.addEventListener('submit', (e) => {
  // Stop the browser from refreshing the page (default form behaviour):
  e.preventDefault();

  // Now we can handle the submission ourselves:
  const email    = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  // Validate and send to server...
  console.log('Submitted:', email, password);
});

// Prevent navigation on anchor click:
const link = document.querySelector('a.tab-link');
link.addEventListener('click', (e) => {
  e.preventDefault(); // Don't navigate to the href
  // Handle tab switching manually instead
  switchToTab(link.dataset.tab);
});
```

### `event.stopPropagation()`

Events **bubble up** the DOM tree by default. A click on a `<button>` inside a `<div>` triggers click handlers on *both* the button AND the div. `stopPropagation()` prevents this bubbling.

```
Event Bubbling — click travels upward:
                ┌──────────────────────────────┐
                │ document (3rd to fire)        │
                │  ┌──────────────────────────┐ │
                │  │ div.container (2nd)       │ │
                │  │  ┌────────────────────┐  │ │
                │  │  │ button (1st)  CLICK│  │ │
                │  │  └────────────────────┘  │ │
                │  └──────────────────────────┘ │
                └──────────────────────────────┘
                 Event bubbles upward ↑↑↑
```

```js
const container = document.querySelector('.container');
const button = container.querySelector('button');

container.addEventListener('click', () => {
  console.log('Container clicked!'); // Would normally fire on button click too
});

button.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent this click from reaching the container listener
  console.log('Only button clicked!'); // Container handler does NOT fire
});
```

### Multiple Event Types at Once

```js
const input = document.querySelector('#search');

// Listen to multiple events on the same element efficiently:
['focus', 'blur', 'input'].forEach(eventType => {
  input.addEventListener(eventType, (e) => {
    console.log(`Event: ${e.type}, Value: ${e.target.value}`);
  });
});
```

### Common Mistakes & How to Avoid Them — Events

**Mistake 1: Using `onclick` attribute instead of `addEventListener`**

```html
<!-- ❌ HTML event attributes — outdated, hard to remove, can only have one -->
<button onclick="handleClick()">Click me</button>

<!-- ✅ No JS in HTML — use addEventListener in your script -->
<button id="my-btn">Click me</button>
```

```js
document.querySelector('#my-btn').addEventListener('click', handleClick);
```

**Mistake 2: Forgetting `event.preventDefault()` on form submit**

```js
// ❌ Form will refresh the page, you'll never see your console.log!
form.addEventListener('submit', (e) => {
  console.log('Submitted!'); // Flashes briefly before page refreshes
});

// ✅ Prevent default first, then handle
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop the page refresh
  console.log('Submitted!'); // Now you can see this
});
```

### 📌 Section Recap
- Use `addEventListener(type, callback)` to respond to events
- The `event` object provides info about the event (target, key, mouse position)
- `preventDefault()` stops the default browser action (form submit, link navigate)
- `stopPropagation()` prevents the event from bubbling up to parent elements

---

## 7. Removing Event Listeners (Modern Way)

### The Old Problem

In the past, to remove an event listener, you had to pass the **exact same function reference** to `removeEventListener()`. This was clumsy with anonymous arrow functions:

```js
// ❌ The old painful way — must keep a reference to the function:
function handleClick() {
  console.log('Clicked!');
}

button.addEventListener('click', handleClick);
// Later:
button.removeEventListener('click', handleClick); // Works, but you need the reference

// ❌ This DOES NOT work — two different anonymous function objects:
button.addEventListener('click', () => console.log('Hi'));
button.removeEventListener('click', () => console.log('Hi')); // Fails! Different functions
```

### The Modern Solution — AbortController

`AbortController` is an elegant modern solution. You create a "controller" and link it to one or many event listeners using a `signal`. When you want to remove all linked listeners, you call `controller.abort()`.

```js
// Create a controller — it's like a "master switch" for your listeners
const controller = new AbortController();

// Link the event listener to the controller's signal:
button.addEventListener('click', () => {
  console.log('Clicked!');
}, { signal: controller.signal }); // ← Pass the signal here

// You can link MANY listeners to the same controller:
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
}, { signal: controller.signal });

window.addEventListener('scroll', updateScrollPosition,
  { signal: controller.signal });

// Later — flip the switch and ALL linked listeners are removed instantly!
controller.abort();
// Now button click, keydown, AND scroll listeners are all gone.
```

### Why Is This Better?

1. **No function references needed** — anonymous arrows work fine
2. **One call removes many listeners** — a single `abort()` cleans up everything
3. **Prevents memory leaks** — listeners are always properly cleaned up
4. **Works with fetch too** — the same `AbortController` cancels network requests (Lecture 13)

### Real-World Use Case: One-Time Modal Keyboard Listener

A modal that opens and needs a keyboard listener while open, but should stop listening when closed:

```js
function openModal(content) {
  const modal = document.querySelector('#modal');
  modal.querySelector('.modal-content').textContent = content;
  modal.classList.remove('hidden');

  // Create a controller just for this modal session
  // Each time the modal opens, a fresh controller is created
  const controller = new AbortController();

  // Close on Escape key — this listener should ONLY be active while modal is open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  }, { signal: controller.signal });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) { // Only if they clicked the backdrop, not the content
      closeModal();
    }
  }, { signal: controller.signal });

  function closeModal() {
    modal.classList.add('hidden');
    controller.abort(); // Clean up ALL listeners in one call!
  }
}
```

> [!TIP]
> `AbortController` is also used to cancel `fetch` requests (Lecture 13). Learning it here gives you a powerful, versatile tool.

### 📌 Section Recap
- `AbortController` provides a clean, modern way to remove event listeners
- Pass `{ signal: controller.signal }` as the third argument to `addEventListener`
- One `controller.abort()` removes all listeners linked to that controller
- This prevents memory leaks and avoids the "keep a function reference" problem

---

## 8. Event Delegation

### The Problem: Dynamically Added Elements

Imagine a to-do list. You add a delete button for each task. But if a new task is added *after* your `addEventListener` code runs, the new task's button has **no listener** — you'd have to manually attach one every time you add an item.

```js
// ❌ Problem: Listeners only exist on items present at page load
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.task-item').remove();
  });
});
// Any task added LATER won't have this listener!
// You'd have to re-run this code every time you add a task.
```

### The Solution: Event Delegation

Instead of attaching listeners to each child, attach **one listener to the parent**. Since events bubble up, any click on a child will eventually reach the parent. Then use `event.target.closest()` to determine which child was actually clicked.

```
Event Delegation Pattern:
─────────────────────────────────────────────────────────
Instead of:    btn btn btn btn btn → 5 listeners on 5 buttons
               (+ more listeners every time you add a button!)
Use:           ONE listener on the parent container
               + event.target.closest() to identify which btn
─────────────────────────────────────────────────────────
Benefits: Less memory, works for future elements, simpler cleanup
```

```js
// HTML structure (simplified):
// <ul id="task-list">
//   <li class="task-item" data-id="1">
//     <span>Buy milk</span>
//     <button class="btn-delete">Delete</button>
//     <button class="btn-toggle">Toggle</button>
//   </li>
//   ... more items added dynamically
// </ul>

const taskList = document.querySelector('#task-list');

// ONE listener on the parent — handles ALL current AND future items
taskList.addEventListener('click', (e) => {
  // Step 1: Was a delete button clicked (anywhere inside it)?
  const deleteBtn = e.target.closest('.btn-delete');
  if (deleteBtn) {
    // Step 2: Find the parent task item
    const taskItem = deleteBtn.closest('.task-item');
    // Step 3: Get the task ID from data attribute
    const taskId = Number(taskItem.dataset.id);
    console.log(`Deleting task ${taskId}`);
    taskItem.remove();
    return; // Stop checking — we already handled this click
  }

  // Was a toggle button clicked?
  const toggleBtn = e.target.closest('.btn-toggle');
  if (toggleBtn) {
    const taskItem = toggleBtn.closest('.task-item');
    taskItem.classList.toggle('completed');
  }
});
```

### Why `closest()` Instead of `e.target`?

`e.target` is the **exact element** that was clicked. If your button contains an `<i>` icon, clicking the icon gives you the `<i>` tag, not the button. `closest('.btn-delete')` walks up from wherever was clicked and reliably finds the button.

```html
<button class="btn-delete">
  <i class="icon-trash"></i>  ← User clicks HERE (the icon)
  Delete
</button>
```

```js
// e.target is <i class="icon-trash">  ← Not what we want!
// e.target.closest('.btn-delete') walks up and finds the <button> ← Correct!
```

### Step-by-Step: How Event Delegation Works

1. User clicks on `.btn-delete` inside a task item
2. The click event fires on `.btn-delete`
3. The event **bubbles up** through `.task-item` → `#task-list` → `body` → `document`
4. Our listener on `#task-list` fires
5. `e.target` is whatever was actually clicked (could be the button or its child icon)
6. `e.target.closest('.btn-delete')` walks up from `e.target` to find the button
7. We get the button, find its parent task item, and handle the action

### Common Mistakes & How to Avoid Them — Event Delegation

**Mistake: Checking `e.target` directly instead of using `closest()`**

```js
taskList.addEventListener('click', (e) => {
  // ❌ Breaks if the button has child elements (icons, spans)!
  if (e.target.classList.contains('btn-delete')) {
    // Only works if user clicked the button itself, not its icon child
  }

  // ✅ closest() handles clicks on children too
  const deleteBtn = e.target.closest('.btn-delete');
  if (deleteBtn) {
    // Works whether user clicked the button or the icon inside it
  }
});
```

---

## ⚠️ Common Mistakes & How to Avoid Them (Summary)

### Mistake 1: Using `innerHTML` with User Input

```js
// ❌ DANGEROUS — XSS vulnerability!
const userInput = '<img src=x onerror="alert(\'hacked\')">';
element.innerHTML = userInput; // Executes the JS!

// ✅ SAFE — escaped, never executed as code
element.textContent = userInput; // Shows the literal text string
```

### Mistake 2: Querying Before the DOM Loads

```js
// ❌ If this script is in <head>, the DOM isn't loaded yet!
const btn = document.querySelector('#btn'); // null!
btn.addEventListener('click', ...); // TypeError: Cannot read properties of null

// ✅ Option 1: Put your <script> tag at the bottom of <body>
// ✅ Option 2: Use the 'defer' attribute: <script defer src="app.js">
// ✅ Option 3: Listen for DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#btn'); // ✅ DOM is ready!
  btn?.addEventListener('click', () => {});
});
```

### Mistake 3: Forgetting to Check for `null`

```js
// ❌ Crashes if element doesn't exist on this page
document.querySelector('#maybe-missing').classList.add('active');

// ✅ Guard with optional chaining
document.querySelector('#maybe-missing')?.classList.add('active');

// ✅ Or with an if statement for more complex logic
const el = document.querySelector('#maybe-missing');
if (el) {
  el.classList.add('active');
  el.textContent = 'Updated!';
}
```

### Mistake 4: Not Using Event Delegation for Dynamic Content

If you add new elements to the DOM after binding listeners, those new elements won't have listeners. Always use delegation on the parent for lists of dynamically generated content.

### Mistake 5: Clearing with `innerHTML = ''` Instead of `replaceChildren()`

```js
// ❌ Slower and can cause memory leaks (event listeners on children may persist)
container.innerHTML = '';

// ✅ Modern, clean, and safe
container.replaceChildren();
```

---

## 🧪 Practice Labs

### Lab 1: Real-Time Character Counter (30 min)

**Goal:** Listen to input events and update a counter in real time.

**Steps:**
1. Create a `<textarea>` with a `maxlength="200"` attribute
2. Create a `<span id="counter">` below it to display the count
3. In JavaScript, listen for the `input` event on the textarea
4. On every keystroke, update: `"47 / 200 characters"`
5. When fewer than 20 characters remain, add a `warning` CSS class (turns text red)
6. Prevent the textarea from accepting input when limit is reached

```js
// Starter code:
const textarea = document.querySelector('#message');
const counter  = document.querySelector('#counter');
const MAX = 200;

textarea.addEventListener('input', () => {
  const remaining = MAX - textarea.value.length;
  counter.textContent = `${textarea.value.length} / ${MAX} characters`;

  // Add or remove warning class based on remaining characters
  counter.classList.toggle('warning', remaining < 20);
});
```

### Lab 2: Interactive Task List (45 min)

**Goal:** Build a task list with add, complete, and delete using event delegation.

**Steps:**
1. Create an input and "Add Task" button
2. On button click, create a new `<li>` with task text and a Delete button
3. Use `replaceChildren()` when refreshing the list
4. Use ONE delegated listener on the `<ul>` to handle all delete clicks
5. Clicking the task text itself should toggle a `completed` style

---

## 📌 Final Lecture Recap

- The **DOM** is a live JavaScript object tree built from HTML — modify it to update the page
- **`querySelector`** finds the first match; **`querySelectorAll`** finds all matches
- **Traversal** moves between related elements (`parentElement`, `closest`, `nextElementSibling`)
- **`createElement`** + **`append`** is the safe way to add content
- **`textContent`** is safe; **`innerHTML`** with user data is dangerous (XSS!)
- **`classList`** manages CSS classes; **`dataset`** stores custom data on elements
- **`addEventListener`** handles events; **`event.preventDefault()`** stops defaults
- **`AbortController`** cleanly removes multiple listeners with one `abort()` call
- **Event delegation** = one listener on the parent to handle all current and future children

---

**Next Lecture:** [Lecture 12 — Advanced JavaScript: Scope, Closures & this](./12%20-%20Advanced%20JavaScript%20%E2%80%94%20Scope,%20Closures%20%26%20this.md)