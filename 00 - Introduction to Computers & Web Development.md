# Lecture 00 — Introduction to Computers & Web Development

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand the basic hardware components of a computer and how they work together
- Distinguish between different software layers and programming language types
- Explain how the Internet and the World Wide Web function at a high level
- Identify the roles of Frontend, Backend, and Full-Stack Developers
- Set up a professional web development environment on your computer
- Create and view your very first HTML web page

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. What is a Computer?
2. Software Layers & Programming Languages
3. How the Internet Works
4. How the Web Works
5. Web Browsers
6. What is Web Development?
7. Career Paths & The 2026 Landscape

### Part 2 — Practice & Lab (~90–120 minutes)
1. Developer Tools & Environment Setup
2. Your First Webpage
3. Course Roadmap
4. Practice Labs
5. Assignment

---

## 1. What is a Computer?

Before we can build software, we need to understand the machine that runs it. A computer is essentially a machine that takes input, processes it, and provides output. 

Think of a computer like a professional kitchen:

- **CPU (Central Processing Unit)**: The Chef. The CPU does all the actual work and calculations. It follows instructions (the recipe) step-by-step.
- **RAM (Random Access Memory)**: The Countertop. This is where the chef keeps the ingredients they are currently using. It's very fast to access, but if the kitchen closes (power goes off), the countertop gets cleared.
- **Storage (SSD/HDD)**: The Refrigerator/Pantry. This is where you store everything long-term. It's slower to access than the countertop, but it keeps your data safe even when the power is off.
- **I/O (Input/Output) Devices**: The Waiters and Plates. How information gets into the kitchen (keyboard, mouse) and how the results are presented to the customer (monitor, speakers).

When you write a program, you are essentially writing a recipe for the CPU (chef) to follow, using data from Storage (pantry) that gets loaded into RAM (countertop) while the program is running.

---

## 2. Software Layers

Hardware is useless without software. Software is the instructions that tell the hardware what to do.

1. **Operating System (OS)**: Windows, macOS, Linux. The OS is the restaurant manager. It handles the hardware and provides a platform for other software to run. It decides which application gets to use the CPU or RAM at any given moment.
2. **Applications**: Web browsers, games, word processors. These are the specific tasks you want the computer to perform.
3. **Programming Languages**: How we write applications.

### Compiled vs Interpreted Languages

