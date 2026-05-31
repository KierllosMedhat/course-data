# Lecture 49 — Miscellaneous Topics: Git, GitHub, AI & Developer Productivity

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Master version control using Git to track changes and collaborate effectively
- Navigate complex Git scenarios including merge conflicts, rebasing, and cherry-picking
- Implement a professional GitHub workflow with pull requests and code reviews
- Use AI tools like GitHub Copilot and Claude effectively and responsibly in your development workflow
- Apply prompt engineering techniques specific to software development
- Optimize your developer productivity with terminal tools and keyboard shortcuts
- Understand the path forward for continuous learning and career growth in 2026

## 📋 Agenda

### Part 1 — Theory (~90 minutes)
1. Git Fundamentals
2. Branching & Merging
3. GitHub Workflows
4. Git Advanced Techniques
5. AI-Assisted Development in 2026
6. Prompt Engineering for Developers
7. AI Ethics & Limitations
8. Developer Productivity & Terminal Mastery
9. Open Source Contribution
10. Continuous Learning & Career Growth

### Part 2 — Practice & Lab (~90–120 minutes)
1. Git Workflow Mastery
2. GitHub Collaboration Simulation
3. AI Pair Programming
4. Portfolio Launch Assignment

---

## 1. Git Fundamentals

Version control is essential for any professional developer. Git allows you to track changes, collaborate with others, and safely experiment without breaking working code.

### The Three States of Git
Git thinks about files in three main states:
1. **Modified**: You have changed the file but haven't committed it to the database yet. (Working Directory)
2. **Staged**: You have marked a modified file in its current version to go into your next commit snapshot. (Staging Area)
3. **Committed**: The data is safely stored in your local database. (Repository)

### Essential Git Commands

| Command | Purpose |
|---------|---------|
| `git init` | Initialize a new local Git repository |
| `git add <file>` | Move changes from the working directory to the staging area |
| `git commit -m "msg"` | Save the staged snapshot to the repository |
| `git status` | Show the state of the working directory and staging area |
| `git log --oneline` | View the commit history compactly |
| `git diff` | Show unstaged changes |

> [!TIP]
> **Conventional Commits**  
> Professional teams use a standard format for commit messages:
> - `feat: add user login` (New feature)
> - `fix: resolve crash on checkout` (Bug fix)
> - `docs: update readme` (Documentation changes)
> - `refactor: simplify user service` (Code change that neither fixes a bug nor adds a feature)

### The `.gitignore` File
You should *never* commit everything. Things like `node_modules`, compiled code (`bin/`, `obj/`), and secrets (API keys) must be kept out of version control using a `.gitignore` file.

---

## 2. Branching & Merging

Branching allows you to diverge from the main line of development and continue to do work without messing with that main line.

### Basic Branching Workflow
1. `git branch feature/navbar` (Create a new branch)
2. `git switch feature/navbar` (Move to that branch)
   - *Note: `git switch` is the modern alternative to `git checkout` for switching branches.*
3. Make commits on the new branch.
4. `git switch main` (Go back to the main branch)
5. `git merge feature/navbar` (Bring the changes into main)

### Merge Conflicts
If you modified the exact same part of the same file differently in the two branches you're merging, Git won't be able to merge them cleanly.

**Resolving a Conflict:**
1. Git will pause the merge and tell you there is a conflict.
2. Open the file in VS Code. You'll see markers like `<<<<<<< HEAD` and `>>>>>>> feature/navbar`.
3. Choose which changes to keep (or combine them manually).
4. Save the file.
5. `git add <file>` (Mark as resolved)
6. `git commit` (Finalize the merge)

### Merging vs. Rebasing
- **Merging**: Creates a new "merge commit" that ties the two histories together. It's safe and preserves history exactly as it happened.
- **Rebasing**: Moves your entire branch to begin on the tip of the `main` branch. It rewrites history to create a clean, linear project history.

> [!CAUTION]  
> **The Golden Rule of Rebasing**: *Never* rebase commits that exist outside your repository and that people may have based work on. Only rebase your local, private branches.

---

## 3. GitHub Workflows

Git is the tool on your computer; GitHub is the platform in the cloud where you host and share your Git repositories.

### Pull Requests (PRs)
In a professional environment, you don't merge your own code directly into `main`. You open a Pull Request.

1. Push your feature branch to GitHub: `git push origin feature/login`
2. Open a Pull Request on GitHub.
3. Your team reviews the code, leaves comments, and suggests changes.
4. You make the requested changes and push them (they automatically update the PR).
5. Once approved, the team lead merges the PR into `main`.

### Forking vs Cloning
- **Clone**: Downloading a copy of a repository you have direct access to.
- **Fork**: Creating a personal copy of someone else's repository on your GitHub account so you can propose changes to it.

---

