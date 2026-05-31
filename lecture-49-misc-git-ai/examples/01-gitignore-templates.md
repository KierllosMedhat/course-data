# Common .gitignore Templates

Here are the standard `.gitignore` templates for the main technologies used in this course. Always create a `.gitignore` file in the root of your project BEFORE you run `git add .` or commit anything!

## 1. Web Projects (HTML/CSS/Vanilla JS)
For simple frontend projects without a build step:

```text
# OS generated files
.DS_Store
Thumbs.db

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln

# Ignore local environment variables if used
.env
.env.local
```

## 2. Node.js / Angular / React / Vite Projects
For projects that use npm packages:

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# Dependencies
node_modules/
dist/
dist-ssr/
*.local

# Editor directories
.vscode/
.idea/
.DS_Store

# Environment variables (CRITICAL TO IGNORE!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 3. C# / .NET / ASP.NET Core Projects
For your backend APIs:

```text
# Build results
[Bb]in/
[Oo]bj/

# Visual Studio files
.vs/
*.user
*.userosscache
*.sln.docstates

# NuGet Packages
*.nupkg
packages/

# User-specific files
*.rsuser
*.suo
*.user

# Environment variables and secrets
appsettings.Development.json
appsettings.Local.json
```
