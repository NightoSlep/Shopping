import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

import { exec } from 'child_process';
import * as os from 'os';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('ssl/localhost-key.pem'),
    cert: fs.readFileSync('ssl/localhost-cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  app.enableCors({
    origin: 'https://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Shopping API')
    .setDescription('API documentation for Shopping App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 443;
  await app.listen(port);

  const swaggerUrl = `https://localhost:${port}/api/docs`;
  console.log(`🚀 Swagger is running at ${swaggerUrl}`);

  const openSwagger = () => {
    const platform = os.platform();
    if (platform === 'win32') {
      exec(`start ${swaggerUrl}`);
    } else if (platform === 'darwin') {
      exec(`open ${swaggerUrl}`);
    } else if (platform === 'linux') {
      exec(`xdg-open ${swaggerUrl}`);
    }
  };
  openSwagger();
}

bootstrap();
