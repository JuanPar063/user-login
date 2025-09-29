import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { User } from './domain/entities/user.entity';
import { JwtStrategy } from './infrastructure/auth/strategies/jwt.strategy';
//import { LocalStrategy } from './infrastructure/auth/strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy/* , LocalStrategy */],
  exports: [AuthService],
})
export class AuthModule {}