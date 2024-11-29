import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';
import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { JwtStrategy } from '../libs/common/auth';
import { AuthServiceModule } from '@app/auth-service';
import { HealthModule } from './health/health.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SuccessResponseMiddleware } from './success.middleware';
import { AppLogger } from '../libs/common/logger/logger.service';
import { DatabaseSource } from '../libs/common/database/database-source';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot(DatabaseSource),
    HealthModule,
    TerminusModule,
    LoggerModule.forRoot(),
    AuthServiceModule,
    ConfigModule.forRoot(),
    RouterModule.register([
      {
        path: 'v1/auth',
        module: AuthServiceModule,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN_SEC },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,    
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SuccessResponseMiddleware).forRoutes('*');
  }
}