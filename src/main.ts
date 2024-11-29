import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { configureApp } from '../libs/common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
