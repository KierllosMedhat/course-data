import { Component } from '@angular/core';
// TODO: Import NavbarComponent and FooterComponent here
// import { NavbarComponent } from './lab2-navbar.component';
// import { FooterComponent } from './lab2-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // TODO: Add NavbarComponent and FooterComponent to the imports array
  imports: [],
  template: `
    <!-- TODO: Use the app-navbar component tag here -->
    
    <main style="padding: 20px;">
      <h1>Welcome to my Angular App!</h1>
      <p>This is the main content area.</p>
    </main>

    <!-- TODO: Use the app-footer component tag here -->
  `,
  styles: []
})
export class AppComponent {
  title = 'lab2-nested-components';
}
