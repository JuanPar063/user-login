import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for user roles
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'client', 'teller')
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "created_at" TIMESTAMPTZ DEFAULT NOW();
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "updated_at" TIMESTAMPTZ DEFAULT NOW();
    `);

    // Opcional: Trigger para actualizar updated_at en cada UPDATE
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON "users"
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id_user',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'role',
            type: 'user_role_enum',
            default: `'client'`,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    

    // Enable UUID extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('users', 'IDX_USERS_USERNAME');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
    await queryRunner.dropIndex('users', 'IDX_USERS_ROLE');

    // Drop table
    await queryRunner.dropTable('users');

    // Drop enum type
    await queryRunner.query(`DROP TYPE "user_role_enum"`);

     await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
    `);
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_updated_at_column;
    `);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "created_at";
    `);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "updated_at";
    `);
  }
}