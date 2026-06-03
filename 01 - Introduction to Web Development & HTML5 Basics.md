# Lecture 01 — Introduction to Web Development & HTML5 Basics

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand what HTML is and why it exists
- Write a complete, valid HTML5 document from scratch
- Use semantic elements to give meaning and structure to your content
- Apply the most common HTML tags: headings, paragraphs, lists, links, images
- Understand the difference between block and inline elements
- Use VS Code with Emmet to write HTML quickly
- Begin building your personal developer portfolio

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. What is HTML? Why does it exist?
2. The HTML5 Document Structure (Boilerplate)
3. Semantic Elements — the HTML5 Revolution
4. The Most Important HTML Tags
5. Block vs Inline Elements
6. Links, Images & File Paths

### Part 2 — Practice & Lab (~90–120 minutes)
1. Personal Profile Page (semantic HTML5)
2. Inspect and Modify DOM with DevTools
3. Multi-section Resume Page
4. Portfolio Project Part 1

---

## 1. What is HTML? Why Does It Exist?

### Plain-English Introduction

Imagine you've written a book and you want to tell the printer:
- "This line is the title — make it big"
- "These three sentences form a paragraph"
- "This is a bullet-point list"
- "This word is a link to another page"

In print, you'd use formatting marks or instructions. On the web, we use **HTML (HyperText Markup Language)** — a system of text labels called **tags** that tell the browser what each piece of content *is*.

HTML is **not** a programming language — it doesn't do calculations or make decisions. It simply **describes the structure and content** of a document. Think of it as the **architect's blueprint**: it defines what rooms exist and what goes in them, but doesn't decide the paint colour (CSS) or the lighting automation (JavaScript).

**Analogy:** A house blueprint shows where walls, doors, and windows go — it doesn't choose the wallpaper or install smart lights. HTML is the blueprint.

### Why "HyperText"?

The "Hyper" in HyperText refers to **links** — the ability to click a word on one document and instantly jump to another document anywhere in the world. This was revolutionary in 1991 and remains the core feature of the web today.

### A Brief History

| Year | Milestone |
|------|-----------|
| 1991 | Tim Berners-Lee invents HTML to share scientific documents |
| 1999 | HTML 4 standardises the web |
| 2008–2014 | HTML5 developed — adds video, audio, forms, semantic elements |
| Today (2026) | HTML5 is the living standard, continuously updated |

### 📌 Section Recap
- HTML = HyperText Markup Language — describes structure and content, not appearance
- Tags are labels telling the browser what each piece of content is
- HTML is the blueprint; CSS is the interior design; JavaScript is the automation
- "HyperText" = the ability to link documents together

---

## 2. The HTML5 Document Structure (Boilerplate)

### Plain-English Introduction

Every single HTML page on the web follows the same basic skeleton. It's like a legal document — it must follow a specific format to be valid. Once you understand this structure, it becomes second nature.

Here is the complete HTML5 boilerplate with a comment explaining every single line:

