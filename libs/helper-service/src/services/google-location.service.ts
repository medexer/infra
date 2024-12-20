import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GooglePlaceDetails } from '../interface';

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
      throw new Error(`Failed to fetch place details from Google Maps API : ${error}`);
    }
  }

  async searchPlaces(query: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query,
        )}&key=${this.apiKey}`,
      );

      return response.data.results;
    } catch (error) {
      throw new Error('Failed to search places from Google Maps API');
    }
  }

  async getPlaceAutocomplete(input: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input,
        )}&key=${this.apiKey}`,
      );

      return response.data.predictions;
    } catch (error) {
      throw new Error('Failed to get place autocomplete from Google Maps API');
    }
  }
}
