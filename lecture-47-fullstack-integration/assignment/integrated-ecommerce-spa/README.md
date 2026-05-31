# Integrated E-Commerce SPA

This assignment requires building a full-stack application.

## Backend (ASP.NET Core Web API)
The `backend/` folder contains a scaffolded Web API project.

### TODO:
1. Configure CORS in `Program.cs` to allow requests from `http://localhost:4200`.
2. Create an `OrdersController` with basic CRUD operations.
3. Secure the endpoints using JWT Authentication.

## Frontend (Angular)
You need to generate an Angular project in the `frontend/` folder:
```bash
ng new frontend --style=css --ssr=false
```

### TODO:
1. Create an `environment.ts` file with the `apiUrl` pointing to your running ASP.NET Core backend (e.g., `https://localhost:7123/api`).
2. Implement an `OrderService` using `HttpClient` to communicate with the backend.
3. Implement an HTTP Interceptor to attach the JWT token to outgoing requests.
4. Build a UI to list, create, and view orders.
