import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Interfaces for API responses
interface LocationResponse {
  lat: number;
  lon: number;
  name: string;
}

interface WeatherEntry {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { icon: string; description: string }[];
  wind: { speed: number };
}

interface WeatherApiResponse {
  city: { name: string };
  list: WeatherEntry[];
}

interface Coordinates {
  lat: number;
  lon: number;
}

// Exporting the Weather class for potential external use
export class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org';
  private apiKey: string = process.env.OPENWEATHER_API_KEY || '';

  // Fetches location data based on the city name
  private async fetchLocationData(query: string): Promise<LocationResponse[]> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid location data received');
    }

    return data as LocationResponse[];
  }

  // Extracts lat/lon from API response
  private destructureLocationData(locationData: LocationResponse[]): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  // Constructs a weather API query for the given coordinates
  private buildWeatherQuery({ lat, lon }: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;
  }

  // Fetch and extract coordinates from location data
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // Fetches weather data from OpenWeather API
  private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherApiResponse> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data: unknown = await response.json();

    if (
      !data ||
      typeof data !== 'object' ||
      !('list' in data) ||
      !('city' in data) ||
      !Array.isArray((data as WeatherApiResponse).list)
    ) {
      throw new Error('Invalid weather data received');
    }

    return data as WeatherApiResponse;
  }

  // Parses current weather from API response
  private parseCurrentWeather(response: WeatherApiResponse): Weather {
    const current = response.list[0];

    if (!current || !current.weather || !current.weather[0]) {
      throw new Error('Weather data is incomplete');
    }

    return new Weather(
      response.city.name,
      new Date(current.dt * 1000).toLocaleDateString(),
      current.weather[0].icon,
      current.weather[0].description,
      current.main.temp,
      current.wind.speed,
      current.main.humidity
    );
  }

  // Extracts 5-day forecast from API response
  private buildForecastArray(currentWeather: Weather, weatherData: WeatherEntry[]): Weather[] {
    if (!Array.isArray(weatherData) || weatherData.length === 0) {
      return [];
    }

    return weatherData
      .filter((_, index: number) => index % 8 === 0) // One entry per day
      .map(
        (entry: WeatherEntry) =>
          new Weather(
            currentWeather.city,
            new Date(entry.dt * 1000).toLocaleDateString(),
            entry.weather[0].icon,
            entry.weather[0].description,
            entry.main.temp,
            entry.wind.speed,
            entry.main.humidity
          )
      );
  }

  // Main method to get weather for a city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      return [currentWeather, ...this.buildForecastArray(currentWeather, weatherData.list)];
    } catch (error: any) {
      console.error('Error fetching weather:', error.message || error);
      throw new Error('Could not fetch weather data');
    }
  }
}

export default new WeatherService();