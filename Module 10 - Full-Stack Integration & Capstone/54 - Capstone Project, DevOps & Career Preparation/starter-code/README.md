# 🎓 Final Capstone Project: Enterprise E-Commerce Platform

Welcome to the Capstone Assignment repository. This workspace provides starter scaffolds for integrating, production-hardening, containerizing, and automating the deployment of your full-stack application.

## 📂 Directory Layout
- **`backend/`**: ASP.NET Core 10 Web API scaffolding, including production dockerfiles and health-check boilerplate.
- **`frontend/`**: Zoneless Angular 21 application workspace containing Signals-based architecture stubs.
- **`.github/workflows/`**: GitHub Actions workflows for continuous integration and automated deployment testing.

## 📝 Deliverables & Checklist
To achieve certification, you must finalize the following tasks:
- [ ] **Full Integration:** Confirm communication between Angular client services and C# controllers via Dev Proxy.
- [ ] **Auth Pipeline:** Ensure token authentication works end-to-end with the custom Functional interceptors.
- [ ] **Zoneless Migration:** Provide performance gains by migrating Angular to Zoneless change detection.
- [ ] **Deferred Loading:** Implement at least one `@defer` viewport block for lazy rendering.
- [ ] **Caching & Performance:** Configure `.AsNoTracking()` in read-only queries and install/configure `HybridCache`.
- [ ] **Observability:** Complete health check endpoints under `/health/live` and `/health/ready`.
- [ ] **DevOps Packaging:** Build and test the Docker container representing the API backend.
- [ ] **Continuous Integration:** Configure a GitHub Actions workflow that automatically builds and runs tests on PR requests.
- [ ] **Cloud Deployment:** Deploy both components to live public HTTPS endpoints.

Refer to the course portal to submit your final GitHub repository link and public production URLs.
