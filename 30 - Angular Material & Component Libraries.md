# Lecture 30 — Angular Material & Component Libraries

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Understand what Angular Material is and why you'd use a component library
- Install and configure Angular Material using `ng add @angular/material`
- Apply and customize pre-built themes using Angular's theming system
- Use core components: buttons, form fields, cards, lists
- Build responsive navigation layouts with `MatSidenav` and `MatToolbar`
- Create feature-rich data tables with `MatTable`, `MatSort`, `MatPaginator`, and filtering
- Provide user feedback with `MatDialog` and `MatSnackBar`
- Understand the Angular CDK and what it offers
- Compare Angular Material to other popular Angular component libraries

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. What is a Component Library? Why use one?
2. Angular Material: installation and theming
3. Core components: buttons, form fields, cards
4. Navigation: `MatSidenav`, `MatToolbar`
5. Data tables: `MatTable` (broken down step by step)
6. Feedback: `MatDialog`, `MatSnackBar`
7. Angular CDK: behaviour without style
8. Alternative component libraries

### Part 2 — Practice / Lab (~90–120 min)
1. Set up Angular Material with a custom theme
2. Build a data table with sorting, pagination, and filtering
3. ShopAngular Project Part 8: Angular Material UI

---

## 1. What is a Component Library? Why Should You Use One?

### Plain-English Explanation

Imagine you are building a house. You *could* manufacture your own door handles, windows, and light switches from scratch. But that would take a very long time, and the results might not be as polished or safe as factory-made ones.

A **component library** is the equivalent of a hardware store for UI development. It provides a collection of **pre-built, pre-styled, pre-tested UI components** — buttons, form inputs, modals, tables, and more — that you can drop into your app without writing the underlying HTML, CSS, and JavaScript behaviour from scratch.

### Why Not Just Write Everything Yourself?

1. **Accessibility (a11y) is hard.** Screen readers, keyboard navigation, focus management, ARIA attributes — getting these right takes years of expertise. Pre-built components have this baked in.
2. **Cross-browser consistency.** Input elements look different in Chrome vs Firefox vs Safari. Libraries normalize these differences.
3. **Design consistency.** A library enforces a unified visual language across your entire app.
4. **Speed.** You ship features faster.

### Why Does This Matter?

> [!NOTE]
> In most professional development environments, you will not be building UI components from scratch. You will be using a component library. Understanding how to install, configure, and extend one is a core job skill.

---

## 2. Angular Material — What It Is

