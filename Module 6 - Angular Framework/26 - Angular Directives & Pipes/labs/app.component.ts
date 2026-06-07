import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './highlight.directive';
import { TruncatePipe } from './truncate.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HighlightDirective, TruncatePipe],
  template: `
    <div style="padding: 20px;">
      <h1>Directives & Pipes Lab</h1>
      
      <!-- TODO: Test the appHighlight directive on this div -->
      <div 
        style="width: 200px; height: 100px; border: 1px solid black; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        Hover me!
      </div>

      <!-- TODO: Test the truncate pipe on this long text -->
      <p>{{ longText }}</p>
    </div>
  `
})
export class AppComponent {
  longText = 'Angular is an open-source, TypeScript-based front-end web framework led by the Angular Team at Google and by a community of individuals and corporations.';
}
