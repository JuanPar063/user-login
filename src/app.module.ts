import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module';
import { getDatabaseConfig } from './infrastructure/config/database.config';
import { JwtAuthGuard } from './infrastructure/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}