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

---

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

### Plain-English Introduction

Before we can build software, we need to understand the machine that runs it. If you've ever wondered *"how does a computer actually work?"*, you're about to find out.

Imagine you want to make a sandwich. You need to:
1. **Get the ingredients out** of the fridge (input)
2. **Assemble the sandwich** (process)
3. **Put it on a plate** for someone to eat (output)

A computer works exactly the same way:
1. **Takes input** — you type on a keyboard, click a mouse, or tap a touchscreen
2. **Processes it** — performs calculations and logical operations at billions of operations per second
3. **Produces output** — shows results on a screen, plays audio through speakers, saves to a file

That's it! Everything from a cheap smartphone to a supercomputer follows this exact pattern.

### The Professional Kitchen Analogy

Think of a computer like a professional restaurant kitchen:

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE COMPUTER KITCHEN                        │
│                                                                 │
│   🧑‍🍳  CPU (The Head Chef)       🍳  RAM (The Countertop)       │
│   ─────────────────────────     ──────────────────────────      │
│   Does ALL the actual work.     Holds everything currently       │
│   Follows recipes (programs)    in use. Fast to reach, but       │
│   one instruction at a time,   cleared completely when          │
│   billions/second.              power goes off.                  │
│                                                                 │
│   🗄️  Storage (The Pantry)      🖥️  I/O (Waiters & Diners)      │
│   ─────────────────────────     ──────────────────────────      │
│   Holds everything long-term.   Keyboard/mouse = orders         │
│   Slow to fetch, but safe       coming in. Monitor/speakers =   │
│   when the kitchen closes.      meals going out.                 │
└─────────────────────────────────────────────────────────────────┘
```

Let's look at each component in detail:

#### CPU — Central Processing Unit (The Head Chef)

The CPU is the brain of the computer. It fetches instructions from memory, decodes them, executes them, and stores results — billions of times per second. Modern CPUs have multiple **cores** (think multiple chefs cooking at the same time), which is why your computer can run a music app, a browser, and a code editor simultaneously.

**Why does this matter?** When you write a program, you are writing a *recipe* for the CPU to follow. If your recipe has unnecessary steps (inefficient code), the CPU wastes time — making your app slow.

#### RAM — Random Access Memory (The Countertop)

RAM is your computer's short-term working memory. When you open a web browser, the browser's entire program code and all its data are loaded from Storage (the pantry) into RAM (the countertop) so the CPU can access them quickly. RAM is extremely fast but **volatile** — when you turn off the computer, everything in RAM is gone.

**Common sizes:** 8 GB, 16 GB, 32 GB. If you've ever had your computer slow to a crawl when you have too many browser tabs open, that's because you've run out of RAM.

#### Storage — SSD / HDD (The Pantry)

Storage keeps your data permanently — even when the power is off. There are two main types:
- **SSD (Solid State Drive):** Modern, fast (like a well-organised, fully stocked fridge). Used in most computers today.
- **HDD (Hard Disk Drive):** Older, slower, cheaper (like a big dusty pantry). Uses spinning magnetic disks.

**Common sizes:** 256 GB, 512 GB, 1 TB+.

#### I/O — Input/Output Devices (Waiters & Diners)

- **Input devices:** Keyboard, mouse, microphone, webcam, touchscreen — how humans communicate *to* the computer
- **Output devices:** Monitor, speakers, printer — how the computer communicates *back* to the human

> [!NOTE]
> When you write a program, you are essentially writing a recipe for the CPU (chef) to follow. Data from Storage (pantry) gets loaded into RAM (countertop) while the program runs. The results are then sent to Output devices. Everything else is just details built on top of this foundation.

### Step-by-Step: What Happens When You Open a Web Browser

1. You double-click the Chrome icon (input)
2. The OS loads Chrome's program files from Storage (pantry) into RAM (countertop)
3. The CPU starts executing Chrome's code (the chef starts following the recipe)
4. Chrome draws its window on the monitor (output)
5. You type a URL and press Enter — that's another input event
6. Chrome processes it (more CPU work) and displays the webpage

### Why Does This Matter for Web Development?

When you deploy a website, your code runs on a **server** — which is just another computer, usually without a monitor or keyboard, sitting in a data centre. Understanding CPU, RAM, and Storage helps you write efficient code. For example:
- Loading a 50 MB image that only displays at 200×200 pixels wastes RAM on every visitor's computer
- Storing user session data in RAM (instead of a database) makes a web app fast, but the data disappears if the server restarts

### Common Mistakes & How to Avoid Them

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| Confusing RAM with Storage | Both "store" data, just differently | RAM = temporary workspace; Storage = permanent filing cabinet |
| Thinking more CPU cores always = faster | Some programs can't use multiple cores | Profile your code before optimising |
| Ignoring memory usage in web apps | "It works on my machine" — your machine has 32 GB RAM, the server has 2 GB | Always test with realistic constraints |

### 📌 Section Recap
- A computer = Input → Process (CPU) → Output
- CPU: processes instructions; RAM: holds working data (temporary); Storage: keeps data permanently
- I/O devices: how humans interact with the machine
- Your code is a recipe the CPU follows
- Servers are just computers running your code in a data centre

---

## 2. Software Layers

### Plain-English Introduction

Hardware is useless without software. Think of hardware as a piano — beautiful and full of potential, but useless until someone knows how to play it. Software is the music.

There are different *layers* of software, each built on top of the layer below:

```
┌────────────────────────────────────────────────────┐
│           YOUR WEB APPLICATION                     │  ← What we build in this course
├────────────────────────────────────────────────────┤
│           Programming Languages                    │  ← JavaScript, C#, Python, etc.
├────────────────────────────────────────────────────┤
│           Operating System (OS)                    │  ← Windows, macOS, Linux
├────────────────────────────────────────────────────┤
│           Hardware                                 │  ← CPU, RAM, Storage, I/O
└────────────────────────────────────────────────────┘
          Each layer depends on the one below it.