> [!NOTE]  
> **Compiled Languages** (C++, C#, Java) are translated into machine code (1s and 0s) *before* the program runs. The compilation process takes time, but the resulting program runs very fast. Think of it like translating a whole book into another language before reading it.
> 
> **Interpreted Languages** (JavaScript, Python) are translated into machine code line-by-line *as* the program is running. This makes them easier to write and test quickly, but they can be slightly slower to execute. Think of it like having a live translator beside you.

In this course, we'll use both: **JavaScript** (interpreted) for the frontend, and **C#** (compiled) for the backend.

---

## 3. How the Internet Works

The Internet is simply a massive global network of interconnected computers.

- **ISP (Internet Service Provider)**: Companies like Comcast, AT&T, or Vodafone that provide you with a physical connection to the Internet.
- **IP Addresses**: Every computer on the Internet has a unique address, like `192.168.1.1` (IPv4) or `2001:0db8:85a3:0000:0000:8a2e:0370:7334` (IPv6). It's like a phone number for your computer.
- **DNS (Domain Name System)**: The phonebook of the Internet. Humans are bad at remembering IP addresses, so we use domain names like `google.com`. DNS translates `google.com` into the actual IP address of Google's servers.

### The TCP/IP Stack

Data travels across the internet in small chunks called **packets**.

| Layer | Protocol | Purpose |
|-------|----------|---------|
| Application | HTTP, FTP, SMTP | High-level data exchange (what we care about as web devs) |
| Transport | TCP, UDP | Ensures packets arrive in order and without errors |
| Internet | IP | Routes packets across networks to the correct destination |
| Link | Ethernet, Wi-Fi | The physical connection between devices |

> [!TIP]  
> **Latency vs Bandwidth**:
> - **Bandwidth** is how *much* data can travel at once (like the width of a highway).
> - **Latency** is how *fast* data travels from point A to point B (like the speed limit). 
> For a snappy web app, low latency is often more important than high bandwidth!

---

## 4. How the Web Works

The Internet is the infrastructure; the World Wide Web (the Web) is a service built *on top* of the Internet. The Web uses a protocol called **HTTP** (Hypertext Transfer Protocol).

### The Client-Server Model

The Web relies on a request-response cycle.

Imagine a restaurant:
- **Client (You/Browser)**: The customer sitting at the table. You want to see a webpage.
- **Server**: The kitchen. A powerful computer sitting somewhere in the world that stores the website's files.
- **HTTP**: The waiter. The client asks the waiter (HTTP Request) for the menu. The waiter takes the request to the kitchen (Server), and brings back the food (HTTP Response).

### HTTP Methods

When a client makes a request, it specifies an "action" using an HTTP method:

| Method | Description | Example Use Case |
|--------|-------------|------------------|
| `GET` | Read/Retrieve | Fetching a webpage or a list of products |
| `POST` | Create | Submitting a registration form |
| `PUT` | Update (Replace) | Updating your entire user profile |
| `PATCH`| Update (Partial) | Changing just your password |
| `DELETE`| Delete | Removing an item from your cart |

### HTTP Status Codes

The server always responds with a status code indicating what happened:

| Range | Meaning | Common Examples |
|-------|---------|-----------------|
| 1xx | Informational | `100 Continue` |
| 2xx | Success | `200 OK`, `201 Created` |
| 3xx | Redirection | `301 Moved Permanently` |
| 4xx | Client Error | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| 5xx | Server Error | `500 Internal Server Error`, `503 Service Unavailable` |

> [!IMPORTANT]  
> If it's a 4xx error, *you* (the client/developer) made a mistake. If it's a 5xx error, the *server* is broken.

### Anatomy of a URL

`https://www.example.com:443/products/shoes?color=red&size=10#details`

- **Scheme**: `https://` (the protocol)
- **Domain**: `www.example.com` (the server's address)
- **Port**: `:443` (the specific "door" on the server; usually hidden)
- **Path**: `/products/shoes` (the specific resource)
- **Query String**: `?color=red&size=10` (extra parameters)
- **Fragment**: `#details` (scroll to a specific part of the page)

---

## 5. Web Browsers

A web browser (Chrome, Edge, Firefox, Safari) is a complex piece of software. Its main job is to fetch resources from a server and render them visually.

### Rendering Engines
Browsers use "rendering engines" to turn code into visuals:
- **Blink**: Used by Chrome, Edge, Brave, Opera
- **Gecko**: Used by Firefox
- **WebKit**: Used by Safari

### The Page Load Waterfall
1. **DNS Resolution**: Find the IP address for the domain.
2. **TCP Handshake**: Establish a connection to the server.
3. **HTTP Request/Response**: Ask for the `index.html` file and receive it.
4. **Parsing**: The browser reads the HTML and discovers it needs CSS and Images. It makes more HTTP requests for those.
5. **Rendering**: The browser calculates the layout and paints the pixels on your screen.

---

## 6. What is Web Development?

Web development is the process of building websites and web applications. It is typically split into two main areas:

### Frontend (Client-Side)
Everything the user sees and interacts with in their browser.
- **HTML (Hypertext Markup Language)**: The structure and content (the skeleton).
- **CSS (Cascading Style Sheets)**: The design and layout (the skin and clothes).
- **JavaScript**: The interactivity and logic (the muscles and brain).

### Backend (Server-Side)
Everything that happens behind the scenes on the server.
- **Server Logic**: Processing data, handling business rules. We will use **C# and ASP.NET Core**.
- **Database**: Storing data persistently (user accounts, products, orders). We will use **SQL Server**.
- **API (Application Programming Interface)**: How the frontend talks to the backend.

### Full-Stack
A Full-Stack Developer is someone who can build both the frontend and the backend, creating a complete, functional web application from start to finish. That's what you're here to learn!

---

## 7. Career Paths & The 2026 Landscape

The web development industry in 2026 is robust, with high demand for skilled professionals who understand modern architectures.

| Role | Focus | Approx. 2026 Salary Range (US) |
|------|-------|--------------------------------|
| **Frontend Developer** | UI/UX implementation, Angular/React/Vue | $75k – $140k+ |
| **Backend Developer** | APIs, Databases, Server architecture, C#/.NET | $85k – $150k+ |
| **Full-Stack Developer**| Both Frontend and Backend, end-to-end features | $95k – $165k+ |
| **DevOps Engineer** | Deployment pipelines, cloud infrastructure | $105k – $180k+ |

> [!CAUTION]  
> While AI tools (like Copilot and Cursor) are ubiquitous in 2026, they have *not* replaced developers. They are tools that make developers faster. To succeed, you must understand the underlying principles to know when the AI is wrong or introducing security flaws.

---

## 8. Developer Tools & Environment Setup

To write code, you need the right tools.

### 1. The Code Editor: Visual Studio Code (VS Code)
VS Code is the industry standard editor. It's free, lightweight, and highly customizable.
While AI-first editors like Cursor and Windsurf are gaining popularity in 2026, VS Code remains the foundational tool to learn first.

**Essential VS Code Extensions for this course:**
| Extension | Purpose |
|-----------|---------|
| Live Server | Launches a local development server with live reload |
| Prettier | Automatically formats your code to look neat |
| Material Icon Theme | Adds recognizable icons to your file explorer |
| Auto Rename Tag | Automatically renames the closing HTML tag when you change the opening one |
| ESLint | Finds and fixes problems in your JavaScript code |

### 2. The Runtime: Node.js
Node.js is a runtime that allows JavaScript to run on your computer (not just in the browser). Even though we are writing C# for our backend, modern frontend tools (like Angular and Tailwind) require Node.js to be installed.

### 3. Version Control: Git
Git is a system that tracks changes to your files over time. It allows you to save "checkpoints" of your code, collaborate with others, and undo mistakes. We will cover Git in depth in Lecture 49, but you need it installed now.

### 4. The Browser DevTools
Every modern browser has Developer Tools built-in (press `F12` or `Ctrl+Shift+I` / `Cmd+Option+I`).
- **Elements tab**: Inspect and modify HTML/CSS live.
- **Console tab**: View errors and run JavaScript.
- **Network tab**: Monitor HTTP requests and responses.

---

## 9. Your First Webpage

Let's build a simple HTML file. You don't need a server to view a basic HTML file; your browser can read it directly from your hard drive.

Open VS Code, create a new folder, and create a file named `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    
    <h1>Welcome to Web Development!</h1>
    
    <p>This is my very first webpage created in 2026.</p>
    
    <p>I am learning how to become a Full-Stack Developer.</p>
    
    <a href="https://google.com">Search for coding tutorials</a>

</body>
</html>
```

Save the file. You can open it by double-clicking it in your file explorer, but a better way is to use the **Live Server** extension in VS Code. Right-click the file in VS Code and select "Open with Live Server". 

Now, change the text inside the `<h1>` tag and save the file. The browser will automatically refresh!

---

## 10. Course Roadmap

You are embarking on a comprehensive 50-lecture journey. Here is how the course is structured:

| Module | Focus | Lectures | What You'll Learn |
|--------|-------|----------|-------------------|
| **0** | Foundations | L00 | Computer basics, internet concepts, dev setup |
| **1** | HTML & CSS | L01-L08 | Semantic structure, modern layouts (Flexbox/Grid), responsive design, animations |
| **2** | JavaScript | L09-L14 | Programming logic, DOM manipulation, asynchronous programming (Promises/Fetch) |
| **3** | CSS Frameworks| L15-L18 | Rapid UI development with Bootstrap 5 and Tailwind CSS v4 |
| **4** | TypeScript | L19-L22 | Static typing, interfaces, generics, modern tooling |
| **5** | Angular | L23-L32 | Component architecture, routing, forms, state management, HTTP integration |
| **6** | C# Basics | L33-L38 | Object-Oriented Programming, LINQ, async/await, Entity Framework Core |
| **7** | ASP.NET Core | L39-L48 | Building robust REST APIs, authentication (JWT), real-time (SignalR), deployment |
| **8** | Pro Skills | L49 | Git mastery, GitHub workflows, leveraging AI tools effectively |

### 🏗️ Portfolio Projects
Throughout this course, you won't just follow tutorials; you will build **7 progressive portfolio projects**. Instead of small, disconnected exercises, you'll build features lecture-by-lecture that culminate in large, professional applications suitable for your resume:

1. **Personal Developer Portfolio** (HTML/CSS)
2. **TaskFlow Interactive Dashboard** (JavaScript)
3. **StartupLaunch Agency Landing Page** (Bootstrap & Tailwind)
4. **DataForge Utility Library** (TypeScript)
5. **FinanceTracker Library** (C#)
6. **ShopAngular E-Commerce SPA** (Angular)
7. **ShopAPI Full-Stack Backend** (ASP.NET connecting to Angular)

---

## 🧪 Practice Labs

### Lab 1: Set Up Your Development Environment (30 min)
It's time to get your tools ready.
1. Download and install VS Code, Node.js (LTS version), and Git.
2. Open VS Code and install the 5 recommended extensions: Live Server, Prettier, Material Icon Theme, Auto Rename Tag, and ESLint.
3. Open your terminal (in VS Code: `Ctrl+~` or `View -> Terminal`) and verify your installations by running:
   - `node -v`
   - `npm -v`
   - `git --version`

### Lab 2: Trace an HTTP Request (25 min)
Let's see the Web in action.
1. Open your browser (Chrome or Edge recommended).
2. Open Developer Tools (`F12`) and go to the **Network** tab.
3. Navigate to `https://en.wikipedia.org/wiki/Web_development`.
4. Look at the very first request in the list (the HTML document). Click on it.
5. Identify the Request URL, Request Method (GET), and Status Code (200 OK).
6. Look at the waterfall chart to see how the browser subsequently requested CSS, images, and fonts to render the page.

### Lab 3: Create Your First Web Page (35 min)
1. Create a dedicated folder on your computer for this course (e.g., `FullstackCourse`).
2. Open that folder in VS Code.
3. Inside, create a file called `lab3-starter.html` using the template provided in the `labs/` directory.
4. Add an `<h1>` heading with your name.
5. Add a paragraph describing why you want to learn web development.
6. Add an image (`<img>` tag) using a random image URL from Unsplash.
7. Launch it using Live Server.

---

## 📝 Assignment: "How the Web Works" Report

### Requirements
1. Create a new HTML file named `index.html` in your `assignment/` folder.
2. Write a 1-page report explaining how a URL becomes a rendered webpage.
3. Your report must include sections on: DNS Resolution, the TCP Handshake, the HTTP Request/Response cycle, and HTML Parsing/Rendering.
4. Use appropriate HTML headings (`<h2>`, `<h3>`) and paragraphs (`<p>`) to structure your report.
5. Take at least 3 screenshots from your browser's DevTools Network tab (from Lab 2 or another site) and embed them in your report using the `<img>` tag.
6. Make sure the page opens correctly in your browser and all images load.

### 🏗️ Portfolio Project
No progressive project milestone for this lecture. Your portfolio journey begins in Lecture 1!

### Optional Bonus
1. Research and add a section to your report about the difference between HTTP/1.1, HTTP/2, and HTTP/3.
2. Add some basic inline CSS (`<h1 style="color: blue;">`) to make your report look slightly better.
3. Use the terminal to navigate your computer's file system, rather than the graphical file explorer.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| VS Code Download | https://code.visualstudio.com/ |
| Node.js Download | https://nodejs.org/ |
| Git Download | https://git-scm.com/ |
| MDN Web Docs: How the Web Works | https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works |
| HTTP Status Dogs (Fun Reference) | https://httpstatusdogs.com/ |

---

## 📌 Key Takeaways
- A computer uses the CPU to process data, RAM for short-term memory, and Storage for long-term data retention.
- Compiled languages are translated before execution; interpreted languages are translated on the fly.
- The Internet is a global network of computers connected via the TCP/IP suite; DNS acts as the phonebook translating domains to IP addresses.
- The World Wide Web runs *on top* of the Internet using HTTP and the Client-Server model.
- HTTP requests use methods (GET, POST) and servers reply with status codes (200 OK, 404 Not Found, 500 Server Error).
- Full-Stack Developers build both the client-side (Frontend) and server-side (Backend) of web applications.
- A proper development environment requires a code editor (VS Code), a runtime (Node.js), and version control (Git).

---

**Next Lecture:** [Lecture 01 — Introduction to Web Development & HTML5 Basics →](01%20-%20Introduction%20to%20Web%20Development%20%26%20HTML5%20Basics.md)
