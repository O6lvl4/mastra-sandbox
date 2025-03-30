export interface GeocodingResult {
    latitude: number;
    longitude: number;
    name: string;
  }
  
  export interface GeocodingService {
    getCoordinates(location: string): Promise<GeocodingResult>;
  }
  