import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { Not, In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AvailabilityCheckResponsePayload } from '../interface';
import { AppLogger } from '../../../common/src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    private configService: ConfigService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  generateUserJWT(account: Account) {
    try {
      this.logger.log(`[SIGN-JWT-PROCESSING] : {Account - ${account.id}}`);

      const jwt = this.jwtService.sign(
        {
          id: account.id,
          email: account.email,
          role: `${account.accountType}`,
          status: account.status,
        },
        {
          subject: `${account.id}`,
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      this.logger.log(`[SIGN-JWT-SUCCESS]`);

      return 'Bearer ' + jwt;
    } catch (error) {
      this.logger.error(`[SIGN-JWT-ERROR] : ${error}`);
    }
  }

  async isEmailAvailable(
    email: string,
  ): Promise<AvailabilityCheckResponsePayload> {
    const isAvailable = await this.accountRepository.exists({
      where: {
        email: email,
        signupVerificationHash: Not(In(['', null, undefined])),
      },
    });

    return {
      isAvailable: isAvailable,
    };
  }

  async isPhoneAvailable(
    phone: string,
  ): Promise<AvailabilityCheckResponsePayload> {
    const isAvailable = await this.accountRepository.findOneBy({
      phone: phone,
      signupVerificationHash: Not(In(['', null, undefined])),
    });

    return {
      isAvailable: isAvailable ? false : true,
    };
  }
}