```html
<!DOCTYPE html>
<!-- This MUST be the very first line of every HTML file.                      -->
<!-- It tells the browser: "Render this page using modern HTML5 standards."    -->
<!-- Without it, browsers enter "quirks mode" — inconsistent, buggy rendering. -->
<!-- Note: <!DOCTYPE> is NOT an HTML tag — it's a document type declaration.   -->

<html lang="en">
<!-- The ROOT element — everything else in the page lives inside here.         -->
<!-- There is ONLY ONE <html> element per page.                                -->
<!-- lang="en" declares the page language as English.                          -->
<!--   Why this matters:                                                       -->
<!--   • Screen readers choose the correct text-to-speech voice                -->
<!--   • Search engines serve results in the right language                    -->
<!--   • Browser spell-checkers use the correct dictionary                     -->
<!--   Use "ar" for Arabic, "fr" for French, "de" for German, etc.            -->

  <head>
    <!-- The <head> contains METADATA — information ABOUT the page.            -->
    <!-- Nothing inside <head> is VISIBLE to the user on screen.               -->
    <!-- Think of it as the cover of a book: title and metadata, not content.  -->

    <meta charset="UTF-8">
    <!-- Defines the character encoding — how the browser interprets text.     -->
    <!-- UTF-8 is universal and supports EVERY human writing system:           -->
    <!--   English: a–z, A–Z                                                   -->
    <!--   Accented: é ü ñ ø                                                   -->
    <!--   Arabic: العربية   Chinese: 中文   Japanese: 日本語                    -->
    <!--   Emoji: 🎉 🚀 💻                                                      -->
    <!-- Without this, special characters appear as garbled symbols: â€™       -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CRITICAL for mobile devices.                                           -->
    <!-- "width=device-width" = use the device's actual screen width           -->
    <!--   (NOT a simulated 980px desktop width that mobile browsers default to)-->
    <!-- "initial-scale=1.0" = don't zoom in or out on page load               -->
    <!-- Without this: mobile browsers zoom way out, text becomes microscopic. -->

    <meta name="description" content="A page describing web development basics.">
    <!-- The SEO description — shown under the page title in Google results.   -->
    <!-- Keep it under 160 characters. Make it informative and compelling.     -->

    <title>My Portfolio | Alex Chen</title>
    <!-- Text shown in the browser tab.                                        -->
    <!-- Also used as the headline in Google search results.                   -->
    <!-- Best practice: "Page Name | Site Name"                                -->

    <link rel="stylesheet" href="css/style.css">
    <!-- Links to an external CSS stylesheet.                                  -->
    <!-- rel="stylesheet" = the type of relationship (it's a stylesheet).      -->
    <!-- href="css/style.css" = path to the CSS file (relative path here).     -->
    <!-- CSS is loaded in <head> so the browser knows styles BEFORE rendering. -->

  </head>

  <body>
    <!-- Everything the user SEES on screen goes inside <body>.                -->
    <!-- All visible content lives here: text, images, forms, buttons, etc.   -->
    <!-- There is ONLY ONE <body> element per page.                            -->

    <!-- Your visible content goes here -->

  </body>

</html>
<!-- Closing tag for the root <html> element.                                  -->
<!-- Every opening tag needs a matching closing tag (with a forward slash).    -->
```

### The Head vs Body — Visual Summary

