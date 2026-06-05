import re
import os

filepath = r"D:\Projects\Fullstack Web Development Course\course-data\23 - Angular Architecture & First Application.md"
with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add Prerequisites
prerequisites = """
## 🛑 0. Prerequisites (What to know before starting)

Before diving into Angular v21, ensure you are comfortable with:
- **HTML & CSS:** Basic structure and styling (Grid/Flexbox).
- **JavaScript/TypeScript:** ES6 features (classes, arrow functions, destructuring) and basic types.
- **Command Line:** Navigating folders and running basic `npm` commands.

---
"""
text = text.replace("## 1. What Is Angular?", prerequisites + "\n## 1. What Is Angular?")

# 2. Add Think Like a Developer
think_like = """
### 🧠 Think Like a Developer: Handling Missing Data
**Scenario:** You fetch products, but the API is slow or returns an empty list.
**Bad Approach:** Show a blank screen while loading, let the user think the app is frozen.
**Expert Approach:** Always handle the three states (Loading, Success, Error). With `@if` and `@for`, show a skeleton loader, then the data, and an `@empty` block if no data exists. This improves UX and trust.
"""
text = text.replace("## 7. Reactive Data Fetching with `resource()`", "## 7. Reactive Data Fetching with `resource()`\n" + think_like)

# 3. Add Interview Prep, Cheat Sheet, and Common Mistakes Table
end_layers = """
## 🚫 Common Mistakes & How to Avoid Them

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Missing `track` in `@for` | Angular throws a compilation error. | Always use `track item.id` to identify elements. |
| Forgetting to call a signal `count` | Displays the signal object instead of its value. | Always use parentheses: `count()` or `{{ count() }}`. |
| Using `href` instead of `routerLink` | Causes full page reload, breaking the SPA experience. | Use `routerLink="/path"` for client-side navigation. |
| `resource()` loader not async | Throws an error, expects a Promise. | Always use `async () => { return await fetch(...) }`. |
| Running `ng new` inside a project | Creates nested projects, breaking builds. | Run `ng new` in a neutral parent directory. |

---

## 🎙️ Interview Prep

**Q1: How is Angular different from React?**
**A:** Angular is an opinionated, comprehensive framework with built-in routing, HTTP, and forms. React is a UI library that relies on third-party tools for these features.

**Q2: What are Standalone Components?**
**A:** Introduced in v14 (and default in v17+), they remove the need for `NgModules`. Components declare their own dependencies, making the app easier to learn and scale.

**Q3: Why use Signals over traditional variables?**
**A:** Signals provide fine-grained reactivity. They tell Angular exactly *what* changed, allowing zoneless, highly optimized UI updates without checking the entire component tree.

---

## 📑 Cheat Sheet

- **Interpolation:** `{{ value() }}`
- **Property Binding:** `[disabled]="isValid()"`
- **Event Binding:** `(click)="save()"`
- **Control Flow:** `@if (cond) { ... }`, `@for (item of items; track item.id) { ... }`
- **CLI Gen Component:** `ng g c my-component`

---
"""
text = text.replace("## 🔗 Resources", end_layers + "\n## 🔗 Resources")

# 4. Trimming fluff to reduce size

# Remove all original "Common Mistakes" sections with code blocks
text = re.sub(r"### Common Mistakes & How to Avoid Them.*?### Section Recap", "### Section Recap", text, flags=re.DOTALL)

# Remove Real-world analogy
text = re.sub(r"\*\*Real-world analogy:\*\*.*?### Key Characteristics of Angular v21", "### Key Characteristics of Angular v21", text, flags=re.DOTALL)

# Remove Folder Structure Walkthrough and Three Most Important files
text = re.sub(r"### Folder Structure Walkthrough.*?### The Bootstrap Process", "### The Bootstrap Process", text, flags=re.DOTALL)

# Remove angular vs react table and text completely, but we keep part of section 2 title or just remove the whole section?
# Let's remove Section 2 entirely to save space, the interview prep covers it!
text = re.sub(r"## 2\. Angular vs React vs Vue.*?## 3\. The Angular CLI", "## 3. The Angular CLI", text, flags=re.DOTALL)

# Remove manual state management problem
text = re.sub(r"### The Problem — Manual State Management is Tedious.*?### The Solution: `resource\(\)` \(Angular v19\+\)", "### The Solution: `resource()` (Angular v19+)", text, flags=re.DOTALL)

# Remove the CLI dry run and info sections
text = re.sub(r"# ── Dry Run.*?### Section Recap", "### Section Recap", text, flags=re.DOTALL)

# Let's see the new size
with open("temp.md", "w", encoding="utf-8") as f:
    f.write(text)

print(len(text.encode("utf-8")))
