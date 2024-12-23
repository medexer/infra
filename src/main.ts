import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as serviceAccount from './firebase.json';
import admin, { ServiceAccount } from 'firebase-admin';
import { configureApp } from '../libs/common/src/config';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
