# Lecture 02 — HTML5 Forms, Tables & Multimedia

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Build HTML forms with a variety of modern input types
- Use HTML5's built-in form validation
- Create accessible forms with proper labels and ARIA attributes
- Implement modern interactive elements like `<dialog>`, `<datalist>`, and the `popover` attribute
- Structure data using HTML tables with proper semantic markup
- Embed audio, video, and external content in web pages

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. Form Architecture & Essential Elements
2. Expanded Input Types & Validation
3. Modern Interactive Elements (Dialog, Datalist, Popover)
4. Accessibility Best Practices
5. Table Markup & Responsive Strategies
6. Audio, Video & Embedding

### Part 2 — Practice & Lab (~90–120 minutes)
1. Build a Job Application Form
2. Implement an Interactive Modal `<dialog>`
3. Portfolio Project Part 2: Contact Form & Projects Table

---

## 1. Form Architecture

**What is a form?** A form is how users send data to your website — think login pages, search bars, contact forms, and checkout pages.

The `<form>` element wraps all the input controls:

```html
<form action="/submit" method="post">
  <!-- form controls go here -->
</form>
```

| Attribute | What It Does | Example |
|-----------|-------------|---------|
| `action` | The URL where the form data is sent | `action="/api/contact"` |
| `method` | **How** the data is sent: `GET` (data visible in the URL) or `POST` (data hidden in the request body) | `method="post"` |

### Core Form Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `<label>` | A text caption for an input field | `<label for="email">Email:</label>` |
| `<input>` | Collects a single value from the user | `<input type="text" id="name">` |
| `<select>` | A dropdown list of options | `<select><option>Choice</option></select>` |
| `<textarea>` | A multi-line text box | `<textarea rows="4"></textarea>` |
| `<button>` | A clickable button | `<button type="submit">Send</button>` |

### Connecting Labels to Inputs (Critical!)

Always connect every `<label>` to its `<input>` using the `for` and `id` attributes:

```html
<label for="email">Email:</label>
<input type="email" id="email" name="email">
```

> [!WARNING]
> Forms without labels are a major **accessibility failure**. Screen readers (used by visually impaired users) need the `for`-`id` pairing to announce what each input field is for.

---

## 2. Expanded Input Types & Validation

HTML5 introduced specialised input types that automatically show the right keyboard on mobile devices and offer built-in validation.

| Type | What It Does | Mobile Benefit |
|------|-------------|----------------|
| `email` | Validates email format | Shows `@` key |
| `password` | Masks characters (●●●●) | Standard keyboard |
| `number` | Accepts numbers | Numeric keyboard |
| `tel` | For phone numbers | Phone dial pad |
| `date` | Native date picker | Calendar picker |
| `color` | Native colour picker | Colour selection popup |

### Built-in Validation

The browser checks the user's input automatically:

| Attribute | What It Does | Example |
|-----------|-------------|---------|
| `required` | Field must be filled in | `<input type="text" required>` |
| `pattern` | Must match a regular expression | `<input pattern="[A-Za-z]{3}">` |
| `min` / `max` | Min/max values for numbers | `<input type="number" min="0" max="100">` |

```html
<!-- Example: Age must be between 18 and 120 -->
<input type="number" name="age" min="18" max="120" required>
```

---

## 3. Modern Interactive Elements

In 2026, we don't need massive JavaScript libraries to create standard UI elements. HTML provides them natively!

### The `<datalist>` Element
Provides an autocomplete dropdown for a text input. Unlike `<select>`, the user can also type a custom value.

```html
<label for="browser">Choose a browser:</label>
<input list="browsers" id="browser" name="browser">

<datalist id="browsers">
  <option value="Edge">
  <option value="Firefox">
  <option value="Chrome">
  <option value="Safari">
</datalist>
```

### The `<dialog>` Element
A native HTML element to create modal windows or dialog boxes.

```html
<!-- The dialog is hidden by default -->
<dialog id="myModal">
  <h2>Welcome to my site!</h2>
  <p>Please read the terms and conditions.</p>
  <form method="dialog">
    <button>Close</button>
  </form>
</dialog>

<!-- JavaScript is needed to open it -->
<button onclick="document.getElementById('myModal').showModal()">
  Open Modal
</button>
```

### The `popover` Attribute (New Standard)
Allows you to create tooltips, menus, and popovers without any JavaScript at all!

```html
<button popovertarget="my-popover">More Info</button>

<div id="my-popover" popover>
  This is a native popover! It handles clicking outside to close automatically.
</div>
```

