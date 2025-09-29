import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../../domain/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        username: 'testuser',
        password: 'Test@1234',
        email: 'test@email.com',
        role: UserRole.CLIENT,
      };

      const mockUser = {
        id_user: 'uuid-123',
        ...registerDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.user.username).toBe(registerDto.username);
      expect(result.access_token).toBe('jwt-token');
    });

    it('should throw ConflictException if username already exists', async () => {
      const registerDto = {
        username: 'existinguser',
        password: 'Test@1234',
        email: 'new@email.com',
        role: UserRole.CLIENT,
      };

      const existingUser = {
        id_user: 'uuid-existing',
        username: 'existinguser',
        email: 'existing@email.com',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Username already exists',
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        username: 'newuser',
        password: 'Test@1234',
        email: 'existing@email.com',
        role: UserRole.CLIENT,
      };

      const existingUser = {
        id_user: 'uuid-existing',
        username: 'existinguser',
        email: 'existing@email.com',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'Test@1234',
      };

      const mockUser = {
        id_user: 'uuid-123',
        username: 'testuser',
        email: 'test@email.com',
        password: 'hashedpassword',
        role: UserRole.CLIENT,
        created_at: new Date(),
        updated_at: new Date(),
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.user.username).toBe(loginDto.username);
      expect(result.access_token).toBe('jwt-token');
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      const loginDto = {
        username: 'nonexistent',
        password: 'Test@1234',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'WrongPassword',
      };

      const mockUser = {
        id_user: 'uuid-123',
        username: 'testuser',
        password: 'hashedpassword',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      const mockUser = {
        id_user: 'uuid-123',
        username: 'testuser',
        email: 'test@email.com',
        password: 'hashedpassword',
        role: UserRole.CLIENT,
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser', 'Test@1234');

      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(result.username).toBe('testuser');
    });

    it('should return null for invalid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('invalid', 'password');

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id_user: 'uuid-1',
          username: 'user1',
          email: 'user1@email.com',
          role: UserRole.CLIENT,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id_user: 'uuid-2',
          username: 'user2',
          email: 'user2@email.com',
          role: UserRole.ADMIN,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('user1');
      expect(result[1].username).toBe('user2');
    });
  });
});