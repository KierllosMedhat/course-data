import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div>
      <!-- TODO: Display the title property using string interpolation {{ }} -->
      <h1><!-- Your code here --></h1>
      <p>Welcome to Lab 1 - Angular Basics!</p>
    </div>
  `,
  styles: [`
    h1 {
      color: #3f51b5;
    }
  `]
})
export class AppComponent {
  // TODO: Modify this title property as described in Lab 1
  title = 'My First Angular App';
}
