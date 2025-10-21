import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Nombre de usuario. Solo letras, números, guiones y guiones bajos',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores and hyphens',
  })
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Contraseña con mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico válido' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CLIENT,
    description: 'Rol del usuario (opcional)',
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Nombre de usuario' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña' })
  @IsString()
  password: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-1234', description: 'ID único del usuario' })
  id_user: string;

  @ApiProperty({ example: 'john_doe', description: 'Nombre de usuario' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT, description: 'Rol del usuario' })
  role: UserRole;

  @ApiProperty({ example: '2025-01-01T10:00:00Z', description: 'Fecha de creación' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-10T12:00:00Z', description: 'Fecha de última actualización' })
  updated_at: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: () => UserResponseDto, description: 'Datos del usuario autenticado' })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acceso',
  })
  access_token: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Logged out successfully', description: 'Mensaje de respuesta' })
  message: string;

  @ApiProperty({ example: 200, description: 'Código de estado HTTP' })
  statusCode: number;
}