**Angular Material** is the official component library built and maintained by the **Angular team at Google**. It implements [Google's Material Design](https://m3.material.io/) specification — a comprehensive system of guidelines for building consistent, accessible, and beautiful UIs.

Because it's made by the same team as Angular itself, it has:
- **First-class Angular integration** — components work natively with Angular forms, change detection, and signals
- **Full accessibility (a11y)** — keyboard navigation, ARIA roles, and screen reader support built in
- **Theming support** — one line changes the color of your entire app
- **Regular updates** — kept in sync with Angular releases

---

## 3. Installation & Setup

### Step-by-Step Installation

1. **Navigate to your Angular project** in the terminal.
2. **Run the Angular schematic** — this is a special CLI command that does more than just `npm install`:

```bash
ng add @angular/material
```

3. **Answer the prompts** the CLI shows you:
   - *Choose a prebuilt theme* (or "Custom" for a fully custom palette)
   - *Set up global Angular Material typography styles?* → **Yes**
   - *Include the Angular animations module?* → **Yes**

4. **What the command does automatically:**
   - Adds `@angular/material` and `@angular/cdk` to `package.json`
   - Adds the chosen theme CSS import to `angular.json` → `styles`
   - Adds `provideAnimationsAsync()` to your `app.config.ts`
   - Adds Material typography classes to `index.html`

> [!TIP]
> The `ng add` command is a "schematic" — it not only installs a package, it also *configures* your project automatically. This is why you should use `ng add @angular/material` instead of plain `npm install @angular/material`.

### Understanding Themes

Angular Material comes with four pre-built themes you can choose from:

```
azure-blue     — Clean Microsoft-style blue/white
rose-red       — Warm red and pink tones
magenta-violet — Purple and magenta tones
cyan-orange    — Teal cyan with orange accents
```

Each theme defines three **color roles** that you'll see used throughout Material components:
- **Primary** — the main brand color (buttons, toolbar, checkboxes)
- **Secondary / Accent** — a complementary highlight color
- **Error** — the color for error states in forms

### Creating a Custom Theme (Overview)

If you want full control over colors, you can define a custom theme in your `styles.scss`:

```scss
/* styles.scss */
@use '@angular/material' as mat;

/* 
  mat.theme() generates all the Material design tokens for your theme.
  You specify your primary and tertiary (accent) colors using
  Material Design color palettes.
*/
html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,     /* The main brand color palette */
      tertiary: mat.$blue-palette,     /* The accent color palette */
      theme-type: light,               /* 'light' or 'dark' */
    ),
    typography: Roboto,                /* The font to use throughout */
    density: 0,                        /* Spacing density (-3 to 0) */
  ));
}
```

### Importing Material Modules into Components

Modern Angular is **standalone-by-default**. This means you must explicitly import each Material module into every component that uses it.

```typescript
// product-card.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';       // For <mat-card>
import { MatButtonModule } from '@angular/material/button';   // For mat-button directive

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    MatCardModule,    // Gives us <mat-card>, <mat-card-header>, etc.
    MatButtonModule,  // Gives us the mat-button, mat-raised-button directives
  ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {}
```

> [!NOTE]
> Each module (e.g., `MatCardModule`) exports a family of related components and directives. `MatCardModule` gives you `<mat-card>`, `<mat-card-header>`, `<mat-card-title>`, `<mat-card-content>`, `<mat-card-actions>`, and more — all in one import.

### Section Recap
- Angular Material is the official, accessible, Google-maintained UI library for Angular
- Install with `ng add @angular/material` — it configures your project automatically
- Choose a pre-built theme or create a fully custom one in `styles.scss`
- In standalone Angular, each component must explicitly import the Material modules it uses

---

## 4. Core Components

### 4.1 Buttons

Angular Material buttons are applied as **directives** on the native HTML `<button>` element. This means you keep semantic HTML (important for accessibility) and the directive adds the Material styling.

```html
<!-- Basic text button — subtle, low-emphasis -->
<button mat-button>Basic</button>

<!-- Raised button — has a drop shadow, medium emphasis -->
<button mat-raised-button color="primary">Raised</button>

<!-- Flat button — no shadow, filled color -->
<button mat-flat-button color="accent">Flat</button>

<!-- Stroked (outline) button — bordered, no fill -->
<button mat-stroked-button color="warn">Stroked</button>

<!-- Icon button — circular, icon only -->
<button mat-icon-button aria-label="Go home">
  <mat-icon>home</mat-icon>  <!-- Material Design icon name -->
</button>

<!-- FAB (Floating Action Button) — large, circular, prominent -->
<button mat-fab color="primary" aria-label="Add item">
  <mat-icon>add</mat-icon>
</button>
```

**When to use which button variant:**

| Variant | Use Case |
|---------|----------|
| `mat-button` | Low-priority actions, inline text links |
| `mat-raised-button` | Primary actions on forms and dialogs |
| `mat-flat-button` | Primary CTA inside colored sections |
| `mat-stroked-button` | Secondary actions alongside a primary |
| `mat-icon-button` | Toolbar icons, compact actions |
| `mat-fab` | The one main action on a page (e.g., "Create") |

### 4.2 Form Fields & Inputs

The `<mat-form-field>` component is a wrapper that gives your standard `<input>` elements Material Design superpowers: a floating label, underline or outline border, prefix/suffix icons, hint text, and error messages.

```html
<!-- 
  appearance="outline" gives a full rectangular border.
  The other option is appearance="fill" (filled background style).
-->
<mat-form-field appearance="outline">
  
  <!-- The label floats above the field when the user starts typing -->
  <mat-label>Email Address</mat-label>
  
  <!-- 
    matInput is a directive that connects the native input to the form field.
    Without it, the form field won't work correctly.
  -->
  <input matInput type="email" placeholder="name@example.com" required>
  
  <!-- Icon at the end of the field (suffix) -->
  <mat-icon matSuffix>email</mat-icon>
  
  <!-- Hint text shown below the field in normal state -->
  <mat-hint>We'll never share your email.</mat-hint>
  
  <!-- Error message — only shown when the field is invalid AND touched -->
  <mat-error>Please enter a valid email address.</mat-error>
  
</mat-form-field>
```

**ASCII diagram of a mat-form-field:**
```
┌─────────────────────────────────────────────┐
│  Email Address ↑ (floating label)            │
│                                              │
│  name@example.com                  [✉ icon] │
└─────────────────────────────────────────────┘
  We'll never share your email.
```

### 4.3 Cards

`<mat-card>` is a surface component — a contained, elevated piece of UI that groups related content.

```html
<!-- 
  A product card demonstrating the full structure of mat-card.
  Cards are great for displaying items in a grid or list.
-->
<mat-card appearance="outlined">

  <!-- Optional: image header area -->
  <mat-card-header>
    <mat-card-title>MacBook Pro 16"</mat-card-title>
    <mat-card-subtitle>Apple — Laptops</mat-card-subtitle>
  </mat-card-header>

  <!-- An image associated with the card -->
  <img mat-card-image src="/assets/macbook.jpg" alt="MacBook Pro">

  <!-- The main body content of the card -->
  <mat-card-content>
    <p>
      The MacBook Pro 16" features the M3 Pro chip for incredible
      performance, a stunning Liquid Retina XDR display, and up to 
      22 hours of battery life.
    </p>
    <p><strong>Price:</strong> $2,499.00</p>
  </mat-card-content>

  <!-- Action buttons at the bottom of the card -->
  <mat-card-actions align="end">
    <button mat-button>VIEW DETAILS</button>
    <button mat-raised-button color="primary">ADD TO CART</button>
  </mat-card-actions>

</mat-card>
```

### Common Mistakes & How to Avoid Them

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Forgetting `matInput` on `<input>` | The field renders incorrectly, label doesn't float | Always add `matInput` to `<input>` inside `<mat-form-field>` |
| Nesting a `<button>` inside another `<button>` | Invalid HTML, accessibility errors | Use `mat-icon-button` as a sibling, not a child |
| Not importing `MatIconModule` | `<mat-icon>` shows text names, not icons | Add `MatIconModule` to your component imports |
| Forgetting to include icon font | Icons don't render | Ensure the Material Icons font is in `index.html` |

### Section Recap
- `mat-button`, `mat-raised-button`, etc. are **directives** on native `<button>` elements
- `<mat-form-field>` wraps native inputs with the `matInput` directive
- `<mat-card>` groups related content into a surface with optional header, image, content, and actions

---

## 5. Navigation Components

### 5.1 MatToolbar

`MatToolbar` creates a header bar (like an app bar or navbar). It's the standard way to display your app title and top-level actions.

```html
<!-- 
  color="primary" fills the toolbar with your primary theme color.
  Other options: color="accent", color="warn", or no color (transparent).
-->
<mat-toolbar color="primary">
  
  <!-- Hamburger menu button to toggle the sidenav -->
  <button mat-icon-button aria-label="Open navigation menu" (click)="sidenav.toggle()">
    <mat-icon>menu</mat-icon>
  </button>

  <!-- App title -->
  <span>ShopAngular</span>

  <!-- 
    flex: 1 (spacer) pushes the remaining items to the right.
    This is the standard pattern for right-aligning toolbar actions.
  -->
  <span class="toolbar-spacer" style="flex: 1;"></span>

  <!-- Cart button on the right -->
  <button mat-icon-button aria-label="Shopping cart">
    <mat-icon>shopping_cart</mat-icon>
  </button>

</mat-toolbar>
```

### 5.2 MatSidenav

`MatSidenav` creates a sliding panel (drawer) — standard in mobile-first responsive layouts. When collapsed, it hides off-screen; a button toggles it open.

```html
<!-- 
  The MatSidenav layout consists of three parts:
  1. <mat-sidenav-container>  — wraps everything
  2. <mat-sidenav>            — the sliding drawer
  3. <mat-sidenav-content>    — the main page content
-->
<mat-sidenav-container class="sidenav-container">

  <!-- 
    mode="over"  — drawer slides over the content (mobile style)
    mode="side"  — drawer sits beside the content (desktop style)
    mode="push"  — content pushes to the side when drawer opens
    
    #sidenav creates a template reference we can use to call .toggle()
  -->
  <mat-sidenav #sidenav mode="over" [fixedInViewport]="true">

    <!-- Navigation list inside the drawer -->
    <mat-nav-list>
      <!-- Each item is a link that closes the nav after clicking -->
      <a mat-list-item routerLink="/home" (click)="sidenav.close()">
        <mat-icon matListItemIcon>home</mat-icon>
        <span matListItemTitle>Home</span>
      </a>
      <a mat-list-item routerLink="/products" (click)="sidenav.close()">
        <mat-icon matListItemIcon>inventory_2</mat-icon>
        <span matListItemTitle>Products</span>
      </a>
      <a mat-list-item routerLink="/cart" (click)="sidenav.close()">
        <mat-icon matListItemIcon>shopping_cart</mat-icon>
        <span matListItemTitle>Cart</span>
      </a>
    </mat-nav-list>

  </mat-sidenav>

  <!-- The main content area (everything except the drawer) -->
  <mat-sidenav-content>

    <!-- The toolbar lives inside the content area -->
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>ShopAngular</span>
    </mat-toolbar>

    <!-- The router outlet renders the current page's component -->
    <main class="main-content">
      <router-outlet />
    </main>

  </mat-sidenav-content>

</mat-sidenav-container>
```

**ASCII layout diagram:**
```
┌──────────────────────────────────────────────────────────┐
│ [≡] ShopAngular                            [🛒]          │  ← MatToolbar
├──────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────────────────────────────────┐  │
│ │ [🏠] Home │  │                                      │  │
│ │ [📦] Prod │  │        <router-outlet />             │  │
│ │ [🛒] Cart │  │        (current page renders here)   │  │
│ │           │  │                                      │  │
│ └──────────┘  └──────────────────────────────────────┘  │
│  MatSidenav             MatSidenav-Content               │
└──────────────────────────────────────────────────────────┘
```

### Section Recap
- `MatToolbar` creates a top navigation bar; use `color="primary"` for brand color
- `MatSidenav` creates a responsive sliding drawer with three modes: `over`, `side`, `push`
- Use a `#templateRef` on `<mat-sidenav>` to call `.toggle()`, `.open()`, `.close()` from the toolbar button

---

## 6. Data Tables — MatTable

### Why Does This Matter?

`MatTable` is one of the most powerful — and most confusing — components in Angular Material. It looks overwhelming at first because it separates **what columns to show** from **how to render rows**. Once you understand the pattern, it becomes very elegant. You'll use data tables in virtually every business application you build.

### The Real-World Analogy

Think of building a spreadsheet. You first define the **column headers** (ID, Name, Email), then you define **where the data rows come from**, and finally you specify **what the header row and data rows look like**. MatTable works the same way, just in Angular's template syntax.

### Step-by-Step Breakdown

MatTable has exactly **three things** you must configure:

1. **The Data Source** — where does the data come from?
2. **Column Definitions** — what does each column look like?
3. **Row Definitions** — how do I render the header and data rows?

#### Step 1: Define the Data Source (TypeScript)

```typescript
// users-table.component.ts
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table'; // Smart data source

// Define the shape of each row's data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent {

  // The columns to display, in order.
  // These MUST match the matColumnDef values in the template.
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];

  // MatTableDataSource wraps an array and adds built-in
  // filtering, sorting, and pagination support.
  dataSource = new MatTableDataSource<User>([
    { id: 1, name: 'Alice Johnson',  email: 'alice@example.com',  role: 'Admin' },
    { id: 2, name: 'Bob Smith',      email: 'bob@example.com',    role: 'User' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com',  role: 'User' },
    { id: 4, name: 'David Brown',    email: 'david@example.com',  role: 'Manager' },
  ]);
}
```

#### Step 2: Define Columns and Rows (Template)

```html
<!-- users-table.component.html -->

<!--
  [dataSource]="dataSource" — binds our MatTableDataSource to the table.
  class="mat-elevation-z4" — gives the table a Material Design shadow.
-->
<table mat-table [dataSource]="dataSource" class="mat-elevation-z4">

  <!-- 
    ══════════════════════════════════════════════════════════
    COLUMN DEFINITIONS
    Each <ng-container> defines ONE column.
    matColumnDef="id" MUST match the string in displayedColumns.
    ══════════════════════════════════════════════════════════
  -->

  <!-- ── ID Column ── -->
  <ng-container matColumnDef="id">
    <!-- mat-header-cell: the header cell for this column -->
    <th mat-header-cell *matHeaderCellDef> # </th>
    <!-- 
      mat-cell: one data cell per row.
      "let user" binds the current row's data object to the variable "user".
    -->
    <td mat-cell *matCellDef="let user"> {{ user.id }} </td>
  </ng-container>

  <!-- ── Name Column ── -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef> Full Name </th>
    <td mat-cell *matCellDef="let user"> {{ user.name }} </td>
  </ng-container>

  <!-- ── Email Column ── -->
  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef> Email </th>
    <td mat-cell *matCellDef="let user"> {{ user.email }} </td>
  </ng-container>

  <!-- ── Role Column ── -->
  <ng-container matColumnDef="role">
    <th mat-header-cell *matHeaderCellDef> Role </th>
    <!-- 
      You can put any HTML inside the cell, not just text.
      Here we show a colored badge depending on the role.
    -->
    <td mat-cell *matCellDef="let user">
      <span [class]="'role-badge role-' + user.role.toLowerCase()">
        {{ user.role }}
      </span>
    </td>
  </ng-container>

  <!-- 
    ══════════════════════════════════════════════════════════
    ROW DEFINITIONS
    Tell the table how to render the header and data rows.
    ══════════════════════════════════════════════════════════
  -->

  <!-- The header row: shows the column headers -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>

  <!-- 
    The data rows: one row per item in the dataSource.
    "let row" gives access to the row data if needed.
  -->
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

</table>
```

### Adding Sorting and Filtering

MatTable's `MatTableDataSource` has built-in support for sorting and filtering. You just need to wire up the additional components.

```typescript
// users-table.component.ts — extended version
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,       // For sortable column headers
    MatPaginatorModule,  // For page navigation
    MatFormFieldModule,  // For the filter input
    MatInputModule,
  ],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent implements AfterViewInit {
  displayedColumns = ['id', 'name', 'email', 'role'];
  dataSource = new MatTableDataSource<User>(MOCK_USERS);

  // @ViewChild lets us get a reference to child components in the template
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Connect sort and paginator AFTER the view is initialized
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;           // Enable sort
    this.dataSource.paginator = this.paginator; // Enable pagination
  }

  // Called when user types in the filter input
  applyFilter(event: Event): void {
    // Get the input value from the DOM event
    const filterValue = (event.target as HTMLInputElement).value;
    // MatTableDataSource does the filtering automatically
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
```

```html
<!-- Template with sort, filter, and pagination -->

<!-- Filter input above the table -->
<mat-form-field appearance="outline" class="filter-field">
  <mat-label>Search users...</mat-label>
  <input matInput (keyup)="applyFilter($event)" placeholder="Type to filter">
  <mat-icon matSuffix>search</mat-icon>
</mat-form-field>

<!-- 
  matSort on the <table> enables sortable columns.
-->
<table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z4">

  <!-- ID Column — add mat-sort-header to make it sortable -->
  <ng-container matColumnDef="id">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> # </th>
    <td mat-cell *matCellDef="let user"> {{ user.id }} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Full Name </th>
    <td mat-cell *matCellDef="let user"> {{ user.name }} </td>
  </ng-container>

  <!-- Email Column -->
  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Email </th>
    <td mat-cell *matCellDef="let user"> {{ user.email }} </td>
  </ng-container>

  <!-- Role Column -->
  <ng-container matColumnDef="role">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Role </th>
    <td mat-cell *matCellDef="let user"> {{ user.role }} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

</table>

<!-- 
  Paginator below the table.
  pageSizeOptions lets the user choose how many rows to see per page.
-->
<mat-paginator
  [pageSizeOptions]="[5, 10, 25, 100]"
  showFirstLastButtons
  aria-label="Select page of users">
</mat-paginator>
```

### Common Mistakes with MatTable

| Mistake | Symptom | Fix |
|---------|---------|-----|
| `matColumnDef` doesn't match `displayedColumns` | Empty table or console error | Ensure every string in `displayedColumns` has a matching `matColumnDef` |
| Missing `MatSortModule` import | Sort arrows don't appear | Add `MatSortModule` to component imports |
| Not calling `ngAfterViewInit` | Sort/paginator don't work | Connect sort and paginator in `ngAfterViewInit`, not `ngOnInit` |
| Missing `mat-sort-header` on `<th>` | Specific column not sortable | Add `mat-sort-header` directive to each `<th>` you want to sort |

### Section Recap
- MatTable requires three parts: **data source**, **column definitions** (`ng-container`), **row definitions** (`<tr>`)
- `MatTableDataSource` enables built-in filtering, sorting, and pagination
- Wire up `MatSort` and `MatPaginator` in `ngAfterViewInit` using `@ViewChild`
- Every `matColumnDef` string MUST match a string in `displayedColumns`

---

## 7. Feedback Components: Dialogs & SnackBars

### Why These Matter

Unlike most UI components that live in your template, Material's feedback components (`MatDialog`, `MatSnackBar`) are **imperatively launched from TypeScript**. This is intentional — they appear in response to user actions (form submissions, deletions, errors) and need to be triggered programmatically.

### 7.1 MatSnackBar (Toast Notifications)

SnackBars are brief messages that appear at the bottom of the screen to inform users of an operation's outcome. They auto-dismiss after a set duration.

```typescript
// product-form.component.ts
import { Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [MatSnackBarModule],
  template: `
    <button mat-raised-button color="primary" (click)="saveProduct()">
      Save Product
    </button>
  `,
})
export class ProductFormComponent {
  // inject() is the modern, constructor-free way to request services
  private snackBar = inject(MatSnackBar);

  saveProduct(): void {
    // Simulate saving...

    // open(message, actionLabel, config)
    this.snackBar.open(
      '✅ Product saved successfully!',  // The message to display
      'Dismiss',                          // The action button label (can be '')
      {
        duration: 3000,          // Auto-close after 3 seconds (3000ms)
        horizontalPosition: 'end',  // 'start' | 'center' | 'end'
        verticalPosition: 'bottom', // 'top' | 'bottom'
        panelClass: ['success-snackbar'], // Custom CSS class for styling
      }
    );
  }

  handleError(): void {
    this.snackBar.open('❌ Failed to save. Please try again.', 'Retry', {
      duration: 5000,
    });
  }
}
```

### 7.2 MatDialog (Modal Windows)

Dialogs are overlays that appear on top of the main content, requiring user interaction before proceeding. Common use cases: confirmation prompts, complex forms, image previews.

**Step 1 — Create a dialog component:**

```typescript
// confirm-dialog.component.ts
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Interface for the data we'll pass into the dialog
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <!-- mat-dialog-title styles the heading -->
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <!-- mat-dialog-content scrollable body area -->
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <!-- mat-dialog-actions is pinned to the bottom -->
    <mat-dialog-actions align="end">
      <!-- 
        mat-dialog-close closes the dialog.
        The value inside [mat-dialog-close] is returned to the opener.
      -->
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        {{ data.confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  // MatDialogRef lets us close the dialog programmatically
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  // MAT_DIALOG_DATA contains the data passed when opening the dialog
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
```

**Step 2 — Open the dialog from another component:**

```typescript
// product-list.component.ts
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <button mat-raised-button color="warn" (click)="deleteProduct(42)">
      Delete Product
    </button>
  `,
})
export class ProductListComponent {
  private dialog = inject(MatDialog);

