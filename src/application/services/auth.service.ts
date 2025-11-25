// src/application/services/auth.service.ts (user-login) - AGREGAR AL FINAL

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../../domain/entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserResponseDto,
} from '../../infrastructure/dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, password, role } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      id_user: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENT,
    });

    const savedUser = await this.userRepository.save(user);

    const payload = {
      sub: savedUser.id_user,
      username: savedUser.username,
      role: savedUser.role,
    };
    const access_token = this.jwtService.sign(payload);

    const userResponse: UserResponseDto = {
      id_user: savedUser.id_user,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
    };

    return {
      user: userResponse,
      access_token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username },
      select: [
        'id_user',
        'username',
        'password',
        'email',
        'role',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      throw new NotFoundException(
        `El usuario "${username}" no existe. Por favor, regístrate primero.`
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Contraseña incorrecta. Verifica tus credenciales.'
      );
    }

    const payload = {
      sub: user.id_user,
      username: user.username,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    const userResponse: UserResponseDto = {
      id_user: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      user: userResponse,
      access_token,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: [
        'id_user',
        'username',
        'password',
        'email',
        'role',
        'created_at',
        'updated_at',
      ],
    });

    if (user && (await user.comparePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id_user: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: {
        created_at: 'DESC',
      },
    });

    return users.map((user) => ({
      id_user: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  /**
   * ✅ NUEVO: Elimina un usuario por ID (usado en rollback)
   * Este método se llama cuando la creación del perfil falla
   */
  async deleteUser(id: string): Promise<void> {
    try {
      this.logger.log(`🔄 Intentando eliminar usuario con ID: ${id}`);
      
      const user = await this.userRepository.findOne({
        where: { id_user: id },
      });

      if (!user) {
        this.logger.warn(`⚠️ Usuario con ID ${id} no encontrado para eliminar`);
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      await this.userRepository.remove(user);
      this.logger.log(`✅ Usuario ${user.username} (${id}) eliminado correctamente`);
      
    } catch (error) {
      this.logger.error(`❌ Error al eliminar usuario ${id}:`, error);
      throw error;
    }
  }
}