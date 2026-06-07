import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeavyChartComponent } from './heavy-chart.component';

@Component({
  selector: 'app-dashboard-parent',
  standalone: true,
  imports: [CommonModule, HeavyChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-parent.component.html',
  styles: [`
    .dashboard-view {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: sans-serif;
    }
    .spacer-block {
      height: 800px; /* Forces scroll down to see the chart */
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #ccc;
      margin: 20px 0;
      color: #888;
    }
    .skeleton-placeholder {
      height: 250px;
      background: #e2e8f0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4a5568;
      font-style: italic;
    }
    .spinner-loading {
      text-align: center;
      padding: 30px;
      font-weight: bold;
      color: #3f51b5;
    }
    .error-msg {
      color: red;
      padding: 20px;
      border: 1px solid red;
      background: #ffebeb;
    }
  `]
})
export class DashboardParentComponent {}
