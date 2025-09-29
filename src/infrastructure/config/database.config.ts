import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'authuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'user-login-db',
  entities: [User],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

// Para CLI de migraciones
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'authuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'user-login-db',
  entities: ['src/domain/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;