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
import { Public } from '../../infrastructure/auth/decorators/public.decorator';
import { UserRole } from '../../domain/entities/user.entity';

// Swagger
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
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
    // En una implementación real, podrías invalidar el token (lista negra, etc.)
    return {
      message: 'Logged out successfully',
      statusCode: HttpStatus.OK,
    };
  }

  // --- Rutas comentadas de referencia ---
  // Si decides habilitarlas, deja los decoradores y tipos igual que arriba.
  /*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @ApiOkResponse({ description: 'Perfil encontrado', type: UserResponseDto })
  async getProfile(@CurrentUser() user: any): Promise<UserResponseDto> {
    return this.authService.findUserById(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios (solo ADMIN)' })
  @ApiOkResponse({ description: 'Lista de usuarios', type: [UserResponseDto] })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario por ID (solo ADMIN)' })
  @ApiOkResponse({ description: 'Usuario encontrado', type: UserResponseDto })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.authService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token actual' })
  @ApiOkResponse({ description: 'Token válido', type: MessageResponseDto })
  async validateToken(@CurrentUser() user: any): Promise<MessageResponseDto> {
    return { message: 'Token is valid', statusCode: HttpStatus.OK };
  }
  */
}
