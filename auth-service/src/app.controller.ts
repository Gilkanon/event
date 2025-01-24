import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('sign-in')
  async signIn(@Payload() data: any) {
    return this.appService.signIn(data);
  }
}
