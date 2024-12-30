import { Get, Req, Post, Controller, Body, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { GooglePlacePrediction } from '../interface';
import { GoogleLocationService } from '../services/google-location.service';

@ApiTags('address-helper')
@Controller({ path: 'address-helper' })
export class AddressHelperController {
  constructor(public readonly googleLocationService: GoogleLocationService) {}

  @Get('place-autocomplete')
  @ApiQuery({ name: 'searchQuery', type: String })
  @ApiOkResponse({ isArray: true, type: GooglePlacePrediction })
  @ApiInternalServerErrorResponse()
  async initializeDonationCenters(
    @Req() req: Request,
    @Query('searchQuery') searchQuery: string,
  ): Promise<GooglePlacePrediction[]> {
    return await this.googleLocationService.getPlaceAutocomplete(searchQuery);
  }
}
