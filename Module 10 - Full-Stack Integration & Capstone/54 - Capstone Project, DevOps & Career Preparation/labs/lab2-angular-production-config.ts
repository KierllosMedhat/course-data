import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO: Enable zoneless change detection in this Angular application.
    // 1. Remove standard zone.js provisioning (if any) from providers.
    // 2. Call provideExperimentalZonelessChangeDetection() to enable native Signal-based updates.
    provideExperimentalZonelessChangeDetection(),
    
    provideRouter(routes)
  ]
};

/*
  TODO Instructions for Deferrable Views in templates:
  Open your main/heavy component HTML file and wrap components like large lists,
  charts, or heavy maps inside a @defer block.
  
  Example syntax:
  @defer (on viewport) {
    <app-heavy-chart [data]="salesData" />
  } @placeholder {
    <div class="spinner-border">Loading chart components...</div>
  }
*/
