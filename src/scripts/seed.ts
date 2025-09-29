import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../application/services/auth.service';
import { UserRole } from '../domain/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Create admin user
    const adminUser = await authService.register({
      username: 'admin',
      password: 'Admin@123456',
      email: 'admin@bankapp.com',
      role: UserRole.ADMIN,
    });
    console.log('Admin user created:', adminUser.user.username);

    // Create sample client user
    const clientUser = await authService.register({
      username: 'johndoe',
      password: 'Client@123456',
      email: 'john.doe@email.com',
      role: UserRole.CLIENT,
    });
    console.log('Client user created:', clientUser.user.username);

    // Create sample teller user
    const tellerUser = await authService.register({
      username: 'teller1',
      password: 'Teller@123456',
      email: 'teller1@bankapp.com',
      role: UserRole.TELLER,
    });
    console.log('Teller user created:', tellerUser.user.username);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();