```

### Layer 1: The Operating System

The OS (Windows, macOS, Linux) is the **restaurant manager**. It:
- Directly controls the hardware
- Decides which application gets to use the CPU at any given moment
- Manages files on the hard drive
- Provides common services (networking, security, user interfaces) so every application doesn't have to reinvent the wheel

When your music app and browser both want to play audio at the same time, the OS arbitrates that conflict.

### Layer 2: Applications

Applications are built *on top of* the OS. They use the OS's services to do specific tasks. Web browsers, code editors, games, and word processors are all applications.

### Layer 3: Programming Languages

Programming languages are how developers write instructions. They bridge the gap between human-readable logic ("if the user clicks Buy, add the item to their cart") and machine-executable instructions (a sequence of 1s and 0s the CPU can understand).

### Compiled vs Interpreted Languages

This is a fundamental concept you'll encounter throughout your career:

> [!NOTE]
> **Compiled Languages** (C++, C#, Java): The entire source code is translated into machine code *before* the program runs. This translation step (compilation) takes time up front, but the resulting program runs very fast because the translation is already done.
>
> **Analogy:** Like translating an entire book from French to English *before* giving it to your friend to read. Translation takes time, but reading is instant.

> [!NOTE]
> **Interpreted Languages** (JavaScript, Python): The source code is translated into machine code line-by-line *as* the program runs. This makes them faster to write and test (no compile step), but slightly slower to execute.
>
> **Analogy:** Having a live interpreter whisper translations in your ear as a speaker talks in French. No delay up front, but every sentence requires a processing cost.

### Languages in This Course

```
Frontend (Browser)                Backend (Server)
──────────────────────────        ────────────────────────────
JavaScript  (interpreted)         C#  (compiled)
HTML        (markup language)     ASP.NET Core  (framework)
CSS         (stylesheet lang.)    SQL Server  (database)
TypeScript  (compiled to JS)
Angular     (JS framework)
```

> [!TIP]
> You don't need to choose between them — a Full-Stack Developer uses both. JavaScript runs in the browser (client side), and C# runs on the server (server side). They communicate over HTTP.

### Common Mistakes & How to Avoid Them

| Mistake | Fix |
|---------|-----|
| Using `var` in JavaScript (old habit) | Always use `const` or `let` — covered in depth in Lecture 09 |
| Thinking compiled = better than interpreted | They're tools for different jobs. JavaScript is interpreted and powers the entire web |
| Treating the OS like background magic | Understanding OS fundamentals helps you debug path issues, permissions, and environment variables |

### 📌 Section Recap
- Software layers: Hardware → OS → Applications → Your code
- The OS is the manager that coordinates hardware for all applications
- Compiled languages translate before running (faster execution)
- Interpreted languages translate line-by-line (faster to develop and test)
- This course uses JavaScript (frontend, interpreted) and C# (backend, compiled)

---

## 3. How the Internet Works

### Plain-English Introduction

The Internet is often described as a "network of networks." Here's what that means in plain English:

Imagine every computer in the world is a house, and the Internet is the road system connecting all those houses. You can send a letter (data) from your house to any other house in the world via this road system, as long as you know the address.

The key difference from real roads: **data travels as electrical signals through cables and as radio waves through the air**, at nearly the speed of light.

### Key Concept 1: IP Addresses — The Street Addresses of the Internet

Every computer connected to the Internet needs a unique address so data knows where to go. This address is called an **IP address** (Internet Protocol address):

```
IPv4 (older):   192.168.1.100
                └─ Four numbers, each 0–255, separated by dots
                └─ Only ~4 billion unique addresses (we've run out!)

IPv6 (newer):   2001:0db8:85a3:0000:0000:8a2e:0370:7334
                └─ Much longer
                └─ 340 undecillion unique addresses (enough for every atom on Earth)
```

**Your home IP address** is assigned by your ISP (Internet Service Provider — companies like AT&T, Comcast, Vodafone). When you connect to the internet, they give your router a public IP address.

**Why does this matter?** When you deploy a website, your server gets an IP address. Without it, no one can reach it.

### Key Concept 2: ISP — The On-Ramp to the Highway

Your **ISP (Internet Service Provider)** provides the physical connection from your home/office to the global internet infrastructure — via cables, fibre optics, or wireless signals. Without an ISP, your computer has no connection to the outside world.

### Key Concept 3: DNS — The Internet's Phone Book

Humans are terrible at remembering IP addresses like `142.250.184.238`. So we use **domain names** like `google.com` instead.

**DNS (Domain Name System)** is the service that translates domain names into IP addresses:

```
Step 1: You type  →  google.com
                          │
Step 2: Your computer asks a DNS server:
        "What IP address does google.com have?"
                          │
Step 3: DNS server replies: "142.250.184.238"
                          │
Step 4: Your computer connects to: 142.250.184.238
```

DNS servers are maintained by organisations around the world. Your ISP provides one by default, but you can use public ones like Google's (8.8.8.8) or Cloudflare's (1.1.1.1).

### Key Concept 4: Data Packets — Breaking Things Into Pieces

Data doesn't travel across the Internet as one giant blob. It's broken into small chunks called **packets**:

```
Your 5 MB file gets split into thousands of small packets:

Packet 1 → [Header: From: you, To: server, #1 of 3000] [Data chunk]
Packet 2 → [Header: From: you, To: server, #2 of 3000] [Data chunk]
Packet 3 → [Header: From: you, To: server, #3 of 3000] [Data chunk]
...

Each packet may take a DIFFERENT ROUTE through the internet
and arrive OUT OF ORDER. They're reassembled at the destination.
```

**Why packets?** If your connection drops for a moment, only the missing packets need to be re-sent, not the entire file.

### The TCP/IP Model — The Rules of the Road

The TCP/IP model describes the layered system that makes all of this work:

| Layer | Protocol | Purpose | Analogy |
|-------|----------|---------|---------| 
| Application | HTTP, FTP, SMTP | High-level data exchange (what we care about as web devs) | The content of the letter |
| Transport | TCP, UDP | Ensures packets arrive correctly and in order | The envelope with tracking |
| Internet | IP | Routes packets across networks to the right destination | The postal sorting office |
| Link | Ethernet, Wi-Fi | Physical connection between nearby devices | The delivery truck |

> [!TIP]
> **Latency vs Bandwidth** — Two concepts that sound similar but mean very different things:
> - **Bandwidth** = how *much* data can travel at once (width of the highway — more lanes = more cars)
> - **Latency** = how *quickly* a single piece of data travels from A to B (the speed limit)
>
> For a responsive web app, **low latency** is often more important than high bandwidth! A video call needs low latency; downloading a movie needs high bandwidth.

### Step-by-Step: How Data Travels Across the Internet

1. **You send a request** on your computer
2. Your router breaks it into **packets** and assigns IP headers
3. Packets travel through your **ISP's network**
4. ISP routes packets through **internet exchange points** (massive hubs where networks connect)
5. Packets reach the **destination server's ISP**
6. Server's ISP delivers packets to the **server**
7. Server **reassembles** packets, processes the request, and sends a response back the same way

### Common Mistakes & How to Avoid Them

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| Confusing the Internet with the Web | They're often used interchangeably | Internet = infrastructure (the roads); Web = a service on top of it (one type of vehicle) |
| Thinking DNS is instant | DNS lookups add latency | Use DNS caching and CDNs to mitigate this |
| Ignoring latency when building apps | Works fast locally, slow for international users | Test your app from different geographic regions |

### 📌 Section Recap
- The Internet = a global network of interconnected computers
- Every device has a unique IP address (its "street address")
- DNS translates human-readable domain names into IP addresses
- Data travels as small packets that may take different routes and arrive out of order
- TCP/IP is the layered set of rules that governs all Internet communication
- Latency = speed of a single packet; Bandwidth = total data capacity

---

## 4. How the Web Works

### Plain-English Introduction

Here's a distinction that trips up almost every beginner:

> **The Internet ≠ The Web**

- **The Internet** is the global physical infrastructure — the cables, routers, and protocols that allow computers to connect
- **The Web (World Wide Web)** is a *service* that runs *on top of* the Internet — a collection of interconnected documents (web pages) accessed through a browser

Think of it this way: The Internet is the road system. The Web is one type of vehicle that uses those roads. Email, online gaming, video calls, and FTP file transfers all use the same Internet roads — they're different "vehicles."

### The Client-Server Model

The Web works on a **request-response cycle** called the Client-Server Model:

```
┌───────────────────┐                        ┌────────────────────────┐
│                   │   ── HTTP Request ──→   │                        │
│   CLIENT          │                        │   SERVER               │
│   (Your Browser)  │                        │   (Computer in a       │
│                   │   ←── HTTP Response ── │    data centre)        │
└───────────────────┘                        └────────────────────────┘
       You                                      Somewhere in the world
  (Your laptop)                              (Could be thousands of km away)
```

**Restaurant analogy:**
- **Client (Browser)** = You, the customer at the table. You look at the menu and place an order.
- **Server** = The kitchen. It prepares your food based on your order.
- **HTTP** = The waiter. Carries your request to the kitchen and brings back the response.

### HTTP Methods — Types of Requests

When a browser makes a request, it specifies *what it wants to do* using an HTTP method:

| Method | Description | Real-World Example |
|--------|-------------|-------------------|
| `GET` | Read / Retrieve data | Loading a product listing page |
| `POST` | Create new data | Submitting a registration form |
| `PUT` | Update data (replace entirely) | Saving an updated user profile |
| `PATCH` | Update data (partially) | Changing just your password |
| `DELETE` | Delete data | Removing an item from your cart |

### HTTP Status Codes — The Server's Reply

Every HTTP response includes a **status code** — a 3-digit number telling the browser what happened:

| Range | Category | Common Examples |
|-------|---------|----------------|
| 1xx | Informational | `100 Continue` |
| 2xx | ✅ Success | `200 OK`, `201 Created` |
| 3xx | Redirection | `301 Moved Permanently`, `302 Found` |
| 4xx | ❌ Client Error | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| 5xx | 💥 Server Error | `500 Internal Server Error`, `503 Service Unavailable` |

> [!IMPORTANT]
> **The golden rule for debugging:**
> - **4xx errors** = *You* (the client/developer) made a mistake — bad URL, not logged in, resource doesn't exist
> - **5xx errors** = *The server* is broken — something went wrong on the backend
>
> This distinction saves you enormous debugging time!

### Anatomy of a URL

Every resource on the Web has a unique address called a **URL (Uniform Resource Locator)**:

```
https://www.example.com:443/products/shoes?color=red&size=10#details
│       │               │   │              │                 │
│       │               │   │              │                 └─ Fragment: jumps to #details on page
│       │               │   │              └─ Query String: filter parameters passed to server
│       │               │   └─ Path: which specific resource on the server
│       │               └─ Port: which "door" on the server (443 is default for HTTPS)
│       └─ Domain: human-readable name of the server
└─ Scheme: which protocol to use (https = secure HTTP)
```

### Step-by-Step: What Happens When You Press Enter

Let's trace the exact journey of navigating to `https://www.google.com/`:

1. **You type the URL and press Enter** — your browser starts the request process
2. **DNS Lookup** — Your browser asks: "What IP address is google.com?" Gets back `142.250.184.238`
3. **TCP Handshake** — Your browser and Google's server exchange "hello / hello / acknowledged" (3 messages to establish a connection)
4. **TLS Handshake** — For HTTPS, they negotiate encryption (this creates the 🔒 padlock in your browser)
5. **HTTP GET Request** — Your browser sends: `GET / HTTP/2` (requesting Google's homepage)
6. **Server Response** — Google's server sends back `200 OK` plus the HTML file
7. **Browser Parses HTML** — It reads the HTML and finds references to CSS files, JavaScript files, images, fonts — and requests each one
8. **Browser Renders** — It calculates the layout and paints pixels to your screen

All of that happens in under one second. Every time you visit a website.

### Common Mistakes & How to Avoid Them

| Mistake | Fix |
|---------|-----|
| Using `http://` instead of `https://` in production | Always enforce HTTPS — it encrypts the connection and is required for many modern browser APIs |
| Not understanding 404 vs 500 | 404 = wrong URL (your fault); 500 = server crash (backend fault) |
| Confusing `POST` and `GET` for form submissions | Use `GET` for searches (sharable URL), `POST` for sensitive data (login, payments) |

### 📌 Section Recap
- The Internet is infrastructure; the Web is a service running on top of it
- Client (browser) sends HTTP requests; Server sends HTTP responses
- HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- Status codes: 2xx = success, 4xx = client mistake, 5xx = server broken
- A URL has: scheme, domain, port, path, query string, and fragment
- Browser → DNS → TCP → TLS → HTTP Request → HTTP Response → Parse → Render

---

## 5. Web Browsers

### Plain-English Introduction

A web browser isn't just a simple viewer — it's one of the most complex pieces of software ever built. Your browser takes raw HTML, CSS, and JavaScript text files and turns them into the interactive, visually rich experiences you see on screen.

To do this, every browser has a **rendering engine** — the core component responsible for turning code into pixels.

### Rendering Engines

| Browser | Rendering Engine | Market Share (approx. 2026) |
|---------|-----------------|----------------|
| Chrome, Edge, Brave, Opera | **Blink** | ~65% of web users |
| Firefox | **Gecko** | ~4% of web users |
| Safari | **WebKit** | ~19% of web users |

> [!TIP]
> For development, use **Chrome** or **Edge** (both use Blink). They have the most powerful DevTools. But always *test* in Firefox and Safari before releasing, because small differences in rendering engines can cause visual bugs.

### The Critical Rendering Path (How a Page Loads)

Understanding how a browser loads a page helps you write faster websites:

```
1. DNS Resolution
   └─ "What IP address is example.com?" → 93.184.216.34

2. TCP + TLS Handshake
   └─ Secure connection established ✅

3. HTTP GET /index.html
   └─ Browser requests the main HTML document

4. HTML Parsing (Top to Bottom)
   ├─ Finds <link rel="stylesheet" href="style.css">
   │   └─ Fetches CSS — ⚠️ BLOCKS rendering until CSS is done
   ├─ Finds <script src="app.js">
   │   └─ Fetches JS — ⚠️ BLOCKS HTML parsing unless `defer` is used
   └─ Finds <img src="photo.jpg">
       └─ Fetches image — does NOT block rendering

5. CSSOM Construction
   └─ Browser reads CSS and builds CSS Object Model (tree of styles)

6. Render Tree
   └─ Combines DOM (HTML structure) + CSSOM (styles)
       to determine what is visible

7. Layout (Reflow)
   └─ Calculates exact pixel position and size of every element

8. Paint
   └─ Draws pixels to the screen layer by layer

9. Composite
   └─ GPU assembles layers into the final image you see
```

This is why **the order of your `<link>` and `<script>` tags matters**! CSS in the `<head>` is fine (needed before rendering). Scripts without `defer` in the `<head>` block everything — always use `defer`.

### Browser DevTools — Your Most Important Tool

Every modern browser has **Developer Tools** built in. You'll use these constantly:

**How to open:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

| Tab | What It Does |
|-----|-------------|
| **Elements** | Inspect and live-edit any page's HTML and CSS |
| **Console** | See JavaScript errors; run JS commands interactively |
| **Network** | Watch every HTTP request the page makes — see status codes, response times |
| **Performance** | Record and analyse page load and rendering speed |
| **Application** | Inspect cookies, localStorage, session data, service workers |

> [!TIP]
> Don't be afraid to experiment in DevTools! Any change you make is **temporary** — refreshing the page resets everything to normal. You can modify any website's appearance just for fun and it won't affect anything permanently.

### 📌 Section Recap
- Browsers use rendering engines (Blink, Gecko, WebKit) to turn code into visuals
- The Critical Rendering Path: DNS → TCP → HTTP → HTML Parse → CSSOM → Layout → Paint
- CSS blocks rendering; scripts without `defer` block HTML parsing — always use `defer`
- DevTools is your most important debugging and learning tool — master it

---

## 6. What is Web Development?

### Plain-English Introduction

Web development is the process of building websites and web applications. It's one of the most in-demand skills in the world. Essentially every business today needs a web presence.

Web development has three main specialisations:

### Frontend (Client-Side) Development

Frontend development is everything the user sees and interacts with in their browser.

```
Frontend = What the user SEES and TOUCHES
                    ↓
┌──────────────────────────────────────────────────┐
│                  WEB BROWSER                     │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │    HTML    │  │    CSS     │  │ JavaScript │ │
│  │────────────│  │────────────│  │────────────│ │
│  │ Structure  │  │  Styling   │  │ Behaviour  │ │
│  │ "Skeleton" │  │ "Clothes"  │  │ "Muscles"  │ │
│  │            │  │            │  │            │ │
│  │ Defines    │  │ Defines    │  │ Defines    │ │
│  │ WHAT       │  │ HOW it     │  │ HOW it     │ │
│  │ things are │  │ looks      │  │ behaves    │ │
│  └────────────┘  └────────────┘  └────────────┘ │
└──────────────────────────────────────────────────┘
```

- **HTML (HyperText Markup Language)** — The skeleton. HTML defines *what* things are: headings, paragraphs, buttons, forms, images. Without HTML, there's no content.
- **CSS (Cascading Style Sheets)** — The clothes. CSS is like the clothes a website wears. It defines *how* things look: colours, fonts, spacing, layouts, animations. The same HTML can look completely different with different CSS.
- **JavaScript** — The muscles and brain. JavaScript defines *how* things behave: button clicks trigger actions, forms get validated, data gets fetched and displayed dynamically.

**Real-world analogy:** Building a house. HTML is the bricks and structure (what's there). CSS is the paint, carpet, and furniture (how it looks). JavaScript is the electricity and plumbing (how it works).

### Backend (Server-Side) Development

Backend development is everything that happens behind the scenes on the server. Users never see this directly — but it's what makes web applications actually work.

```
Backend = What happens BEHIND THE SCENES
                    ↓
┌──────────────────────────────────────────────────┐
│                  WEB SERVER                      │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │   Server   │  │    API     │  │  Database  │ │
│  │   Logic    │  │────────────│  │────────────│ │
│  │────────────│  │  REST API  │  │    SQL     │ │
│  │  C# /      │  │  (Bridge   │  │  Server   │ │
│  │ ASP.NET    │  │  between   │  │            │ │
│  │  Core      │  │  front &   │  │  Stores    │ │
│  │            │  │  back)     │  │  all data  │ │
│  └────────────┘  └────────────┘  └────────────┘ │
└──────────────────────────────────────────────────┘
```

- **Server Logic (C# / ASP.NET Core)** — Processes data, enforces business rules, handles authentication (logging in), authorisation (what you're allowed to do)
- **Database (SQL Server)** — Stores data permanently: user accounts, products, orders, blog posts, etc.
- **API (Application Programming Interface)** — The agreed-upon way the frontend (browser) and backend (server) communicate. Like a waiter: the kitchen (backend) and customer (frontend) never speak directly — they go through the API.

### Full-Stack Development

A Full-Stack Developer can build **both** frontend and backend, creating a complete application from scratch.

```
Full-Stack Flow — "User clicks Buy Now":

1. User clicks button                 (HTML element, frontend)
         ↓
2. JavaScript sends HTTP POST         (JavaScript, frontend)
         ↓
3. Server receives request            (C# ASP.NET Core, backend)
         ↓
4. Server validates & saves order     (C# + SQL Server, backend)
         ↓
5. Server returns "201 Created"       (HTTP Response, backend)
         ↓
6. JavaScript shows "Order confirmed! 🎉" (JavaScript, frontend)
```

That full flow is what you'll be able to build by the end of this course.

### 📌 Section Recap
- Frontend = HTML (structure) + CSS (style) + JavaScript (behaviour) — what users see
- Backend = server logic + database + API — the behind-the-scenes engine
- Full-Stack = building both sides of the application
- HTML is the skeleton; CSS is the clothes; JavaScript is the muscles

---

## 7. Career Paths & The 2026 Landscape

### The Industry Today

Web development remains one of the most in-demand and well-compensated fields in the world. The ecosystem has matured, with well-established tools and clear career paths.

| Role | Core Skills | Approx. 2026 Salary (US) |
|------|-------------|--------------------------|
| **Frontend Developer** | HTML, CSS, JS, React/Angular/Vue | $75k – $140k+ |
| **Backend Developer** | APIs, Databases, C#/.NET/Node.js | $85k – $150k+ |
| **Full-Stack Developer** | Frontend + Backend, end-to-end | $95k – $165k+ |
| **DevOps Engineer** | CI/CD, Cloud, Docker, Kubernetes | $105k – $180k+ |

> [!CAUTION]
> **On AI Tools in 2026:** Tools like GitHub Copilot, Cursor, and others are widely used and make skilled developers significantly more productive. However, they have **not** replaced developers. AI tools are like a calculator for a mathematician — they speed up the work, but you must understand the fundamentals to know when the AI is wrong, introducing bugs, or creating security vulnerabilities. This course builds the foundation that makes AI tools useful rather than dangerous.

### What Employers Want in 2026

```
Frontend:   TypeScript > JavaScript, Angular/React > jQuery, Tailwind CSS
Backend:    ASP.NET Core, Node.js, Python (FastAPI), Go
Database:   SQL (PostgreSQL, SQL Server), Redis, MongoDB
Cloud:      Azure, AWS, GCP — especially Containers & Serverless
Dev Tools:  Git, Docker, CI/CD pipelines, GitHub Actions
```

This course covers TypeScript, Angular, ASP.NET Core, SQL Server, and Git — directly matching what employers are looking for.

### 📌 Section Recap
- Web development has four main career paths: Frontend, Backend, Full-Stack, DevOps
- Full-Stack developers earn $95k–$165k+ in the US
- AI tools enhance productivity but don't replace fundamental understanding
- This course's tech stack (Angular, C#, SQL Server, Git) is directly industry-aligned

---

## 8. Developer Tools & Environment Setup

### Why a Good Environment Matters

Imagine trying to cook a gourmet meal with no knives, no labels on ingredients, and a broken stove. You *could* do it, but it would be miserable. A proper development environment removes friction and lets you focus on actually solving problems.

### Step-by-Step Setup Guide

#### Step 1: Install Visual Studio Code (VS Code)

VS Code is the industry-standard free code editor used by millions of developers worldwide.

**Download:** [code.visualstudio.com](https://code.visualstudio.com/)

After installing, add these essential extensions immediately (press `Ctrl+Shift+X` to open the extensions panel):

| Extension | Why You Need It |
|-----------|----------------|
| **Live Server** | Runs a local web server that auto-refreshes when you save — see changes instantly |
| **Prettier** | Automatically formats your code to look clean and consistent |
| **Material Icon Theme** | Adds icons to files in Explorer (HTML gets orange, CSS gets blue, etc.) |
| **Auto Rename Tag** | When you rename `<div>` to `<section>`, the closing tag updates automatically |
| **ESLint** | Highlights JavaScript errors and bad practices as you type |

**How to install an extension:**
1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows) or `Cmd+Shift+X` (Mac)
3. Type the extension name in the search box
4. Click "Install"

> [!NOTE]
> **AI-Powered Editors:** Editors like **Cursor** and **Windsurf** are increasingly popular in 2026. They're built on VS Code with powerful AI built directly in. We recommend starting with plain VS Code to learn the fundamentals first, then graduating to an AI editor once you're comfortable.

#### Step 2: Install Node.js

Node.js allows JavaScript to run on your computer outside the browser. Even though our backend uses C#, modern frontend tools (Angular, TypeScript compiler, build tools) all require Node.js.

**Download the LTS (Long-Term Support) version:** [nodejs.org](https://nodejs.org/)

**Verify it works** — open a terminal and type:
```bash
node -v    # Should print something like: v20.14.0
npm -v     # Should print something like: 10.7.0
```

> [!WARNING]
> If `node` or `npm` is not recognised after installing, you may need to restart your terminal or computer to update the PATH environment variable.

#### Step 3: Install Git

Git tracks changes to your code over time — like a time machine for your project. It lets you:
- Save checkpoints of working code
- Experiment safely (branches)
- Collaborate with teammates
- Undo any mistake

**Download:** [git-scm.com](https://git-scm.com/)

**After installing, configure your identity** (required for Git to work):
```bash
git config --global user.name "Your Full Name"
git config --global user.email "your@email.com"
git --version    # Verify installation: git version 2.x.x
```

#### Step 4: Learn Your Browser DevTools

You'll use DevTools every single day as a developer. Master it now.

**How to open:** Press `F12` on any webpage, or right-click → "Inspect"

| DevTools Tab | What It Does | When to Use |
|-------------|-------------|-------------|
| **Elements** | Inspect and live-edit HTML/CSS on any page | Debugging layout issues |
| **Console** | View JS errors; run JS commands | Debugging JavaScript |
| **Network** | Monitor every HTTP request/response | Slow page? API errors? Check here |
| **Performance** | Profile page load and animation speed | Optimising slow pages |
| **Application** | Inspect cookies, localStorage, cache | Debugging auth/data storage |

### Common Mistakes & How to Avoid Them

| Mistake | Fix |
|---------|-----|
| Installing Node.js but the terminal doesn't recognise it | Restart the terminal (or the whole computer) after installation |
| Not configuring Git with name and email | Run the `git config` commands above — Git won't let you commit without them |
| Skipping Prettier setup | Configure it to format on save: Settings → `"editor.formatOnSave": true` |
| Opening HTML files directly instead of using Live Server | Always use Live Server — direct file opening uses the `file://` protocol, not HTTP |

### 📌 Section Recap
- VS Code + 5 extensions = your primary development tool
- Node.js is required for modern frontend tooling (even with a C# backend)
- Git tracks your code changes and enables safe experimentation
- Browser DevTools is your primary debugging tool — use it constantly

---

## 9. Your First Webpage

### What We're Building

Before writing a single line of CSS or JavaScript, let's prove that you can make something appear in a browser with just HTML. This is the simplest possible webpage — and it already teaches you the complete request-response cycle.

### Why This Matters

By building this page, you are demonstrating:
- You understand how HTML is structured
- You understand how a web server (Live Server) serves files
- You understand how a browser requests and renders HTML
- You've set up your development environment correctly

### Step-by-Step Instructions

**Step 1:** Create a new folder on your Desktop called `FirstWebpage`.

**Step 2:** Open VS Code. Go to `File → Open Folder` and open that folder.

**Step 3:** In the VS Code Explorer panel (left side), click the "New File" icon and name it `index.html`.

> [!NOTE]
> The file is named `index.html` by convention. Web servers automatically look for a file named `index.html` when a visitor navigates to a directory. It's the "homepage" file of any website.

**Step 4:** Type `!` and press `Tab` inside the file. This triggers an **Emmet** shortcut that generates a full HTML5 boilerplate for you instantly.

**Step 5:** Modify the generated code to look exactly like this:

```html
<!DOCTYPE html>
<!-- This line MUST be first. It tells the browser: "This is an HTML5 document."    -->
<!-- Without it, the browser enters "quirks mode" and renders things inconsistently. -->

<html lang="en">
<!-- The root element — everything in the page lives inside here.                    -->
<!-- lang="en" tells screen readers and search engines this page is in English.      -->

  <head>
    <!-- The <head> contains METADATA — information ABOUT the page.                 -->
    <!-- Users don't see the <head> content directly on the page.                   -->

    <meta charset="UTF-8">
    <!-- UTF-8 encoding lets the browser display ANY character:                     -->
    <!-- é, ü, 中, العربية, 🎉 — without this, special chars show as garbage.       -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- This makes the page display correctly on mobile devices.                   -->
    <!-- Without it, mobile browsers zoom way out, making everything tiny.          -->

    <title>My First Webpage</title>
    <!-- The text shown in the browser's tab.                                       -->
    <!-- Also used by Google in search results — make it descriptive!               -->

  </head>

  <body>
    <!-- Everything the user SEES on screen goes inside the <body>.                 -->

    <h1>Welcome to Web Development!</h1>
    <!-- h1 = the main heading of the page — the most important title.              -->
    <!-- Best practice: use ONLY ONE <h1> per page.                                 -->

    <p>This is my very first webpage, built in 2026.</p>
    <!-- p = a paragraph of text. Use <p> for any block of regular text.            -->

    <p>I am on my journey to become a Full-Stack Developer.</p>
    <!-- Each <p> tag creates a new paragraph with spacing above and below.         -->

    <a href="https://developer.mozilla.org">Learn more at MDN Web Docs</a>
    <!-- a = anchor element — creates a clickable hyperlink.                        -->
    <!-- href = "HyperText REFerence" — the URL the link points to.                 -->

  </body>
</html>
<!-- Closing </html> — every opening tag needs a closing tag (with a slash).        -->
```

**Step 6:** Save the file — `Ctrl+S` (Windows) or `Cmd+S` (Mac).

**Step 7:** In the VS Code Explorer, right-click `index.html` and select **"Open with Live Server"**.

Your browser opens and shows your webpage! Now experiment:
- Change the text inside `<h1>` and save — the browser updates instantly
- Change "Welcome" to your actual name
- Add another `<p>` tag with something about yourself

### What Just Happened? (The Full Cycle)

```
1. You wrote HTML code (a recipe/instructions for the browser)
            ↓
2. Live Server started a local web server on port 5500
            ↓
3. Your browser sent a GET request to http://localhost:5500/index.html
            ↓
4. Live Server responded with 200 OK + the HTML file content
            ↓
5. Your browser's rendering engine parsed the HTML
            ↓
6. The browser laid out the elements and painted pixels on screen
            ↓
7. You see your webpage! 🎉
```

You just completed the **entire client-server cycle** on your own computer. `localhost` is a special hostname that means "this computer itself."

### Common Mistakes & How to Avoid Them

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| Page is blank | Missing `<!DOCTYPE html>` or `<html>` tag | Check the file starts with `<!DOCTYPE html>` |
| "Index of /" directory listing appears | File isn't named `index.html` | Rename your file to exactly `index.html` |
| Changes don't appear in the browser | Forgot to save the file | Press `Ctrl+S`, then check the browser |
| Browser downloads the file instead of showing it | Opened the file directly without Live Server | Right-click → "Open with Live Server" |
| Special characters (é, ü) show as garbled symbols | Missing `<meta charset="UTF-8">` | Add that meta tag inside your `<head>` |
| The link doesn't work | Forgot the `https://` in the href | Always include the full URL: `href="https://..."` |

### 📌 Section Recap
- Every HTML page starts with `<!DOCTYPE html>` — it's not optional
- `<head>` = invisible metadata; `<body>` = visible content
- `index.html` is the conventional name for a homepage
- Live Server auto-refreshes your browser every time you save
- The file → Live Server → browser request → response → render cycle is the foundation of the entire web

---

## 10. Course Roadmap

### Your Full-Stack Journey

You are embarking on a comprehensive journey to becoming a Full-Stack Developer. Here is the complete course structure:

| Module | Focus | Lectures | What You'll Build |
|--------|-------|----------|-------------------|
| **0** | Foundations | L00 | Computer basics, internet concepts, dev setup |
| **1** | HTML & CSS | L01–L08 | Semantic structure, layouts, responsive design, animations |
| **2** | JavaScript | L09–L14 | Programming logic, DOM manipulation, async programming |
| **3** | CSS Frameworks | L15–L18 | Bootstrap 5, Tailwind CSS v4 |
| **4** | TypeScript | L19–L22 | Static typing, interfaces, generics |
| **5** | Angular | L23–L32 | Components, routing, forms, HTTP, state management |
| **6** | C# Basics | L33–L38 | OOP, LINQ, async/await, Entity Framework Core |
| **7** | ASP.NET Core | L39–L48 | REST APIs, authentication (JWT), SignalR, deployment |
| **8** | Pro Skills | L49 | Git mastery, GitHub workflows, AI tools |

### 🏗️ Portfolio Projects

You won't just follow tutorials — you'll build **7 progressive portfolio projects** suitable for your resume:

1. **Personal Developer Portfolio** — A multi-page website showcasing you (HTML/CSS, Lectures 1–8)
2. **TaskFlow Interactive Dashboard** — A dynamic task management app (JavaScript, Lectures 9–14)
3. **StartupLaunch Agency Landing Page** — A pixel-perfect marketing page (Bootstrap & Tailwind, Lectures 15–18)
4. **DataForge Utility Library** — A typed utility library (TypeScript, Lectures 19–22)
5. **FinanceTracker Library** — A C# data processing library (C#, Lectures 33–38)
6. **ShopAngular E-Commerce SPA** — A full-featured shopping application (Angular, Lectures 23–32)
7. **ShopAPI Full-Stack Backend** — A production-ready REST API connecting everything (ASP.NET, Lectures 39–48)

> [!TIP]
> By the end of this course, you will have 7 real, deployed projects to show employers — not just exercises. Each lecture adds a building block to a project you can be proud of.

---

## 🧪 Practice Labs

### Lab 1: Set Up Your Development Environment (30 min)

Get your tools ready before writing any serious code.

1. **Download and install** VS Code from [code.visualstudio.com](https://code.visualstudio.com/)
2. **Install all 5 extensions:** Live Server, Prettier, Material Icon Theme, Auto Rename Tag, ESLint
3. **Configure Prettier as your default formatter:**
   - Press `Ctrl+Shift+P` → search "Open User Settings (JSON)"
   - Add these two lines:
   ```json
   "editor.defaultFormatter": "esbenp.prettier-vscode",
   "editor.formatOnSave": true
   ```
4. **Install Node.js** (LTS version) from [nodejs.org](https://nodejs.org/)
5. **Install Git** from [git-scm.com](https://git-scm.com/)
6. **Verify all installations** by opening the VS Code terminal (`Ctrl+~`) and running:
   ```bash
   node -v       # Should print: v20.x.x or newer
   npm -v        # Should print: 10.x.x or newer
   git --version # Should print: git version 2.x.x
   ```
7. **Configure Git** with your name and email:
   ```bash
   git config --global user.name "Your Full Name"
   git config --global user.email "your@email.com"
   ```

### Lab 2: Trace an HTTP Request Live (25 min)

See the web working in real time with your own eyes.

1. Open Chrome or Edge
2. Press `F12` to open DevTools and go to the **Network** tab
3. Check the **"Preserve log"** checkbox at the top
4. Navigate to `https://en.wikipedia.org/wiki/Web_development`
5. Click the very first request in the Network list (the main HTML document)
6. In the right panel, identify:
   - **Request URL** — the full URL you requested
   - **Request Method** — should be `GET`
   - **Status Code** — should be `200 OK`
   - **Response Headers** — find `Content-Type: text/html`
7. Switch to the **Preview** or **Response** tab — you can see the raw HTML the server sent!
8. Look at the **Waterfall** column — see how the browser made dozens of follow-up requests for CSS, images, and JavaScript

### Lab 3: Create Your First Web Page (35 min)

1. Create a dedicated course folder on your computer (e.g., `D:\FullstackCourse\`)
2. Open that folder in VS Code (`File → Open Folder`)
3. Create `lab3.html` inside it
4. Use the Emmet shortcut (`!` + Tab) to generate the HTML boilerplate
5. Build a simple "About Me" page that includes:
   - An `<h1>` with your name
   - A paragraph explaining why you want to learn web development
   - An unordered list (`<ul>`) of 3 things you hope to build
   - A placeholder image: `<img src="https://picsum.photos/400/300" alt="A random placeholder image">`
   - A link to your favourite website (with `href` pointing to the actual URL)
6. Launch with Live Server and verify everything displays correctly

---

## 📝 Assignment: "How the Web Works" Report

### Overview

This assignment tests your understanding of the foundational concepts from this lecture. You'll write a mini technical report explaining the journey from typing a URL to seeing a webpage — demonstrating you understand the full cycle.

### Requirements

1. Create a new folder `assignment-00/` in your course directory and inside it create `index.html`
2. Write a structured report answering: *"What happens when you type `https://www.google.com` into a browser and press Enter?"*
3. Your report **must** use proper HTML structure with `<h2>` and `<h3>` headings for these sections:
   - **DNS Resolution** — How the domain name becomes an IP address
   - **TCP Handshake** — How the connection is established
   - **HTTP Request/Response** — What the browser asks for and what the server returns
   - **HTML Parsing & Rendering** — How the browser turns code into a visual page
4. Use semantic HTML: `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<strong>` for emphasis
5. Take at least **3 screenshots** from DevTools (Network tab) and embed them with `<img>` tags and descriptive `alt` attributes
6. Ensure the page opens correctly in your browser

### 📌 Portfolio Note

No progressive portfolio project milestone for Lecture 00. Your portfolio journey officially begins in Lecture 01!

### Optional Bonus Challenges

1. **HTTP Versions:** Add a section explaining the difference between HTTP/1.1 (sequential requests), HTTP/2 (multiplexed), and HTTP/3 (QUIC-based). Draw an ASCII diagram showing the difference.
2. **Basic Styling:** Add minimal inline CSS to make the report readable:
   ```html
   <body style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;">
   <h2 style="color: #2563eb;">
   ```
3. **Terminal Practice:** Use only the terminal to create your folder and file — no graphical file explorer!
   ```bash
   mkdir assignment-00
   cd assignment-00
   # On Windows (PowerShell): New-Item index.html
   # On Mac/Linux:            touch index.html
   ```

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| VS Code Download | https://code.visualstudio.com/ |
| Node.js Download | https://nodejs.org/ |
| Git Download | https://git-scm.com/ |
| MDN — How the Web Works | https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works |
| HTTP Status Codes (Fun Reference) | https://httpstatusdogs.com/ |
| Latency vs Bandwidth | https://www.cloudflare.com/learning/performance/glossary/what-is-latency/ |
| OKLCH Color Picker | https://oklch.com/ |

---

## 📌 Key Takeaways

- A computer = **Input → CPU (Process) → Output**; RAM is temporary, Storage is permanent
- **Compiled languages** (C#, Java) translate before execution; **interpreted languages** (JavaScript) translate line-by-line
- The **Internet** is a global network of computers connected via TCP/IP; **DNS** translates domain names to IP addresses
- The **World Wide Web** runs *on top of* the Internet using **HTTP** and the **Client-Server model**
- HTTP requests use **methods** (GET, POST, PUT, DELETE); servers reply with **status codes** (200 OK, 404 Not Found, 500 Server Error)
- **Frontend** = what users see (HTML + CSS + JavaScript); **Backend** = server logic + database; **Full-Stack** = both
- Your dev environment: **VS Code** + **Live Server** + **Node.js** + **Git**
- Every HTML page has the same skeleton: `<!DOCTYPE html>` → `<html>` → `<head>` (metadata) + `<body>` (visible content)
- **CSS is like the clothes a website wears** — the same HTML content can look completely different with different CSS

---

**Next Lecture:** [Lecture 01 — Introduction to Web Development & HTML5 Basics →](01%20-%20Introduction%20to%20Web%20Development%20%26%20HTML5%20Basics.md)