```
┌─────────────────────────────────────────────────────┐
│                   <html lang="en">                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                   <head>                      │  │
│  │         INVISIBLE — metadata only             │  │
│  │                                               │  │
│  │  <meta charset="UTF-8">      → encoding       │  │
│  │  <meta name="viewport" ...>  → mobile size    │  │
│  │  <meta name="description" …> → SEO snippet    │  │
│  │  <title>Page Title</title>   → tab text       │  │
│  │  <link rel="stylesheet" …>   → CSS file       │  │
│  │  <script src="…" defer>      → JS file        │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                   <body>                      │  │
│  │           VISIBLE — user content              │  │
│  │                                               │  │
│  │  <header>  <nav>  <main>  <footer>            │  │
│  │  Headings, paragraphs, images, forms          │  │
│  │  Everything the user sees and interacts with  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### The Emmet Shortcut

Instead of typing the entire boilerplate manually, use **Emmet** in VS Code:

1. Create a new `.html` file
2. Type `!` (just the exclamation mark)
3. Press `Tab`

VS Code generates the full HTML5 boilerplate instantly. Always use this shortcut!

### Common Mistakes & How to Avoid Them

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| Missing `<!DOCTYPE html>` | Forgetting the first line | Use Emmet (`!` + Tab) — it's always included |
| Content placed outside `<body>` | Pasting code in the wrong location | Always structure: `<html>` → `<head>` + `<body>` |
| Missing `lang` attribute on `<html>` | Not understanding its importance | Always include `lang="en"` (or your page's language) |
| Deleting the viewport meta tag | Thinking it's unnecessary | Never delete it — it's required for mobile responsiveness |
| Forgetting `<meta charset="UTF-8">` | Not understanding encoding | Emmet includes it — never delete it |

### 📌 Section Recap
- Every HTML page starts with `<!DOCTYPE html>` — mandatory, always first
- `<html lang="en">` wraps everything — one per page
- `<head>` = invisible metadata; `<body>` = visible content
- The viewport meta tag is essential for mobile devices
- Use Emmet (`!` + Tab in VS Code) to generate the boilerplate instantly

---

## 3. Semantic Elements — The HTML5 Revolution

### Plain-English Introduction

Before HTML5, most web pages used `<div>` for everything:

```html
<div id="header">Logo & Nav</div>
<div id="content">Main stuff</div>
<div id="sidebar">Related links</div>
<div id="footer">Copyright</div>
```

A `<div>` is a generic, meaningless container. Labelling every box in your house "Box" is technically correct — but completely useless for finding anything.

HTML5 introduced **semantic elements**: tags with meaningful names that describe *what the content actually is*:

```html
<header>Logo & Nav</header>
<main>Main stuff</main>
<aside>Related links</aside>
<footer>Copyright</footer>
```

Now the structure **communicates its own meaning** — to browsers, screen readers, search engines, and other developers.

### Why Semantics Matter — 3 Big Reasons

**Reason 1 — Accessibility:**
Screen readers (used by visually impaired users) use semantic elements to navigate pages. A screen reader can announce "Navigation region" for `<nav>`, letting users skip straight to the menu. With `<div id="nav">`, it has no idea what anything means.

**Reason 2 — SEO:**
Google's crawlers read semantic HTML to understand your page's structure. Content inside `<article>` or `<main>` is weighted more heavily than content inside generic `<div>` tags.

**Reason 3 — Maintainability:**
Code is read far more often than it's written. `<article>` is instantly recognisable as a blog post or content card. `<aside>` is obviously a sidebar. `<section>` is clearly a themed group of content. Self-documenting code = less confusion.

### The Core Semantic Layout Elements

```
┌─────────────────────────────────────────────────────────┐
│                      <header>                           │
│   Site logo, site name, primary navigation              │
│   (Can also appear inside <article> as an article header)│
├─────────────────────────────────────────────────────────┤
│                       <nav>                             │
│   Primary navigation links (menus, breadcrumbs)         │
│   Only for MAJOR navigation — not every group of links  │
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│   <aside>     │              <main>                     │
│               │                                         │
│  Secondary    │  The PRIMARY, UNIQUE content of the page│
│  content:     │  Only ONE <main> per page               │
│  sidebars,    │                                         │
│  related      │  ┌───────────────────────────────────┐ │
│  links, ads   │  │           <article>               │ │
│               │  │  Self-contained content that could │ │
│               │  │  stand alone: blog post, news item,│ │
│               │  │  comment, product card             │ │
│               │  └───────────────────────────────────┘ │
│               │                                         │
│               │  ┌───────────────────────────────────┐ │
│               │  │           <section>               │ │
│               │  │  A themed group of content.        │ │
│               │  │  Always has a heading inside it.   │ │
│               │  │  "About Me", "My Skills", "FAQ"    │ │
│               │  └───────────────────────────────────┘ │
│               │                                         │
├───────────────┴─────────────────────────────────────────┤
│                      <footer>                           │
│   Copyright, contact info, legal links, social icons   │
└─────────────────────────────────────────────────────────┘
```

### Full Semantic Page Example with Comments

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Chen | Full-Stack Developer</title>
  <meta name="description" content="Alex Chen's web developer portfolio showcasing projects in Angular and ASP.NET.">
</head>
<body>

  <header>
    <!-- Site-wide header — appears on every page -->
    <!-- Contains the brand identity and primary navigation -->

    <h1>Alex Chen</h1>
    <!-- The ONE and ONLY <h1> on this page — the page's main title     -->

    <nav>
      <!-- Primary navigation — the main menu of the site -->
      <!-- Uses anchor links (#id) to jump to page sections -->
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <!-- The main content — unique to THIS page -->
    <!-- This is what the page is actually ABOUT -->

    <section id="about">
      <!-- A themed section — always has a heading inside it -->
      <h2>About Me</h2>
      <p>I'm a full-stack developer passionate about building things for the web.</p>
    </section>

    <section id="skills">
      <h2>My Skills</h2>
      <ul>
        <li>HTML5 &amp; CSS3</li>
        <li>JavaScript &amp; TypeScript</li>
        <li>C# &amp; ASP.NET Core</li>
        <li>SQL Server</li>
        <li>Angular</li>
      </ul>
    </section>

    <section id="projects">
      <h2>Projects</h2>

      <article>
        <!-- An <article> is self-contained — it makes sense on its own -->
        <h3>TaskFlow Dashboard</h3>
        <p>A dynamic task management app built with JavaScript.</p>
        <a href="https://github.com/alexchen/taskflow" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </article>

      <article>
        <h3>ShopAngular E-Commerce</h3>
        <p>A full-featured shopping app built with Angular and ASP.NET Core.</p>
        <a href="https://github.com/alexchen/shopangular" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </article>
    </section>

    <section id="contact">
      <h2>Get in Touch</h2>
      <p>Email: <a href="mailto:alex@example.com">alex@example.com</a></p>
    </section>

  </main>

  <aside>
    <!-- Related but secondary content — sidebar, quick links -->
    <h2>Quick Links</h2>
    <ul>
      <li><a href="https://github.com/alexchen" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="https://linkedin.com/in/alexchen" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
    </ul>
  </aside>

  <footer>
    <!-- Site-wide footer -->
    <p>&copy; 2026 Alex Chen. All rights reserved.</p>
  </footer>

</body>
</html>
```

