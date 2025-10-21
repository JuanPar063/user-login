import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 🔥 IMPORTANTE: Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3002', // URL del frontend
    credentials: true,
  });
  // Pipes globales
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Documentación automática con Swagger para Auth Service')
    .setVersion('1.0')
    .addBearerAuth() // Soporte para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const port = process.env.APP_PORT || 3001; // Debe usar process.env.APP_PORT
  await app.listen(port);
  console.log(`🚀 Auth Service running on http://localhost:3000`);
  console.log(`📖 Swagger docs available at http://localhost:3000/api/docs`);
}
bootstrap();
