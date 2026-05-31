import { Component } from '@angular/core';

// 1. Import specific Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-material-demo',
  standalone: true,
  // 2. Add them to the imports array
  imports: [
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <!-- TOOLBAR -->
    <mat-toolbar color="primary">
      <button mat-icon-button aria-label="Menu icon">
        <mat-icon>menu</mat-icon>
      </button>
      <span>My App</span>
      <span class="spacer"></span> <!-- CSS flex: 1 1 auto; -->
      <button mat-icon-button>
        <mat-icon>favorite</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>share</mat-icon>
      </button>
    </mat-toolbar>

    <div class="container" style="padding: 20px; max-width: 600px; margin: 0 auto;">
      
      <!-- CARDS & BUTTONS -->
      <mat-card>
        <mat-card-header>
          <div mat-card-avatar class="example-header-image" style="background-color: #ff4081; border-radius: 50%;"></div>
          <mat-card-title>Angular Material</mat-card-title>
          <mat-card-subtitle>UI Component Library</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content class="mt-3">
          <p>
            Material Design components for Angular web applications. 
            They are highly customizable and accessible out of the box.
          </p>
        </mat-card-content>
        
        <mat-card-actions>
          <!-- Different Button Types -->
          <button mat-button>FLAT</button>
          <button mat-raised-button color="primary">RAISED</button>
          <button mat-stroked-button color="accent">STROKED</button>
        </mat-card-actions>
      </mat-card>

      <!-- FORM FIELDS -->
      <mat-card style="margin-top: 20px;">
        <mat-card-content>
          <h3>Form Inputs</h3>
          <mat-form-field appearance="fill" style="width: 100%;">
            <mat-label>Email address</mat-label>
            <input matInput placeholder="Ex. pat@example.com">
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width: 100%; margin-top: 10px;">
            <mat-label>Password</mat-label>
            <input matInput type="password">
            <mat-icon matSuffix>visibility_off</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class MaterialDemoComponent {}
