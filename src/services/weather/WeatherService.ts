export interface WeatherResult {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windGust: number;
    conditions: string;
    location: string;
  }
  
  export interface WeatherService {
    getCurrentWeather(latitude: number, longitude: number, locationName?: string): Promise<WeatherResult>;
  }
  