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

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores and hyphens',
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UserResponseDto {
  id_user: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export class AuthResponseDto {
  user: UserResponseDto;
  access_token: string;
}

export class MessageResponseDto {
  message: string;
  statusCode: number;
}