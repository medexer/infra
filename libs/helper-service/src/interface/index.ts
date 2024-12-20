import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResult {
  @ApiProperty()
  url: string;
  @ApiProperty()
  public_id: string;
}

export interface GooglePlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  name: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}
