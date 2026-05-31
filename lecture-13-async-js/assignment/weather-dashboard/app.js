// ASSIGNMENT — Weather Dashboard (Async/Await & Fetch)
// Note: You can use a free API like OpenWeatherMap or a placeholder API 
// like JSONPlaceholder for testing if you don't have an API key.
// Let's use OpenMeteo which requires no API key: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const resultDiv = document.getElementById("weather-result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  // TODO: Show a loading state in resultDiv
  // resultDiv.innerHTML = "Loading...";

  try {
    // 1. Geocoding API: Convert city name to latitude/longitude
    // URL: `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    
    // TODO: fetch geocoding data, check response.ok, parse to JSON
    // const geoRes = await fetch(...);
    // const geoData = await geoRes.json();
    
    // TODO: Extract latitude, longitude, and actual city name from geoData.results[0]
    // Handle the case where the city is not found

    // 2. Weather API: Get current weather using the coordinates
    // URL: `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`

    // TODO: fetch weather data
    // const weatherRes = await fetch(...);
    // const weatherData = await weatherRes.json();

    // 3. Display the results
    // TODO: update resultDiv.innerHTML with the city name, temperature, and wind speed

  } catch (error) {
    // TODO: Handle any network errors or thrown errors
    // resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
});