### Non-Semantic vs Semantic — Side by Side

```html
<!-- ❌ Bad — tells nothing about content purpose -->
<div id="header">
  <div id="logo">My Site</div>
  <div id="nav">
    <div class="nav-link">Home</div>
  </div>
</div>
<div id="main-content">
  <div class="blog-post">...</div>
</div>
<div id="foot">Copyright 2026</div>

<!-- ✅ Good — structure communicates its own meaning -->
<header>
  <h1>My Site</h1>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>...</article>
</main>
<footer>Copyright 2026</footer>
```

### Common Mistakes & How to Avoid Them

| Mistake | Fix |
|---------|-----|
| Multiple `<main>` elements on one page | Only ONE `<main>` per page — it must be unique |
| Using `<section>` for every container | `<section>` is for themed groups with headings. Generic grouping? Use `<div>`. |
| Missing headings inside `<section>` | Every `<section>` should have a heading (`<h2>`, `<h3>`, etc.) |
| Using `<article>` for every card-shaped element | `<article>` is for self-contained content that could be shared independently |
| Nesting `<main>` inside semantic landmarks | `<main>` cannot be a child of `<article>`, `<aside>`, `<footer>`, `<header>`, or `<nav>` |

### 📌 Section Recap
- Semantic HTML describes *what* content is — for accessibility, SEO, and maintainability
- Core elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- Only ONE `<main>` per page; only ONE `<h1>` per page
- `<article>` = standalone content; `<section>` = themed group needing page context
- `<div>` = generic block container (no semantic meaning) — use as last resort

---

## 4. The Most Important HTML Tags

### Headings — The Page's Outline

```html
<h1>Main Page Title</h1>
<!-- Largest heading. ONE per page. Defines the page's main topic. -->
<!-- Think: the book's TITLE on the cover                          -->

<h2>Major Section Heading</h2>
<!-- Direct children of h1 — the main sections of your page        -->
<!-- Think: CHAPTER names in the book                              -->

<h3>Subsection Heading</h3>
<!-- Sub-topics within a major section                             -->
<!-- Think: SECTIONS within a chapter                              -->

<h4>Minor Heading</h4>
<!-- Rarely needed — for complex, deeply nested documents          -->

<h5>Very Minor Heading</h5>
<h6>Smallest Heading — Almost Never Used</h6>
```

> [!WARNING]
> **Never skip heading levels for visual styling purposes.** Don't jump from `<h1>` to `<h4>` just because you want a smaller font — that breaks screen reader navigation. Use CSS to control size. Always maintain the logical hierarchy: h1 → h2 → h3.

### Paragraphs and Text Emphasis

