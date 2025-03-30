import { createTool } from "@mastra/core";
import { OpenMeteoGeocodingService } from "../../../services/geocoding/OpenMeteoGeocodingService";
import { OpenMeteoWeatherService } from "../../../services/weather/OpenMeteoWeatherService";
import { WeatherToolAction } from "./action";
import { WeatherToolInputSchema, WeatherToolOutputSchema } from "./schema";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: WeatherToolInputSchema,
  outputSchema: WeatherToolOutputSchema,
  execute: async ({ context }) => {
    const geocodingService = new OpenMeteoGeocodingService();
    const weatherService = new OpenMeteoWeatherService();
    return await new WeatherToolAction({
      geocodingService,
      weatherService,
    }).execute(context);
  },
});
