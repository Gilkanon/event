import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('sign-in')
  async signIn(@Payload() data) {
    return this.appService.signIn(data);
  }

  @MessagePattern('refresh')
  async refreshTokens(@Payload() data) {
    return this.appService.refreshTokens(data);
  }

  @MessagePattern('sign-up')
  async signUp(@Payload() data) {
    return this.appService.signUp(data);
  }

  @EventPattern('logout')
  async logout(@Payload() data) {
    return this.appService.logout(data);
  }
}