## 4. Git Advanced Techniques

Sometimes things go wrong, or you need precise control over your history.

| Command | Purpose | Scenario |
|---------|---------|----------|
| `git stash` | Temporarily shelves changes | You need to switch branches quickly but aren't ready to commit your current work. |
| `git cherry-pick <hash>` | Applies the changes from a single commit | You need a bugfix from another branch but don't want to merge the whole branch. |
| `git rebase -i` | Interactive rebase | You want to squash multiple small messy commits into one clean commit before pushing. |
| `git reflog` | Log of all branch updates | You accidentally deleted a branch or messed up a rebase and need to recover lost commits. |

---

## 5. AI-Assisted Development in 2026

AI tools have fundamentally changed how developers work. They are not replacing developers; they are amplifying them. 

### The Tool Landscape

| Tool | Primary Use Case | Strengths |
|------|------------------|-----------|
| **GitHub Copilot** | Inline autocomplete | Context-aware, integrates directly into standard editors, excellent for boilerplate. |
| **Cursor / Windsurf** | AI-first IDEs | Deep codebase understanding, can refactor multiple files simultaneously, powerful chat. |
| **Claude / ChatGPT** | Architecture & complex logic | Best for brainstorming, rubber-ducking, and generating complex, isolated algorithms. |

### How AI Changes the Workflow
- **Less typing, more reviewing**: You spend more time reading and verifying code generated by AI than typing it character by character.
- **Faster unblocking**: Instead of searching Stack Overflow, you ask the AI for the specific solution to an obscure error.
- **Better testing**: AI is excellent at generating edge-case unit tests.

---

## 6. Prompt Engineering for Developers

Getting good code from AI requires giving it good instructions. 

### The CONTEXT-TASK-FORMAT Pattern
1. **Context**: "I am building an Angular 21 e-commerce app using signals."
2. **Task**: "Write a CartService that handles adding/removing items and calculating totals."
3. **Format**: "Provide only the TypeScript code, using the modern `inject()` function and `computed()` signals. No NgModules."

### Real-World Prompt Examples

**Refactoring:**
> "Here is my legacy JavaScript function that uses nested callbacks. Refactor this to use modern `async/await` and handle errors with `try/catch`. Explain what you changed."

**Debugging:**
> "I am getting a `NullReferenceException` in C# on line 42 of this file. Here is the relevant code block: [code]. What could cause this, and how do I fix it safely using the null-conditional operator?"

**Testing:**
> "Write a suite of xUnit tests for this `CalculateDiscount` method. Include edge cases for negative prices, null inputs, and maximum discount limits."

---

## 7. AI Ethics & Limitations

> [!WARNING]  
> **When NOT to trust AI blindly:**
> 1. **Security/Cryptography**: AI can confidently generate insecure hashing or auth logic. Always verify with official documentation.
> 2. **Complex Business Logic**: AI doesn't know your company's specific rules unless you tell it.
> 3. **Package Imports**: AI frequently "hallucinates" methods that don't exist in a library, or uses outdated APIs.

**The Golden Rule of AI:** If you don't understand the code well enough to maintain it and fix it when it breaks, you shouldn't commit it. AI is a pair programmer, not a replacement for your brain.

---

## 8. Developer Productivity & Terminal Mastery

A professional developer is fast. Learning your tools pays massive dividends over a career.

### Terminal Mastery
You should be comfortable navigating your computer without a mouse.

| Action | PowerShell (Windows) | Bash (Mac/Linux) |
|--------|----------------------|------------------|
| List files | `dir` or `ls` | `ls -la` |
| Change directory | `cd <path>` | `cd <path>` |
| Create folder | `mkdir <name>` | `mkdir <name>` |
| Create empty file | `New-Item <name>` | `touch <name>` |
| Print file contents| `cat <name>` | `cat <name>` |

### VS Code Essential Shortcuts
- **Ctrl+P**: Quick open file
- **Ctrl+Shift+F**: Global search across all files
- **Ctrl+D**: Select next occurrence of current word
- **Alt+Click**: Multiple cursors
- **Alt+Up/Down**: Move line up/down

---

## 9. Open Source Contribution

Contributing to open source is one of the best ways to level up your skills, build your resume, and give back to the community.

1. **Find a project**: Look for repositories with the "good first issue" or "help wanted" labels.
2. **Read the guidelines**: Always read `CONTRIBUTING.md` and the Code of Conduct.
3. **Communicate**: Comment on the issue asking if you can take it before you start writing code.
4. **Follow the workflow**: Fork the repo, create a branch, write clean code, and open a detailed Pull Request.

---

## 10. Continuous Learning & Career Growth

The tech stack you learned in this course will evolve. Your most important skill is learning how to learn.

