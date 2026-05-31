// TESTING, PERFORMANCE & DEPLOYMENT — Lecture 32

// ==========================================
// 1. UNIT TESTING (Jasmine/Karma format)
// ==========================================
/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  // Setup runs before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent] // For standalone components
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  // A basic test
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Testing the DOM
  it('should render title in an h1 tag', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello World');
  });

  // Testing component methods
  it('should increment counter when clicked', () => {
    component.counter = 0;
    component.increment();
    expect(component.counter).toBe(1);
  });
});
*/

// ==========================================
// 2. PERFORMANCE OPTIMIZATION
// ==========================================

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// OnPush Change Detection
// Component only updates if its @Input() references change, or an event fires inside it.
@Component({
  selector: 'app-pure-list',
  standalone: true,
  template: `<ul>@for(item of items; track item.id) { <li>{{item.name}}</li> }</ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class PureListComponent {
  @Input() items: any[] = [];
}

// Lazy Loading Routes (see routing lecture)
// { path: 'feature', loadComponent: () => import('./feature.component').then(m => m.FeatureComponent) }

// Deferrable Views (Angular v17+)
// Allows lazy loading of component chunks declaratively in the template
@Component({
  selector: 'app-defer-demo',
  standalone: true,
  template: `
    <!-- The component is only loaded when the placeholder enters the viewport -->
    @defer (on viewport) {
      <app-heavy-chart></app-heavy-chart>
    } @placeholder {
      <div>Scroll down to load chart...</div>
    } @loading {
      <div>Loading chunk...</div>
    }
  `
})
export class DeferDemoComponent {}

// ==========================================
// 3. DEPLOYMENT COMMANDS
// ==========================================
/*
  // Build for production
  ng build
  
  // Test production build locally
  npx http-server dist/browser
  
  // Firebase Deployment Example
  npm install -g firebase-tools
  firebase login
  firebase init hosting
  firebase deploy
*/
