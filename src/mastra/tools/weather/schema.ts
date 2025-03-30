import { z } from "zod";

export const WeatherToolInputSchema = z.object({
  location: z.string().describe("City name"),
});

export const WeatherToolOutputSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  conditions: z.string(),
  location: z.string(),
});

export type WeatherToolInput = z.infer<typeof WeatherToolInputSchema>;
export type WeatherToolOutput = z.infer<typeof WeatherToolOutputSchema>;
