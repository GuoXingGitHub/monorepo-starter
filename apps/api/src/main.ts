import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { useContainer } from 'typeorm';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import appConfig from './config/app';
import { setupSwagger } from './setup-swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  app.use(helmet());
  app.use(compression());
  app.use(rateLimit({ max: 100, windowMs: 15 * 60 * 1000 }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

  if (!appConfig.isProduction()) {
    setupSwagger(app);
  }

  Logger.log(`App Listening http://localhost:${appConfig.port}`, 'Bootstrap');
  Logger.log(`NODE_ENV ${process.env.NODE_ENV}`, 'Bootstrap');
  Logger.log(`APP_ENV ${appConfig.env}`, 'Bootstrap');

  await app.listen(appConfig.port);
}
bootstrap();
