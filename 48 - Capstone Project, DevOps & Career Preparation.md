# Lecture 48 — Capstone Project, DevOps & Career Preparation

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Architect a full-stack Capstone Project with clear separation of concerns
- Prepare your Angular 21 application for production (Zoneless, Lazy Loading, `@defer`)
- Prepare your ASP.NET Core 10 application for production (Health Checks, MapStaticAssets)
- Apply professional Git branching strategies (GitHub Flow vs GitFlow) and code review processes
- Build a standout GitHub portfolio with pinned projects and exceptional `README` files
- Structure your answers for full-stack technical interviews using the STAR method

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. The Capstone Architecture
2. Front-End Production Readiness (Angular)
3. Back-End Production Readiness (ASP.NET Core)
4. DevOps & Version Control Strategies
5. The Perfect Portfolio & Interviewing

### Part 2 — Practice / Lab (~90–120 min)
1. Capstone Scaffolding
2. ShopAPI Project Part 10: Capstone Delivery

---

## 1. The Capstone Architecture

The capstone project is the culmination of everything you've learned. It integrates every technology into a single, cohesive, deployable system.

```text
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  Angular SPA (Standalone, Signals, Zoneless)        │
│  Auth Interceptor → Bearer Token → HTTP Calls       │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS Request
┌────────────────────────▼────────────────────────────┐
│                 API Gateway Layer                    │
│  Kestrel Server → Middleware Pipeline               │
│  GlobalExceptionHandler → CORS → Auth → RateLimiter │
│  Health Checks (/health/live, /health/ready)        │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│               Application Layer                      │
│  API Controllers → MediatR (CQRS)                   │
│  FluentValidation → Pipeline Behaviors               │
│  SignalR Hubs → Real‑Time Notifications             │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                 Persistence Layer                    │
│  EF Core 10 → Generic Repository → Unit of Work     │
│  SQL Server / SQLite Database                       │
│  HybridCache (L1 Memory + L2 Redis)                 │
└─────────────────────────────────────────────────────┘
```

When an interviewer asks, *"Describe a complex system you built,"* walk them through this diagram top-to-bottom! 

**Example Answer:** *"I built an eCommerce platform. An Angular component uses Signals to manage state and dispatches an HTTP POST. An Angular Interceptor attaches a JWT token. On the backend, Kestrel receives it. The ASP.NET pipeline validates the JWT. The Controller wraps the payload in a Command and sends it to MediatR. A Pipeline Behavior intercepts the command to run FluentValidation. The Handler uses a Unit of Work to save to EF Core, clears the HybridCache, and uses an IHubContext to push a SignalR notification back to all connected Angular clients."*

---

## 2. Front-End Production Readiness (Angular)

Before deploying Angular, we need to optimize it so it loads instantly for users on slow mobile connections.

1. **Lazy Loading:** Never load the "Admin Dashboard" code for a user who isn't logged in. Use `loadComponent` in your Route definitions so features are only downloaded when the user actually navigates to them.
2. **`@defer` Blocks:** If a page has a heavy chart at the very bottom, use `@defer (on viewport) { <heavy-chart /> }`. Angular won't download the chart code until the user actually scrolls down to see it!
3. **Zoneless & Signals:** Remove `zone.js` to shrink your bundle size, and rely purely on Signals for change detection.
4. **The Build Command:** Always run `ng build --configuration production`. This triggers the aggressive `esbuild` minifier, removes dead code (tree-shaking), and creates the final optimized `/dist` folder.

---

## 3. Back-End Production Readiness (ASP.NET Core)

1. **`MapStaticAssets`:** If you are serving your Angular files directly from ASP.NET Core, replace `UseStaticFiles()` with the new `MapStaticAssets()`. It automatically compresses files (gzip/Brotli) at build time and adds cryptographic ETags for perfect browser caching.
2. **Health Checks:** Cloud providers (like Azure or AWS) need to know if your app crashed so they can restart it. Add `builder.Services.AddHealthChecks()` and `app.MapHealthChecks("/health")`.
3. **`AsNoTracking()`:** Double check all your EF Core `GET` Queries. If you are just reading data to return a DTO, use `.AsNoTracking()`. This stops EF Core from setting up change-trackers in memory and makes your reads **30-50% faster**!
4. **Environment Variables:** Never hardcode connection strings or JWT secret keys in C#. In production, your cloud provider injects these securely as Environment Variables.

---

