import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CORS para frontend - CRÍTICO para que funcione con React
  app.enableCors({
    origin: [
      'http://localhost:3004',
      'http://localhost:3002',                            // Frontend React
      'http://localhost:3000', // Por si el frontend corre en 3000
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipes globales
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Documentación automática con Swagger para Auth Service')
    .setVersion('1.0')
    .addBearerAuth() // Soporte para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.APP_PORT || 3001;
  await app.listen(port);
  console.log(`✅ Auth Service running on http://localhost:${port}`);
  console.log(`📖 Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();