  deleteProduct(productId: number): void {
    // Open the dialog and pass data into it
    const dialogRef = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: {
          title: 'Delete Product',
          message: 'This action cannot be undone. Are you sure?',
          confirmLabel: 'DELETE',
        },
        width: '400px', // Dialog width
      }
    );

    // afterClosed() emits the value passed to [mat-dialog-close]
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // User clicked DELETE — proceed with deletion
        console.log(`Deleting product ${productId}`);
      }
      // If false or undefined, user cancelled — do nothing
    });
  }
}
```

### Section Recap
- `MatSnackBar.open()` shows a brief notification — inject the service and call it from TypeScript
- `MatDialog.open()` shows a modal overlay — create a separate dialog component and pass data via `MAT_DIALOG_DATA`
- Dialog results are returned via `dialogRef.afterClosed()` observable
- Both are triggered from TypeScript, not from HTML templates

---

## 8. Angular CDK — Behaviour Without Style

### What is the CDK?

The Angular **Component Dev Kit (CDK)** is the layer underneath Angular Material. It provides **unstyled interaction primitives** — the JavaScript behaviour without any CSS styling. You can use the CDK with **any** CSS framework (Tailwind, Bootstrap, custom CSS) or even without one.

Think of it this way:
- **Material components** = CDK behaviour + Material Design styling
- **CDK alone** = behaviour only, you bring your own styles

### Key CDK Packages

| Package | What It Does | Example Use Case |
|---------|-------------|-----------------|
| `@angular/cdk/drag-drop` | Drag-and-drop sortable lists | Kanban boards, reorderable lists |
| `@angular/cdk/scrolling` | Virtual scrolling | Rendering 10,000 items efficiently |
| `@angular/cdk/overlay` | Positioned overlays | Custom tooltips, dropdowns, popovers |
| `@angular/cdk/a11y` | Focus traps, live regions | Accessible modals and custom components |
| `@angular/cdk/clipboard` | Copy to clipboard | "Copy link" buttons |
| `@angular/cdk/layout` | Responsive breakpoint detection | Show/hide elements at different screen sizes |

### Quick CDK Example: Drag & Drop

```typescript
// task-board.component.ts
import { Component } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <!-- cdkDropList makes this an area where items can be dropped -->
    <ul cdkDropList (cdkDropListDropped)="onDrop($event)">
      <!-- cdkDrag makes each item draggable -->
      @for (task of tasks; track task) {
        <li cdkDrag class="task-item">{{ task }}</li>
      }
    </ul>
  `,
  styles: [`.task-item { cursor: move; padding: 12px; margin: 8px 0; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }`]
})
export class TaskBoardComponent {
  tasks = ['Design mockup', 'Build API', 'Write tests', 'Deploy to staging'];

  // Called when a drag-and-drop operation completes
  onDrop(event: CdkDragDrop<string[]>): void {
    // moveItemInArray reorders the array in place
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
```

