import { CommandBus } from '@nestjs/cqrs';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateDonorAccountDTO, SignupResponsePayload } from '../interface';
import { ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({ path: '' })
export class AuthController {
  constructor(
    public command: CommandBus,
    public readonly authService: AuthService,
  ) {}
  
  @ApiTags('auth')
  @Post('signup-donor')
  @ApiOkResponse({ type: SignupResponsePayload })
  @ApiConflictResponse()
  async signupDonor(
    @Body() body: CreateDonorAccountDTO,
    @Req() req: Request,
  ): Promise<SignupResponsePayload> {
    return {
      token: 'token',
    };
  }
}