```html
<!-- p = paragraph — use for any block of regular body text -->
<p>
  This is a paragraph. Each <p> tag automatically gets spacing above and below.
</p>

<!-- strong = important text — semantic meaning: "this is critical!" -->
<!-- Screen readers add stress to strongly-important words -->
<p>Always use <strong>semantic HTML</strong> — it matters for accessibility.</p>

<!-- em = emphasised text — semantic meaning: "stress on this word" -->
<p>The function runs <em>asynchronously</em>, not synchronously.</p>

<!-- code = inline code snippet — monospace font -->
<p>Use the <code>console.log()</code> function to debug JavaScript.</p>

<!-- abbr = abbreviation — shows the full form on hover -->
<p><abbr title="HyperText Markup Language">HTML</abbr> is the language of the web.</p>

<!-- mark = highlighted/marked text -->
<p>The most important point is <mark>use semantic elements</mark>.</p>
```

### Lists — Ordered and Unordered

```html
<!-- ul = unordered list (bullets) — use when ORDER doesn't matter -->
<ul>
  <li>HTML</li>       <!-- li = list item -->
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<!-- Renders as:  • HTML  • CSS  • JavaScript -->

<!-- ol = ordered list (numbers) — use when ORDER matters -->
<ol>
  <li>Download VS Code</li>
  <li>Install the Live Server extension</li>
  <li>Create your first HTML file</li>
  <li>Open with Live Server</li>
</ol>
<!-- Renders as: 1. Download VS Code  2. Install...  etc. -->

<!-- Nested list — lists inside list items -->
<ul>
  <li>Frontend Technologies
    <ul>
      <li>HTML5</li>
      <li>CSS3</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend Technologies
    <ul>
      <li>C# &amp; ASP.NET Core</li>
      <li>SQL Server</li>
    </ul>
  </li>
</ul>
```

### Links — The Core of the Web

```html
<!-- Basic link to an external website -->
<a href="https://developer.mozilla.org">MDN Web Docs</a>
<!-- href = "HyperText REFerence" — where the link points                -->
<!-- The text between tags is what the user sees and clicks              -->

<!-- External link opening in a new tab -->
<a href="https://github.com" target="_blank" rel="noopener noreferrer">
  My GitHub Profile
</a>
<!-- target="_blank" = open in a new browser tab                         -->
<!-- rel="noopener noreferrer" = security protection against tabnapping  -->
<!-- ALWAYS use rel="noopener noreferrer" with target="_blank"           -->

<!-- Link to another page in your project (relative path) -->
<a href="about.html">About Me</a>
<a href="pages/contact.html">Contact</a>
<a href="../index.html">Back to Home</a>   <!-- ../ goes up one folder  -->

<!-- Anchor link — scrolls to a section on the SAME page -->
<a href="#projects">Jump to Projects</a>
<!-- The target: <section id="projects">...</section>                    -->

<!-- Email link — opens the user's email client -->
<a href="mailto:hello@example.com">Send me an email</a>

<!-- Phone link — works on mobile devices -->
<a href="tel:+15551234567">+1 (555) 123-4567</a>
```

### Images

```html
<!-- Basic image -->
<img src="images/photo.jpg" alt="A smiling profile photo of Alex Chen">
<!-- src = the path to the image file                                     -->
<!-- alt = alternative text — REQUIRED for every meaningful image        -->

<!-- Image with explicit dimensions (prevents layout shift) -->
<img
  src="avatar.jpg"
  alt="Profile photo of Alex Chen"
  width="200"
  height="200"
>
<!-- Setting width and height reserves space before the image loads      -->
<!-- Prevents "Cumulative Layout Shift" (CLS) — a Google SEO ranking signal -->

<!-- Decorative image (purely visual — no meaningful content) -->
<img src="decorative-wave.svg" alt="">
<!-- Empty alt="" tells screen readers to skip this image entirely       -->

<!-- Linked image — clicking the image goes to another page -->
<a href="https://github.com/alexchen">
  <img src="github-logo.png" alt="Alex Chen's GitHub profile">
</a>
```

> [!WARNING]
> **Never omit the `alt` attribute.** Missing `alt` is an accessibility failure — and potentially illegal in many countries for public-facing websites. If an image is decorative, use `alt=""` (empty string). Never just leave it out entirely.

### Generic Containers

