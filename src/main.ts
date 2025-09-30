import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
  console.log(`🚀 Auth Service running on http://localhost:3000`);
  console.log(`📖 Swagger docs available at http://localhost:3000/api/docs`);
}
bootstrap();
