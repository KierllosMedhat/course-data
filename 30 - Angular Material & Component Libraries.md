# Lecture 30 — Angular Material & Component Libraries

**Course:** Full-Stack Web Development  
**Instructor:** Kyrillos Medhat  
**Duration:** 3 hours (Theory + Lab)

---

## 🎯 Learning Objectives

By the end of this lecture, you will be able to:
- Install and theme Angular Material with `ng add @angular/material`
- Use core components: buttons, inputs, cards, tables, dialogs, snackbars
- Build responsive layouts with `MatSidenav` and `MatToolbar`
- Implement data tables with `MatTable`, `MatSort`, `MatPaginator`, and filtering
- Understand Angular CDK for unstyled behavior

---

## 📋 Agenda

### Part 1 — Theory (~90 min)
1. Angular Material: installation, theming
2. Core components: buttons, form fields, cards
3. Navigation: `MatSidenav`, `MatToolbar`
4. Data tables: `MatTable` (Syntax clarified)
5. Feedback: `MatDialog`, `MatSnackBar`
6. Angular CDK: Behaviour Without Style
7. Alternative Component Libraries

### Part 2 — Practice / Lab (~90–120 min)
1. Set up Material with a custom theme
2. Build a data table with sorting, pagination, filtering
3. ShopAngular Project Part 8: Material Design!

---

## 1. Angular Material — Installation & Setup

Angular Material is the official component library from the Angular team.

### Installation
```bash
ng add @angular/material
```
This command automatically updates your `package.json`, configures typography and animations, and lets you select a pre-built or custom theme.

### Importing Components
Since modern Angular is standalone, you must import the specific Material modules you need into your components.
```ts
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatButtonModule, MatCardModule],
  // ...
})
```

---

## 2. Core Components

### Buttons
```html
<button mat-button>Basic</button>
<button mat-raised-button color="primary">Raised</button>
<button mat-flat-button color="accent">Flat</button>
<button mat-icon-button><mat-icon>home</mat-icon></button>
```

### Form Fields & Inputs
Material wraps your standard `<input>` tags in `<mat-form-field>` to provide floating labels, icons, hints, and error messages.
```html
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput type="email" placeholder="name@example.com">
  <mat-icon matSuffix>email</mat-icon>
  <mat-hint>Enter your work email</mat-hint>
  <mat-error>Valid email required</mat-error>
</mat-form-field>
```

### Cards
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Product Title</mat-card-title>
    <mat-card-subtitle>$99.99</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>Product description goes here.</p>
  </mat-card-content>
  <mat-card-actions>
    <button mat-button>Add to Cart</button>
  </mat-card-actions>
</mat-card>
```

---

## 3. Navigation

Material provides Layout components to structure your app.
```html
<mat-sidenav-container>
  
  <mat-sidenav #sidenav mode="over">
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard">Dashboard</a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    <!-- Toolbar -->
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>My Application</span>
    </mat-toolbar>
    
    <!-- Main Content -->
    <router-outlet />
  </mat-sidenav-content>

</mat-sidenav-container>
```

---

## 4. Data Tables (`MatTable`)

`MatTable` syntax can look overwhelming at first. Let's break it down into 3 parts:

### 1. The Data Source
In your TypeScript, define the columns you want to show, and create a `MatTableDataSource`.
```ts
export class UsersTableComponent {
  displayedColumns = ['id', 'name', 'role'];
  dataSource = new MatTableDataSource(myUsersArray);
}
```

### 2. The Column Definitions
In HTML, you must define the `<ng-container>` for EVERY column in your `displayedColumns` array.
```html
<table mat-table [dataSource]="dataSource">

  <!-- ID Column -->
  <ng-container matColumnDef="id">
    <th mat-header-cell *matHeaderCellDef> ID </th>
    <td mat-cell *matCellDef="let user"> {{user.id}} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef> Name </th>
    <td mat-cell *matCellDef="let user"> {{user.name}} </td>
  </ng-container>

  <!-- Role Column -->
  <ng-container matColumnDef="role">
    <th mat-header-cell *matHeaderCellDef> Role </th>
    <td mat-cell *matCellDef="let user"> {{user.role}} </td>
  </ng-container>
```

### 3. The Row Definitions
Finally, tell the table how to render the header row and data rows.
```html
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

*(You can add Sorting and Pagination by adding `MatSort` and `MatPaginator` components!)*

---

## 5. Feedback: Dialogs & SnackBars

Material provides imperatively launched components (you trigger them from TypeScript, not HTML).

### SnackBar (Toast Notifications)
```ts
export class MyComponent {
  private snackBar = inject(MatSnackBar);

  save() {
    this.snackBar.open('Saved successfully!', 'Close', { duration: 3000 });
  }
}
```

---

## 6. Angular CDK — Behaviour Without Style

The Angular CDK (Component Dev Kit) provides unstyled interaction primitives. You can use these with **any** CSS framework, even if you don't use Angular Material!

- **Drag and Drop** (`@angular/cdk/drag-drop`)
- **Virtual Scrolling** (`@angular/cdk/scrolling`)
- **Accessibility** (`@angular/cdk/a11y`)
- **Clipboard** (`@angular/cdk/clipboard`)

---

## 7. Alternative Libraries

Angular Material is great, but there are other options depending on your needs:

| Library | Best for |
|---------|----------|
| **Angular Material** | Official Google support, Material Design |
| **PrimeNG** | Maximum component coverage (80+ components), Data-heavy apps |
| **NG-ZORRO** | Ant Design aesthetic, Enterprise UI |
| **Tailwind UI** | If you prefer utility CSS and building components yourself |

> [!TIP]
> Pick **one** component library and commit. Mixing libraries creates visual inconsistency and drastically increases bundle size.

---

## 🧪 Practice Labs

### Lab 1 — Custom Theme Setup (30 min)
1. Run `ng add @angular/material`.
2. Choose a custom theme. 
3. Import `MatButtonModule` and `MatCardModule` into your App Component and test them out!

### Lab 2 — Data Table (45 min)
1. Generate a component: `ng g c user-table`.
2. Create an array of mock users.
3. Build a `MatTable` displaying their ID, Name, and Email.
4. Try adding a `MatPaginator`!

---

## 📝 Assignment: ShopAngular Project — Part 8

Let's migrate our ShopAngular app to use Angular Material!

### Requirements
1. Run `ng add @angular/material` in your ShopAngular project.
2. In `AppComponent`, replace your custom Navbar with a `MatToolbar`. Add a "ShopAngular" title and a "Cart" button (`mat-icon-button` with a `shopping_cart` icon).
3. In `ProductCardComponent`, wrap the product details in a `<mat-card>`. Use `mat-raised-button color="primary"` for the Add to Cart button!
4. In `CheckoutComponent`, wrap your form inputs in `<mat-form-field appearance="outline">` and `<input matInput>`.
5. When the user successfully checks out, display a `MatSnackBar` thanking them for their order!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Angular Material Components | https://material.angular.io/components/categories |
| MatTable Guide | https://material.angular.io/components/table/overview |

---

## 📌 Key Takeaways
- **Angular Material** is the official, accessible, themeable component library for Angular.
- Install with `ng add @angular/material`.
- **MatTable** requires defining the Data Source, Columns, and Rows explicitly.
- **MatSnackBar** and **MatDialog** are triggered via TypeScript, not HTML.
- **Angular CDK** provides unstyled behaviour primitives that you can use anywhere.

---

**Next Lecture:** [Lecture 31 — State Management with RxJS & Signals](./31%20-%20State%20Management%20with%20RxJS%20%26%20Services.md)