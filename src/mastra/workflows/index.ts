import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { OpenMeteoGeocodingService } from "../../services/geocoding/OpenMeteoGeocodingService";
import { OpenMeteoWeatherService } from "../../services/weather/OpenMeteoWeatherService";

const llm = google("gemini-1.5-pro-latest");

const agent = new Agent({
  name: "Weather Planner Agent",
  model: llm,
  instructions: `
    You are a local activities and travel expert who excels at weather-based planning.
    Analyze weather data and provide structured daily recommendations for both outdoor and indoor activities.

    Structure the response consistently using clear section headers and relevant emojis.
    Include weather conditions, temperature ranges, precipitation probability, and special considerations.

    Prioritize indoor activities if precipitation exceeds 50%.
  `,
});

const geocodingService = new OpenMeteoGeocodingService();
const weatherService = new OpenMeteoWeatherService();

const fetchWeather = new Step({
  id: "fetch-weather",
  description: "Fetches weather forecast for a given city",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  execute: async ({ context }) => {
    const triggerData = context?.getStepResult<{ city: string }>("trigger");

    if (!triggerData) {
      throw new Error("Trigger data not found");
    }

    const { latitude, longitude, name } = await geocodingService.getCoordinates(
      triggerData.city
    );
    const forecast = await weatherService.getCurrentWeather(
      latitude,
      longitude,
      name
    );

    return forecast;
  },
});

const forecastSchema = z.array(
  z.object({
    date: z.string(),
    maxTemp: z.number(),
    minTemp: z.number(),
    precipitationChance: z.number(),
    condition: z.string(),
    location: z.string(),
  })
);

const planActivities = new Step({
  id: "plan-activities",
  description: "Suggests activities based on weather conditions",
  inputSchema: forecastSchema,
  execute: async ({ context }) => {
    const forecast =
      context?.getStepResult<z.infer<typeof forecastSchema>>("fetch-weather");

    if (!forecast || forecast.length === 0) {
      throw new Error("Forecast data not found");
    }

    const prompt = `Based on the following weather forecast for ${forecast[0]?.location}, suggest appropriate activities:\n${JSON.stringify(forecast, null, 2)}`;

    const response = await agent.stream([{ role: "user", content: prompt }]);

    let activitiesText = "";
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      activitiesText += chunk;
    }

    return { activities: activitiesText };
  },
});

const weatherWorkflow = new Workflow({
  name: "weather-workflow",
  triggerSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
})
  .step(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