### Section Recap
- The CDK provides the **behaviour** (JavaScript logic) without any styling
- You can use CDK packages independently — no need for full Angular Material
- CDK powers drag-and-drop, virtual scrolling, overlays, focus management, and more

---

## 9. Alternative Component Libraries

Angular Material is excellent, but it's not the only option. Here are the most popular alternatives:

| Library | Design System | Best For | Components |
|---------|--------------|----------|------------|
| **Angular Material** | Google Material Design 3 | Official Angular apps, Material Design consistency | ~50 components |
| **PrimeNG** | Custom (very flexible) | Data-heavy enterprise apps, maximum variety | 90+ components |
| **NG-ZORRO** | Ant Design (Alibaba) | Enterprise UIs, professional business apps | 60+ components |
| **Spartan (shadcn-like)** | Tailwind CSS-based | Custom designs, headless components | Growing |

> [!WARNING]
> Pick **one** component library and commit to it. Mixing libraries causes:
> - **Visual inconsistency** — different design languages clash
> - **Bundle size bloat** — each library adds kilobytes to your app
> - **CSS conflicts** — global styles from one library can break another

### How to Choose

```
Do you need Material Design aesthetics? (Google-style)
    YES → Angular Material
    
Do you need maximum number of components (advanced data grids, charts, etc.)?
    YES → PrimeNG
    
Do you need Ant Design (popular in enterprise China/international apps)?
    YES → NG-ZORRO
    
Do you need full custom styling with utility CSS?
    YES → Consider headless options with Tailwind
```

