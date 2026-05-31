# Lecture 01 — Introduction to Web Development & HTML5 Basics

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand how the internet works and what happens when you visit a website
- Distinguish between front-end, back-end, and full-stack development
- Set up your development environment (VS Code + AI editors + browser DevTools)
- Write a complete HTML5 page using semantic elements
- Use basic HTML tags to structure content
- Begin building your personal developer portfolio

---

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. Internet & Web Fundamentals (HTTP/1 to HTTP/3)
2. Front-end vs Back-end vs Full-stack
3. Tooling: Code Editors, Browsers, DevTools & Modern Terminals
4. HTML5 Document Anatomy
5. Semantic Elements
6. Basic Tags

### Part 2 — Practice & Lab (~90–120 minutes)
1. Personal Profile Page (semantic HTML5)
2. Inspect and Modify DOM with DevTools
3. Simple Multi-section Resume Page

---

## 1. How the Web Works — The Client-Server Model

Before we write any code, let's understand what actually happens when you type a website address into your browser and press Enter.

**In plain English:** Think of it like ordering food at a restaurant. You (the **client**) look at the menu and tell the waiter what you want. The waiter carries your order to the kitchen (the **server**), which prepares your food and sends it back through the waiter. In web development:

- **Client (Browser)** — Your web browser (Chrome, Firefox, Edge). It sends a request asking for a web page.
- **Server** — A computer somewhere in the world that stores the website's files. It receives your request and sends back the web page.
- **HTTP / HTTPS** — The "language" the client and server use to communicate. HTTP stands for **HyperText Transfer Protocol**. HTTPS is the secure (encrypted) version — look for the 🔒 icon in your browser's address bar.

### The Evolution of HTTP (HTTP/1 to HTTP/3)
- **HTTP/1.1 (1997):** Fetched one file at a time sequentially.
- **HTTP/2 (2015):** Allowed multiple files to be fetched simultaneously over a single connection (multiplexing), making modern websites load much faster.
- **HTTP/3 (2022+):** Built on a new protocol (QUIC) designed specifically to improve speed and reliability on mobile networks, fixing issues when users switch between Wi-Fi and cellular.

> [!TIP]
> Every website you visit follows this pattern. Later in this course, we'll build our own servers with ASP.NET Web API, and our own clients with Angular. For now, understanding this request/response cycle is the most important concept.

---

## 2. Web Development Roles

Web development has different specialisations. Here's what each one focuses on:

| Role | Focus Area | What They Build |
|------|-----------|-----------------|
| **Front-End Developer** | HTML, CSS, JavaScript, UI frameworks | What users see and interact with |
| **Back-End Developer** | Server-side languages, databases, APIs | The behind-the-scenes logic and data storage |
| **Full-Stack Developer** | Both front and back end | Complete applications from start to finish |
| **DevOps Engineer** | Deployment, CI/CD, infrastructure | The systems that deliver code to users |

**This course prepares you as a Full-Stack Developer** — you'll learn how to build every layer of a web application.

> [!NOTE]
> A full-stack developer can build an entire application from scratch. By the end of this course, you'll be comfortable with each of these roles' tools and responsibilities.

---

## 3. Essential Tools — Setting Up Your Environment

You only need three things to start building websites:

### The Code Editor: VS Code vs AI-Powered Editors

**Visual Studio Code (VS Code)** is the industry standard editor. It's free, lightweight, and highly customizable. We recommend starting here to learn the fundamentals without the editor writing the code for you.

> [!IMPORTANT]
> **AI-Powered Editors in 2026:** Editors like **Cursor** and **Windsurf** are incredibly popular among professionals. They are "forks" of VS Code with powerful AI built directly into the editor, allowing you to generate, refactor, and debug code instantly. While extremely powerful, we recommend mastering the basics first before relying entirely on AI autocompletion.

### A Modern Web Browser

