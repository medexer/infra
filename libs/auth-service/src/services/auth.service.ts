import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}
}
