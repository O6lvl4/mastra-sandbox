import { GeocodingService } from "../../../services/geocoding/GeocodingService";
import { WeatherService } from "../../../services/weather/WeatherService";
import { WeatherToolInput, WeatherToolOutput } from "./schema";

export interface WeatherToolActionDeps {
  geocodingService: GeocodingService;
  weatherService: WeatherService;
}

export class WeatherToolAction {
  private geocodingService: GeocodingService;
  private weatherService: WeatherService;

  constructor(deps: WeatherToolActionDeps) {
    this.geocodingService = deps.geocodingService;
    this.weatherService = deps.weatherService;
  }

  async execute(input: WeatherToolInput): Promise<WeatherToolOutput> {
    const { latitude, longitude, name } =
      await this.geocodingService.getCoordinates(input.location);
    return await this.weatherService.getCurrentWeather(
      latitude,
      longitude,
      name
    );
  }
}
