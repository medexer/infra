import { Get, Req, Post, Controller, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ContactUsDTO } from '../interface';
import { SupportService } from '../services/support.service';

@ApiTags('support')
@Controller({ path: 'support' })
export class SupportController {
  constructor(public readonly supportService: SupportService) {}

  @Post('contact-us')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async getDetailedAccountInfo(
    @Req() req: Request,
    @Body() body: ContactUsDTO,
  ) {
    return await this.supportService.handleContactUsService(body);
  }
}