```html
<!-- div = Division — BLOCK-level generic container -->
<!-- Use when no semantic element fits and you need to group block content -->
<div class="project-card">
  <h3>Project Title</h3>
  <p>Project description goes here.</p>
  <a href="#">View Project</a>
</div>
<!-- div takes the FULL WIDTH and starts on a NEW LINE                   -->

<!-- span = INLINE generic container -->
<!-- Use when no semantic element fits and you need to style inline text -->
<p>
  The error code is <span class="error-code">404</span> — not found.
</p>
<!-- span sits WITHIN the text flow — no line break before or after      -->
```

### HTML Entities — Special Characters

| Entity | Renders As | When to Use |
|--------|-----------|-------------|
| `&lt;` | `<` | Less-than sign in text |
| `&gt;` | `>` | Greater-than sign in text |
| `&amp;` | `&` | Ampersand in text |
| `&copy;` | © | Copyright symbol |
| `&nbsp;` | (non-breaking space) | Space that won't wrap |
| `&mdash;` | — | Em dash |
| `&pound;` | £ | British pound symbol |
| `&euro;` | € | Euro symbol |

```html
<p>HTML uses &lt;tags&gt; to mark up content.</p>
<!-- Renders as: HTML uses <tags> to mark up content. -->

<footer>
  <p>&copy; 2026 Alex Chen. All rights reserved.</p>
  <!-- Renders as: © 2026 Alex Chen. All rights reserved. -->
</footer>
```

### Common Mistakes & How to Avoid Them

| Mistake | Fix |
|---------|-----|
| Using `<b>` for important text | Use `<strong>` — has semantic meaning (important) not just visual bold |
| Using `<i>` for emphasis | Use `<em>` — conveys stress emphasis to screen readers |
| Skipping heading levels (h1 → h4) | Maintain hierarchy: h1 → h2 → h3. Use CSS for visual size |
| Wrapping block elements in inline elements | Never put `<div>` or `<p>` inside `<span>` or `<a>` |
| Using `<br><br>` for vertical spacing | Use CSS `margin` or `padding` — `<br>` is only for meaningful line breaks |
| Missing quotes around attribute values | Always quote attributes: `href="..."` not `href=...` |

### 📌 Section Recap
- Headings h1–h6 define the content outline — never skip levels for visual styling
- `<strong>` (important) and `<em>` (emphasis) have semantic meaning — use them over `<b>` and `<i>`
- `<ul>` for unordered lists, `<ol>` for ordered lists — always use `<li>` inside
- Links need `href`; external links need `target="_blank" rel="noopener noreferrer"`
- Images need `alt` — always; empty `alt=""` only for purely decorative images
- `<div>` (block) and `<span>` (inline) are generic containers — use when no semantic element fits

---

## 5. Block vs Inline Elements

### Plain-English Introduction

Every HTML element behaves as either **block-level** or **inline-level** by default. This determines how elements arrange themselves on the page — completely independently of any CSS.

**Block elements** are like paragraphs in a book: each one starts on a new line and takes up the full width of the page.

**Inline elements** are like words within a paragraph: they flow alongside the surrounding text without breaking to a new line.

```
BLOCK elements (each occupies its own line):
┌────────────────────────────────────────────┐
│ <h2>My Skills Section</h2>                 │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│ <p>I know HTML, CSS, and JavaScript.</p>   │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│ <ul><li>HTML</li><li>CSS</li></ul>         │
└────────────────────────────────────────────┘

INLINE elements (flow within text):
This is a paragraph with a <a>link</a>, some <strong>bold</strong>
text, and an <em>italic</em> word — all on the same line.
```

### Block Elements (Common Examples)

```
Block elements (new line, full width):
<div>, <p>, <h1>–<h6>, <ul>, <ol>, <li>,
<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>,
<form>, <table>, <blockquote>, <figure>, <figcaption>
```

### Inline Elements (Common Examples)

```
Inline elements (flow within text, no line break):
<span>, <a>, <strong>, <em>, <img>,
<input>, <button>, <code>, <label>, <abbr>, <time>
```

### Why This Matters

