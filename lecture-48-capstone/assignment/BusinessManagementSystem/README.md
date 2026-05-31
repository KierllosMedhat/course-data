# Capstone Project: Business Management System

Welcome to the final project! This capstone integrates everything you've learned: HTML/CSS, JavaScript, Angular, C#, EF Core, and ASP.NET Core.

## Backend (ASP.NET Core Web API)
The `backend/` folder contains the initial API scaffold.

### Architecture Requirements:
1. **Clean Architecture**: Separate your code into distinct layers (e.g., API, Core/Domain, Infrastructure).
2. **CQRS & MediatR**: Use the CQRS pattern for all business logic.
3. **Entity Framework Core**: Use a relational database (SQL Server or SQLite). Implement at least 4 related entities (e.g., Employee, Department, Project, Task).
4. **Authentication**: Implement Role-Based Access Control (Admin vs. User).
5. **Caching**: Implement output caching for frequently accessed, rarely changing data.

## Frontend (Angular)
Generate your Angular workspace in the `frontend/` folder.

### Architecture Requirements:
1. **Standalone Components**: Build the entire app using zoneless, standalone components.
2. **State Management**: Use RxJS Signals for reactive state management.
3. **Routing**: Implement lazy-loaded routes and Route Guards to protect admin-only pages.
4. **Angular Material**: Use Material components for a professional UI (Tables, Dialogs, Forms).
5. **Error Handling**: Implement a global error handler and display toast notifications.

## DevOps
- Implement a GitHub Actions workflow to build and test both the frontend and backend automatically on pull requests.

Good luck!
