import {
  GooglePlaceDetails,
  GooglePlacePrediction,
} from '../interface';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleLocationService {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`,
      );

      return response.data.result as GooglePlaceDetails;
    } catch (error) {
      throw new Error(
        `Failed to fetch place details from Google Maps API : ${error}`,
      );
    }
  }

  async searchPlaces(query: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query,
        )}&key=${this.apiKey}&components=country:ng&limit=5`,
      );

      return response.data.results;
    } catch (error) {
      throw new Error('Failed to search places from Google Maps API');
    }
  }

  async getPlaceAutocomplete(input: string): Promise<GooglePlacePrediction[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input,
        )}&key=${this.apiKey}&components=country:ng&limit=5`,
      );
      
      const predictions: GooglePlacePrediction[] = response.data.predictions.map(prediction => ({
        description: prediction.description,
        place_id: prediction.place_id,
        reference: prediction.reference
      }));

      return predictions;
    } catch (error) {
      throw new Error('Failed to get place autocomplete from Google Maps API');
    }
  }

  async reverseGeocode(lat: string, lng: string): Promise<{ state: string, city: string }> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
      );
      
      let state = '';
      let city = '';

      if (response.data.results && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        
        for (const component of addressComponents) {
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
            if (!city) {
              city = component.long_name;
            }
          }
        }
      }

      return { state, city };
    } catch (error) {
      throw new Error('Failed to reverse geocode from Google Maps API');
    }
  }

  static getDistanceInKm(lat1: string, lon1: string, lat2: string, lon2: string): string {
    if (!lat1 || !lon1 || !lat2 || !lon2) return '0KM';
    
    const numLat1 = parseFloat(lat1);
    const numLon1 = parseFloat(lon1);
    const numLat2 = parseFloat(lat2);
    const numLon2 = parseFloat(lon2);
    
    if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) {
      return '0KM';
    }

    const R = 6371; // Radius of the earth in km
    const dLat = (numLat2 - numLat1) * (Math.PI / 180);
    const dLon = (numLon2 - numLon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(numLat1 * (Math.PI / 180)) *
        Math.cos(numLat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return `${Math.round(distance)}KM`;
  }
}
