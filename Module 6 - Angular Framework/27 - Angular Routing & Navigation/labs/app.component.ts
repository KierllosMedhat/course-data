import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// TODO: Import routing directives (RouterOutlet, RouterLink, RouterLinkActive) from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <!-- TODO: Implement navigation links using routerLink and routerLinkActive -->
        <!-- Links: Home (/home), About (/about), Products (/products), Dashboard (/dashboard), Checkout (/checkout) -->
      </nav>
      
      <hr>

      <!-- TODO: Implement the router-outlet to load the active routes -->
    </div>
  `,
  styles: [`
    .navbar { display: flex; gap: 15px; padding: 10px; background-color: #f8f9fa; }
    .active { font-weight: bold; color: blue; }
  `]
})
export class AppComponent {
  title = 'angular-routing-lab';
}
