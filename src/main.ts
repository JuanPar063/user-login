import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CORS CONFIGURADO CORRECTAMENTE - MUY IMPORTANTE
  app.enableCors({
    origin: [
      'http://localhost:3004',  // Frontend React
      'http://localhost:3002',  // Alternativa del frontend
      'http://localhost:3000',  // User service
      'http://localhost:3003',  // Admin service
      'http://localhost:3005',  // Gateway
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Pipes globales para validación
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Documentación automática con Swagger para Auth Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.APP_PORT || 3001;
  
  // ✅ CRÍTICO: Escuchar en todas las interfaces (0.0.0.0)
  await app.listen(port, '0.0.0.0');
  
  console.log('='.repeat(60));
  console.log(`✅ Auth Service running on http://localhost:${port}`);
  console.log(`📖 Swagger docs available at http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS habilitado para frontend en puerto 3004`);
  console.log('='.repeat(60));
}
bootstrap();