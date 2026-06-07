import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-box">
      <h3>Theme Settings</h3>
      <!-- TODO: Display current settings -->
      <p>Current Mode: {{ currentTheme()?.mode }}</p>
      <p>Primary Color: {{ currentTheme()?.primaryColor }}</p>

      <!-- TODO: Add click bindings to toggle dark/light mode and select colors -->
      <button (click)="toggleTheme()">Toggle Dark Mode</button>

      <div class="colors">
        <button (click)="changeColor('blue')">Blue</button>
        <button (click)="changeColor('red')">Red</button>
        <button (click)="changeColor('green')">Green</button>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private themeService = inject(ThemeService);

  // TODO: Convert themeService.state$ to a signal using toSignal()
  currentTheme = toSignal(this.themeService.state$);

  toggleTheme(): void {
    // TODO: Call toggleMode on themeService
  }

  changeColor(color: string): void {
    // TODO: Call setPrimaryColor on themeService
  }
}
