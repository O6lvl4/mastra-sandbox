import { GeocodingService, GeocodingResult } from './GeocodingService';

export class OpenMeteoGeocodingService implements GeocodingService {
  async getCoordinates(location: string): Promise<GeocodingResult> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to geocode location: ${location}`);

    const data = await res.json() as { results?: GeocodingResult[] };
    if (!data.results?.[0]) throw new Error(`Location not found: ${location}`);

    return data.results[0];
  }
}
