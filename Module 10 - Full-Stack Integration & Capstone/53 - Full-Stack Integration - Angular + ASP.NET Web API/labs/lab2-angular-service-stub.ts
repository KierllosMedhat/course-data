import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Create a strongly-typed model corresponding to the WeatherForecast C# class
export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // TODO: Inject HttpClient using the modern `inject()` pattern
  private http = inject(HttpClient);

  // TODO: Use a relative path `/api/weatherforecast` to let Webpack Proxy forward the request to the backend
  private apiUrl = '/api/weatherforecast';

  /**
   * Fetches weather forecast data from the backend.
   * Make sure it returns a typed Observable: Observable<WeatherForecast[]>
   */
  getForecasts(): Observable<WeatherForecast[]> {
    // TODO: Write code to call HttpClient.get with the correct generic type <WeatherForecast[]>
    return this.http.get<WeatherForecast[]>(this.apiUrl);
  }
}