- **The T-Shaped Developer**: Aim to have a broad understanding of the whole stack (the top of the T), but deep expertise in one specific area (the stem of the T).
- **Stay Current**: Follow newsletters like ByteByteGo, Frontend Focus, or .NET Weekly.
- **Build in Public**: Share what you are learning on LinkedIn or a personal blog.
- **Don't chase every trend**: Wait for technologies to prove their worth before rewriting all your apps. Master the fundamentals.

---

## 🧪 Practice Labs

### Lab 1: Git Workflow Mastery (45 min)
Let's practice advanced Git locally.
1. Initialize a new local repository in a folder.
2. Create an `index.html` file and commit it to `main`.
3. Create a branch called `feature/add-footer`. Add a footer to the HTML. Commit the change.
4. Switch back to `main`. Add a completely different footer to the same lines in `index.html`. Commit it.
5. Attempt to merge `feature/add-footer` into `main`.
6. You will get a merge conflict! Resolve the conflict in VS Code by combining both footers, save, and finish the merge commit.
7. Run `git log --graph --oneline` to see the resulting history.

### Lab 2: GitHub Collaboration Simulation (40 min)
*If you are doing this course with a friend, do this together!*
1. Create a public repository on GitHub.
2. Invite your partner as a collaborator (or have them Fork it).
3. Clone the repo to your local machine.
4. Create a branch, make a change, and push the branch to GitHub.
5. Open a Pull Request on GitHub. Use a proper PR description template.
6. Have your partner review the code and request a change.
7. Make the change locally, push again, and have the partner approve and merge the PR.

### Lab 3: AI Pair Programming (35 min)
Let's test an AI's ability to refactor.
1. Take the messy, unoptimized JavaScript file provided in the `labs/lab3-refactor-target.js` starter.
2. Paste it into an AI tool (ChatGPT, Claude, or Copilot Chat).
3. Prompt: *"This is legacy JavaScript. Refactor this code to use modern ES6+ features (arrow functions, async/await, optional chaining, array methods). Ensure it is clean and readable, but do not change the underlying business logic."*
4. Compare the result to the original. Did it break anything? Is it truly better?

---

## 📝 Assignment: Professional Developer Portfolio Launch

This is it! Time to present your hard work to the world.

### Requirements
1. Select your top 3 projects from this course (e.g., the TaskFlow Dashboard, the DataForge utility library, and the full-stack ShopAPI/ShopAngular platform).
2. Create clean, public GitHub repositories for each.
3. Ensure every repository has a proper `.gitignore` file so no `node_modules` or `bin/obj` folders are pushed.
4. **READMEs**: Write a professional `README.md` for each project using the template provided in the `assignment/` folder. It must include: Project description, tech stack used, setup/installation instructions, and screenshots.
5. Set up **GitHub Actions CI** for at least one project so it builds and tests automatically when you push to `main`.
6. Write a **Reflection Essay** (approx. 500 words) using the template provided. Reflect on your use of AI tools during this course—what worked well, what caused issues, and how your approach to coding has changed.

### 🏗️ Portfolio Project
This assignment represents the final polish and publication of all your portfolio projects. Your GitHub profile is now your resume.

### Optional Bonus
1. Deploy your frontend projects live using Netlify, Vercel, or GitHub Pages, and link to the live demo in your READMEs.
2. Create a clean Git history using interactive rebase before pushing your final commits.
3. Record a 2-minute Loom video walking through your final Capstone project and link it in the README.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Pro Git Book (Free) | https://git-scm.com/book/en/v2 |
| GitHub Learning Lab | https://lab.github.com/ |
| Conventional Commits | https://www.conventionalcommits.org/ |
| Prompt Engineering Guide | https://www.promptingguide.ai/ |
| Missing Semester of Your CS Education (CLI tools) | https://missing.csail.mit.edu/ |

---

## 📌 Key Takeaways
- Git tracks changes securely; use branches for new work and keep the `main` branch stable.
- Merging and rebasing both integrate changes, but rebasing rewrites history for a cleaner timeline (only use on local branches).
- GitHub is for collaboration: use Pull Requests and code reviews to maintain quality.
- AI tools like Copilot and Claude are powerful assistants that write boilerplate and solve isolated algorithms, but they require developer oversight.
- Effective prompt engineering relies on providing clear Context, specific Tasks, and desired Formats.
- Terminal proficiency and keyboard shortcuts separate average developers from highly productive ones.
- Your portfolio and GitHub profile are your most important assets for getting hired in 2026.

---

**🎉 Congratulations!**  
You've reached the end of the Full-Stack Web Development Course. You have journeyed from basic HTML to complex ASP.NET Web APIs and Angular frontends, building real-world projects along the way. The skills you've learned here—and your ability to learn new ones—will serve you throughout your career as a professional developer. Keep building, keep coding, and welcome to the industry!
