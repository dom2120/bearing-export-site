import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,x-admin-token',
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  logger.log(`Bearing export backend listening on port ${port}`);
}

bootstrap();
