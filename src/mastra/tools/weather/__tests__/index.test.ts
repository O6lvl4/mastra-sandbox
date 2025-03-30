import { WeatherToolAction } from "../action";

test("WeatherToolAction fetches weather correctly", async () => {
  const mockGeoService = {
    getCoordinates: jest
      .fn()
      .mockResolvedValue({ latitude: 35, longitude: 139, name: "Tokyo" }),
  };

  const mockWeatherService = {
    getCurrentWeather: jest.fn().mockResolvedValue({
      temperature: 20,
      feelsLike: 18,
      humidity: 50,
      windSpeed: 5,
      windGust: 7,
      conditions: "Clear sky",
      location: "Tokyo",
    }),
  };

  const toolAction = new WeatherToolAction({
    geocodingService: mockGeoService,
    weatherService: mockWeatherService,
  });

  const result = await toolAction.execute({ location: "Tokyo" });

  expect(result.temperature).toBe(20);
  expect(mockGeoService.getCoordinates).toHaveBeenCalledWith("Tokyo");
  expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(
    35,
    139,
    "Tokyo"
  );
});
