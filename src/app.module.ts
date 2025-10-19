import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/config/database.config';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { User } from './domain/entities/user.entity';
import { JwtModule } from '@nestjs/jwt'; // Importa JwtModule

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Asegúrate de tener esta variable en tu .env
      signOptions: { expiresIn: '60s' }, // Configura el tiempo de expiración según tus necesidades
    }),
  ],
  providers: [
    AuthService,
  ],
  controllers: [AuthController],
})
export class AppModule {}