---

## 4. Accessibility Best Practices

### Grouping Fields with `<fieldset>` and `<legend>`
```html
<fieldset>
  <legend>Contact Information</legend>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
</fieldset>
```

### ARIA Attributes
When visual labels aren't enough, use ARIA (Accessible Rich Internet Applications):
- `aria-label`: Provides an invisible label.
- `aria-describedby`: Links to error or help text.

```html
<label for="pwd">Password:</label>
<input type="password" id="pwd" aria-describedby="pwd-help">
<span id="pwd-help">Must be at least 8 characters.</span>
```

---

## 5. HTML Tables

**What are tables for?** Tables display data in rows and columns. They should **only** be used for tabular data, **never** for layout.

```html
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>Developer</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Total Employees: 1</td>
    </tr>
  </tfoot>
</table>
```
- `colspan`: Merges cells across multiple columns.
- `rowspan`: Merges cells across multiple rows.

---

## 6. Multimedia — Audio, Video & Embedding

### Video
```html
<video controls width="640" poster="preview.jpg">
  <source src="movie.mp4" type="video/mp4">
  <track src="subtitles.vtt" kind="subtitles" srclang="en" label="English" default>
</video>
```

> [!IMPORTANT]
> Captions via `<track>` are not optional for public-facing content — they're an accessibility requirement.

### Embedding with `<iframe>`
Used for Google Maps, YouTube, etc.

```html
<iframe 
  src="https://www.youtube.com/embed/..." 
  loading="lazy" 
  allowfullscreen>
</iframe>
```
Always use `loading="lazy"` on iframes to improve page load speed!

---

## 🧪 Practice Labs

### Lab 1: Job Application Form (45 min)
Build a complete job application form using modern input types and validation.
1. Open the starter file `labs/lab1-form-starter.html`.
2. Include fields: Full Name, Email, Phone (`tel`), DOB (`date`).
3. Add a `<datalist>` for the applicant's Primary Language.
4. Use `<fieldset>` to group Personal Info vs Job Info.
5. Add a `<button type="submit">` to submit the form.

### Lab 2: Interactive Modal Dialog (20 min)
1. Open `labs/lab2-dialog-starter.html`.
2. Create a native `<dialog>` element containing a "Terms of Service" text.
3. Add a button that uses `showModal()` to open it.
4. Inside the dialog, create a `<form method="dialog">` with an "I Agree" button that closes the modal automatically.

---

## 📝 Assignment: Portfolio Project — Part 2

Let's continue building your Developer Portfolio.

### Requirements
1. Open your portfolio `index.html` from Lecture 1.
2. In the `<section id="contact">`, add a complete **Contact Form**:
   - Name (`text`), Email (`email`), Message (`textarea`).
   - Use proper `<label>` tags linked with `for` and `id`.
   - Make Name and Email `required`.
   - Add a `<button type="submit">Send Message</button>`.
3. In the `<section id="projects">`, add an **HTML Table** detailing the projects you will build in this course:
   - Use `<thead>`, `<tbody>`, `<th>`, and `<td>`.
   - Columns should be: "Project Name", "Technologies", "Expected Completion".
   - Add 3 rows using the roadmap from Lecture 00 (e.g., TaskFlow Dashboard - JavaScript).
4. In your footer, add a native `popover` button that says "Hire Me", which opens a small `<div popover>` containing your email and phone number.

### Optional Bonus
1. Add a `<video>` tag showcasing a screencast of your favorite code snippet running.
2. Embed your city's Google Map in the Contact section using an `<iframe>`.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN — Forms | https://developer.mozilla.org/en-US/docs/Learn/Forms |
| MDN — `<dialog>` element | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog |
| MDN — Popover API | https://developer.mozilla.org/en-US/docs/Web/API/Popover_API |

---

## 📌 Key Takeaways
- Always pair `<label>` with inputs using `for`/`id`.
- Modern HTML provides `<datalist>`, `<dialog>`, and `popover` natively without needing massive JavaScript libraries.
- Use `required`, `min`, `max`, and `pattern` for quick front-line validation.
- Tables are strictly for data (`<thead>`, `<tbody>`, `<th>`), never for layout.
- Embed media correctly using `<video>` (with tracks for accessibility) and `<iframe>` with `loading="lazy"`.

---

**Next Lecture:** [Lecture 03 — CSS3 Fundamentals & Selectors →](./03%20-%20CSS3%20Fundamentals%20%26%20Selectors.md)