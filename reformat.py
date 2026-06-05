import re
import os

filepath = r"D:\Projects\Fullstack Web Development Course\course-data\16 - Bootstrap 5 — Forms, Tables, Customization & JS Plugins.md"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Extract parts
title_match = re.search(r"^(# Lecture 16.*?)\n\n---", content, re.DOTALL)
title_meta = title_match.group(1) if title_match else ""

obj_match = re.search(r"## 🎯 Learning Objectives\n(.*?)(?=\n---\n\n## 📋 Agenda)", content, re.DOTALL)
objectives = obj_match.group(1).strip() if obj_match else ""

agenda_match = re.search(r"## 📋 Agenda\n(.*?)(?=\n---\n\n## 1\. Forms & Floating Labels)", content, re.DOTALL)
agenda = agenda_match.group(1).strip() if agenda_match else ""

deep_dive_match = re.search(r"(## 1\. Forms & Floating Labels.*?)(?=\n---\n\n## ⚠️ Common Mistakes & How to Avoid Them)", content, re.DOTALL)
deep_dive = deep_dive_match.group(1).strip() if deep_dive_match else ""

# Demote headers in deep dive
deep_dive = re.sub(r"^## (\d+\.)", r"### \1", deep_dive, flags=re.MULTILINE)

mistakes_match = re.search(r"## ⚠️ Common Mistakes & How to Avoid Them\n(.*?)(?=\n---\n\n## 🧪 Practice Labs)", content, re.DOTALL)
mistakes = mistakes_match.group(1).strip() if mistakes_match else ""

labs_match = re.search(r"## 🧪 Practice Labs\n(.*?)(?=\n---\n\n## 🔗 Resources)", content, re.DOTALL)
labs = labs_match.group(1).strip() if labs_match else ""

# Demote assignment header in labs
labs = re.sub(r"^## 📝", r"### 📝", labs, flags=re.MULTILINE)

takeaways_match = re.search(r"## 📌 Key Takeaways\n(.*?)(?=\n---\n\n\*\*Next Lecture:\*\*)", content, re.DOTALL)
takeaways = takeaways_match.group(1).strip() if takeaways_match else ""

next_lecture_match = re.search(r"(\*\*Next Lecture:\*\*.*)", content, re.DOTALL)
next_lecture = next_lecture_match.group(1).strip() if next_lecture_match else ""

prerequisites = """
- Basic understanding of HTML tags and forms (`<input>`, `<select>`, `<button>`, etc.).
- Basic understanding of CSS styling and specificities.
- Prior knowledge of Bootstrap 5 grid system and basic utility classes (spacing, colors).
- Basic JavaScript knowledge (DOM manipulation, event listeners) for JS components.
"""

think_like_a_dev = """
When approaching UI development with Bootstrap, always ask yourself: **"Should I write custom CSS for this, or does Bootstrap already have a class/component?"**

1. **Leverage the Framework Fully**: Don't reinvent the wheel. If you need a switch, use Bootstrap's `.form-switch` rather than building a custom toggle from scratch. This saves time, reduces bugs, and ensures cross-browser compatibility.
2. **Customization via Sass, Not Overrides**: Novices write custom CSS to override Bootstrap's colors (`!important` everywhere). Professionals use Bootstrap's Sass variables to compile a custom version of the framework. This keeps the CSS clean and maintainable.
3. **Progressive Enhancement**: Start with simple HTML. Add Bootstrap classes to style it. Then add JS for interactivity. If JS fails, the form or table should still be fundamentally usable.
4. **Accessibility (a11y) First**: Notice how Bootstrap requires `aria-label`, `aria-hidden`, or explicit `<label>` elements for forms? A good developer never skips these. Screen readers rely on this markup to make your site accessible to visually impaired users.
"""

before_after = """
### 1. Plain HTML Form vs. Bootstrap Form

**Before (Plain HTML):**
```html
<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email">
  <button type="submit">Send</button>
</form>
```
*Result: Unstyled, inconsistent across browsers, cramped spacing.*

**After (Bootstrap 5):**
```html
<form>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" placeholder="name@example.com">
  </div>
  <button type="submit" class="btn btn-primary">Send</button>
</form>
```
*Result: Polished, proper padding, focus rings, and consistent spacing.*

### 2. Standard Table vs. Responsive Bootstrap Table

**Before (Plain HTML):**
```html
<table>
  <tr><th>Name</th><th>Role</th></tr>
  <tr><td>Alice</td><td>Admin</td></tr>
</table>
```
*Result: No borders, no padding, text crammed together, breaks layout on mobile.*

**After (Bootstrap 5):**
```html
<div class="table-responsive">
  <table class="table table-striped table-hover table-bordered align-middle">
    <thead class="table-dark">
      <tr><th>Name</th><th>Role</th></tr>
    </thead>
    <tbody>
      <tr><td>Alice</td><td>Admin</td></tr>
    </tbody>
  </table>
</div>
```
*Result: Zebra-striping, hover effects, dark header, vertically aligned text, and scrolls horizontally on small screens.*
"""

