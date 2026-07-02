import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';

const envName = process.env.NODE_ENV ?? 'development';
loadEnv({ path: `.env.${envName}` });

import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true để Winston kịp khởi động trước khi log được xuất ra
    bufferLogs: true,
    rawBody: true, // Cần cho webhook signature verification
  });

  // Dùng Winston thay NestJS default logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';

  const corsOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000,http://localhost:4000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: [
      ...corsOrigins,
      'https://mhhome.shop',
      'https://www.mhhome.shop',
      'https://admin.mhhome.shop',
      'https://www.admin.mhhome.shop',
      'https://sion.gospelserver.click',
      'https://h5.zdn.vn',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix(apiPrefix, {
    exclude: ['health'],
  });

  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableShutdownHooks();

  if (configService.get<string>('app.env') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API-Swagger')
      .setDescription('API cho hệ thống zalo-mini-app, quản trị, và sion-hub')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('app.port') ?? 5000;
  await app.listen(port);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(`Application running on http://localhost:${port}`, 'Bootstrap');
  logger.log(`Prefix: /${apiPrefix}`, 'Bootstrap');
  logger.log(`Health: http://localhost:${port}/health`, 'Bootstrap');
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