```html
<!-- Block elements stack vertically -->
<p>First paragraph</p>
<p>Second paragraph</p>
<!-- Two separate paragraphs, one below the other -->

<!-- Inline elements flow within their container -->
<p>
  I know <strong>HTML</strong>, <em>CSS</em>, and
  <a href="#">JavaScript</a>.
</p>
<!-- All three are on the same line as the surrounding paragraph text -->

<!-- ✅ VALID: inline elements inside block elements -->
<p>
  <strong>Important:</strong> Always use semantic HTML.
</p>

<!-- ❌ INVALID: block elements inside inline elements -->
<span>
  <p>This is wrong!</p>   <!-- Block inside inline — invalid -->
</span>
```

> [!NOTE]
> CSS can change any element's default display behaviour using the `display` property. This is covered in detail in Lecture 04. But understanding the HTML defaults helps you predict layout before adding any CSS.

### 📌 Section Recap
- Block elements: start on new line, fill full width (`<div>`, `<p>`, `<h1>`–`<h6>`)
- Inline elements: flow within text, take only the space they need (`<span>`, `<a>`, `<strong>`)
- Inline elements **cannot** contain block elements
- Images are inline by default (but can be changed with CSS)
- CSS can change display behaviour — the defaults are just starting points

---

## 6. Links, Images & File Paths

### Understanding File Paths

When linking to a file or image within your own project, you use a **relative path** — the path relative to *where the current file lives*.

Think of it like giving directions:
- "It's in *this same folder*" → `filename.html`
- "It's in a *subfolder*" → `subfolder/filename.html`
- "It's *one level up*" → `../filename.html`
- "It's *two levels up*" → `../../filename.html`

```
Example project structure:
my-portfolio/
├── index.html            ← You are working in this file
├── about.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── images/
│   ├── avatar.jpg
│   └── project1.png
└── pages/
    └── contact.html
```

```html
<!-- From index.html — paths to different locations: -->

<!-- File in the SAME folder as index.html -->
<a href="about.html">About Me</a>

<!-- File in a SUBFOLDER -->
<a href="pages/contact.html">Contact</a>
<img src="images/avatar.jpg" alt="My profile photo">

<!-- CSS and JS files in subfolders -->
<link rel="stylesheet" href="css/style.css">
<script src="js/app.js" defer></script>

<!-- From pages/contact.html — going UP to parent folder: -->
<a href="../index.html">Back to Home</a>
<img src="../images/avatar.jpg" alt="My profile photo">
```

> [!TIP]
> Use **relative paths** for files within your own project — they work no matter where you deploy the site. Use **absolute URLs** (`https://...`) only for resources hosted on external servers.

### Common Path Mistakes & Fixes

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| `<img src="C:\Users\Me\Desktop\photo.jpg">` | Copy-pasting from File Explorer | Never use system-absolute paths — use relative paths |
| Image shows broken icon | Wrong relative path | Double-check the exact folder structure |
| `../` doesn't seem to work | Miscounting levels | Count one `../` per folder level you need to go up |
| CSS not loading | Wrong path in `<link href="...">` | Open DevTools → Network tab to see the exact error |

### 📌 Section Recap
- Relative paths are relative to the current file's location
- `images/photo.jpg` = file in a subfolder named "images"
- `../index.html` = file one folder level up from the current file
- Never use system-absolute paths (`C:\...`) — they only work on your machine
- Use `https://...` absolute URLs only for external resources

---

## 🧪 Practice Labs

### Lab 1: Personal Profile Page (30 min)

Build a personal profile page using semantic HTML5.

**Steps:**
1. Create `labs/lab1-profile.html`
2. Generate the boilerplate with Emmet (`!` + Tab)
3. Build this structure:
   - `<header>` with your name in `<h1>` and `<nav>` with anchor links
   - `<main>` containing:
     - `<section id="about">` with `<h2>` and a bio paragraph
     - `<section id="skills">` with `<h2>` and a `<ul>` of 5 skills
   - `<footer>` with copyright notice using `&copy;`
4. Add a placeholder image: `<img src="https://picsum.photos/200/200" alt="Profile photo placeholder">`
5. Open with Live Server and verify the structure looks correct

