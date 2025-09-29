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

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  TELLER = 'teller',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

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