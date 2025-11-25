// src/presentation/controllers/auth.controller.ts (user-login)

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
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
import { Public } from '../../infrastructure/auth/decorators/public.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiCreatedResponse({
    description: 'Usuario registrado y token generado',
    type: AuthResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiOkResponse({
    description: 'Login correcto. Devuelve accessToken y user',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión (requiere JWT)' })
  @ApiOkResponse({
    description: 'Sesión cerrada correctamente',
    type: MessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async logout(): Promise<MessageResponseDto> {
    return {
      message: 'Logged out successfully',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * ✅ NUEVO: Endpoint para eliminar usuario (usado en rollback)
   * Permite eliminar un usuario sin autenticación para casos de rollback
   */
  @Public()
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar usuario (usado para rollback en registro fallido)',
    description: 'Elimina un usuario por ID. Usado cuando falla la creación del perfil.'
  })
  @ApiParam({ name: 'id', type: String, description: 'ID del usuario a eliminar' })
  @ApiOkResponse({
    description: 'Usuario eliminado correctamente',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteUser(@Param('id') id: string): Promise<MessageResponseDto> {
    await this.authService.deleteUser(id);
    return {
      message: 'Usuario eliminado correctamente',
      statusCode: HttpStatus.OK,
    };
  }
}