### Lab 2: Explore Browser DevTools (20 min)

**Steps:**
1. Open your Lab 1 page in Chrome/Edge
2. Press `F12` → go to the **Elements** tab
3. Find your `<h1>` element and double-click its text — change it live
4. Find your `<body>` tag → right-click → "Edit attribute" → add: `style="background-color: lightyellow;"`
5. Refresh the page — notice it resets (DevTools changes are temporary)
6. Go to the **Console** tab and type: `document.title = "I changed the title!"`
7. Notice the browser tab text changes

### Lab 3: Multi-Section Resume Page (40 min)

**Steps:**
1. Create `labs/lab3-resume.html`
2. Add the HTML5 boilerplate
3. Build sections with semantic HTML:
   - `<header>` with name, job title, and contact links
   - `<main>` with:
     - `<section id="education">` — `<ol>` of your education
     - `<section id="experience">` — `<article>` elements for each role
     - `<section id="skills">` — `<ul>` of skills
4. Add `<nav>` with anchor links pointing to each section's `id`
5. Test clicking the nav links — they should scroll to each section

---

## 📝 Assignment: Portfolio Project — Part 1

### Overview

We are building a complete professional developer portfolio over 8 lectures. Today: the **semantic HTML skeleton** — structure only, no CSS.

### Requirements

1. Create the folder structure:
   ```
   portfolio/
   └── index.html
   ```

2. Add the full HTML5 boilerplate:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="description" content="Your Name — Full-Stack Developer Portfolio">
     <title>Your Name | Full-Stack Developer</title>
   </head>
   ```

3. Inside `<body>`, build this structure:

   **`<header>`**:
   - Your name in `<h1>`
   - `<nav>` with anchor links to: `#about`, `#skills`, `#projects`, `#contact`

   **`<main>`**:
   - `<section id="home">` — Hero section with `<h2>` catchy headline + short paragraph
   - `<section id="about">` — `<h2>` + 2–3 paragraphs about yourself
   - `<section id="skills">` — `<h2>` + `<ul>` of technologies you'll learn
   - `<section id="projects">` — `<h2>` + placeholder paragraph
   - `<section id="contact">` — `<h2>` + `mailto:` link and GitHub link

   **`<footer>`**:
   - `<p>&copy; 2026 Your Name</p>`

4. ✅ **No CSS at all** — pure semantic skeleton only
5. ✅ Validate at [validator.w3.org](https://validator.w3.org/) — fix every error before submitting

### Optional Bonus

1. Add `target="_blank" rel="noopener noreferrer"` to all external links
2. Use the `<time>` element for the year:
   ```html
   <p>&copy; <time datetime="2026">2026</time> Your Name</p>
   ```
3. Add a headshot: `<img src="images/avatar.jpg" alt="Photo of [Your Name]" width="200" height="200">`

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN Web Docs — HTML | https://developer.mozilla.org/en-US/docs/Web/HTML |
| W3C Markup Validation Service | https://validator.w3.org/ |
| MDN — HTML Elements Reference | https://developer.mozilla.org/en-US/docs/Web/HTML/Element |
| HTML Entity Reference | https://html.spec.whatwg.org/multipage/named-characters.html |
| Emmet Documentation | https://emmet.io/ |

---

## 📌 Key Takeaways

- **HTML describes structure and content** — it's the blueprint, not the painting
- Every HTML page has the same skeleton: `<!DOCTYPE html>` → `<html lang="en">` → `<head>` + `<body>`
- The **viewport meta tag** is mandatory for mobile-friendly pages — never delete it
- **Semantic elements** (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`) communicate meaning to browsers, screen readers, and search engines
- **Only one `<h1>`** per page — maintain a logical heading hierarchy (never skip levels)
- **Always include `alt` text** on every `<img>` — use empty `alt=""` only for decorative images
- **Always use `rel="noopener noreferrer"`** with `target="_blank"` on external links
- **Block elements** stack vertically; **inline elements** flow within text

---

**Next Lecture:** [Lecture 02 — HTML5 Forms, Tables & Multimedia →](./02%20-%20HTML5%20Forms,%20Tables%20%26%20Multimedia.md)