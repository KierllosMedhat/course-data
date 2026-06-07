# Lab 2: Your First Git Repository

This lab guides you through the process of initializing a Git repository, making commits, creating branches, and pushing your work to GitHub.

## 🛠️ Step-by-step Tasks

### TODO 1: Initialize Git
Open your terminal (PowerShell, Git Bash, or Zsh) in this folder and initialize a Git repository.
- **Command to run:** `git init`

### TODO 2: Check Status
Verify which files are tracked/untracked by Git.
- **Command to run:** `git status`

### TODO 3: Configure Git (One-time setup)
If you haven't configured your Git credentials, run these commands with your info:
- `git config --global user.name "Your Name"`
- `git config --global user.email "your.email@example.com"`

### TODO 4: Stage your files
Stage this file (`lab2-git-instructions.md`) and the Lab 1 HTML file (`lab1-test.html`) to prepare them for commit.
- **Command to run:** `git add .` (or specify individual files like `git add lab2-git-instructions.md`)

### TODO 5: Create Your First Commit
Commit the staged files with a descriptive commit message.
- **Command to run:** `git commit -m "feat: complete dev environment setup and practice git basics"`

### TODO 6: Create a safe feature branch
Create and switch to a new branch called `feature/setup-check`.
- **Command to run:** `git checkout -b feature/setup-check` (or `git switch -c feature/setup-check`)

### TODO 7: Modify and Commit again
Add a note below this line in the file, then stage and commit your changes on the new branch.
- *Write your note here: [TODO: Add your custom note here]*
- **Commands to run:**
  1. `git add lab2-git-instructions.md`
  2. `git commit -m "docs: add custom setup note"`

### TODO 8: Merge back to main (Optional)
Switch back to your `main` branch and merge the changes from `feature/setup-check`.
- **Commands to run:**
  1. `git checkout main` (or `git switch main`)
  2. `git merge feature/setup-check`
