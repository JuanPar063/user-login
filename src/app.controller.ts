import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './infrastructure/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  healthCheck(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'auth-microservice',
    };
  }
}