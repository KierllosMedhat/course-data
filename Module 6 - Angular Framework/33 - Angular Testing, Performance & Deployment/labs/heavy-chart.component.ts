import { Component } from '@angular/core';

@Component({
  selector: 'app-heavy-chart',
  standalone: true,
  template: `
    <div class="chart-box">
      <h3>📈 Live Analytics Metrics</h3>
      <p>This is a heavy widget simulating charts, maps, or real-time graphs requiring significant assets.</p>
      <div class="bar-chart">
        <div class="bar" style="height: 120px;">60%</div>
        <div class="bar" style="height: 180px;">90%</div>
        <div class="bar" style="height: 80px;">40%</div>
        <div class="bar" style="height: 150px;">75%</div>
      </div>
    </div>
  `,
  styles: [`
    .chart-box {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      margin-top: 20px;
    }
    .bar-chart {
      display: flex;
      gap: 15px;
      align-items: flex-end;
      height: 200px;
      padding: 10px;
      border-bottom: 2px solid #333;
    }
    .bar {
      flex: 1;
      background-color: #3f51b5;
      color: white;
      text-align: center;
      padding-top: 5px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-size: 0.8em;
    }
  `]
})
export class HeavyChartComponent {}
