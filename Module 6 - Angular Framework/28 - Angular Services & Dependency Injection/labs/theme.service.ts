import { Injectable } from '@angular/core';
import { BaseStateStore } from './base-state-store';

export interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService extends BaseStateStore<ThemeState> {
  constructor() {
    // TODO: Call super() with initial state, e.g. { mode: 'light', primaryColor: 'blue' }
    super({ mode: 'light', primaryColor: 'blue' });
  }

  toggleMode(): void {
    const currentMode = this.getState().mode;
    const nextMode = currentMode === 'light' ? 'dark' : 'light';
    // TODO: Update state using this.setState()
  }

  setPrimaryColor(color: string): void {
    // TODO: Update primaryColor using this.setState()
  }
}
