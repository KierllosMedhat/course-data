# Lecture 48 — Capstone Project, DevOps & Career Preparation

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Architect a full-stack Capstone Project with clear separation of concerns.
- Prepare your Angular 21 application for production.
- Prepare your ASP.NET Core 10 application for production.
- Apply Git branching strategies and code review processes.
- Build a professional GitHub portfolio with pinned projects.
- Prepare for full-stack technical interviews.

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Capstone Architecture
2. Front-End Production Readiness
3. Back-End Production Readiness
4. DevOps & Git
5. Portfolio & Interviews

### Part 2 — Practice / Lab (~90–120 min)
1. Capstone Scaffolding
2. ShopAPI Project Part 10: Capstone Delivery

---

## 1. Capstone Architecture

The capstone integrates every technology from the course into a single, deployable system:

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  Angular v21 SPA (Standalone, Signals, Zoneless)    │
│  Auth Interceptor → Bearer Token → HTTP Calls       │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────┐
│                 API Gateway Layer                    │
│  Kestrel → Middleware Pipeline                      │
│  ExceptionHandler → CORS → Auth → RateLimiter       │
│  Health Checks (/health/live, /health/ready)        │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│               Application Layer                      │
│  Controllers → MediatR (CQRS) → Handlers            │
│  FluentValidation → Pipeline Behaviors               │
│  SignalR Hubs → Real‑Time Notifications             │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                 Persistence Layer                    │
│  EF Core 10 → Repository → Unit of Work             │
│  SQL Server / SQLite                                │
│  HybridCache (L1 Memory + L2 Redis)                 │
└─────────────────────────────────────────────────────┘
```

When an interviewer asks "describe a complex system you built," walk through this architecture!
Example: *An Angular component dispatches an HTTP request → Pipeline validates → MediatR Handler persists with EF Core → Cache is invalidated → SignalR notification fires!*

---

## 2. Front-End Production Readiness (Angular)

Before deploying Angular, we need to optimize it.

1. **Lazy Loading:** Use `loadComponent` in your routes so features are only downloaded when the user visits them.
2. **`@defer` Blocks:** Defer loading heavy components (like charts or lists) until they scroll into view.
3. **Zoneless:** Remove `zone.js` for a smaller runtime and rely on Signals for change detection.
4. **esbuild:** Run `ng build --configuration production` to trigger the aggressive esbuild minifier!

---

## 3. Back-End Production Readiness (ASP.NET Core)

1. **`MapStaticAssets`:** Replaces `UseStaticFiles()`. It provides build-time compression (gzip + Brotli) and fingerprinted ETags.
2. **Health Checks:** Add `/health/live` and `/health/ready` endpoints so your cloud provider knows if your app crashed!
3. **`AsNoTracking()`:** Double check all your EF Core Queries. Are they using `AsNoTracking()`? This can make reads 30-50% faster!
4. **Environment Variables:** Never hardcode connection strings or JWT keys. Use `appsettings.Production.json` or Cloud Environment Variables!

---

## 4. DevOps & Git

### Branching Strategies
- **GitHub Flow:** Single `main` branch. Create a feature branch, open a PR, merge. Perfect for SaaS and side projects.
- **GitFlow:** `develop` and `main` branches. Great for enterprise versioned software.

### Code Review
- Open a Pull Request (PR) even if you work alone. It forces you to review your own diff.
- Keep PRs small (< 400 lines).
- Squash and Merge to keep your `main` history clean!

---

## 5. Portfolio & Interviews

Your GitHub profile is your resume.

### The Perfect README
1. **Title & Brief Description:** What does it do?
2. **Screenshots or GIFs:** Recruiters don't clone code, they look at pictures!
3. **Tech Stack:** "Angular 21, .NET 10, EF Core, Redis".
4. **Architecture Diagram:** Draw the boxes from Section 1.
5. **Live Demo Link:** Host it on Railway, Render, or Azure!

### Technical Interview Tips
- Use the **STAR** method for behavioral questions: **S**ituation, **T**ask, **A**ction, **R**esult.
- Be prepared to answer:
  - Explain the ASP.NET Core Middleware Pipeline.
  - Dependency Injection lifetimes (Singleton vs Scoped vs Transient).
  - Angular Signals vs RxJS.

---

## 🧪 Practice Labs

### Lab 1 — Portfolio Audit (45 min)
1. Go to your GitHub profile.
2. Pin your 4 best repositories.
3. Open your ShopAPI repository. Write a professional `README.md` following the template above!
4. Take a screenshot of your Angular app and embed it in the README.

---

## 📝 Assignment: ShopAPI Project — Part 10 (Capstone Delivery)

This is it! Deliver your final capstone project.

### Requirements
1. **Completion:** Ensure all previous 9 parts of the ShopAPI and ShopApp are complete.
2. **Production Build:** Run `ng build` for Angular and integrate it into your ASP.NET Core `wwwroot` folder, OR deploy them separately using Docker.
3. **Health Checks:** Add health checks to your .NET API.
4. **Documentation:** Write an exceptional `README.md`.
5. **Deployment:** Deploy your full-stack application to a cloud provider and ensure it works end-to-end!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Deployment | https://angular.dev/guide/deployment |
| ASP.NET Core Health Checks | https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks |

---

## 📌 Key Takeaways
- **The Capstone** is your proof of competence — architect, deploy, and document it.
- **Angular:** lazy loading + `@defer` + standalone + zoneless = minimal bundle, maximum speed.
- **ASP.NET Core:** `MapStaticAssets` + `HybridCache` + rate limiting = production-grade performance.
- **Portfolio:** GitHub profile, detailed READMEs, live demos, CI/CD badges.

---

## 🎉 Congratulations!

**You have completed the Full-Stack Web Development Master Course.**

> 48 Lectures · 144 Hours · Theory + Practice + Projects

You haven't just attended lectures — you've **built**: ShopAPI, FinanceTracker, and countless small labs. Walk into your next interview with the confidence of a builder. You are a full-stack developer.

*Now go build something extraordinary.*