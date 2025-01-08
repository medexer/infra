import {
  Get,
  Req,
  Post,
  Controller,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { SeederService } from '../services/seeder.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('seeder')
@Controller({ path: 'seeder' })
export class SeederController {
  constructor(public readonly seederService: SeederService) {}

  @Post('initialize-donation-centers')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // Set content type as multipart/form-data
  @ApiBody({
    description: 'Upload an csv file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async initializeDonationCenters(
    @Req() req: Request,
    @Body() payload: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.seederService.initializeDonationCenters(payload, file);
  }

  @Post('initialize-donation-centers-with-inventory')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload an csv file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async initializeDonationCentersWithInventory(
    @Req() req: Request,
    @Body() payload: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.seederService.initializeDonationCentersWithInventory(
      payload,
      file,
    );
  }

  @Post('initialize-old-donation-centers-with-inventory')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async initializeOldDonationCentersWithInventory(
    @Req() req: Request,
    @Body() payload: any,
  ) {
    return await this.seederService.initializeOldDonationCentersWithInventory();
  }
}