---

## 🧪 Practice Labs

### Lab 1 — Custom Theme Setup (30 min)
1. Run `ng add @angular/material` in your Angular project.
2. Choose a pre-built theme or select "Custom" and configure a palette in `styles.scss`.
3. Import `MatButtonModule` and `MatCardModule` into your `AppComponent`.
4. Add one of each button variant to the template and observe how the theme colors apply.
5. Try changing `color="primary"` to `color="accent"` and `color="warn"`.

### Lab 2 — Data Table with Sort, Filter & Paginator (60 min)
1. Generate a component: `ng g c features/user-table`.
2. In the component class, create a `MatTableDataSource` with at least 15 mock user objects.
3. Build the full `mat-table` HTML with 4 columns (id, name, email, role).
4. Add a filter text input above the table connected to `applyFilter()`.
5. Add `matSort` and `MatSort` wired in `ngAfterViewInit`.
6. Add `<mat-paginator>` below the table with page sizes of 5, 10, 25.

---

## 📝 Assignment: ShopAngular Project — Part 8

Migrate the ShopAngular UI to use Angular Material throughout.

### Requirements

**Step 1 — Setup**
1. Run `ng add @angular/material` and choose a theme that suits a shopping app.

**Step 2 — Navigation**
2. In `AppComponent`, replace your custom navbar with:
   - A `<mat-sidenav-container>` wrapping the whole layout
   - A `<mat-sidenav>` with `<mat-nav-list>` links for Home, Products, Cart
   - A `<mat-toolbar color="primary">` with a menu icon button, app title, and cart icon button
   - Wire the menu button to `sidenav.toggle()`

