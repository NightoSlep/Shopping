import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Bật CORS cho toàn bộ API
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api'); // Thêm API prefix

  // 🔹 Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Shopping API') // Tiêu đề API
    .setDescription('API documentation for Shopping App') // Mô tả
    .setVersion('1.0') // Phiên bản API
    .addBearerAuth() // Thêm xác thực Bearer Token (JWT)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Định nghĩa URL Swagger

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
