import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
// TODO: Import APP_LOGGER token and toSignal

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SettingsComponent],
  template: `
    <div [class]="themeClass()" [style.border-top]="'5px solid ' + primaryColor()" style="padding: 20px;">
      <h1>Services & DI Labs</h1>
      <button (click)="testLog()">Log Activity</button>
      
      <hr>
      <app-settings></app-settings>
    </div>
  `,
  styles: [`
    .light { background-color: #ffffff; color: #000000; }
    .dark { background-color: #333333; color: #ffffff; }
  `]
})
export class AppComponent {
  // TODO: Inject the APP_LOGGER token using inject(APP_LOGGER)
  // private logger = inject(APP_LOGGER);

  // TODO: Use the ThemeService state to computed values or signals
  // themeClass = ... (e.g. returns 'light' or 'dark')
  // primaryColor = ...
  themeClass = () => 'light';
  primaryColor = () => 'blue';

  testLog(): void {
    // TODO: Call log() on the injected logger
    // this.logger.log('Test log message from app component!');
  }
}