**Step 3 — Product Cards**
3. In `ProductCardComponent`:
   - Wrap the product in a `<mat-card appearance="outlined">`
   - Use `<mat-card-header>`, `<mat-card-content>`, `<mat-card-actions>`
   - Replace the Add to Cart button with `<button mat-raised-button color="primary">`

**Step 4 — Checkout Form**
4. In `CheckoutComponent`, wrap each form field with:
   ```html
   <mat-form-field appearance="outline">
     <mat-label>Field Name</mat-label>
     <input matInput formControlName="fieldName">
   </mat-form-field>
   ```

**Step 5 — Snack Bar**
5. After successful checkout, display:
   ```typescript
   this.snackBar.open('🎉 Order placed! Thank you for shopping with us.', 'Close', { duration: 4000 });
   ```

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Material Components | https://material.angular.io/components/categories |
| MatTable Guide | https://material.angular.io/components/table/overview |
| MatDialog Guide | https://material.angular.io/components/dialog/overview |
| Material Design 3 System | https://m3.material.io/ |
| Angular CDK | https://material.angular.io/cdk/categories |

---

## 📌 Key Takeaways

- **Angular Material** is the official, accessible, Google-maintained component library for Angular
- Install with `ng add @angular/material` — the schematic configures everything automatically
- In standalone Angular, each component must import the specific Material modules it uses
- **MatTable** requires three parts: data source (TypeScript), column definitions (`ng-container`), and row definitions (`<tr>`)
- `MatTableDataSource` provides built-in filtering, sorting, and pagination — wire them up in `ngAfterViewInit`
- **MatSnackBar** and **MatDialog** are launched from TypeScript, not from HTML templates
- The **Angular CDK** provides unstyled behaviour primitives you can use with any CSS framework
- Pick **one** component library and stick with it — mixing causes visual inconsistency and bundle bloat

---

**Next Lecture:** [Lecture 31 — State Management with RxJS & Signals](./31%20-%20State%20Management%20with%20RxJS%20%26%20Services.md)