## 4. DevOps & Version Control Strategies

### Branching Strategies

When working on a team, you cannot all push directly to `main`. 

1. **GitHub Flow (The Modern Standard):** 
   - `main` is always deployable. 
   - You create a new branch (e.g., `feature/add-shopping-cart`).
   - You commit your code and open a Pull Request (PR) against `main`.
   - Your CI/CD pipeline runs tests automatically.
   - Another developer reviews the code. If approved, you merge.
2. **GitFlow (Enterprise):** 
   - Maintains a `develop` branch for ongoing work, and only merges to `main` when a specific version (e.g., v2.0) is officially released.

### Code Review Etiquette
- **Keep PRs Small:** A PR with 100 lines of code will get a great review. A PR with 2,000 lines will just get an "Looks Good To Me" rubber stamp because the reviewer is overwhelmed.
- **Squash and Merge:** When merging your PR, squash all your messy `wip` or `fixed typo` commits into one single, clean commit message on `main`.

---

## 5. The Perfect Portfolio & Interviewing

Your GitHub profile is your modern resume. Recruiters don't read code; they look at pictures and structure.

### The Perfect `README.md`
If a recruiter lands on your Capstone repository, they need to understand it in 10 seconds.
1. **Title & Elevator Pitch:** "ShopAPI - A full-stack eCommerce platform built with Angular and .NET."
2. **Hero Image/GIF:** A high-quality screenshot or short GIF showing the UI actually working.
3. **Tech Stack Badges:** Angular, .NET 10, SQL Server, Redis, Docker.
4. **Architecture Diagram:** Draw the boxes from Section 1!
5. **Live Demo Link:** Host the frontend on Vercel/Netlify, and the API on Azure/Railway. Provide a clickable link!

### Technical Interview Tips
When answering behavioral questions ("Tell me about a time you struggled with a bug"), use the **STAR** method to keep your answer concise:
- **S**ituation: "I was building the shopping cart feature."
- **T**ask: "I noticed items were disappearing when the user refreshed the page."
- **A**ction: "I realized the state wasn't persisting, so I implemented an Angular HttpInterceptor to sync the Signals state with the backend Redis cache."
- **R**esult: "The bug was fixed, and page reload times actually improved by 20%."

---

## 🧪 Practice Labs

### Lab 1 — Portfolio Audit (45 min)
1. Go to your GitHub profile.
2. Pin your 4 best repositories to the top of your profile.
3. Open your ShopAPI repository. Write a professional `README.md` following the template above!
4. Take a screenshot of your Angular app and embed it in the README (`![App Screenshot](./docs/app.png)`).

---

## 📝 Assignment: ShopAPI Project — Part 10 (Capstone Delivery)

This is it! Deliver your final capstone project.

### Requirements
1. **Completion:** Ensure all previous 9 parts of the ShopAPI and ShopApp are fully functional.
2. **Production Build:** Run `ng build` for your Angular app.
3. **Health Checks:** Add health checks to your .NET API. Ensure all EF Core read queries use `.AsNoTracking()`.
4. **Documentation:** Write an exceptional `README.md` with an architecture diagram and screenshots.
5. **Deployment:** Deploy your full-stack application to a cloud provider (e.g., Azure App Service, Railway, Render) and ensure it works end-to-end on the public internet!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Deployment | https://angular.dev/guide/deployment |
| ASP.NET Core Health Checks | https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks |
| The STAR Method | https://www.thebalancecareers.com/what-is-the-star-interview-response-technique-2061629 |

---

## 📌 Key Takeaways
- **The Capstone** is your proof of competence. It proves you can architect, deploy, and document a real system.
- **Angular Optimization:** Combine lazy loading, `@defer`, standalone components, and zoneless mode for a lightning-fast frontend.
- **ASP.NET Core Optimization:** Use `MapStaticAssets`, `HybridCache`, `.AsNoTracking()`, and Health Checks for production-grade reliability.
- **Portfolio Building:** Make your GitHub profile shine with detailed READMEs, architecture diagrams, and live demos.

---

## 🎉 Congratulations!

**You have officially completed the Full-Stack Web Development Master Course.**

> 48 Lectures · 144 Hours · Theory + Practice + Projects

You haven't just attended lectures — you've **built**: ShopAPI, FinanceTracker, and countless small labs. Walk into your next interview not as a student, but with the confidence of a builder. You are a full-stack developer.

*Now go build something extraordinary.*
