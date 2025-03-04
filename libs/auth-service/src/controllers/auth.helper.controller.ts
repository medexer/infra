import { CommandBus } from '@nestjs/cqrs';
import { AuthService } from '../services/auth.service';
import { Controller, Get, Query, Req } from '@nestjs/common';
import { AvailabilityCheckResponsePayload } from '../interface';
import { ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('helpers')
@Controller({ path: 'helper' })
export class AuthHelperController {
  constructor(
    public command: CommandBus,
    public readonly authService: AuthService,
  ) {}

  @Get('/availability/email')
  @ApiOkResponse({ type: AvailabilityCheckResponsePayload })
  @ApiConflictResponse()
  async checkEmailAvailability(
    @Req() req: Request,
    @Query('email') email: string,
  ): Promise<AvailabilityCheckResponsePayload> {
    return await this.authService.isEmailAvailable(email);
  }

  @Get('/availability/phone')
  @ApiOkResponse({ type: AvailabilityCheckResponsePayload })
  @ApiConflictResponse()
  async checkPhoneAvailability(
    @Req() req: Request,
    @Query('phone') phone: string,
  ): Promise<AvailabilityCheckResponsePayload> {
    return await this.authService.isPhoneAvailable(phone);
  }
}