Use **Google Chrome**, **Mozilla Firefox**, or **Microsoft Edge**. All of them include **Developer Tools** (DevTools) — a powerful set of tools built into the browser for inspecting and debugging web pages.

**How to open DevTools:** Press `F12` on any web page, or right-click anywhere and select "Inspect".

### Modern Terminals
As a web developer, you will spend a lot of time in the command line.
- **Windows:** Use **Windows Terminal** (install from the Microsoft Store) which supports multiple tabs, PowerShell, and WSL (Windows Subsystem for Linux).
- **Mac:** Use **iTerm2** or the built-in Terminal.

> [!TIP]
> DevTools will be your best friend throughout this course. Get comfortable pressing `F12` and exploring — you can't break anything permanently. Any changes you make in DevTools are temporary and disappear when you refresh the page.

---

## 4. HTML5 Document Structure

**What is HTML?** HTML stands for **HyperText Markup Language**. It's the standard language used to create the *structure* and *content* of web pages. HTML tells the browser **what** things are (headings, paragraphs, images, links), while CSS (which we'll learn next) tells the browser **how** things look.

Every HTML page follows the same basic skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Title</title>
</head>
<body>
    <!-- Visible content goes here -->
</body>
</html>
```

Let's break down each part:

| Element | Purpose |
|---------|---------|
| `<!DOCTYPE html>` | Tells the browser "this is an HTML5 document" — always the first line |
| `<html lang="en">` | The root (outermost) element. The `lang` attribute tells screen readers the page is in English |
| `<head>` | Contains **metadata** — information *about* the page that users don't see directly |
| `<meta charset="UTF-8">` | Sets the character encoding so the browser can display special characters correctly |
| `<meta name="viewport" ...>` | Makes the page display correctly on mobile devices |
| `<title>` | The text shown in the browser tab — also used by search engines |
| `<body>` | Everything the user actually sees on the page goes here |

---

## 5. Semantic Elements in HTML5

**What does "semantic" mean?** A semantic element clearly describes its meaning to both the browser and the developer. Instead of using generic `<div>` tags for everything, HTML5 provides elements with meaningful names.

```html
<header>      <!-- Top section of a page (logo, navigation)     -->
<nav>         <!-- Navigation links                              -->
<main>        <!-- The primary content of the page               -->
<article>     <!-- A self-contained piece of content (blog post) -->
<section>     <!-- A thematic grouping of content                -->
<aside>       <!-- Sidebar or related content                    -->
<footer>      <!-- Bottom of the page (copyright, contact info)  -->
```

### Why Use Semantic Elements?

1. **Accessibility** — Screen readers (software used by visually impaired users) can understand the page structure and navigate it more easily.
2. **SEO** — Search engines like Google can better understand what your page is about.
3. **Maintainability** — Other developers (and future you) can read and understand your code more quickly.

**Example — Non-semantic vs. Semantic:**

```html
<!-- ❌ Non-semantic: unclear what each section is for -->
<div>
    <div>Logo and Navigation</div>
    <div>Main content here</div>
    <div>Footer info</div>
</div>

