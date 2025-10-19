import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  TELLER = 'teller',
}

@Entity('users')
export class User {
  @ApiProperty({
    example: 'uuid-1234',
    description: 'Identificador único del usuario',
  })
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Nombre de usuario único',
  })
  @Column({ unique: true, length: 50 })
  username: string;

  @ApiProperty({
    example: '********',
    description: 'Contraseña encriptada (no se expone en responses)',
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Correo electrónico único del usuario',
  })
  @Column({ unique: true, length: 100 })
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CLIENT,
    description: 'Rol del usuario dentro del sistema',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Fecha de creación del registro',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({
    example: '2025-01-10T12:00:00Z',
    description: 'Fecha de la última actualización del registro',
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || '10'));
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(attemptPassword: string): Promise<boolean> {
    return await bcrypt.compare(attemptPassword, this.password);
  }
}
