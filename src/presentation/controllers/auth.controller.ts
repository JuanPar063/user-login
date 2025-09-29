import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserResponseDto,
  MessageResponseDto,
} from '../../infrastructure/dto/auth.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
//import { LocalAuthGuard } from '../../infrastructure/auth/guards/local-auth.guard';
//import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { Public } from '../../infrastructure/auth/decorators/public.decorator';
//import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
//import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
/*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<UserResponseDto> {
    return this.authService.findUserById(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.authService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@CurrentUser() user: any): Promise<MessageResponseDto> {
    return {
      message: 'Token is valid',
      statusCode: HttpStatus.OK,
    };
  }
*/
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<MessageResponseDto> {
    // En una implementación real, aquí podrías invalidar el token
    // agregándolo a una lista negra en Redis o base de datos
    return {
      message: 'Logged out successfully',
      statusCode: HttpStatus.OK,
    };
  }
}