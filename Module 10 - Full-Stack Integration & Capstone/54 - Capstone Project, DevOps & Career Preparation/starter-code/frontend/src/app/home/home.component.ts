import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <header class="hero">
        <h1>Welcome to the ShopApp Retail Center</h1>
        <p>Your one-stop digital shopping platform powered by Angular 21 & ASP.NET Core 10.</p>
      </header>

      <main class="content-area">
        <section class="quick-intro">
          <h2>Latest Catalog Highlights</h2>
          <p>Scroll down to see our seasonal sales trends analytics chart.</p>
        </section>

        <!-- TODO: Practice implementing deferrable views below -->
        <!-- 1. Wrap the heavy analytics element in a @defer block -->
        <!-- 2. Set trigger conditions, such as 'on viewport' or 'on interaction' -->
        <!-- 3. Provide a @placeholder and a @loading state -->
        
        <div class="defer-section">
          @defer (on viewport) {
            <!-- Heavy components like charts are lazily fetched only when scrolled into view -->
            <div class="heavy-chart-card">
              <h3>Seasonal Sales Activity Map</h3>
              <div class="chart-mock">
                [📊 Analytics Data Dynamic Visual Render]
              </div>
            </div>
          } @placeholder {
            <!-- Placeholder renders immediately, allocating space and loading minimal initial JS -->
            <div class="chart-skeleton">
              <p>Scroll down to load sales activity trends chart...</p>
            </div>
          } @loading (minimum 500ms) {
            <!-- Loading indicator displays while the chart component JavaScript chunks load asynchronously -->
            <div class="loading-indicator">
              <span class="spinner">Fetching analytics bundles...</span>
            </div>
          } @error {
            <!-- Fallback state if chunk download fails -->
            <div class="error-state">
              <p>Could not load the sales analytics view. Please check your internet connection.</p>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero {
      text-align: center;
      background: linear-gradient(135deg, #0078d4, #005a9e);
      color: white;
      padding: 40px 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .heavy-chart-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 50px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .chart-mock {
      height: 250px;
      background-color: #f3f2f1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #605e5c;
      font-weight: bold;
      border: 2px dashed #0078d4;
      border-radius: 4px;
    }
    .chart-skeleton {
      height: 250px;
      background-color: #eaeaea;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
      margin-top: 50px;
      border-radius: 8px;
    }
    .loading-indicator {
      text-align: center;
      padding: 40px;
    }
    .error-state {
      background-color: #fde7e9;
      color: #a80000;
      padding: 20px;
      border-radius: 8px;
    }
  `]
})
export class HomeComponent {
  // Signals can be used to manage UI toggle state cleanly
  showDetails = signal(false);
}