interview_prep = """
**Q: How do you customize Bootstrap's default theme (e.g., changing the primary color)?**
**A:** The best practice is to customize Bootstrap via its Sass variables. You create a custom `.scss` file, define your variable overrides (like `$primary: #6f42c1;`), and then `@import` Bootstrap's source Sass files. You should never directly edit Bootstrap's compiled CSS or blindly override its classes with `!important`.

**Q: What is the difference between declarative and programmatic initialization of Bootstrap JS components?**
**A:** Declarative initialization relies entirely on HTML attributes (like `data-bs-toggle="modal"` and `data-bs-target="#myModal"`). Bootstrap's JS automatically detects these and makes them work without writing custom JavaScript. Programmatic initialization involves selecting the element and instantiating it via JS (`new bootstrap.Modal(document.getElementById('myModal'))`). Programmatic is useful when you need to trigger a component based on logic (e.g., showing a modal after an API call succeeds).

**Q: Why do tooltips and toasts require manual initialization in Bootstrap, while modals and dropdowns don't?**
**A:** Modals and dropdowns are typically triggered by direct user interactions on specific buttons. Tooltips can be numerous (potentially hundreds on a page). Initializing all of them automatically would have a severe performance impact. Bootstrap requires manual initialization for tooltips/toasts so developers can opt-in and control exactly when and where they are instantiated.

**Q: Explain how floating labels work in Bootstrap.**
**A:** Floating labels use CSS sibling selectors and the `:placeholder-shown` pseudo-class. The `<input>` must come *before* the `<label>` in the DOM, and it must have a `placeholder` attribute. When the input is focused or has a value (so the placeholder is not shown), CSS transforms the label to float above the input text.
"""

cheat_sheet = """
### Forms
- `.form-label`: Base styling for labels.
- `.form-control`: Main input styling.
- `.form-select`: Styled dropdown selects.
- `.form-check`: Wrapper for checkboxes/radios.
- `.form-check-input`: Styled checkbox/radio input.
- `.form-switch`: Turns a checkbox into a toggle switch.
- `.input-group`: Wrapper to append/prepend text or buttons to inputs.
- `.form-floating`: Wrapper for floating labels (input must precede label, requires placeholder).

### Validation
- `.needs-validation`: Added to form, combined with `novalidate` attribute.
- `.was-validated`: Toggled via JS on form submit to reveal validation UI.
- `.valid-feedback` / `.invalid-feedback`: Messages shown based on input validity.

### Tables
- `.table`: Base table styling.
- `.table-striped`: Zebra-striping.
- `.table-hover`: Hover state on rows.
- `.table-bordered`: Borders on all sides of table and cells.
- `.table-dark`: Dark theme for table or thead.
- `.table-responsive`: Wrapper `<div>` to enable horizontal scrolling on mobile.

### JS Components
- **Modals:** `data-bs-toggle="modal"` `data-bs-target="#id"`
- **Tabs:** `data-bs-toggle="tab"` `data-bs-target="#id"`
- **Accordions:** `data-bs-toggle="collapse"` `data-bs-parent="#id"`
- **Tooltips:** `new bootstrap.Tooltip(element)`
- **Toasts:** `new bootstrap.Toast(element).show()`
"""

new_content = f"""{title_meta}

---

## 1. 🛑 Prerequisites

{prerequisites.strip()}

---

## 2. 🎯 Objectives

{objectives.strip()}

---

## 3. 📋 Agenda

{agenda.strip()}

---

## 4. 📖 Deep Dive

{deep_dive.strip()}

---

## 5. 🧠 Think Like a Dev

{think_like_a_dev.strip()}

---

## 6. 🔄 Before / After

{before_after.strip()}

---

## 7. ⚠️ Common Mistakes

{mistakes.strip()}

---

## 8. 🧪 Labs

{labs.strip()}

---

## 9. 💼 Interview Prep

{interview_prep.strip()}

---

## 10. 📑 Cheat Sheet

{cheat_sheet.strip()}

---

## 11. 📌 Key Takeaways

{takeaways.strip()}

---

{next_lecture.strip()}
"""

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Done! New size: {len(new_content.encode('utf-8'))} bytes.")
