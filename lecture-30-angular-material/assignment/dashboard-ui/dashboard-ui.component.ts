import { Component } from '@angular/core';

// TODO: Import MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatCardModule
// Add them to the imports array.

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO: Wrap the whole layout in a <mat-sidenav-container> -->
    <div class="dashboard-container">
      
      <!-- TODO: Add a <mat-sidenav mode="side" opened> -->
      <!-- Inside, use <mat-nav-list> to create navigation links with icons -->
      <aside>
        <p>Navigation goes here (Dashboard, Profile, Settings)</p>
      </aside>

      <!-- TODO: Add <mat-sidenav-content> for the main area -->
      <main>
        <!-- TODO: Add a <mat-toolbar> at the top -->
        
        <div class="content">
          <!-- TODO: Add a CSS Grid of <mat-card> elements for dashboard stats -->
          <!-- E.g., Total Users, Revenue, Active Sessions -->
        </div>
      </main>

    </div>
  `,
  styles: [`
    /* TODO: Ensure the sidenav container takes full height (height: 100vh) */
    .dashboard-container { height: 100vh; }
  `]
})
export class DashboardUiComponent {}