<!-- ✅ Semantic: immediately clear what each section represents -->
<header>Logo and Navigation</header>
<main>Main content here</main>
<footer>Footer info</footer>
```

---

## 6. Basic HTML Tags

These are your building blocks — the most common tags you'll use in every web page:

| Tag | Purpose | Example |
|-----|---------|---------|
| `<h1>` to `<h6>` | Headings (h1 is largest, h6 is smallest) | `<h1>Welcome</h1>` |
| `<p>` | Paragraph of text | `<p>This is a paragraph.</p>` |
| `<ul>`, `<ol>`, `<li>` | Lists — unordered (bullets) and ordered | `<ul><li>Item</li></ul>` |
| `<a>` | Hyperlink — links to another page or section | `<a href="https://...">Click</a>` |
| `<img>` | Image — displays a picture | `<img src="photo.jpg" alt="Desc">` |
| `<div>` | Generic block container — used for grouping | `<div>Block content</div>` |
| `<span>` | Inline container — used for styling text | `<span>Highlighted text</span>` |

### Important Notes for Beginners

- **Always set the `alt` attribute on images.** This text describes the image for screen readers and appears if the image fails to load.
- **Use only one `<h1>` per page.** Think of headings like a book outline: one title (`<h1>`), chapters (`<h2>`), sections within chapters (`<h3>`), and so on.
- **The `href` attribute in `<a>` tags** stands for "hypertext reference" — it's the URL the link points to.

---

## 🧪 Practice Labs

### Lab 1: Personal Profile Page (30 min)
Build a personal profile page using semantic HTML5 elements:
1. Open the starter file `labs/lab1-profile-starter.html`
2. Add your name in the `<header>`
3. Add a navigation menu with links to sections on your page
4. Include a photo of yourself (or a placeholder) and a bio paragraph
5. List your skills in a `<ul>`

### Lab 2: Explore Browser DevTools (20 min)
1. Open your profile page from Lab 1 in Chrome or Edge
2. Press `F12` to open DevTools
3. In the Elements tab, click on your `<h1>` element
4. Double-click the text and change it live in the browser
5. Add `style="background-color: yellow;"` to your body tag to see how it works

### Lab 3: Multi-Section Resume Page (40 min)
Build a structured resume page with multiple sections:
1. Open the starter file `labs/lab3-resume-starter.html`
2. Create sections for Education, Experience, and Projects using `<section>` and `<h2>` tags
3. Use a mix of paragraphs and lists to describe your background
4. Add internal "jump" links at the top of the page connecting to the `id` of each section

---

## 📝 Assignment: Portfolio Start

### Requirements
1. Create a clean, perfectly indented HTML file using semantic tags.
2. The page must contain at least an `<h1>` heading, 3 paragraphs, an image, a list, and a link.
3. Validate your HTML using the W3C Validator and fix any errors.

### 🏗️ Portfolio Project: Personal Developer Portfolio — Part 1
We are building a complete, professional developer portfolio over the next 8 lectures. Today, we start with the absolute foundation: the semantic structure.

1. In your `assignment/` folder, create `index.html`.
2. Add the proper HTML5 boilerplate.
3. Add a semantic `<header>` with a `<nav>` for links like Home, About, Skills, Projects, and Contact.
4. Add a `<main>` section containing:
   - A hero `<section id="home">` with your name and a catchy headline
   - An `<section id="about">` with a bio paragraph
   - An `<section id="skills">` with a list of technologies you plan to learn
   - An `<section id="projects">` (leave a placeholder here for now)
   - An `<section id="contact">` with links to your email and GitHub
5. Add a `<footer>` with a copyright notice.
6. Make sure there is **no CSS** yet. We are building the pure semantic skeleton.

### Optional Bonus
1. Find a professional headshot of yourself, save it to the folder, and use a relative path to link it in the hero section.
2. Use `target="_blank"` on your external links (like GitHub) so they open in a new tab.
3. Use the HTML `<time>` element to semantically represent the current year in your footer.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MDN Web Docs — HTML | https://developer.mozilla.org/en-US/docs/Web/HTML |
| W3C Markup Validation Service | https://validator.w3.org/ |
| Windows Terminal | https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701 |

---

## 📌 Key Takeaways
- The web is built on the HTTP request-response cycle. Modern versions like HTTP/2 and HTTP/3 make it faster and more reliable.
- Modern developers use tools like VS Code, AI editors (Cursor), and powerful terminal environments.
- Every HTML5 page has the same skeleton: `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, etc.) make your code more accessible, SEO-friendly, and maintainable.
- Never forget the `alt` attribute on images, and only use one `<h1>` per page.

---

**Next Lecture:** [Lecture 02 — HTML5 Forms, Tables & Multimedia →](./02%20-%20HTML5%20Forms,%20Tables%20%26%20Multimedia.md)