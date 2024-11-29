import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DocumentBuilder } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { GetSystemJWTModule } from '../../common/config';
import { setupSwaggerDocument } from '../../common/swagger';
import { AppLogger } from '../../common/logger/logger.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [CqrsModule, GetSystemJWTModule()],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
  exports: [AuthService],
})
export class AuthServiceModule {}

setupSwaggerDocument(
  'auth-service',
  new DocumentBuilder()
    .addBearerAuth()
    .addServer(process.env.API_HOST)
    .setTitle('Auth Docs')
    .setDescription('Authentication endpoints...')
    .setVersion('1.0')
    .build(),
)(AuthServiceModule);
