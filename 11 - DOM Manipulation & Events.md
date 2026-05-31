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

The DOM is the browser's representation of your HTML page as a **tree of objects**. Every HTML element becomes a "node" in this tree, and JavaScript can read, modify, add, or remove any node.

---

## 2. Selecting Elements

| Method | Returns |
|--------|---------|
| `document.querySelector('.class')` | **First** matching element or `null` |
| `document.querySelectorAll('div')` | **All** matching elements (NodeList) |

`querySelectorAll` returns a NodeList that you can loop over with `forEach`:
```js
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  console.log(card.textContent);
});
```

---

## 3. Traversing the DOM

Navigate to related elements:

- `element.parentElement` (Direct parent)
- `element.children` (Children)
- `element.nextElementSibling` (Next sibling)
- `element.closest('.container')` (Searches UP the tree for the nearest matching ancestor)

---

## 4. Modifying Content

### Setting Text
- `element.textContent = 'Hello'`: Sets raw text. SAFE from XSS.
- `element.innerHTML = '<b>Hello</b>'`: Renders HTML. **DANGEROUS with user input!**

### Creating and Inserting
```js
const newItem = document.createElement('li');
newItem.textContent = 'New task';
document.querySelector('#task-list').append(newItem);
```

### Emptying an Element (Modern Way)
Historically, developers used `element.innerHTML = ''` to clear a container, which is slow and poses security risks.
In modern JavaScript, use `replaceChildren()`:
```js
const container = document.querySelector('.container');
// Instantly and safely empties the container!
container.replaceChildren(); 
```

---

## 5. Classes and Data Attributes

### `classList`
```js
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('active');
```

### Data Attributes (`data-*`)
Store custom data on HTML elements:
```html
<div data-id="42">...</div>
```
```js
const id = element.dataset.id; // "42"
```

---

## 6. Event Handling

An event is something that happens in the browser (click, type, scroll).

```js
const button = document.querySelector('#myButton');

button.addEventListener('click', (event) => {
  console.log('Button clicked!');
  console.log('Target:', event.target); // The element clicked
});
```

### `preventDefault()`
Stops the browser's default action (e.g. stopping a form from submitting).
```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
});
```

---

## 7. Removing Event Listeners (Modern Way)

Historically, you had to pass the exact same function reference to `removeEventListener()`. This was annoying for anonymous arrow functions.
Today, we use **AbortController**!

```js
const controller = new AbortController();

button.addEventListener('click', () => {
  console.log('Clicked!');
}, { signal: controller.signal }); // Link the listener to the controller

// Later, when you want to remove the listener:
controller.abort(); // Instantly removes the listener!
```

---

## 8. Event Delegation

When you dynamically add new elements (like task items), they don't have event listeners attached to them.
**The solution:** Attach ONE listener to the parent and use `event.target.closest()` to determine which child was clicked.

```js
const todoList = document.querySelector('#todo-list');

todoList.addEventListener('click', (e) => {
  // Check if a delete button was clicked
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    // Find the parent item and remove it
    deleteBtn.closest('.todo-item').remove();
  }
});
```

---

## 🧪 Practice Labs

### Lab 1: Character Counter (30 min)
1. Open `labs/lab1-char-counter/index.html`.
2. Listen for the `input` event on the textarea.
3. Update a `<span id="counter">` with the length of the textarea value.

### Lab 2: Shopping Cart Delegation (45 min)
1. Open `labs/lab2-shopping-cart/index.html`.
2. Add a single event listener to the cart container.
3. Use Event Delegation (`e.target.closest()`) to detect when a "Remove" button is clicked and remove that specific item row.

---

## 📝 Assignment: TaskFlow Project — Part 3

It's time to bring TaskFlow to the browser!

### Requirements
1. In your TaskFlow folder, create a basic UI in `index.html`. You need:
   - An `<input>` for the task title.
   - An "Add Task" `<button>`.
   - A `<ul>` to hold the task items.
2. In `app.js`, link the button to an event listener.
3. When clicked:
   - `e.preventDefault()` if you put it in a `<form>`.
   - Read the input value.
   - Create a new `<li>` using `document.createElement`.
   - Give the `<li>` the text content of the input.
   - Append the `<li>` to the `<ul>`.
   - Clear the input field.

*Bonus:* Create an "Empty State". When the array is empty, display a `<p>` saying "No tasks yet!". When a task is added, use `replaceChildren()` to clear the `<p>` and append the task list.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — AbortController | https://developer.mozilla.org/en-US/docs/Web/API/AbortController |
| MDN — replaceChildren | https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren |

---

## 📌 Key Takeaways
- The DOM is a live tree of objects.
- Use `querySelector` / `querySelectorAll` to find elements.
- Use `replaceChildren()` to safely and efficiently empty an element.
- `classList` is the clean way to manage CSS classes.
- Use **AbortController** to clean up event listeners easily.
- **Event delegation** — attach ONE listener to the parent, handle all children. Use `closest()` for reliable targeting.

---

**Next Lecture:** [Lecture 12 — Advanced JavaScript: Scope, Closures & `this`](./12%20-%20Advanced%20JavaScript%20—%20Scope,%20Closures%20%26%20this.md)